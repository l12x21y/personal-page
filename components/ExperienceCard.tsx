import React from 'react';
import { Experience } from '../types.ts';
import EditableInput from './common/EditableInput.tsx';
import EditableTextarea from './common/EditableTextarea.tsx';
import TrashIcon from './icons/TrashIcon.tsx';

interface ExperienceCardProps {
  experience: Experience;
  onUpdate: (field: keyof Omit<Experience, 'id'>, value: string) => void;
  onDelete: () => void;
  isViewMode?: boolean;
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({ experience, onUpdate, onDelete, isViewMode }) => {
  return (
    <div className="relative group mb-4">
      {!isViewMode && (
        <button 
          onClick={onDelete} 
          className="absolute top-0 right-0 p-1.5 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Delete experience entry"
        >
          <TrashIcon className="w-4 h-4" />
        </button>
      )}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-1">
        <EditableInput 
          value={experience.role} 
          onChange={val => onUpdate('role', val)} 
          ariaLabel="Role or Title" 
          className="text-xl font-bold text-gray-900 w-full sm:w-auto"
          isViewMode={isViewMode} 
        />
        <EditableInput 
          value={experience.date} 
          onChange={val => onUpdate('date', val)} 
          ariaLabel="Date range" 
          className="text-sm text-gray-600 w-full sm:w-auto text-left sm:text-right mt-1 sm:mt-0"
          isViewMode={isViewMode} 
        />
      </div>
      <EditableInput 
        value={experience.organization} 
        onChange={val => onUpdate('organization', val)} 
        ariaLabel="Organization or Company" 
        className="font-semibold text-gray-700 mb-1 w-full"
        isViewMode={isViewMode} 
      />
      <EditableTextarea 
        value={experience.description} 
        onChange={val => onUpdate('description', val)} 
        ariaLabel="Experience description" 
        className="text-gray-700 w-full mt-1"
        isViewMode={isViewMode} 
      />
    </div>
  );
};

export default ExperienceCard;