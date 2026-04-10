import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { usePortfolioData } from '../hooks/usePortfolioData.ts';
import { getAssetUrl } from '../utils/assetUrl.ts';
import ChevronLeftIcon from '../components/icons/ChevronLeftIcon.tsx';
import type { Project, ProjectImage, ProjectMedia, ProjectNavSection } from '../types.ts';
import type { PortfolioData } from '../types.ts';

interface ProjectDetailPageProps {
  portfolioData?: PortfolioData;
}

const formatFallbackSectionLabel = (index: number) => `Section ${String(index + 1).padStart(2, '0')}`;

const buildProjectSections = (images: ProjectImage[], mediaAssets: ProjectMedia[], navSections?: ProjectNavSection[]) => {
  if (navSections && navSections.length > 0) {
    const usedNames = new Set<string>();

    const resolveSectionMedia = (section: ProjectNavSection) => {
      // If section.content exists (ordered blocks), build media list from it
      if (Array.isArray((section as any).content) && (section as any).content.length > 0) {
        const blocks = (section as any).content;
        const out: any[] = [];
        for (let i = 0; i < blocks.length; i++) {
          const block = blocks[i];
          if (!block) continue;
          const t = String(block.type || '').toLowerCase();
          if (t === 'text' || t === 'html') {
            out.push({ type: 'text' as const, html: block.html || block.text || '' });
          } else if (t === 'image') {
            const name = block.mediaName || block.name || '';
            const found = mediaAssets.find((m) => m.name === name);
            if (found) out.push(found);
          } else if (t === 'gallery' || t === 'images') {
            const names = Array.isArray(block.mediaNames) ? block.mediaNames : Array.isArray(block.imageNames) ? block.imageNames : [];
            for (const name of names) {
              const found = mediaAssets.find((m) => m.name === name);
              if (found) out.push(found);
            }
          }
        }
        return out;
      }

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
        // exclude cover image from "More" by marking first image as used
        const cover = images && images.length > 0 ? images[0] : null;
        if (cover && cover.name) usedNames.add(cover.name);

        const unassigned = mediaAssets.filter((item) => !usedNames.has(item.name));
        if (unassigned.length === 0) return [];
        return [
          {
            id: 'section-unassigned',
            title: 'More',
            text: undefined,
            layout: undefined,
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
  if (layout === 'grid-1') return 'grid-cols-1';
  if (layout === 'grid-2') return 'grid-cols-1 md:grid-cols-2';
  if (layout === 'grid-3') return 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3';
  if (layout === 'grid-4') return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4';
  if (itemCount <= 1) return 'grid-cols-1';
  if (itemCount === 2) return 'grid-cols-1 md:grid-cols-2';
  return 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3';
};

const detailFontClass = 'font-mono tracking-widest';
const bodyFontStyle: React.CSSProperties = { fontFamily: 'DengXian, "Microsoft Yahei", Arial, sans-serif', fontSize: '22px', lineHeight: 1.75 };

const toLineItems = (value?: string | string[]) => {
  if (!value) return [] as string[];
  if (Array.isArray(value)) {
    return value
      .map((item) => (typeof item === 'string' ? item.trim() : ''))
      .filter((item) => item.length > 0);
  }
  const text = String(value).trim();
  return text ? [text] : [];
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

  const [zoomedImage, setZoomedImage] = useState<ProjectImage | null>(null);
  const roleItems = toLineItems(project?.role);
  const typeItems = toLineItems(project?.workType);

  useEffect(() => {
    if (!zoomedImage) return;

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setZoomedImage(null);
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [zoomedImage]);

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
          <aside className="lg:sticky lg:top-24 lg:h-[calc(100vh-6rem)] lg:overflow-hidden self-start border-r border-black/10 pr-4 lg:pr-6 lg:flex lg:flex-col">
              <div className="pt-3 relative z-20 flex-shrink-0">
              <div className="mb-6">
                <button onClick={() => navigate('/')} className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-black transition-colors">
                  <ChevronLeftIcon className="w-4 h-4" />
                  Back to portfolio
                </button>
              </div>
              <p className={`text-[11px] uppercase tracking-[0.28em] text-gray-500 ${detailFontClass}`}>Project Detail</p>
              <h1 className="mt-3 text-3xl leading-tight font-bold text-gray-950">{project.title}</h1>
              {project.description && <p className="mt-3 text-sm leading-6 text-gray-600" style={{ ...bodyFontStyle, fontSize: '16px' }}>{project.description}</p>}
            </div>

            <div className="mt-6 space-y-5 flex-1 overflow-y-auto pr-1">
              <div className="space-y-3 text-sm">
                {project.time && (
                  <div className="flex gap-3">
                    <span className={`w-16 shrink-0 text-gray-500 ${detailFontClass}`}>Time</span>
                    <span className={`text-gray-800 ${detailFontClass}`}>{project.time}</span>
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
                <p className={`text-[11px] uppercase tracking-[0.28em] text-gray-500 mb-3 ${detailFontClass}`}>Navigation</p>
                <div className="space-y-1 pr-1">
                  {sectionItems.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        const el = document.getElementById(item.id);
                        if (el) {
                          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          try { window.history.replaceState(null, '', `#${item.id}`); } catch {}
                        }
                      }}
                      className="group relative block w-fit py-2 text-sm text-gray-700 hover:text-black transition-colors"
                    >
                        <span className={`relative z-10 inline-block ${detailFontClass}`}>{item.label}</span>
                        <span aria-hidden className="absolute left-0 right-0 bottom-2 h-1 rounded-full bg-sky-200 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                    </a>
                  ))}
                </div>
              </nav>
            </div>
          </aside>

          <main className="min-w-0 pb-10 lg:pb-16">
            <section id="overview" className="space-y-6">
              {coverImage && (
                <div className="relative overflow-hidden">
                  <div
                    className="w-full h-[72vh] bg-center bg-cover"
                    style={{
                      backgroundImage: `url(${getAssetUrl(coverImage.url)})`,
                      opacity: 0.98,
                    }}
                  />

                  {/* top-left intro text (same style as About lead) */}
                  {/* cover intro intentionally removed per user preference */}

                  {/* white upward fade layer on top of cover */}
                  <div
                    className="absolute inset-x-0 bottom-0 h-[52%] pointer-events-none"
                    style={{
                      background: 'linear-gradient(to top, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.78) 34%, rgba(255,255,255,0.38) 62%, rgba(255,255,255,0) 100%)',
                    }}
                  />

                  {/* right-side project meta on white fade layer */}
                  <div className="absolute left-4 right-4 bottom-6 sm:left-8 sm:right-8 sm:bottom-8 z-20 text-black">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 text-sm">
                      {roleItems.length > 0 && (
                        <div className="min-w-0">
                          <p className={`text-gray-700 mb-1 ${detailFontClass}`}>Role</p>
                          <div className={`text-black leading-relaxed ${detailFontClass}`}>
                            {roleItems.map((item) => (
                              <div key={item}>{item}</div>
                            ))}
                          </div>
                        </div>
                      )}
                      {typeItems.length > 0 && (
                        <div className="min-w-0">
                          <p className={`text-gray-700 mb-1 ${detailFontClass}`}>Type</p>
                          <div className={`text-black leading-relaxed ${detailFontClass}`}>
                            {typeItems.map((item) => (
                              <div key={item}>{item}</div>
                            ))}
                          </div>
                        </div>
                      )}
                      {Array.isArray(project.tools) && project.tools.length > 0 && (
                        <div className="min-w-0">
                          <p className={`text-gray-700 mb-1 ${detailFontClass}`}>Tools</p>
                          <div className={`text-black leading-relaxed ${detailFontClass}`}>
                            {project.tools.map((tool) => (
                              <div key={tool}>{tool}</div>
                            ))}
                          </div>
                        </div>
                      )}
                      {Array.isArray(project.skills) && project.skills.length > 0 && (
                        <div className="min-w-0">
                          <p className={`text-gray-700 mb-1 ${detailFontClass}`}>Skills</p>
                          <div className={`text-black leading-relaxed ${detailFontClass}`}>
                            {project.skills.map((skill) => (
                              <div key={skill}>{skill}</div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* bottom gradient to smoothly blend into following content */}
                  <div
                    className="absolute inset-x-0 bottom-0 h-32 pointer-events-none"
                    style={{
                      background: 'linear-gradient(to bottom, rgba(244,239,230,0) 0%, rgba(244,239,230,0.06) 62%, rgba(244,239,230,0.16) 84%, rgba(244,239,230,0.36) 100%)',
                    }}
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
                      <div className="text-left mb-5">
                        <h3 className={`mt-1 text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-950 ${detailFontClass}`}>{section.title}</h3>
                        {sectionText && (
                          <p className={`mt-3 text-gray-700 leading-7 text-[15px] md:text-base whitespace-pre-line`} style={bodyFontStyle}>{sectionText}</p>
                        )}
                      </div>

                    {section.media.length > 0 && (
                      <div className="space-y-6">
                        {(() => {
                          const blocks = section.media;
                          const nodes: React.ReactNode[] = [];
                          let idx = 0;
                          while (idx < blocks.length) {
                            const blk = blocks[idx] as any;
                            // text block: render full-width and ignore layout
                            if (blk && (blk.type === 'text' || blk.type === 'html')) {
                              nodes.push(
                                <div key={`text-${idx}`} className={`w-full prose`} style={bodyFontStyle} dangerouslySetInnerHTML={{ __html: blk.html || blk.text || '' }} />
                              );
                              idx += 1;
                              continue;
                            }

                            // otherwise collect a run of media items (images/videos) and render as a grid
                            const run: any[] = [];
                            let j = idx;
                            while (j < blocks.length && blocks[j] && blocks[j].type !== 'text' && blocks[j].type !== 'html') {
                              run.push(blocks[j]);
                              j += 1;
                            }

                            const runKey = `media-run-${idx}`;
                            const runGridClass = getGridClass(section.layout, run.length);
                            nodes.push(
                              <div key={runKey} className={`grid gap-6 items-start ${runGridClass}`}>
                                {run.map((media: any, mi: number) => (
                                  <div key={(media && media.url) || `${runKey}-${mi}`} className="space-y-3 text-left">
                                    {media.type === 'video' ? (
                                      <video
                                        src={getAssetUrl(media.url)}
                                        className="w-full max-h-[78vh] object-contain cursor-pointer"
                                        controls
                                        playsInline
                                        preload="metadata"
                                        onClick={() => setZoomedImage(media as ProjectImage)}
                                      />
                                    ) : (
                                      <img
                                        src={getAssetUrl(media.url)}
                                        alt={media.name}
                                        className="w-full max-h-[78vh] object-contain cursor-pointer"
                                        onClick={() => setZoomedImage(media)}
                                      />
                                    )}
                                    {media.description?.trim() && (
                                      <p className={`text-sm leading-6 text-gray-600 whitespace-pre-line`} style={bodyFontStyle}>{media.description}</p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            );

                            idx = j;
                          }

                          return nodes;
                        })()}
                      </div>
                    )}
                  </section>
                );
              })}
            </div>
          </main>
        </div>
      </div>
      {zoomedImage && createPortal(
        <div
          className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center overflow-hidden"
          role="dialog"
          aria-modal="true"
          onClick={() => setZoomedImage(null)}
        >
          <button
            type="button"
            onClick={() => setZoomedImage(null)}
            className="absolute top-4 right-4 z-[210] rounded-full bg-white/10 text-white px-4 py-2 text-sm hover:bg-white/20 transition-colors"
            aria-label="Close image preview"
          >
            Close
          </button>
          <div className="w-[90vw] h-[90vh] max-w-[90vw] max-h-[90vh] flex items-center justify-center pointer-events-none">
            {zoomedImage.type === 'video' ? (
              <video
                src={getAssetUrl(zoomedImage.url)}
                className="max-w-full max-h-full object-contain shadow-[0_20px_80px_rgba(0,0,0,0.45)] pointer-events-auto"
                controls
                playsInline
              />
            ) : (
              <img
                src={getAssetUrl(zoomedImage.url)}
                alt={zoomedImage.name}
                className="max-w-full max-h-full object-contain shadow-[0_20px_80px_rgba(0,0,0,0.45)] pointer-events-auto"
              />
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default ProjectDetailPage;