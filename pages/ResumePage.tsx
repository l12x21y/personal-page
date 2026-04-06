import React from 'react';
import Section from '../components/common/Section.tsx';
import ExperienceCard from '../components/ExperienceCard.tsx';
import AwardCard from '../components/AwardCard.tsx';
import SkillsSection from '../components/SkillsSection.tsx';
import UserIcon from '../components/icons/UserIcon.tsx';
import PdfIcon from '../components/icons/PdfIcon.tsx';
import { PortfolioData } from '../types.ts';

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
                <div className="w-36 h-36 rounded-xl overflow-hidden border border-[#c6dce8] bg-[#f7fffb] shadow-md">
                  {about.photoUrl ? (
                    <img src={about.photoUrl} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <UserIcon className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                </div>
              </div>
              <div className="md:col-span-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">Basic Information</h2>
                  <div>
                    <a
                      href={encodeURI('/Personal Info/XinyaoLyu-CV.pdf')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#eaf6ff] border border-[#cfe3f2] text-[var(--primary)] rounded-md shadow-sm hover:bg-[#d7eefb]"
                      title="Open CV PDF"
                    >
                      <PdfIcon className="w-4 h-4" />
                      <span className="text-sm font-medium">CV</span>
                    </a>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {about.details.map((detail) => (
                    <div key={detail.id} className="px-0 py-0">
                      <p className="text-xs uppercase tracking-wide text-gray-500">{detail.label}</p>
                      <p className="text-gray-900 font-medium mt-1">{detail.value}</p>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {about.awards.map((award) => (
            <AwardCard
              key={award.id}
              award={award}
              onUpdate={noop}
              onDelete={noop}
              isViewMode={isViewMode}
            />
          ))}
        </div>
      </Section>

      <SkillsSection skills={skills} isViewMode={isViewMode} />
    </div>
  );
};

export default ResumePage;