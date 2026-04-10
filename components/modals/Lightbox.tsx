import React, { useEffect, useState, useRef } from 'react';
import { Project, ProjectImage } from '../../types.ts';
import CloseIcon from '../icons/CloseIcon.tsx';
import ChevronLeftIcon from '../icons/ChevronLeftIcon.tsx';
import ChevronRightIcon from '../icons/ChevronRightIcon.tsx';
import { getAssetUrl } from '../../utils/assetUrl.ts';
import TrashIcon from '../icons/TrashIcon.tsx';
import PlusIcon from '../icons/PlusIcon.tsx';
import CameraIcon from '../icons/CameraIcon.tsx';
import EditableInput from '../common/EditableInput.tsx';
import PlayIcon from '../icons/PlayIcon.tsx';
import PauseIcon from '../icons/PauseIcon.tsx';


interface LightboxProps {
  project: Project;
  onClose: () => void;
  isViewMode: boolean;
  initialIndex?: number;
  minimalView?: boolean;
  onAddGalleryImage: (projectId: number, file: File) => void;
  onDeleteProjectImage: (projectId: number, imageIndex: number) => void;
  onSetAsCoverImage: (projectId: number, imageIndex: number) => void;
  onUpdateProjectImageName: (projectId: number, imageIndex: number, name: string) => void;
  onReorderProjectImages: (projectId: number, reorderedImages: ProjectImage[]) => void;
}

const Lightbox: React.FC<LightboxProps> = ({ 
    project, 
    onClose, 
    isViewMode,
    initialIndex = 0,
    minimalView = false,
    onAddGalleryImage,
    onDeleteProjectImage,
    onSetAsCoverImage,
    onUpdateProjectImageName,
    onReorderProjectImages
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isPlaying, setIsPlaying] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const allImages = project.images || [];

  useEffect(() => {
    const safeIndex = Math.min(Math.max(initialIndex, 0), Math.max(allImages.length - 1, 0));
    setCurrentIndex(safeIndex);
  }, [initialIndex, allImages.length]);

  const goToNext = () => setCurrentIndex((prevIndex) => (prevIndex + 1) % allImages.length);
  
  // Autoplay Effect
  useEffect(() => {
    let interval: number | undefined;
    if (isPlaying && allImages.length > 1) {
      interval = window.setInterval(goToNext, 5000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, allImages.length, currentIndex]);


  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    const handleArrows = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        goToPrevious();
        setIsPlaying(false);
      }
      if (event.key === 'ArrowRight') {
        goToNext();
        setIsPlaying(false);
      }
    }
    window.addEventListener('keydown', handleEsc);
    window.addEventListener('keydown', handleArrows);
    return () => {
      window.removeEventListener('keydown', handleEsc);
      window.removeEventListener('keydown', handleArrows);
    };
  }, [allImages.length]);

  const goToPrevious = () => setCurrentIndex((prevIndex) => (prevIndex === 0 ? allImages.length - 1 : prevIndex - 1));

  const handleManualNavigation = (action: () => void) => {
    setIsPlaying(false);
    action();
  };
  
  const handleAddImageClick = () => fileInputRef.current?.click();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onAddGalleryImage(project.id, file);
    }
  };

  const handleDeleteImage = () => {
    if (allImages.length <= 1) {
        alert("You cannot delete the only image in the project.");
        return;
    }
    if (window.confirm("Are you sure you want to delete this image?")) {
        onDeleteProjectImage(project.id, currentIndex);
        if (currentIndex >= allImages.length - 1) {
            setCurrentIndex(allImages.length - 2);
        }
    }
  };

  const handleSetAsCover = () => {
    if (currentIndex > 0) {
        onSetAsCoverImage(project.id, currentIndex);
        setCurrentIndex(0); // The new cover is now at index 0
    }
  };
  
  const handleDragSort = () => {
    if (dragItem.current === null || dragOverItem.current === null || dragItem.current === dragOverItem.current) {
        return;
    }
    const reorderedImages = [...allImages];
    const draggedItemContent = reorderedImages.splice(dragItem.current, 1)[0];
    reorderedImages.splice(dragOverItem.current, 0, draggedItemContent);
    onReorderProjectImages(project.id, reorderedImages);
    setCurrentIndex(reorderedImages.findIndex(img => img.url === draggedItemContent.url));
    dragItem.current = null;
    dragOverItem.current = null;
  };

  if (!project) return null;

  const currentImage = allImages[currentIndex];
  const currentImageDescription = currentImage?.description?.trim();
  const showProjectMeta = currentIndex === 0;
  const mediaMaxHeightClass = minimalView
    ? 'max-h-[calc(100vh-10rem)] md:max-h-[calc(100vh-11rem)]'
    : 'max-h-[calc(100vh-13rem)] md:max-h-[calc(100vh-14rem)]';

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-[110]"
      aria-modal="true"
      role="dialog"
      onClick={onClose}
    >
      {minimalView ? (
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-2 text-white hover:text-gray-300 transition-colors z-[120]"
          aria-label="Close viewer"
        >
          <CloseIcon className="w-8 h-8" />
        </button>
      ) : (
        <header className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-[120]">
          <div>
            <h3 className="text-white text-lg font-bold">{project.title}</h3>
            <p className="text-gray-400 text-sm">Image {currentIndex + 1} of {allImages.length}</p>
          </div>
          <div className="flex items-center gap-4">
              {!isViewMode && allImages.length > 1 && (
                   <button 
                      onClick={() => setIsPlaying(!isPlaying)} 
                      className="p-2 text-white hover:text-gray-300 transition-colors"
                      aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
                      title={isPlaying ? "Pause Slideshow" : "Play Slideshow"}
                  >
                      {isPlaying ? <PauseIcon className="w-6 h-6"/> : <PlayIcon className="w-6 h-6"/>}
                  </button>
              )}
              <button
                onClick={onClose}
                className="p-2 text-white hover:text-gray-300 transition-colors"
                aria-label="Close viewer"
              >
                <CloseIcon className="w-8 h-8" />
              </button>
          </div>
        </header>
      )}

        <main className="w-full h-full flex items-center justify-center p-6 md:p-10 pb-24 md:pb-28" onClick={(e) => e.stopPropagation()}>
        {allImages.length > 1 && (
            <>
                <button onClick={() => handleManualNavigation(goToPrevious)} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/40 text-white rounded-full hover:bg-black/60 transition-colors z-[120]">
                    <ChevronLeftIcon className="w-8 h-8"/>
                </button>
                <button onClick={() => handleManualNavigation(goToNext)} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/40 text-white rounded-full hover:bg-black/60 transition-colors z-[120]">
                    <ChevronRightIcon className="w-8 h-8"/>
                </button>
            </>
        )}
        <div className={`w-full h-full max-w-7xl ${minimalView ? 'grid grid-cols-1 items-center' : 'grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-4 md:gap-6 items-center'}`}>
          <div className="relative w-full h-full flex flex-col items-center justify-center">
            {currentImage && (
              <img
                key={currentImage.url}
                src={getAssetUrl(currentImage.url)}
                alt={currentImage.name}
                className={`max-w-full ${mediaMaxHeightClass} object-contain animate-fade-in-up`}
              />
            )}
            {!isViewMode && currentImage && (
              <div className="absolute bottom-0 w-full max-w-xl p-2 text-center">
                <EditableInput 
                  value={currentImage.name}
                  onChange={(val) => onUpdateProjectImageName(project.id, currentIndex, val)}
                  className="text-white text-center bg-black/30 backdrop-blur-sm rounded-md px-3 py-1 text-sm w-full"
                  ariaLabel="Image name"
                />
              </div>
            )}
            {!isViewMode && (
              <div className="absolute top-0 right-0 flex items-center gap-2 p-2 bg-black/30 rounded-bl-lg">
                {currentIndex > 0 && (
                  <button onClick={handleSetAsCover} title="Set as cover image" className="p-2 text-white hover:bg-white/20 rounded-md transition-colors">
                    <CameraIcon className="w-5 h-5" />
                  </button>
                )}
                <button onClick={handleDeleteImage} title="Delete image" className="p-2 text-white hover:bg-white/20 rounded-md transition-colors">
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {!minimalView && (
          <aside className="bg-gradient-to-b from-black/60 to-black/40 border border-white/15 text-white rounded-xl p-5 backdrop-blur-md self-stretch overflow-y-auto shadow-2xl">
            {showProjectMeta && (
              <div className="space-y-4 pb-5 border-b border-white/15">
                <div className="space-y-2">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-gray-300">Project</p>
                  <h4 className="text-xl font-semibold leading-tight">{project.title}</h4>
                  {project.description && (
                    <p className="text-sm text-gray-200 leading-relaxed">{project.description}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-2 text-sm">
                  {project.time && (
                    <div className="flex items-start gap-2">
                      <span className="text-gray-400 w-16 shrink-0">时间</span>
                      <span className="text-gray-100">{project.time}</span>
                    </div>
                  )}
                  {project.workType && (
                    <div className="flex items-start gap-2">
                      <span className="text-gray-400 w-16 shrink-0">类型</span>
                      <span className="text-gray-100">{project.workType}</span>
                    </div>
                  )}
                  {project.role && (
                    <div className="flex items-start gap-2">
                      <span className="text-gray-400 w-16 shrink-0">角色</span>
                      <span className="text-gray-100 leading-relaxed">{project.role}</span>
                    </div>
                  )}
                </div>

                {project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map(tag => (
                      <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-gray-100">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className={showProjectMeta ? 'pt-5 space-y-3' : 'space-y-3'}>
              <p className="text-[11px] uppercase tracking-[0.2em] text-gray-300">Image Info</p>
              <p className="text-sm font-medium break-all text-gray-100">{currentImage?.name}</p>
              {currentImageDescription ? (
                <p className="text-sm text-gray-200 leading-relaxed">{currentImageDescription}</p>
              ) : (
                <p className="text-sm text-gray-400 italic">该图片暂无文字介绍</p>
              )}
            </div>
          </aside>
          )}
        </div>
      </main>
      
      <footer className="absolute bottom-0 left-0 right-0 p-2 z-[120] flex items-center justify-center gap-2" onClick={(e) => e.stopPropagation()}>
          {!isViewMode && (
            <button
              onClick={handleAddImageClick}
              className="w-16 aspect-[4/3] bg-gray-700/50 border-2 border-dashed border-gray-500 rounded-md flex items-center justify-center text-gray-400 hover:bg-gray-600/50 hover:border-gray-400 hover:text-white transition-all flex-shrink-0"
              title="Add new image"
            >
                <PlusIcon className="w-5 h-5"/>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
            </button>
          )}
          <div className="flex gap-2 overflow-x-auto py-1">
            {allImages.map((img, index) => (
                <button 
                    key={img.url + index} 
                    onClick={() => handleManualNavigation(() => setCurrentIndex(index))} 
                    className={`relative w-16 aspect-[4/3] rounded-md flex-shrink-0 overflow-hidden transition-all duration-200 ${currentIndex === index ? 'ring-2 ring-white ring-offset-2 ring-offset-black/50 scale-110' : 'opacity-60 hover:opacity-100'} ${isViewMode ? '' : 'cursor-grab active:cursor-grabbing'}`}
                    draggable={!isViewMode}
                    onDragStart={() => dragItem.current = index}
                    onDragEnter={() => dragOverItem.current = index}
                    onDragEnd={handleDragSort}
                    onDragOver={(e) => e.preventDefault()}
                >
                    <img src={img.url} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover pointer-events-none"/>
                                        <img src={getAssetUrl(img.url)} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover pointer-events-none"/>
                    {index === 0 && <div className="absolute top-0 left-0 px-1.5 py-0.5 text-xs bg-gray-200 text-black rounded-tl-md rounded-br-md font-semibold">Cover</div>}
                </button>
            ))}
          </div>
      </footer>
    </div>
  );
};

export default Lightbox;
