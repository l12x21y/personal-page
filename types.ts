



export interface ProjectImage {
  url: string;
  name: string;
  description?: string;
}

export interface ProjectMedia {
  url: string;
  name: string;
  type: 'image' | 'video';
  description?: string;
}

export interface ProjectNavSection {
  title: string;
  text?: string;
  layout?: 'single' | 'grid-2' | 'grid-3' | 'grid-4';
  imageIndexes?: number[];
  imageNames?: string[];
  mediaIndexes?: number[];
  mediaNames?: string[];
}

export interface Asset {
  id: number;
  name: string;
  url: string;
  type: 'image' | 'pdf';
}

export interface Project {
  id: number;
  slug?: string;
  title: string;
  description: string;
  time?: string;
  workType?: string | string[]; // e.g. 个人作业 / 小组作业
  role?: string | string[];
  images: ProjectImage[]; // First image is cover
  mediaAssets?: ProjectMedia[];
  tools?: string[];
  skills?: string[];
  tags: string[];
  navSections?: ProjectNavSection[];
  fileUrl?: string; // URL for the file if it's not just an image
  fileType?: 'image' | 'pdf'; // Type of the project asset
}

export interface Skill {
  id: number;
  name: string;
  level: number; // Percentage from 0 to 100
}

export interface Contact {
  email: string;
  phone: string;
  github?: string;
  intro: string;
}

export interface Experience {
  id: number;
  role: string;
  organization: string;
  date: string;
  description: string;
}

export interface Award {
    id: number;
    name: string;
    issuer: string;
    date: string;
}

export interface AboutDetail {
  id: number;
  label: string;
  value: string;
}

export interface AboutData {
  photoUrl: string;
  details: AboutDetail[];
  summary: string;
  workExperience: Experience[];
  researchExperience: Experience[];
  awards: Award[];
}

export interface AboutSection {
  id: number;
  title: string;
  text: string;
  imageUrl: string;
}

export interface EducationEntry {
  id: number;
  period: string; // e.g. "2023-present"
  institution: string;
  level?: string; // e.g. 本科 / M.S.
  major?: string;
  description?: string;
}

export interface LifeMediaItem {
  url: string;
  type: 'image' | 'video';
  caption?: string;
  slot?: number;
}

export interface LifeSection {
  id: number;
  title: string;
  text: string;
  media: LifeMediaItem[];
}

export interface PortfolioData {
  name: string;
  title: string;
  heroImageUrl: string;
  about: AboutData;
  aboutSections: AboutSection[];
  lifeSections: LifeSection[];
  education: EducationEntry[];
  projects: Project[];
  skills: Skill[];
  contact: Contact;
  assets: Asset[];
}