import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif', '.bmp', '.svg']);
const VIDEO_EXTS = new Set(['.mp4', '.mov', '.webm', '.m4v']);

const defaultData = {
  name: 'XINYAO LYU',
  title: 'Urban Planning',
  heroImageUrl: '/Personal Info/Cover.jpg',
  about: {
    photoUrl: '/Personal Info/个人照片.jpg',
    details: [
      { id: 1, label: 'Birthday', value: 'December 12, 2004' },
      { id: 2, label: 'School', value: 'Tongji University' },
      { id: 3, label: 'Major', value: 'Urban Planning & Experimental Class for Compound Innovative Talents' },
    ],
    summary: 'I am currently an undergraduate student in Urban and Rural Planning at Tongji University, also enrolled in an interdisciplinary experimental program for architectural innovation. I have maintained an outstanding academic record, with a GPA of 4.92/5.00, ranking first in my major. I have achieved a 100% excellence rate in both professional and theoretical coursework, and possess a strong foundation in academic English.',
    workExperience: [
      {
        id: 1,
        role: 'Software Engineer Intern',
        organization: 'Tech Company Inc.',
        date: 'Summer 2023',
        description: 'Developed and maintained features for a large-scale web application using React and Node.js.',
      },
    ],
    researchExperience: [
      {
        id: 1,
        role: '主导项目、设计实验、理论框架搭建',
        organization: '商业街道更新评价框架',
        date: '2025.7-2026.3',
        description: '搭建基于 AI 生成街道立面，使用近红外设备监测人的愉悦程度，快速筛选评价方案。',
      },
    ],
    awards: [
      { id: 1, name: "Dean's List", issuer: 'University of Technology', date: '2022-2023' },
    ],
  },
  aboutSections: [
    {
      id: 1,
      title: 'My Experience',
      text: 'A growing collection of studio work, internship practice, and interdisciplinary exploration.',
      imageUrl: '/Personal Info/个人照片.jpg',
    },
    {
      id: 2,
      title: 'My Background',
      text: 'Urban planning training with architecture-oriented experimentation and research methods.',
      imageUrl: '/Personal Info/Cover.jpg',
    },
    {
      id: 3,
      title: 'My Hobbies',
      text: 'Photography, music, and observing everyday urban details that inspire design.',
      imageUrl: '/Personal Info/个人照片.jpg',
    },
    {
      id: 4,
      title: 'My Aspirations',
      text: 'To create design work that is both conceptually rigorous and deeply human-centered.',
      imageUrl: '/Personal Info/Cover.jpg',
    },
  ],
  lifeSections: [
    {
      id: 1,
      title: 'Photography',
      text: 'Capturing light, texture, and moments from daily city life.',
      media: [
        { url: '/Personal Info/Cover.jpg', type: 'image', caption: 'Urban light and atmosphere' },
      ],
    },
    {
      id: 2,
      title: 'Music',
      text: 'Music as a background rhythm for ideation and design concentration.',
      media: [
        { url: '/Personal Info/个人照片.jpg', type: 'image', caption: 'Playlist moments' },
      ],
    },
  ],
  projects: [],
  skills: [
    { id: 1, name: 'Urban Analysis', level: 90 },
    { id: 2, name: 'Design Communication', level: 88 },
    { id: 3, name: 'Rendering', level: 85 },
  ],
  contact: {
    email: '2353274@tongji.edu.cn | xinyaolv3@gmail.com',
    phone: '+86 19081323793',
    github: 'https://github.com/l12x21y',
    intro: "Always curious, always open.\nFeel free to reach out.",
  },
  assets: [],
};

function sortNames(a, b) {
  return a.localeCompare(b, 'zh-Hans-CN', { numeric: true, sensitivity: 'base' });
}

function safeReadDir(dirPath) {
  if (!fs.existsSync(dirPath)) return [];
  return fs.readdirSync(dirPath, { withFileTypes: true });
}

function isImageFile(fileName) {
  return IMAGE_EXTS.has(path.extname(fileName).toLowerCase());
}

function isVideoFile(fileName) {
  return VIDEO_EXTS.has(path.extname(fileName).toLowerCase());
}

function getMediaType(fileName) {
  if (isVideoFile(fileName)) return 'video';
  return 'image';
}

function readJsonFile(filePath) {
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

function normalizeArrayJson(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === 'object') return [value];
  return [];
}

function normalizeProjectMetaJson(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (value && Array.isArray(value.projects)) return value.projects;
  return [];
}

function normalizeAboutSections(value) {
  const rows = normalizeArrayJson(value);
  const normalized = rows
    .map((item, index) => {
      const title = typeof item?.title === 'string' ? item.title.trim() : '';
      const text = typeof item?.text === 'string' ? item.text.trim() : '';
      const imageUrl = typeof item?.imageUrl === 'string' ? item.imageUrl.trim() : '';
      if (!title || !text || !imageUrl) return null;
      return {
        id: index + 1,
        title,
        text,
        imageUrl,
      };
    })
    .filter(Boolean);

  return normalized.length > 0 ? normalized : defaultData.aboutSections;
}

function normalizeLifeSections(value) {
  const rows = normalizeArrayJson(value);
  const normalized = rows
    .map((item, index) => {
      const title = typeof item?.title === 'string' ? item.title.trim() : '';
      const text = typeof item?.text === 'string' ? item.text.trim() : '';
      if (!title || !text) return null;

      const media = Array.isArray(item?.media)
        ? item.media
            .map((m) => {
              const url = typeof m?.url === 'string' ? m.url.trim() : '';
              if (!url) return null;
              const type = m?.type === 'video' ? 'video' : 'image';
              const caption = typeof m?.caption === 'string' ? m.caption.trim() : '';
              return {
                url,
                type,
                ...(caption ? { caption } : {}),
              };
            })
            .filter(Boolean)
        : [];

      return {
        id: index + 1,
        title,
        text,
        media,
      };
    })
    .filter(Boolean);

  return normalized.length > 0 ? normalized : defaultData.lifeSections;
}

function normalizeNavSections(value) {
  if (!Array.isArray(value)) return [];

  return value
    .map((section) => {
      if (!section || typeof section.title !== 'string' || !section.title.trim()) return null;

      const imageIndexes = Array.isArray(section.imageIndexes)
        ? section.imageIndexes
            .map((index) => Number(index))
            .filter((index) => Number.isInteger(index) && index >= 0)
        : [];

      const imageNames = Array.isArray(section.imageNames)
        ? section.imageNames.filter((name) => typeof name === 'string' && name.trim().length > 0)
        : [];

      const normalized = {
        title: section.title.trim(),
      };

      const text = typeof section.text === 'string' ? section.text : section.description;
      if (typeof text === 'string' && text.trim()) {
        normalized.text = text.trim();
      }
      if (['single', 'grid-2', 'grid-3', 'grid-4'].includes(section.layout)) {
        normalized.layout = section.layout;
      }
      if (imageIndexes.length > 0) {
        normalized.imageIndexes = imageIndexes;
      }
      if (imageNames.length > 0) {
        normalized.imageNames = imageNames;
      }

      const mediaIndexes = Array.isArray(section.mediaIndexes)
        ? section.mediaIndexes
            .map((index) => Number(index))
            .filter((index) => Number.isInteger(index) && index >= 0)
        : [];

      const mediaNames = Array.isArray(section.mediaNames)
        ? section.mediaNames.filter((name) => typeof name === 'string' && name.trim().length > 0)
        : [];

      if (mediaIndexes.length > 0) {
        normalized.mediaIndexes = mediaIndexes;
      }
      if (mediaNames.length > 0) {
        normalized.mediaNames = mediaNames;
      }

      return normalized;
    })
    .filter(Boolean);
}

function toImageDescriptionMap(meta) {
  const map = {};
  if (!meta) return map;

  const objectMap = (meta.mediaDescriptions && typeof meta.mediaDescriptions === 'object' && !Array.isArray(meta.mediaDescriptions))
    ? meta.mediaDescriptions
    : (meta.imageDescriptions && typeof meta.imageDescriptions === 'object' && !Array.isArray(meta.imageDescriptions))
      ? meta.imageDescriptions
      : null;

  if (objectMap) {
    Object.assign(map, objectMap);
  }

  const listMap = Array.isArray(meta?.mediaDescriptions)
    ? meta.mediaDescriptions
    : Array.isArray(meta?.imageDescriptions)
      ? meta.imageDescriptions
      : [];

  if (Array.isArray(listMap)) {
    for (const row of listMap) {
      if (row && typeof row.name === 'string') {
        map[row.name] = typeof row.description === 'string' ? row.description : '';
      }
    }
  }

  if (meta && typeof meta.imageDescriptions === 'object' && !Array.isArray(meta.imageDescriptions)) {
    Object.assign(map, meta.imageDescriptions);
  }

  return map;
}

function collectExperienceFromFolder(folderPath, fallbackItems) {
  const files = safeReadDir(folderPath)
    .filter((d) => d.isFile() && d.name.toLowerCase().endsWith('.json'))
    .map((d) => d.name)
    .sort(sortNames);

  const items = [];
  for (const file of files) {
    const full = path.join(folderPath, file);
    const parsed = readJsonFile(full);
    if (!parsed) continue;

    if (Array.isArray(parsed)) {
      for (const row of parsed) items.push(row);
    } else {
      items.push(parsed);
    }
  }

  const source = items.length > 0 ? items : fallbackItems;
  return source.map((item, index) => ({
    id: index + 1,
    role: item.role || '',
    organization: item.organization || '',
    date: item.date || '',
    description: item.description || '',
  }));
}

function collectAwardsFromFolder(folderPath, fallbackItems) {
  const files = safeReadDir(folderPath)
    .filter((d) => d.isFile() && d.name.toLowerCase().endsWith('.json'))
    .map((d) => d.name)
    .sort(sortNames);

  const items = [];
  for (const file of files) {
    const full = path.join(folderPath, file);
    const parsed = readJsonFile(full);
    if (!parsed) continue;

    if (Array.isArray(parsed)) {
      for (const row of parsed) items.push(row);
    } else {
      items.push(parsed);
    }
  }

  const source = items.length > 0 ? items : fallbackItems;
  return source.map((item, index) => ({
    id: index + 1,
    name: item.name || '',
    issuer: item.issuer || '',
    date: item.date || '',
  }));
}

function pickPersonalImages(personalDir) {
  const imageFiles = safeReadDir(personalDir)
    .filter((d) => d.isFile() && isImageFile(d.name))
    .map((d) => d.name)
    .sort(sortNames);

  if (imageFiles.length === 0) {
    return {
      hero: defaultData.heroImageUrl,
      photo: defaultData.about.photoUrl,
    };
  }

  const cover = imageFiles.find((name) => /cover|封面/i.test(name)) || imageFiles[0];
  const photo = imageFiles.find((name) => /个人|photo|头像|profile/i.test(name) && name !== cover)
    || imageFiles.find((name) => name !== cover)
    || cover;

  return {
    hero: `/Personal Info/${cover}`,
    photo: `/Personal Info/${photo}`,
  };
}

function loadProjects(projectRoot, datasetProjectMetaList) {
  const projectDirs = safeReadDir(projectRoot)
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort(sortNames);

  const datasetMetaMap = new Map();
  const datasetOrder = [];
  for (const item of datasetProjectMetaList) {
    if (!item || typeof item.folder !== 'string') continue;
    datasetMetaMap.set(item.folder, item);
    datasetOrder.push(item.folder);
  }

  const orderedDirs = [
    ...datasetOrder.filter(folder => projectDirs.includes(folder)),
    ...projectDirs.filter(folder => !datasetOrder.includes(folder)),
  ];

  const projects = [];
  let id = 1;

  for (const folder of orderedDirs) {
    const folderPath = path.join(projectRoot, folder);
    const mediaNames = safeReadDir(folderPath)
      .filter((d) => d.isFile() && (isImageFile(d.name) || isVideoFile(d.name)))
      .map((d) => d.name)
      .sort(sortNames);

    const imageNames = mediaNames.filter((name) => isImageFile(name));

    if (mediaNames.length === 0) continue;

    const folderMeta = readJsonFile(path.join(folderPath, 'meta.json')) || {};
    const datasetMeta = datasetMetaMap.get(folder) || {};
    const meta = { ...folderMeta, ...datasetMeta };

    const imageDescriptionMap = {
      ...toImageDescriptionMap(folderMeta),
      ...toImageDescriptionMap(datasetMeta),
    };

    const coverName = imageNames.length > 0
      ? (typeof meta.cover === 'string' && imageNames.includes(meta.cover) ? meta.cover : imageNames[0])
      : '';

    const orderedImageNames = coverName
      ? [coverName, ...imageNames.filter((n) => n !== coverName)]
      : imageNames;

    const images = orderedImageNames.map((name) => ({
      url: `/Project/${folder}/${name}`,
      name,
      description: typeof imageDescriptionMap[name] === 'string' ? imageDescriptionMap[name] : '',
    }));

    const mediaAssets = mediaNames.map((name) => ({
      url: `/Project/${folder}/${name}`,
      name,
      type: getMediaType(name),
      description: typeof imageDescriptionMap[name] === 'string' ? imageDescriptionMap[name] : '',
    }));

    projects.push({
      id: id++,
      slug: folder,
      title: meta.title || meta.projectName || folder,
      description: meta.description || meta.projectDescription || `Project ${folder}`,
      time: meta.time || meta.date || '',
      workType: meta.workType || meta.assignmentType || '',
      role: meta.role || meta.projectRole || '',
      mediaAssets,
      navSections: normalizeNavSections(meta.navSections || meta.sections || meta.navigation),
      images,
      tags: Array.isArray(meta.tags) && meta.tags.length > 0 ? meta.tags : [folder],
    });
  }

  return projects;
}

function main() {
  const datasetDir = path.join(root, 'dataset');
  const profileJsonPath = path.join(root, 'Personal Info', 'profile.json');
  const profile = readJsonFile(profileJsonPath) || {};
  const datasetProjectsMeta = normalizeProjectMetaJson(readJsonFile(path.join(datasetDir, 'projects.json')));
  const aboutSections = normalizeAboutSections(readJsonFile(path.join(datasetDir, 'about-sections.json')));
  const lifeSections = normalizeLifeSections(readJsonFile(path.join(datasetDir, 'life-sections.json')));

  const personal = pickPersonalImages(path.join(root, 'Personal Info'));
  const projects = loadProjects(path.join(root, 'Project'), datasetProjectsMeta);

  const datasetWork = normalizeArrayJson(readJsonFile(path.join(datasetDir, 'work-experience.json')));
  const workExperience = datasetWork.length > 0
    ? datasetWork.map((item, index) => ({
      id: index + 1,
      role: item.role || '',
      organization: item.organization || '',
      date: item.date || '',
      description: item.description || '',
    }))
    : collectExperienceFromFolder(
      path.join(root, 'Work Experience'),
      defaultData.about.workExperience
    );

  const datasetResearch = normalizeArrayJson(readJsonFile(path.join(datasetDir, 'research-experience.json')));
  const researchExperience = datasetResearch.length > 0
    ? datasetResearch.map((item, index) => ({
      id: index + 1,
      role: item.role || '',
      organization: item.organization || '',
      date: item.date || '',
      description: item.description || '',
    }))
    : collectExperienceFromFolder(
      path.join(root, 'Research Experience'),
      defaultData.about.researchExperience
    );

  const datasetAwards = normalizeArrayJson(readJsonFile(path.join(datasetDir, 'awards.json')));
  const awards = datasetAwards.length > 0
    ? datasetAwards.map((item, index) => ({
      id: index + 1,
      name: item.name || '',
      issuer: item.issuer || '',
      date: item.date || '',
    }))
    : collectAwardsFromFolder(
      path.join(root, 'Award'),
      defaultData.about.awards
    );

  const skillsJson = readJsonFile(path.join(datasetDir, 'skills.json')) || readJsonFile(path.join(root, 'skills.json'));
  const skillsSource = Array.isArray(skillsJson) && skillsJson.length > 0 ? skillsJson : defaultData.skills;
  const skills = skillsSource.map((s, index) => ({
    id: index + 1,
    name: s.name || `Skill ${index + 1}`,
    level: Number.isFinite(Number(s.level)) ? Number(s.level) : 50,
  }));

  const portfolioData = {
    name: profile.name || defaultData.name,
    title: profile.title || defaultData.title,
    heroImageUrl: personal.hero,
    about: {
      photoUrl: personal.photo,
      details: Array.isArray(profile.aboutDetails) && profile.aboutDetails.length > 0
        ? profile.aboutDetails.map((d, index) => ({ id: index + 1, label: d.label || '', value: d.value || '' }))
        : defaultData.about.details,
      summary: profile.summary || defaultData.about.summary,
      workExperience,
      researchExperience,
      awards,
    },
    aboutSections,
    lifeSections,
    projects: projects.length > 0 ? projects : defaultData.projects,
    skills,
    contact: {
      email: profile.contact?.email || defaultData.contact.email,
      phone: profile.contact?.phone || defaultData.contact.phone,
      github: profile.contact?.github || defaultData.contact.github,
      intro: profile.contact?.intro || defaultData.contact.intro,
    },
    assets: [],
  };

  const outputPath = path.join(root, 'hooks', 'generatedPortfolioData.ts');
  const content = `// AUTO-GENERATED FILE. DO NOT EDIT DIRECTLY.\n// Run: npm run generate:data\nimport { PortfolioData } from '../types.ts';\n\nexport const generatedPortfolioData: PortfolioData = ${JSON.stringify(portfolioData, null, 2)};\n`;
  fs.writeFileSync(outputPath, content, 'utf8');
  console.log(`Generated ${path.relative(root, outputPath)} with ${portfolioData.projects.length} project(s).`);
}

main();
