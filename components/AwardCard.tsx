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
    <div className="relative group p-4 bg-white rounded-lg border border-gray-200 transition-colors hover:border-gray-300 flex flex-col">
      {!isViewMode && (
        <button 
          onClick={onDelete} 
          className="absolute top-2 right-2 p-1.5 bg-gray-100 text-gray-800 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-200"
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