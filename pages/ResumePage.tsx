import React from 'react';
import Section from '../components/common/Section.tsx';
import ExperienceCard from '../components/ExperienceCard.tsx';
import AwardCard from '../components/AwardCard.tsx';
import SkillsSection from '../components/SkillsSection.tsx';
import UserIcon from '../components/icons/UserIcon.tsx';
import PdfIcon from '../components/icons/PdfIcon.tsx';
import { PortfolioData } from '../types.ts';
import { getAssetUrl } from '../utils/assetUrl.ts';
import certifications from '../dataset/certifications.json';
import education from '../dataset/education.json';

interface ResumePageProps {
  portfolioData: PortfolioData;
  isViewMode: boolean;
}

const ResumePage: React.FC<ResumePageProps> = ({ portfolioData, isViewMode }) => {
  const { about, skills } = portfolioData;
  const noop = () => {};

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
      <section id="resume-profile" className="py-16 sm:py-20">
          <div className="relative">
            <div className="p-0 sm:p-0">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
              <div className="md:col-span-1 flex justify-center md:justify-start">
                <div className="w-36 h-36 rounded-xl overflow-hidden">
                  {about.photoUrl ? (
                    <img src={getAssetUrl(about.photoUrl)} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-transparent flex items-center justify-center">
                      <UserIcon className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                </div>
              </div>
              <div className="md:col-span-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 font-mono tracking-widest">{portfolioData.name}</h2>
                  <div>
                    <a
                      href={encodeURI('/Personal Info/XinyaoLyu-CV.pdf')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--primary)] text-sm font-medium"
                      title="Open CV PDF"
                    >
                      <PdfIcon className="w-4 h-4 inline-block mr-2" />
                      CV
                    </a>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  {about.details.map((detail) => (
                    <div key={detail.id} className="flex items-center gap-4 py-1">
                      <span className="text-xs uppercase tracking-wide text-gray-500 w-40">{detail.label}</span>
                      <span className="text-gray-900">{detail.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Section id="work-experience" title="Work Experience">
        <div className="space-y-6">
          {about.workExperience.map((experience) => (
            <ExperienceCard
              key={experience.id}
              experience={experience}
              onUpdate={noop}
              onDelete={noop}
              isViewMode={isViewMode}
            />
          ))}
        </div>
      </Section>

      <Section id="research-experience" title="Research Experience">
        <div className="space-y-6">
          {about.researchExperience.map((experience) => (
            <ExperienceCard
              key={experience.id}
              experience={experience}
              onUpdate={noop}
              onDelete={noop}
              isViewMode={isViewMode}
            />
          ))}
        </div>
      </Section>

      <Section id="awards" title="Award">
        <div className="grid grid-cols-1 gap-3">
          {(() => {
            const scholarshipKeywords = ['scholar', 'scholarship', '奖学金', '国家奖学金', 'National Scholarship'];
            const distinctions: Array<any> = [];
            const others: Array<any> = [];

            about.awards.forEach((a) => {
              const name = (a.name || '').toString();
              const lower = name.toLowerCase();
              const isScholar = scholarshipKeywords.some((kw) => lower.includes(kw.toLowerCase()));
              if (isScholar) distinctions.push(a);
              else others.push(a);
            });

            const renderGroup = (label: string, items: Array<any>) => (
              <div key={label} className="grid grid-cols-12 gap-4 items-start">
                <div className="col-span-3 text-sm text-gray-600">{label}</div>
                <div className="col-span-9">
                  <ul className="space-y-2">
                    {items.map((it) => (
                      <li key={it.id} className="text-gray-900">
                        {it.url ? (
                          <a href={it.url} target="_blank" rel="noopener noreferrer" className="underline text-[inherit]">{it.name}</a>
                        ) : (
                          <span>{it.name}</span>
                        )}
                        {it.date ? <span className="text-gray-600 ml-2 text-sm">— {it.date}</span> : null}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );

            const nodes: React.ReactNode[] = [];
            if (distinctions.length > 0) nodes.push(renderGroup('Distinctions', distinctions));
            if (others.length > 0) nodes.push(renderGroup('Awards', others));
            return nodes;
          })()}
        </div>
      </Section>

      {/* Certifications (show only if dataset has items) */}
      {Array.isArray(certifications) && certifications.length > 0 && (
        <Section id="certifications" title="Certifications">
          <div className="space-y-2">
            {certifications.map((c: any, i: number) => (
              <div key={i} className="flex items-center gap-4">
                <div className="text-sm text-gray-600 w-40">{c.issuer || ''}</div>
                <div className="text-gray-900">{c.name || ''} {c.date ? <span className="text-gray-600 ml-2 text-sm">— {c.date}</span> : null}</div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Education (show only if dataset has items) */}
      {Array.isArray(education) && education.length > 0 && (
        <Section id="education" title="Education">
          <div className="space-y-6">
            {education.map((e: any, i: number) => (
              <div key={i} className="grid grid-cols-12 gap-4 items-start">
                <div className="col-span-3 text-lg text-gray-600">{e.period || e.date || ''}</div>
                <div className="col-span-9">
                  <div className="font-semibold text-gray-900 text-lg">{e.institution || ''}</div>
                  <div className="text-gray-600 mt-1">
                    {e.level || e.degree ? <span className="block">{e.level || e.degree}</span> : null}
                    {e.major ? <span className="block">{e.major}</span> : null}
                    {e.description ? <span className="block text-sm text-gray-700 mt-1">{e.description}</span> : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      <SkillsSection skills={skills} isViewMode={isViewMode} />
    </div>
  );
};

export default ResumePage;