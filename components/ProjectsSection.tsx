import React, { useRef, useState, useMemo } from 'react';
import { Project } from '../types.ts';
import ProjectCard from './ProjectCard.tsx';
import Section from './common/Section.tsx';
import ProjectFilterControls from './ProjectFilterControls.tsx';

interface ProjectsSectionProps {
  projects: Project[];
  onUpdateProject: (projectId: number, field: keyof Omit<Project, 'id' | 'tags' | 'images' | 'fileUrl' | 'fileType'>, value: string) => void;
  onUpdateProjectImage: (projectId: number, imageUrl: string) => void;
  onProjectClick: (project: Project) => void;
  onAddProjectTag: (projectId: number, tag: string) => void;
  onDeleteProjectTag: (projectId: number, tag: string) => void;
  onDeleteProject: (projectId: number) => void;
  onReorderProjects: (projects: Project[]) => void;
  isViewMode?: boolean;
}

const ProjectsSection: React.FC<ProjectsSectionProps> = ({ 
    projects, 
    onUpdateProject, 
    onUpdateProjectImage, 
    onProjectClick, 
    onAddProjectTag, 
    onDeleteProjectTag, 
    isViewMode, 
    onDeleteProject, 
    onReorderProjects 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTag, setActiveTag] = useState('All');
  const [sortOption, setSortOption] = useState('custom'); // 'custom', 'date-desc', 'date-asc', 'title-asc', 'title-desc'
  
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const matchesTagFilter = (projectTags: string[], activeFilter: string) => {
    if (activeFilter === 'All') return true;

    const normalizedTags = projectTags.map(tag => tag.toLowerCase().trim());
    const aliasMap: Record<string, string[]> = {
      'individual': ['individual'],
      'team': ['team', 'teamwork'],
      'architure': ['architure', 'architecture'],
      'hci': ['hci'],
    };

    const candidates = aliasMap[activeFilter.toLowerCase().trim()] || [activeFilter.toLowerCase().trim()];
    return candidates.some(candidate => normalizedTags.includes(candidate));
  };
  
  const sortedAndFilteredProjects = useMemo(() => {
    // 1. Filter projects
    const filtered = projects.filter(project => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        project.title.toLowerCase().includes(searchLower) ||
        project.tags.some(tag => tag.toLowerCase().includes(searchLower));

      const matchesTag = matchesTagFilter(project.tags, activeTag);

      return matchesSearch && matchesTag;
    });

    // 2. Sort projects
    const sorted = [...filtered];
    switch (sortOption) {
        case 'date-desc':
            sorted.sort((a, b) => b.id - a.id);
            break;
        case 'date-asc':
            sorted.sort((a, b) => a.id - b.id);
            break;
        case 'title-asc':
            sorted.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'title-desc':
            sorted.sort((a, b) => b.title.localeCompare(a.title));
            break;
        case 'custom':
        default:
            // For 'custom', we maintain the order from the original `projects` array
            return filtered;
    }

    return sorted;
  }, [projects, searchTerm, activeTag, sortOption]);

  const handleDragSort = () => {
    if (dragItem.current === null || dragOverItem.current === null || dragItem.current === dragOverItem.current) {
        dragItem.current = null;
        dragOverItem.current = null;
        return;
    }

    // Since we are dragging the 'custom' ordered list, we use the original filtered list for mapping
    const customOrderedFilteredProjects = projects.filter(project => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = project.title.toLowerCase().includes(searchLower) || project.tags.some(tag => tag.toLowerCase().includes(searchLower));
      const matchesTag = matchesTagFilter(project.tags, activeTag);
      return matchesSearch && matchesTag;
    });

    const draggedProject = customOrderedFilteredProjects[dragItem.current];
    const dropTargetProject = customOrderedFilteredProjects[dragOverItem.current];

    const originalDraggedIndex = projects.findIndex(p => p.id === draggedProject.id);
    const originalDropTargetIndex = projects.findIndex(p => p.id === dropTargetProject.id);
    
    if (originalDraggedIndex === -1 || originalDropTargetIndex === -1) return;

    const projectsCopy = [...projects];
    const draggedItemContent = projectsCopy.splice(originalDraggedIndex, 1)[0];
    projectsCopy.splice(originalDropTargetIndex, 0, draggedItemContent);
    
    onReorderProjects(projectsCopy);
    
    // Switch back to custom sort if user drags
    if (sortOption !== 'custom') {
        setSortOption('custom');
    }

    dragItem.current = null;
    dragOverItem.current = null;
  };
  
  return (
    <Section id="projects" title="My Work">
      {projects.length > 0 && (
          <ProjectFilterControls
            projects={projects}
            searchTerm={searchTerm}
            activeTag={activeTag}
            sortOption={sortOption}
            onSearchChange={setSearchTerm}
            onTagChange={setActiveTag}
            onSortChange={setSortOption}
          />
      )}
      {projects.length === 0 && (
        <div className="text-center py-16 px-6 bg-white border-2 border-dashed border-gray-300 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-900">Your work will appear here.</h3>
          <p className="text-gray-600 mt-2">Use the "Add Content" button in the header to upload assets and create new project cards.</p>
        </div>
      )}
      {sortedAndFilteredProjects.length === 0 && projects.length > 0 && (
        <div className="text-center py-16 px-6 bg-white rounded-lg">
          <h3 className="text-xl font-semibold text-gray-900">No projects found.</h3>
          <p className="text-gray-600 mt-2">Try adjusting your search or filter criteria.</p>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {sortedAndFilteredProjects.map((project, index) => (
          <ProjectCard
            key={project.id}
            project={project}
            onUpdateProject={onUpdateProject}
            onUpdateProjectImage={onUpdateProjectImage}
            onAddProjectTag={onAddProjectTag}
            onDeleteProjectTag={onDeleteProjectTag}
            onCardClick={() => onProjectClick(project)}
            onDeleteProject={onDeleteProject}
            isViewMode={isViewMode}
            isDraggable={!isViewMode && sortOption === 'custom'}
            onDragStart={() => dragItem.current = index}
            onDragEnter={() => dragOverItem.current = index}
            onDragEnd={handleDragSort}
            onDragOver={(e) => e.preventDefault()}
          />
        ))}
      </div>
    </Section>
  );
};

export default ProjectsSection;