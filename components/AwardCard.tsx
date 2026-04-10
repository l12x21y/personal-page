import React from 'react';
import { Award } from '../types.ts';
import EditableInput from './common/EditableInput.tsx';
import TrashIcon from './icons/TrashIcon.tsx';

interface AwardCardProps {
  award: Award;
  onUpdate: (field: keyof Omit<Award, 'id'>, value: string) => void;
  onDelete: () => void;
  isViewMode?: boolean;
}

const AwardCard: React.FC<AwardCardProps> = ({ award, onUpdate, onDelete, isViewMode }) => {
  return (
    <div className="relative group mb-4">
      {!isViewMode && (
        <button 
          onClick={onDelete} 
          className="absolute top-0 right-0 p-1.5 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Delete award entry"
        >
          <TrashIcon className="w-4 h-4" />
        </button>
      )}
      <div className="flex-grow">
         <EditableInput 
            value={award.name} 
            onChange={val => onUpdate('name', val)} 
            ariaLabel="Award Name" 
            className="text-xl font-bold text-gray-900 w-full"
            isViewMode={isViewMode} 
          />
          <EditableInput 
            value={award.issuer} 
            onChange={val => onUpdate('issuer', val)} 
            ariaLabel="Issuer" 
            className="text-gray-700 w-full"
            isViewMode={isViewMode} 
          />
      </div>
      <EditableInput 
        value={award.date} 
        onChange={val => onUpdate('date', val)} 
        ariaLabel="Date of award" 
        className="text-sm text-gray-600 w-full mt-2 text-left"
        isViewMode={isViewMode} 
      />
    </div>
  );
};

export default AwardCard;