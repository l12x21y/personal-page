import React, { useState, useCallback, useRef } from 'react';
import { Project } from '../types.ts';
import { refineTextWithAI } from '../services/geminiService.ts';
import AiRefineButton from './common/AiRefineButton.tsx';
import EditableInput from './common/EditableInput.tsx';
import EditableTextarea from './common/EditableTextarea.tsx';
import PdfIcon from './icons/PdfIcon.tsx';
import CameraIcon from './icons/CameraIcon.tsx';
import CloseIcon from './icons/CloseIcon.tsx';
import TrashIcon from './icons/TrashIcon.tsx';
import CollectionIcon from './icons/CollectionIcon.tsx';

interface ProjectCardProps {
  project: Project;
  onUpdateProject: (projectId: number, field: keyof Omit<Project, 'id' | 'tags' | 'images' | 'fileUrl' | 'fileType'>, value: string) => void;
  onUpdateProjectImage: (projectId: number, imageUrl: string) => void;
  onAddProjectTag: (projectId: number, tag: string) => void;
  onDeleteProjectTag: (projectId: number, tag: string) => void;
  onDeleteProject: (projectId: number) => void;
  onCardClick: () => void;
  isViewMode?: boolean;
  isDraggable?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnter?: (e: React.DragEvent) => void;
  onDragEnd?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ 
  project, 
  onUpdateProject, 
  onUpdateProjectImage, 
  onAddProjectTag, 
  onDeleteProjectTag, 
  onCardClick, 
  onDeleteProject,
  isViewMode,
  isDraggable,
  onDragStart,
  onDragEnter,
  onDragEnd,
  onDragOver
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [newTag, setNewTag] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleRefineDescription = useCallback(async () => {
    setIsLoading(true);
    const refinedDescription = await refineTextWithAI(project.description, 'description');
    onUpdateProject(project.id, 'description', refinedDescription);
    setIsLoading(false);
  }, [project, onUpdateProject]);

  const handleCoverUploadClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click event from firing
    fileInputRef.current?.click();
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
        onDeleteProject(project.id);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          onUpdateProjectImage(project.id, e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  const coverImageUrl = project.images?.[0]?.url;
  const showImage = !!coverImageUrl;
  const isPdfProject = project.fileType === 'pdf';
  const hasGallery = project.images && project.images.length > 1;

  const handleCardClick = (e: React.MouseEvent) => {
    if (!isViewMode && (e.target as HTMLElement).closest('button, input, textarea, a')) {
        return;
    }
    onCardClick();
  };

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    const tagsToAdd = newTag
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    if (tagsToAdd.length > 0) {
      tagsToAdd.forEach(tag => onAddProjectTag(project.id, tag));
      setNewTag('');
    }
  };

  const handleDragStartInternal = (e: React.DragEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button, input, textarea, a')) {
        e.preventDefault();
        return;
    }
    if (onDragStart) {
        onDragStart(e);
    }
  };
  
  const cardCursorClass = isDraggable ? 'cursor-move' : 'cursor-pointer';

  return (
    <div 
      className={`relative bg-white rounded-lg overflow-hidden border border-gray-200 group transition-all duration-300 hover:border-gray-300 hover:shadow-xl hover:shadow-gray-200/80 hover:scale-105 flex flex-col ${cardCursorClass}`}
      draggable={isDraggable}
      onDragStart={handleDragStartInternal}
      onDragEnter={onDragEnter}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onClick={handleCardClick}
    >
      {!isViewMode && (
        <button
          onClick={(e) => {
            e.stopPropagation(); 
            handleDelete();
          }}
          className="absolute top-2 right-2 z-20 p-1.5 bg-white/50 backdrop-blur-sm text-black rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white/80 focus:opacity-100"
          aria-label="Delete project"
          title="Delete Project"
        >
          <TrashIcon className="w-4 h-4" />
        </button>
      )}
      <div className="relative">
        {hasGallery && (
            <div 
                className="absolute top-2 left-2 z-10 p-1.5 bg-black/50 backdrop-blur-sm text-white rounded-full"
                title="This project has a gallery"
            >
                <CollectionIcon className="w-4 h-4" />
            </div>
        )}
        {showImage ? (
            <img src={coverImageUrl} alt={project.title} className="w-full h-48 object-cover" />
        ) : isPdfProject ? (
            <div className="w-full h-48 bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                <PdfIcon className="w-20 h-20 text-gray-400" />
            </div>
        ) : (
             <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                <p className="text-gray-500">No image</p>
            </div>
        )}
        {!isViewMode && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button 
                  onClick={handleCoverUploadClick}
                  className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white font-semibold px-4 py-2 rounded-md hover:bg-white/30 transition-colors"
              >
                  <CameraIcon className="w-5 h-5"/>
                  Change Cover
              </button>
          </div>
        )}
      </div>
      
      {!isViewMode && (
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/png, image/jpeg, image/webp"
          className="hidden"
          aria-hidden="true"
        />
      )}

      <div className="p-6 flex flex-col flex-grow">
        <div className="w-full flex items-start justify-between mb-2 gap-3">
          <h3 className="text-xl font-bold text-gray-900 font-mono tracking-widest flex-1">
             <EditableInput 
                  value={project.title}
                  onChange={(val) => onUpdateProject(project.id, 'title', val)}
                  className="text-xl font-bold text-gray-900 w-full"
                  ariaLabel="Project Title"
                  isViewMode={isViewMode}
              />
          </h3>
          {project.status === 'in progress' && (
            <span className="whitespace-nowrap inline-block text-xs font-semibold text-gray-800 bg-gray-100 px-3 py-1 rounded-full border border-gray-300 self-start">In progress</span>
          )}
        </div>
        <div className="text-gray-600 mb-4 text-sm leading-relaxed flex-grow">
             <EditableTextarea
                value={project.description}
                onChange={(val) => onUpdateProject(project.id, 'description', val)}
                className="text-gray-600 text-sm leading-relaxed w-full"
                ariaLabel="Project Description"
                isViewMode={isViewMode}
            />
        </div>
        
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {project.tags.map((tag) => (
            <span key={tag} className="relative group/tag bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1 rounded-full border border-gray-200">
              {tag}
              {!isViewMode && (
                  <button onClick={(e) => { e.stopPropagation(); onDeleteProjectTag(project.id, tag); }} className="absolute -top-1.5 -right-1.5 bg-gray-300 rounded-full text-black opacity-0 group-hover/tag:opacity-100 transition-opacity" aria-label={`Remove tag: ${tag}`}>
                    <CloseIcon className="w-3 h-3"/>
                  </button>
              )}
            </span>
          ))}
          {!isViewMode && (
            <form onSubmit={handleAddTag} className="inline-block">
                <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add tag(s)..."
                    aria-label="Add new tags, comma-separated"
                    className="bg-gray-100 border border-gray-200 text-gray-800 placeholder:text-gray-500 text-xs font-medium px-3 py-1 rounded-full w-32 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
                />
            </form>
          )}
        </div>
        {!isViewMode && (
          <div className="text-right mt-auto">
            <AiRefineButton onClick={handleRefineDescription} isLoading={isLoading} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;