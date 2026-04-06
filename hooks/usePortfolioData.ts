import { useState } from 'react';
import { PortfolioData, Project, Contact, Asset, Skill, ProjectImage, AboutData, Experience, Award, AboutDetail } from '../types.ts';
import { generateProjectDetailsFromImage } from '../services/geminiService.ts';
import { generatedPortfolioData } from './generatedPortfolioData.ts';

const initialData: PortfolioData = generatedPortfolioData;

export const usePortfolioData = () => {
  const [portfolioData, setPortfolioData] = useState<PortfolioData>(() => JSON.parse(JSON.stringify(initialData)));

  const updateField = <K extends keyof Omit<PortfolioData, 'projects' | 'contact' | 'skills' | 'assets' | 'about'>>(field: K, value: PortfolioData[K]) => {
    setPortfolioData(prev => ({ ...prev, [field]: value }));
  };
  
  const updateProject = (projectId: number, field: keyof Omit<Project, 'id' | 'tags' | 'images' | 'fileUrl' | 'fileType' >, value: string) => {
    setPortfolioData(prev => ({
      ...prev,
      projects: prev.projects.map(p =>
        p.id === projectId ? { ...p, [field]: value } : p
      ),
    }));
  };

  const updateProjectImage = (projectId: number, imageUrl: string) => {
    setPortfolioData(prev => ({
      ...prev,
      projects: prev.projects.map(p => {
        if (p.id !== projectId) return p;
        const newImages = [...p.images];
        if (newImages.length > 0) {
          newImages[0] = { ...newImages[0], url: imageUrl };
        } else {
          newImages.push({ url: imageUrl, name: 'Cover Image' });
        }
        return { ...p, images: newImages };
      })
    }));
  };

  const updateContact = (field: keyof Contact, value: string) => {
    setPortfolioData(prev => ({
      ...prev,
      contact: {
        ...prev.contact,
        [field]: value
      }
    }));
  };
  
  // --- About Section Handlers ---

  const updateAboutField = (field: keyof Omit<AboutData, 'workExperience' | 'researchExperience' | 'awards' | 'photoUrl' | 'details'>, value: string) => {
    setPortfolioData(prev => ({ ...prev, about: { ...prev.about, [field]: value } }));
  };

  const updateAboutPhoto = (url: string) => {
    setPortfolioData(prev => ({ ...prev, about: { ...prev.about, photoUrl: url } }));
  };

  const addAboutDetail = () => {
    const newDetail: AboutDetail = {
      id: Date.now(),
      label: 'New Detail',
      value: 'Value',
    };
    setPortfolioData(prev => ({
      ...prev,
      about: { ...prev.about, details: [...prev.about.details, newDetail] },
    }));
  };

  const updateAboutDetail = (detailId: number, field: keyof Omit<AboutDetail, 'id'>, value: string) => {
    setPortfolioData(prev => ({
      ...prev,
      about: {
        ...prev.about,
        details: prev.about.details.map(detail =>
          detail.id === detailId ? { ...detail, [field]: value } : detail
        ),
      },
    }));
  };

  const deleteAboutDetail = (detailId: number) => {
    setPortfolioData(prev => ({
      ...prev,
      about: {
        ...prev.about,
        details: prev.about.details.filter(detail => detail.id !== detailId),
      },
    }));
  };

  const addExperience = (type: 'workExperience' | 'researchExperience') => {
      const newExperience: Experience = {
        id: Date.now(),
        role: 'New Role',
        organization: 'New Organization',
        date: 'Date Range',
        description: 'Description of responsibilities and achievements.',
      };
      setPortfolioData(prev => ({
        ...prev,
        about: { ...prev.about, [type]: [...prev.about[type], newExperience] },
      }));
  };

  const updateExperience = (type: 'workExperience' | 'researchExperience', experienceId: number, field: keyof Omit<Experience, 'id'>, value: string) => {
      setPortfolioData(prev => ({
        ...prev,
        about: {
          ...prev.about,
          [type]: prev.about[type].map(exp => 
            exp.id === experienceId ? { ...exp, [field]: value } : exp
          ),
        },
      }));
  };

  const deleteExperience = (type: 'workExperience' | 'researchExperience', experienceId: number) => {
      setPortfolioData(prev => ({
        ...prev,
        about: {
          ...prev.about,
          [type]: prev.about[type].filter(exp => exp.id !== experienceId),
        },
      }));
  };

  const addAward = () => {
      const newAward: Award = {
        id: Date.now(),
        name: 'New Award',
        issuer: 'Awarding Institution',
        date: 'Year',
      };
      setPortfolioData(prev => ({
        ...prev,
        about: { ...prev.about, awards: [...prev.about.awards, newAward] },
      }));
  };

  const updateAward = (awardId: number, field: keyof Omit<Award, 'id'>, value: string) => {
      setPortfolioData(prev => ({
        ...prev,
        about: {
          ...prev.about,
          awards: prev.about.awards.map(award => 
            award.id === awardId ? { ...award, [field]: value } : award
          ),
        },
      }));
  };

  const deleteAward = (awardId: number) => {
      setPortfolioData(prev => ({
        ...prev,
        about: {
          ...prev.about,
          awards: prev.about.awards.filter(award => award.id !== awardId),
        },
      }));
  };

  // --- Project Handlers ---

  const addProject = (newProject: Project) => {
    setPortfolioData(prev => ({
      ...prev,
      projects: [...prev.projects, newProject]
    }));
  };
  
  const deleteProject = (projectId: number) => {
    setPortfolioData(prev => ({
      ...prev,
      projects: prev.projects.filter(p => p.id !== projectId)
    }));
  };

  const reorderProjects = (reorderedProjects: Project[]) => {
    setPortfolioData(prev => ({
        ...prev,
        projects: reorderedProjects,
    }));
  };

  const addProjectTag = (projectId: number, tag: string) => {
    setPortfolioData(prev => ({
      ...prev,
      projects: prev.projects.map(p =>
        (p.id === projectId && !p.tags.includes(tag)) ? { ...p, tags: [...p.tags, tag] } : p
      ),
    }));
  };

  const deleteProjectTag = (projectId: number, tagToDelete: string) => {
    setPortfolioData(prev => ({
      ...prev,
      projects: prev.projects.map(p =>
        p.id === projectId ? { ...p, tags: p.tags.filter(t => t !== tagToDelete) } : p
      ),
    }));
  };
  
  // --- Skill Handlers ---

  const addSkill = () => {
    const newSkill: Skill = {
      id: Date.now(),
      name: 'New Skill',
      level: 50,
    };
    setPortfolioData(prev => ({
      ...prev,
      skills: [...prev.skills, newSkill],
    }));
  };
  
  const updateSkill = (skillId: number, field: keyof Omit<Skill, 'id'>, value: string | number) => {
    setPortfolioData(prev => ({
      ...prev,
      skills: prev.skills.map(s =>
        s.id === skillId ? { ...s, [field]: value } : s
      ),
    }));
  };

  const deleteSkill = (skillId: number) => {
    setPortfolioData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s.id !== skillId),
    }));
  };

  // --- General & Data I/O ---

  const resetData = () => {
    try {
        // This needs to be a deep copy to avoid modifying the original initialData object
        setPortfolioData(JSON.parse(JSON.stringify(initialData)));
    } catch (error) {
        console.error("Failed to reset portfolio data", error);
    }
  };

  const updateHeroImage = (file: File) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        updateField('heroImageUrl', reader.result);
      }
    };
    reader.onerror = (error) => {
      console.error("Error reading hero image file:", error);
      alert("There was an error reading the image file.");
    };
  };

  const mergeData = (newData: Partial<PortfolioData>) => {
    setPortfolioData(prev => {
        const updatedData = { ...prev };

        if (newData.name) updatedData.name = newData.name;
        if (newData.title) updatedData.title = newData.title;
        
        if (newData.about) {
            const updatedAbout = { ...prev.about };
            if (newData.about.summary) updatedAbout.summary = newData.about.summary;
            
            if (newData.about.details) {
              const existingLabels = new Set(prev.about.details.map(d => d.label.toLowerCase().trim()));
              const newDetails = newData.about.details
                .filter(d => d.label && !existingLabels.has(d.label.toLowerCase().trim()))
                .map((d, index) => ({ ...d, id: Date.now() + index }));
              updatedAbout.details = [...prev.about.details, ...newDetails];
            }

            const mergeUnique = (prevItems: any[], newItems: any[] | undefined, key: string) => {
                if (!newItems) return prevItems;
                const existingKeys = new Set(prevItems.map(item => item[key]?.toLowerCase().trim()));
                const uniqueNewItems = newItems
                    .filter(item => item[key] && !existingKeys.has(item[key].toLowerCase().trim()))
                    .map((item, index) => ({ ...item, id: Date.now() + index }));
                return [...prevItems, ...uniqueNewItems];
            };

            updatedAbout.workExperience = mergeUnique(prev.about.workExperience, newData.about.workExperience, 'role');
            updatedAbout.researchExperience = mergeUnique(prev.about.researchExperience, newData.about.researchExperience, 'role');
            updatedAbout.awards = mergeUnique(prev.about.awards, newData.about.awards, 'name');
            
            updatedData.about = updatedAbout;
        }

        if (newData.contact) {
            updatedData.contact = { ...prev.contact, ...newData.contact };
        }

        if (newData.projects && newData.projects.length > 0) {
            const existingProjectTitles = new Set(prev.projects.map(p => p.title.toLowerCase().trim()));
            const newProjects = newData.projects
                .filter(p => p.title && !existingProjectTitles.has(p.title.toLowerCase().trim()))
                .map((p, index) => ({
                    ...p,
                    id: Date.now() + index,
                    images: [{ url: `https://picsum.photos/seed/newproject${Date.now() + index}/600/400`, name: p.title || 'New Project Image' }],
                    tags: p.tags || [],
                    description: p.description || '',
                    title: p.title || 'New Project',
                    fileType: 'image' as const,
                }));
            updatedData.projects = [...prev.projects, ...newProjects];
        }

        if (newData.skills && newData.skills.length > 0) {
            const existingSkillNames = new Set(prev.skills.map(s => s.name.toLowerCase().trim()));
            const newSkills = newData.skills
                .filter(s => s.name && !existingSkillNames.has(s.name.toLowerCase().trim()))
                .map((s, index) => ({
                    ...s,
                    id: Date.now() + index,
                    name: s.name || 'New Skill',
                    level: s.level || 50,
                }));
            updatedData.skills = [...prev.skills, ...newSkills];
        }

        return updatedData;
    });
  };

  const addAsset = (file: File) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        if (typeof reader.result !== 'string') return;
        const newAsset: Asset = {
          id: Date.now(),
          name: file.name,
          url: reader.result,
          type: file.type === 'application/pdf' ? 'pdf' : 'image',
        };
        setPortfolioData(prev => ({
          ...prev,
          assets: [...prev.assets, newAsset],
        }));
    };
    reader.onerror = (error) => {
        console.error("Error reading asset file:", error);
        alert("There was an error reading the asset file.");
    };
  };

  const deleteAsset = (assetId: number) => {
    setPortfolioData(prev => {
      const assetToDelete = prev.assets.find(a => a.id === assetId);
      if (!assetToDelete) return prev;
      
      const updatedProjects = prev.projects.map(p => {
        const newImages = p.images.filter(img => img.url !== assetToDelete.url);
        const newFileUrl = p.fileUrl === assetToDelete.url ? undefined : p.fileUrl;
        return { ...p, images: newImages, fileUrl: newFileUrl };
      }).filter(p => p.images.length > 0 || p.fileUrl);

      const updatedAssets = prev.assets.filter(a => a.id !== assetId);
      return { ...prev, projects: updatedProjects, assets: updatedAssets };
    });
  };

  const addProjectFromAsset = async (asset: Asset) => {
    let title = 'New Project';
    let description = `A new project showcasing ${asset.name}.`;
    let tags = ['New'];
    let images: ProjectImage[] = [];

    if (asset.type === 'image' && asset.url) {
        images.push({ url: asset.url, name: asset.name });
        try {
            const mimeType = asset.url.split(';')[0].split(':')[1];
            const base64String = asset.url.split(',')[1];
            const details = await generateProjectDetailsFromImage(base64String, mimeType);
            title = details.title;
            description = details.description;
            tags = details.tags;
        } catch (e) {
            console.error("AI image analysis failed, creating generic project.", e);
        }
    }
    
    const newProject: Project = {
      id: Date.now(),
      title,
      description,
      images,
      fileUrl: asset.type === 'pdf' ? asset.url : undefined,
      fileType: asset.type,
      tags,
    };
    addProject(newProject);
  };
  
  const addGalleryImage = (projectId: number, file: File) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        if (typeof reader.result !== 'string') return;
        const newImage: ProjectImage = {
            url: reader.result,
            name: file.name,
        };
        setPortfolioData(prev => ({
            ...prev,
            projects: prev.projects.map(p => 
                p.id === projectId 
                    ? { ...p, images: [...p.images, newImage] }
                    : p
            ),
        }));
    };
  };

  const deleteProjectImage = (projectId: number, imageIndex: number) => {
    setPortfolioData(prev => ({
        ...prev,
        projects: prev.projects.map(p => {
            if (p.id !== projectId || p.images.length <= 1) return p;
            const newImages = p.images.filter((_, index) => index !== imageIndex);
            return { ...p, images: newImages };
        }),
    }));
  };
  
  const setAsCoverImage = (projectId: number, imageIndex: number) => {
    setPortfolioData(prev => ({
        ...prev,
        projects: prev.projects.map(p => {
            if (p.id !== projectId || imageIndex === 0 || imageIndex >= p.images.length) return p;
            
            const newImages = [...p.images];
            const [newCover] = newImages.splice(imageIndex, 1);
            newImages.unshift(newCover);

            return { ...p, images: newImages };
        }),
    }));
  };

  const updateProjectImageName = (projectId: number, imageIndex: number, name: string) => {
    setPortfolioData(prev => ({
        ...prev,
        projects: prev.projects.map(p => {
            if (p.id !== projectId) return p;
            const newImages = [...p.images];
            if (newImages[imageIndex]) {
                newImages[imageIndex] = { ...newImages[imageIndex], name };
            }
            return { ...p, images: newImages };
        })
    }));
  };

  const reorderProjectImages = (projectId: number, reorderedImages: ProjectImage[]) => {
      setPortfolioData(prev => ({
          ...prev,
          projects: prev.projects.map(p => 
              p.id === projectId ? { ...p, images: reorderedImages } : p
          ),
      }));
  };

  return { portfolioData, setPortfolioData, updateField, updateProject, updateProjectImage, updateContact, mergeData, addProject, resetData, addAsset, deleteAsset, addProjectFromAsset, addProjectTag, deleteProjectTag, addSkill, updateSkill, deleteSkill, deleteProject, reorderProjects, addGalleryImage, deleteProjectImage, setAsCoverImage, updateProjectImageName, reorderProjectImages, updateAboutField, updateAboutPhoto, addExperience, updateExperience, deleteExperience, addAward, updateAward, deleteAward, addAboutDetail, updateAboutDetail, deleteAboutDetail, updateHeroImage };
};