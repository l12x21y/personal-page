import React, { useState, useEffect, useRef } from 'react';
import { Skill } from '../types.ts';
import Section from './common/Section.tsx';
import EditableInput from './common/EditableInput.tsx';
import TrashIcon from './icons/TrashIcon.tsx';
import PlusIcon from './icons/PlusIcon.tsx';

interface SkillsSectionProps {
  skills: Skill[];
  isViewMode?: boolean;
  onUpdateSkill?: (skillId: number, field: keyof Omit<Skill, 'id'>, value: string | number) => void;
  onAddSkill?: () => void;
  onDeleteSkill?: (skillId: number) => void;
}

interface SkillBarProps {
  name: string;
  level: number;
  delay: number;
}

const SkillBar: React.FC<SkillBarProps> = ({ name, level, delay }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <div>
      <div className="flex justify-between items-end mb-1">
        <h4 className="font-semibold text-gray-900">{name}</h4>
        <p className="text-sm text-gray-600">{level}%</p>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className="h-2 rounded-full transition-all ease-out duration-1000"
          style={{ 
            width: isVisible ? `${level}%` : '0%',
            transitionDelay: `${delay}ms`,
            backgroundColor: 'var(--primary)'
          }}
        ></div>
      </div>
    </div>
  );
};

const SkillsSection: React.FC<SkillsSectionProps> = ({ skills, isViewMode, onUpdateSkill, onAddSkill, onDeleteSkill }) => {
  // In view mode, render grouped/tool lists and soft-skill bars.
  if (isViewMode) {
    // User-specified groups
    const categories = {
      Prototyping: ['AutoCAD', 'SketchUp', 'Rhino', 'Blender'],
      Design: ['Figma', 'Photoshop', 'Illustrator', 'InDesign', 'V-Ray', 'D5'],
      Coding: ['Python', 'JavaScript', 'SQL', 'React', 'Node.js'],
    };

    const softSkills = ['Leadership', 'Event Management', 'Writing', 'Public Speaking', 'Time Management'];

    // Build a lookup from provided skills array to preserve any explicit levels
    const levelMap: Record<string, number> = {};
    (skills || []).forEach(s => {
      if (s && s.name) levelMap[s.name.trim()] = Number(s.level) || 0;
    });

    const defaultSoftLevel = 75;

    return (
      <Section id="skills" title="My Expertise">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            {Object.entries(categories).map(([cat, items]) => (
              <div key={cat} className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">{cat}</h4>
                <div className="flex flex-wrap gap-2">
                  {items.map(item => (
                    <span key={item} className="inline-flex items-center px-3 py-1 rounded-full bg-[var(--primary)]/12 text-[var(--primary)] text-sm">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3">Soft Skills</h4>
            <div className="space-y-4">
              {softSkills.map((name, idx) => (
                <SkillBar key={name} name={name} level={levelMap[name] ?? defaultSoftLevel} delay={idx * 120} />
              ))}
            </div>
          </div>
        </div>
      </Section>
    );
  }

  // In editor mode, render editable controls for each skill.
  return (
    <Section id="skills" title="My Expertise">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {skills.map((skill) => (
          <div key={skill.id} className="bg-white p-4 rounded-lg border border-gray-200 flex flex-col gap-3 transition-all hover:border-gray-300">
            <div className="flex items-center justify-between">
              <EditableInput
                value={skill.name}
                onChange={(value) => onUpdateSkill?.(skill.id, 'name', value)}
                ariaLabel="Skill Name"
                className="font-semibold text-gray-900 w-full"
                isViewMode={isViewMode}
              />
              <button 
                onClick={() => onDeleteSkill?.(skill.id)} 
                className="p-1 text-gray-400 hover:text-black transition-colors" 
                aria-label={`Delete ${skill.name} skill`}
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="100"
                value={skill.level}
                onChange={(e) => onUpdateSkill?.(skill.id, 'level', parseInt(e.target.value, 10))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                aria-label={`${skill.name} proficiency level`}
              />
              <span className="text-sm text-gray-600 w-12 text-right">{skill.level}%</span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 text-center">
        <button
          onClick={onAddSkill}
          className="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white font-semibold px-4 py-2 rounded-md hover:bg-indigo-700 transition-all duration-300 hover:scale-105 active:scale-100"
          aria-label="Add a new skill"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Add Skill</span>
        </button>
      </div>
    </Section>
  );
};

export default SkillsSection;