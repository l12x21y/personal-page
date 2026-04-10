import React, { useState } from 'react';
import { Project } from '../types.ts';
import SearchIcon from './icons/SearchIcon.tsx';
import SortIcon from './icons/SortIcon.tsx';
import ChevronDownIcon from './icons/ChevronDownIcon.tsx';

interface ProjectFilterControlsProps {
  projects: Project[];
  searchTerm: string;
  activeTag: string;
  sortOption: string;
  onSearchChange: (term: string) => void;
  onTagChange: (tag: string) => void;
  onSortChange: (option: string) => void;
}

const sortOptions = {
  'custom': 'Custom',
  'date-desc': 'Latest',
  'date-asc': 'Oldest',
  'title-asc': 'Title A-Z',
  'title-desc': 'Title Z-A',
};

const tagFilters = ['All', 'Individual', 'Team', 'Architure', 'HCI'];

const ProjectFilterControls: React.FC<ProjectFilterControlsProps> = ({
  projects,
  searchTerm,
  activeTag,
  sortOption,
  onSearchChange,
  onTagChange,
  onSortChange,
}) => {
  const [isSortOpen, setIsSortOpen] = useState(false);

  const handleSortSelect = (option: string) => {
    onSortChange(option);
    setIsSortOpen(false);
  };

  return (
    <div className="mb-12 space-y-6">
      <div className="relative z-30 flex flex-col md:flex-row items-center justify-center gap-4">
        {/* Search Input */}
        <div className="relative w-full max-w-lg">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <SearchIcon className="w-5 h-5 text-gray-500" />
            </div>
            <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by project name or tag..."
            className="w-full bg-white border border-gray-300 rounded-full py-3 pl-11 pr-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#9ecfe8] focus:border-transparent transition-colors"
            aria-label="Search projects"
            />
        </div>

        {/* Sort Dropdown */}
        <div className="relative">
            <button
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="flex items-center justify-between gap-2 w-52 bg-white border border-gray-300 rounded-full py-3 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#9ecfe8] transition-colors"
            >
                <div className="flex items-center gap-2">
                    <SortIcon className="w-5 h-5 text-gray-500"/>
                    <span className="font-semibold text-sm">{sortOptions[sortOption as keyof typeof sortOptions]}</span>
                </div>
                <ChevronDownIcon className={`w-5 h-5 text-gray-500 transition-transform ${isSortOpen ? 'rotate-180' : ''}`}/>
            </button>
            {isSortOpen && (
              <div 
                className="absolute top-full mt-2 w-52 bg-white border border-gray-200 rounded-lg shadow-xl z-50"
                onMouseLeave={() => setIsSortOpen(false)}
              >
                    {Object.entries(sortOptions).map(([key, value]) => (
                        <button
                            key={key}
                            onClick={() => handleSortSelect(key)}
                          className={`w-full text-left px-4 py-2 text-sm font-semibold transition-colors ${sortOption === key ? 'bg-[#9ecfe8] text-gray-900' : 'text-gray-700 hover:bg-gray-100 hover:text-black'}`}
                        >
                            {value}
                        </button>
                    ))}
                </div>
            )}
        </div>
      </div>

      <div className="relative z-0 flex flex-wrap justify-center items-center gap-2">
        {tagFilters.map(tag => (
          <button
            key={tag}
            onClick={() => onTagChange(tag)}
            className={`group relative overflow-hidden px-4 py-2 text-sm font-semibold transition-all duration-300 ${
              activeTag === tag
                ? 'text-gray-950 font-semibold'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            <span className="relative z-10">{tag}</span>
            <span
              aria-hidden="true"
              className={`pointer-events-none absolute left-2 right-2 bottom-[4px] h-[4px] origin-left rounded-full bg-[#9ecfe8] transition-transform duration-500 ease-out ${
                activeTag === tag ? 'scale-x-100' : 'scale-x-0'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProjectFilterControls;