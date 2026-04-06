import React, { useState, useCallback, useRef } from 'react';
import Section from './common/Section.tsx';
import { refineTextWithAI } from '../services/geminiService.ts';
import AiRefineButton from './common/AiRefineButton.tsx';
import EditableTextarea from './common/EditableTextarea.tsx';
import EditableInput from './common/EditableInput.tsx';
import { PortfolioData, Experience, Award, AboutDetail } from '../types.ts';
import CameraIcon from './icons/CameraIcon.tsx';
import UserIcon from './icons/UserIcon.tsx';
import PlusIcon from './icons/PlusIcon.tsx';
import TrashIcon from './icons/TrashIcon.tsx';

interface AboutSectionProps {
  portfolioData: PortfolioData;
  isViewMode?: boolean;
  onUpdateAboutField: (field: 'summary', value: string) => void;
  onUpdateAboutPhoto: (url: string) => void;
  onAddExperience: (type: 'workExperience' | 'researchExperience') => void;
  onUpdateExperience: (type: 'workExperience' | 'researchExperience', experienceId: number, field: keyof Omit<Experience, 'id'>, value: string) => void;
  onDeleteExperience: (type: 'workExperience' | 'researchExperience', experienceId: number) => void;
  onAddAward: () => void;
  onUpdateAward: (awardId: number, field: keyof Omit<Award, 'id'>, value: string) => void;
  onDeleteAward: (awardId: number) => void;
  onAddAboutDetail: () => void;
  onUpdateAboutDetail: (detailId: number, field: keyof Omit<AboutDetail, 'id'>, value: string) => void;
  onDeleteAboutDetail: (detailId: number) => void;
}

const AboutSection: React.FC<AboutSectionProps> = ({ 
  portfolioData, 
  isViewMode,
  onUpdateAboutField,
  onUpdateAboutPhoto,
  onAddAboutDetail,
  onUpdateAboutDetail,
  onDeleteAboutDetail,
}) => {
  const { about } = portfolioData;
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleRefineSummary = useCallback(async () => {
    setIsLoading(true);
    const refinedSummary = await refineTextWithAI(about.summary, 'summary');
    onUpdateAboutField('summary', refinedSummary);
    setIsLoading(false);
  }, [about.summary, onUpdateAboutField]);

  const handlePhotoUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          onUpdateAboutPhoto(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const DetailItem: React.FC<{detail: AboutDetail}> = ({ detail }) => (
    <div className="flex items-center group -ml-2 -mr-2 px-2 py-1 rounded-md transition-colors hover:bg-gray-100/50">
        <EditableInput
            value={detail.label}
            onChange={(val) => onUpdateAboutDetail(detail.id, 'label', val)}
            ariaLabel="Detail label"
            className="font-semibold text-gray-900 w-1/3"
            isViewMode={isViewMode}
        />
        <EditableInput
            value={detail.value}
            onChange={(val) => onUpdateAboutDetail(detail.id, 'value', val)}
            ariaLabel="Detail value"
            className="text-gray-600 w-2/3 ml-2"
            isViewMode={isViewMode}
        />
        {!isViewMode && (
            <button
                onClick={() => onDeleteAboutDetail(detail.id)}
                className="ml-2 p-1 text-gray-400 hover:text-black opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label={`Delete detail ${detail.label}`}
            >
                <TrashIcon className="w-4 h-4" />
            </button>
        )}
    </div>
  );

  return (
    <Section id="about" title="About Me">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="md:col-span-1 flex justify-center items-start">
          <div className="relative group w-56 h-56 sm:w-64 sm:h-64 rounded-full overflow-hidden border-4 border-gray-200 shadow-lg">
            {about.photoUrl ? (
              <img src={about.photoUrl} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <UserIcon className="w-24 h-24 text-gray-400" />
              </div>
            )}
            {!isViewMode && (
              <>
                <div onClick={handlePhotoUploadClick} className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer">
                  <CameraIcon className="w-8 h-8 mb-2" />
                  <span className="font-semibold">Change Photo</span>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/png, image/jpeg, image/webp"
                  className="hidden"
                  aria-hidden="true"
                />
              </>
            )}
          </div>
        </div>

        <div className="md:col-span-2 flex flex-col justify-center space-y-6">
          <div className="p-6 bg-white rounded-lg border border-gray-200">
             <div className="space-y-1">
                {about.details.map(detail => (
                    isViewMode && !detail.value ? null : <DetailItem key={detail.id} detail={detail} />
                ))}
            </div>
             {!isViewMode && (
                <div className="mt-4 text-center">
                    <button onClick={onAddAboutDetail} className="inline-flex items-center gap-2 text-gray-500 hover:text-black text-sm font-semibold transition-colors py-1 px-2 rounded-md hover:bg-gray-200">
                        <PlusIcon className="w-4 h-4" /> Add Detail
                    </button>
                </div>
            )}
          </div>
          <div className="p-6 bg-white rounded-lg border border-gray-200 transition-colors hover:border-gray-300">
            <EditableTextarea
                value={about.summary}
                onChange={(val) => onUpdateAboutField('summary', val)}
                ariaLabel="Professional Summary"
                className="text-lg text-gray-700 leading-relaxed"
                isViewMode={isViewMode}
            />
          </div>
          {!isViewMode && (
            <div className="flex items-center justify-end">
              <AiRefineButton onClick={handleRefineSummary} isLoading={isLoading} />
            </div>
          )}
        </div>
      </div>
    </Section>
  );
};

export default AboutSection;