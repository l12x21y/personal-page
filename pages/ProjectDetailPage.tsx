import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { usePortfolioData } from '../hooks/usePortfolioData.ts';
import ChevronLeftIcon from '../components/icons/ChevronLeftIcon.tsx';
import type { Project, ProjectImage, ProjectMedia, ProjectNavSection } from '../types.ts';
import Lightbox from '../components/modals/Lightbox.tsx';
import type { PortfolioData } from '../types.ts';

interface ProjectDetailPageProps {
  portfolioData?: PortfolioData;
}

const formatFallbackSectionLabel = (index: number) => `Section ${String(index + 1).padStart(2, '0')}`;

const buildProjectSections = (images: ProjectImage[], mediaAssets: ProjectMedia[], navSections?: ProjectNavSection[]) => {
  if (navSections && navSections.length > 0) {
    const usedNames = new Set<string>();

    const resolveSectionMedia = (section: ProjectNavSection) => {
      const imageIndexes = Array.isArray(section.imageIndexes) ? section.imageIndexes : [];
      const imageNames = Array.isArray(section.imageNames) ? section.imageNames : [];
      const mediaIndexes = Array.isArray(section.mediaIndexes) ? section.mediaIndexes : [];
      const mediaNames = Array.isArray(section.mediaNames) ? section.mediaNames : [];

      const byIndex = mediaIndexes
        .map((index) => mediaAssets[index])
        .filter((item): item is ProjectMedia => Boolean(item));

      const byName = mediaAssets.filter((item) => mediaNames.includes(item.name));

      const byImageIndex = imageIndexes
        .map((index) => images[index])
        .filter((item): item is ProjectImage => Boolean(item))
        .map((image) => mediaAssets.find((media) => media.name === image.name))
        .filter((item): item is ProjectMedia => Boolean(item));

      const byImageName = mediaAssets.filter((item) => imageNames.includes(item.name));

      const merged = [...byIndex, ...byName, ...byImageIndex, ...byImageName];
      const deduped = [] as ProjectMedia[];
      const seen = new Set<string>();
      for (const item of merged) {
        if (seen.has(item.name)) continue;
        seen.add(item.name);
        deduped.push(item);
      }
      return deduped;
    };

    return navSections
      .map((section, sectionIndex) => {
        const resolvedMedia = resolveSectionMedia(section);

        resolvedMedia.forEach((item) => usedNames.add(item.name));

        return {
          id: `section-${sectionIndex}`,
          title: section.title,
          text: section.text,
          layout: section.layout,
          media: resolvedMedia,
        };
      })
      .concat((() => {
        const unassigned = mediaAssets.filter((item) => !usedNames.has(item.name));
        if (unassigned.length === 0) return [];
        return [
          {
            id: 'section-unassigned',
            title: 'More',
            media: unassigned,
          },
        ];
      })())
      .filter((section) => section.media.length > 0 || (section.text && section.text.trim().length > 0));
  }

  return images.map((image, index) => ({
    id: `section-${index}`,
    title: formatFallbackSectionLabel(index),
    media: [{ ...image, type: 'image' as const }],
  }));
};

const getGridClass = (layout: ProjectNavSection['layout'] | undefined, itemCount: number) => {
  if (layout === 'single') return 'grid-cols-1';
  if (layout === 'grid-2') return 'grid-cols-1 md:grid-cols-2';
  if (layout === 'grid-3') return 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3';
  if (layout === 'grid-4') return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4';
  if (itemCount <= 1) return 'grid-cols-1';
  if (itemCount === 2) return 'grid-cols-1 md:grid-cols-2';
  return 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3';
};

const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({ portfolioData: propData }) => {
  const { portfolioData: hookData } = usePortfolioData();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const portfolioData = propData || hookData;

  const projectKey = useMemo(() => {
    const queryProject = new URLSearchParams(location.search).get('project') || '';
    return (id || queryProject || '').trim();
  }, [id, location.search]);

  const decodedProjectKey = useMemo(() => {
    if (!projectKey) return '';
    try {
      return decodeURIComponent(projectKey);
    } catch {
      return projectKey;
    }
  }, [projectKey]);

  const project = useMemo<Project | null>(() => {
    if (!projectKey) return portfolioData.projects[0] || null;

    return (
      portfolioData.projects.find((item: Project) => item.slug === projectKey || item.slug === decodedProjectKey) ||
      portfolioData.projects.find((item: Project) => String(item.id) === projectKey || String(item.id) === decodedProjectKey) ||
      portfolioData.projects.find((item: Project) => item.title === projectKey || item.title === decodedProjectKey) ||
      null
    );
  }, [projectKey, decodedProjectKey, portfolioData]);

  const gallery = project?.images || [];
  const mediaAssets = project?.mediaAssets || gallery.map((image) => ({ ...image, type: 'image' as const }));
  const coverImage = gallery[0];
  const sections = useMemo(
    () => buildProjectSections(gallery, mediaAssets, project?.navSections),
    [gallery, mediaAssets, project?.navSections]
  );

  // Lightbox state: map all media to an images array for the lightbox viewer
  const allMediaForLightbox = useMemo(() => {
    return sections.flatMap(s => s.media.map(m => ({ url: m.url, name: m.name, description: m.description })));
  }, [sections]);

  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxStartIndex, setLightboxStartIndex] = useState(0);

  useEffect(() => {
    document.title = project ? `${project.title} | Projects` : 'Project Not Found';
  }, [project]);

  useEffect(() => {
    document.body.style.background = '#f4efe6';
    return () => {
      document.body.style.background = '';
    };
  }, []);

  const sectionItems = project
    ? sections.map((section) => ({
        id: section.id,
        label: section.title,
      }))
    : [];

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-xl w-full bg-white/80 backdrop-blur border border-black/10 rounded-3xl p-8 shadow-[0_20px_80px_rgba(0,0,0,0.08)]">
          <p className="text-sm uppercase tracking-[0.3em] text-gray-500 mb-3">Project</p>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Project not found</h1>
          <p className="text-gray-600 mb-6">The requested project page could not be found.</p>
          <button onClick={() => navigate('/')} className="inline-flex items-center gap-2 rounded-full bg-black text-white px-5 py-3 font-medium hover:bg-gray-800 transition-colors">
            <ChevronLeftIcon className="w-4 h-4" />
            Back to portfolio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.9),_rgba(244,239,230,0.35)_35%,_rgba(236,226,209,0.2)_100%)]">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
        <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="lg:sticky lg:top-6 h-fit border-r border-black/10 pr-4 lg:pr-6">
            <div className="pt-1">
              <button onClick={() => navigate('/')} className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-black transition-colors mb-5">
                <ChevronLeftIcon className="w-4 h-4" />
                Back to portfolio
              </button>
              <p className="text-[11px] uppercase tracking-[0.28em] text-gray-500">Project Detail</p>
              <h1 className="mt-3 text-3xl leading-tight font-bold text-gray-950">{project.title}</h1>
              {project.description && <p className="mt-3 text-sm leading-6 text-gray-600">{project.description}</p>}
            </div>

            <div className="mt-6 space-y-5">
              <div className="space-y-3 text-sm">
                {project.time && (
                  <div className="flex gap-3">
                    <span className="w-16 shrink-0 text-gray-500">Time</span>
                    <span className="text-gray-800">{project.time}</span>
                  </div>
                )}
                {project.workType && (
                  <div className="flex gap-3">
                    <span className="w-16 shrink-0 text-gray-500">Type</span>
                    <span className="text-gray-800">{project.workType}</span>
                  </div>
                )}
                {project.role && (
                  <div className="flex gap-3">
                    <span className="w-16 shrink-0 text-gray-500">Role</span>
                    <span className="text-gray-800 leading-relaxed">{project.role}</span>
                  </div>
                )}
              </div>

              {project.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-black/10 bg-black/5 px-3 py-1 text-xs font-medium text-gray-700">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <nav className="pt-4 border-t border-black/10">
                <p className="text-[11px] uppercase tracking-[0.28em] text-gray-500 mb-3">Navigation</p>
                <div className="space-y-1 max-h-[40vh] overflow-y-auto pr-1">
                  {sectionItems.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className="block rounded-2xl px-3 py-2 text-sm text-gray-700 hover:bg-black/5 hover:text-black transition-colors"
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              </nav>
            </div>
          </aside>

          <main className="min-w-0 pb-10 lg:pb-16">
            <section id="overview" className="space-y-6">
              {coverImage && (
                <div className="relative text-center">
                    <img
                      src={coverImage.url}
                      alt={coverImage.name}
                      className="mx-auto w-full h-[72vh] object-cover"
                    />
                  </div>
              )}
            </section>

            <div className="mt-10 space-y-14">
              {sections.map((section, sectionIndex) => {
                const firstMedia = section.media[0];
                const sectionText = section.text?.trim() || firstMedia?.description?.trim();
                const mediaGridClass = getGridClass(section.layout, section.media.length);
                return (
                  <section
                    id={section.id}
                    key={section.id}
                    className="scroll-mt-6 pb-12 border-b border-black/10 last:border-b-0 last:pb-0"
                  >
                    <div className="text-center mb-5">
                      <p className="text-[11px] uppercase tracking-[0.25em] text-gray-500">{String(sectionIndex + 1).padStart(2, '0')}</p>
                      <h3 className="mt-1 text-xl font-semibold text-gray-950">{section.title}</h3>
                      {sectionText && (
                        <p className="mt-3 text-gray-700 leading-7 text-[15px] md:text-base whitespace-pre-line mx-auto max-w-3xl">{sectionText}</p>
                      )}
                    </div>

                    {section.media.length > 0 && (
                      <div className={`grid gap-6 items-start ${mediaGridClass}`}>
                        {section.media.map((media) => (
                          <div key={media.url} className="space-y-3 text-center">
                              {media.type === 'video' ? (
                              <video
                                src={media.url}
                                className="mx-auto w-full max-h-[78vh] object-contain cursor-pointer"
                                controls
                                playsInline
                                preload="metadata"
                                onClick={() => {
                                  // open lightbox at this media
                                  const idx = allMediaForLightbox.findIndex(item => item.url === media.url);
                                  setLightboxStartIndex(idx >= 0 ? idx : 0);
                                  setIsLightboxOpen(true);
                                }}
                              />
                              ) : (
                              <img
                                src={media.url}
                                alt={media.name}
                                className="mx-auto w-full max-h-[78vh] object-contain cursor-pointer"
                                onClick={() => {
                                  const idx = allMediaForLightbox.findIndex(item => item.url === media.url);
                                  setLightboxStartIndex(idx >= 0 ? idx : 0);
                                  setIsLightboxOpen(true);
                                }}
                              />
                              )}
                              {media.description?.trim() && (
                                <p className="text-sm leading-6 text-gray-600 whitespace-pre-line mx-auto max-w-3xl">{media.description}</p>
                              )}
                            </div>
                          ))}
                      </div>
                    )}
                  </section>
                );
              })}
            </div>
          </main>
        </div>
      </div>
      {isLightboxOpen && (
        <Lightbox
          project={{ ...project, images: allMediaForLightbox }}
          onClose={() => setIsLightboxOpen(false)}
          isViewMode={true}
          initialIndex={lightboxStartIndex}
          minimalView={true}
          onAddGalleryImage={() => {}}
          onDeleteProjectImage={() => {}}
          onSetAsCoverImage={() => {}}
          onUpdateProjectImageName={() => {}}
          onReorderProjectImages={() => {}}
        />
      )}
    </div>
  );
};

export default ProjectDetailPage;