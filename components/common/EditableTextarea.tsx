import React, { useRef, useEffect } from 'react';

interface EditableTextareaProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  ariaLabel: string;
  isViewMode?: boolean;
}

const EditableTextarea: React.FC<EditableTextareaProps> = ({ value, onChange, className, ariaLabel, isViewMode }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  if (isViewMode) {
    const mergedClassName = className ? `${className} whitespace-pre-line` : 'whitespace-pre-line';
    return <p className={mergedClassName}>{value}</p>;
  }

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={ariaLabel}
      rows={1}
      className={`bg-transparent border-none p-0 focus:ring-0 focus:outline-none w-full resize-none overflow-hidden ${className}`}
    />
  );
};

export default EditableTextarea;