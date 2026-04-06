import React from 'react';

interface EditableInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  ariaLabel: string;
  isViewMode?: boolean;
}

const EditableInput: React.FC<EditableInputProps> = ({ value, onChange, className, ariaLabel, isViewMode }) => {
  if (isViewMode) {
    return <span className={className}>{value}</span>;
  }
  
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={ariaLabel}
      className={`bg-transparent border-none p-0 focus:ring-0 focus:outline-none w-full ${className}`}
    />
  );
};

export default EditableInput;