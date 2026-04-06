import React from 'react';
import { PortfolioData } from '../../types.ts';
import CloseIcon from '../icons/CloseIcon.tsx';
import DownloadIcon from '../icons/DownloadIcon.tsx';
import JSZip from 'jszip';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: PortfolioData;
}

const sanitize = (text: string | undefined | null): string => {
    if (!text) return '';
    const el = document.createElement('div');
    el.textContent = text;
    return el.innerHTML.replace(/\n/g, '<br>');
};

const generateIntroduceHtml = (data: PortfolioData): string => {
    const workExperienceHtml = data.about.workExperience.length > 0 ? `
        <section id="work-experience">
            <div class="flex items-center mb-12">
                <h2 class="text-4xl font-bold text-black tracking-tight">Work Experience</h2>
                <div class="flex-grow h-px bg-gray-300 ml-6"></div>
            </div>
            <div class="space-y-6">
                ${data.about.workExperience.map(exp => `
                    <div class="p-6 bg-white rounded-lg border border-gray-200">
                        <div class="flex flex-col sm:flex-row justify-between sm:items-center mb-1">
                            <h4 class="text-xl font-bold text-gray-900">${sanitize(exp.role)}</h4>
                            <p class="text-sm text-gray-600 mt-1 sm:mt-0">${sanitize(exp.date)}</p>
                        </div>
                        <p class="font-semibold text-gray-700 mb-2">${sanitize(exp.organization)}</p>
                        <p class="text-gray-700">${sanitize(exp.description)}</p>
                    </div>
                `).join('')}
            </div>
        </section>
    ` : '';

    const researchExperienceHtml = data.about.researchExperience.length > 0 ? `
        <section id="research-experience">
            <div class="flex items-center mb-12">
                <h2 class="text-4xl font-bold text-black tracking-tight">Research Experience</h2>
                <div class="flex-grow h-px bg-gray-300 ml-6"></div>
            </div>
            <div class="space-y-6">
                ${data.about.researchExperience.map(exp => `
                    <div class="p-6 bg-white rounded-lg border border-gray-200">
                        <div class="flex flex-col sm:flex-row justify-between sm:items-center mb-1">
                            <h4 class="text-xl font-bold text-gray-900">${sanitize(exp.role)}</h4>
                            <p class="text-sm text-gray-600 mt-1 sm:mt-0">${sanitize(exp.date)}</p>
                        </div>
                        <p class="font-semibold text-gray-700 mb-2">${sanitize(exp.organization)}</p>
                        <p class="text-gray-700">${sanitize(exp.description)}</p>
                    </div>
                `).join('')}
            </div>
        </section>
    ` : '';

    const awardsHtml = data.about.awards.length > 0 ? `
        <section id="awards">
            <div class="flex items-center mb-12">
                <h2 class="text-4xl font-bold text-black tracking-tight">Awards & Honors</h2>
                <div class="flex-grow h-px bg-gray-300 ml-6"></div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                ${data.about.awards.map(award => `
                    <div class="p-4 bg-white rounded-lg border border-gray-200 flex justify-between items-center">
                        <div>
                            <h4 class="text-xl font-bold text-gray-900">${sanitize(award.name)}</h4>
                            <p class="text-gray-700">${sanitize(award.issuer)}</p>
                        </div>
                        <p class="text-gray-600">${sanitize(award.date)}</p>
                    </div>
                `).join('')}
            </div>
        </section>
    ` : '';

    const skillsHtml = data.skills.length > 0 ? `
        <section id="skills">
            <div class="flex items-center mb-12">
                <h2 class="text-4xl font-bold text-black tracking-tight">My Expertise</h2>
                <div class="flex-grow h-px bg-gray-300 ml-6"></div>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-10">
                ${data.skills.map((skill, index) => `
                    <div>
                        <div class="flex justify-between items-end mb-1">
                            <h4 class="font-semibold text-gray-900">${sanitize(skill.name)}</h4>
                            <p class="text-sm text-gray-600">${skill.level}%</p>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div class="skill-bar bg-indigo-500 h-2 rounded-full transition-all ease-out duration-1000"
                                 style="width: 0%; transition-delay: ${index * 100}ms"
                                 data-level="${skill.level}">
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </section>
    ` : '';

    return `
    <!DOCTYPE html>
    <html lang="en" class="scroll-smooth">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>About ${sanitize(data.name)}</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Playfair+Display:wght@700&display=swap" rel="stylesheet">
        <style>
            html { scroll-padding-top: 5rem; }
            body { font-family: 'Inter', sans-serif; }
            h1, h2, h3, h4, h5, h6 { font-family: 'Playfair Display', serif; }
        </style>
    </head>
    <body class="bg-gray-50 text-gray-800 font-sans antialiased">
        <header class="sticky top-0 z-50 bg-white/80 backdrop-blur-lg shadow-md border-b border-gray-200">
            <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex items-center justify-between h-20">
                    <h1 class="text-2xl font-bold font-serif tracking-wider text-black">${sanitize(data.name)}</h1>
                    <a href="./portfolio.html" class="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white font-semibold px-4 py-2 rounded-md hover:bg-indigo-700 transition-all duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="transform rotate-180"><polyline points="9 18 15 12 9 6"></polyline></svg>
                        <span>Back to Portfolio</span>
                    </a>
                </div>
            </div>
        </header>
        <main class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-grow py-16 space-y-20">
            ${workExperienceHtml}
            ${researchExperienceHtml}
            ${awardsHtml}
            ${skillsHtml}
        </main>
        <footer class="py-8 border-t border-gray-200">
            <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500">
                <p>&copy; ${new Date().getFullYear()} ${sanitize(data.name)}. All Rights Reserved.</p>
            </div>
        </footer>
        <script>
            document.addEventListener('DOMContentLoaded', () => {
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const bar = entry.target;
                            bar.style.width = \`\${bar.dataset.level}%\`;
                            observer.unobserve(bar);
                        }
                    });
                }, { threshold: 0.1 });
                document.querySelectorAll('.skill-bar').forEach(bar => observer.observe(bar));
            });
        </script>
    </body>
    </html>`;
};

const generateMainHtml = (data: PortfolioData): string => {
  const header = `
    <header id="page-header" class="sticky top-0 z-50 transition-all duration-300 bg-transparent">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-20">
          <a href="#" class="text-2xl font-bold font-serif tracking-wider text-black">${sanitize(data.name)}</a>
          <nav class="hidden md:flex space-x-8">
            <a href="#about" class="nav-link transition-colors duration-300 font-medium pb-1 text-gray-600 hover:text-black border-b-2 border-transparent">About</a>
            <a href="#projects" class="nav-link transition-colors duration-300 font-medium pb-1 text-gray-600 hover:text-black border-b-2 border-transparent">Projects</a>
            <a href="#contact" class="nav-link transition-colors duration-300 font-medium pb-1 text-gray-600 hover:text-black border-b-2 border-transparent">Contact</a>
          </nav>
        </div>
      </div>
    </header>
  `;

  const heroSection = `
    <section id="home" class="relative flex items-center min-h-screen -mt-20 pt-20 overflow-hidden">
      <div class="absolute inset-0 bg-cover bg-center z-0" style="background-image: url('${data.heroImageUrl}')" aria-hidden="true"></div>
      <div class="absolute inset-0 bg-black/60 z-10" aria-hidden="true"></div>
      <div class="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div class="max-w-3xl text-left">
          <h1 class="text-5xl sm:text-6xl md:text-7xl font-bold text-white leading-tight tracking-tighter" style="text-shadow:0 2px 4px rgba(0,0,0,0.5)">
            ${sanitize(data.name)}
          </h1>
          <div class="mt-6 text-xl sm:text-2xl text-gray-200" style="text-shadow:0 1px 3px rgba(0,0,0,0.5)">
            ${sanitize(data.title)}
          </div>
        </div>
      </div>
    </section>
  `;

  const aboutSection = `
    <section id="about" class="py-20 sm:py-28">
      <div class="flex items-center mb-12">
          <h2 class="text-4xl font-bold text-black tracking-tight">About Me</h2>
          <div class="flex-grow h-px bg-gray-300 ml-6"></div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div class="md:col-span-1 flex justify-center items-start">
              <img src="${data.about.photoUrl}" alt="Profile Photo" class="w-64 h-64 rounded-full object-cover border-4 border-gray-200 shadow-lg"/>
          </div>
          <div class="md:col-span-2 flex flex-col justify-center space-y-6">
              <div class="p-6 bg-white rounded-lg border border-gray-200">
                <div class="space-y-2">
                  ${data.about.details.map(detail => detail.value ? `<div class="flex"><strong class="font-semibold text-gray-900 w-32 flex-shrink-0">${sanitize(detail.label)}:</strong><span class="text-gray-600">${sanitize(detail.value)}</span></div>` : '').join('')}
                </div>
              </div>
              <div class="p-6 bg-white rounded-lg border border-gray-200">
                <p class="text-lg text-gray-700 leading-relaxed">${sanitize(data.about.summary)}</p>
              </div>
              <div class="flex items-center justify-end pt-2">
                 <a href="./introduce.html" target="_blank" class="inline-flex items-center gap-2 text-indigo-600 font-semibold group transition-all duration-300 hover:text-indigo-800">
                    <span class="group-hover:underline">Learn More About Me</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </a>
              </div>
          </div>
      </div>
    </section>
  `;

  const projectsSection = `
    <section id="projects" class="py-20 sm:py-28">
       <div class="flex items-center mb-12">
        <h2 class="text-4xl font-bold text-black tracking-tight">My Work</h2>
        <div class="flex-grow h-px bg-gray-300 ml-6"></div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        ${data.projects.map((project, index) => {
          const coverImage = project.images?.[0]?.url;
          const isPdfProject = project.fileType === 'pdf' && project.fileUrl;
          const hasGallery = project.images && project.images.length > 1;
          return `
            <div data-index="${index}" class="project-card cursor-pointer bg-white rounded-lg overflow-hidden border border-gray-200 flex flex-col group transition-all duration-300 hover:border-gray-300 hover:shadow-xl hover:shadow-gray-200/80 hover:scale-105">
              <div class="relative">
                ${hasGallery ? `
                <div class="absolute top-2 left-2 z-10 p-1.5 bg-black/50 backdrop-blur-sm text-white rounded-full" title="This project has a gallery">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
                </div>` : ''}
                ${coverImage ? 
                  `<img src="${coverImage}" alt="${sanitize(project.title)}" class="w-full h-48 object-cover" />` :
                  (isPdfProject ? 
                    `<div class="w-full h-48 bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                       <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                    </div>` : 
                    `<div class="w-full h-48 bg-gray-100 flex items-center justify-center"><p class="text-gray-500">No image</p></div>`)
                }
              </div>
              <div class="p-6 flex flex-col flex-grow">
                <h3 class="text-xl font-bold text-gray-900 mb-2">${sanitize(project.title)}</h3>
                <p class="text-gray-600 mb-4 text-sm leading-relaxed flex-grow">${sanitize(project.description)}</p>
                <div class="flex flex-wrap items-center gap-2">
                  ${project.tags.map(tag => `<span class="bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1 rounded-full border border-gray-200">${sanitize(tag)}</span>`).join('')}
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </section>
  `;
  
  const contactSection = `
    <section id="contact" class="py-20 sm:py-28">
       <div class="flex items-center mb-12">
        <h2 class="text-4xl font-bold text-black tracking-tight">Get In Touch</h2>
        <div class="flex-grow h-px bg-gray-300 ml-6"></div>
      </div>
      <div class="text-center max-w-xl mx-auto">
        <p class="text-lg text-gray-700 mb-8">${sanitize(data.contact.intro)}</p>
        <div class="flex flex-col sm:flex-row justify-center items-center gap-y-4 sm:gap-x-8">
            <a href="mailto:${sanitize(data.contact.email)}" class="flex items-center space-x-2 text-gray-600 hover:text-black">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6 text-gray-500"><rect x="2" y="4" width="20" height="16" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
                <span>${sanitize(data.contact.email)}</span>
            </a>
            <div class="flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6 text-gray-500"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                <span class="text-gray-600">${sanitize(data.contact.phone)}</span>
            </div>
        </div>
      </div>
    </section>
  `;

  const footer = `
    <footer class="py-8 border-t border-gray-200">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500">
        <p>&copy; ${new Date().getFullYear()} ${sanitize(data.name)}. All Rights Reserved.</p>
      </div>
    </footer>
  `;

  const showcaseModal = `
    <div id="showcase" class="fixed inset-0 z-[100] h-screen w-screen flex-col bg-black text-gray-200 antialiased hidden">
      <div id="showcase-background" class="absolute inset-0 z-0 transition-all duration-700 ease-in-out bg-cover bg-center">
        <div class="absolute inset-0 bg-black/70 backdrop-blur-xl"></div>
      </div>
      <header class="relative z-20 p-6 flex justify-between items-center">
        <div id="showcase-header-info" class="text-white"></div>
        <div class="flex items-center gap-4">
          <button id="showcase-close-btn" class="inline-flex items-center gap-2 bg-white/10 text-white font-semibold px-4 py-2 rounded-md hover:bg-white/20 transition-all duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            <span>Close</span>
          </button>
        </div>
      </header>
      <main class="relative z-10 flex-grow flex items-start justify-center p-6 pt-4 md:p-12 md:pt-8 overflow-hidden">
        <button id="showcase-prev-project-btn" class="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-3 bg-white/10 rounded-full hover:bg-white/20 transition-all duration-300 z-30">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>
        <button id="showcase-next-project-btn" class="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-3 bg-white/10 rounded-full hover:bg-white/20 transition-all duration-300 z-30">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
        <div class="w-full h-full grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <div id="showcase-media" class="relative lg:col-span-2 w-full h-full flex items-center justify-center"></div>
          <div id="showcase-details" class="w-full h-full flex flex-col justify-start bg-black/40 backdrop-blur-sm p-8 rounded-lg overflow-y-auto"></div>
        </div>
      </main>
      <footer class="relative z-20 p-4">
        <div id="showcase-thumbnails" class="flex items-center justify-center gap-3 overflow-x-auto pb-2"></div>
      </footer>
    </div>
  `;

  const scripts = `
    <script>
      document.addEventListener('DOMContentLoaded', function() {
        const portfolioData = ${JSON.stringify(data)};
        
        // --- Page Scroll and Nav ---
        const pageHeader = document.getElementById('page-header');
        if (pageHeader) {
          window.addEventListener('scroll', () => {
            if (window.scrollY > 10) pageHeader.classList.add('bg-white/80', 'backdrop-blur-lg', 'shadow-md', 'border-b', 'border-gray-200');
            else pageHeader.classList.remove('bg-white/80', 'backdrop-blur-lg', 'shadow-md', 'border-b', 'border-gray-200');
          });
        }
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const id = entry.target.getAttribute('id');
              navLinks.forEach(link => {
                const href = link.getAttribute('href');
                link.classList.toggle('text-black', href === '#' + id);
                link.classList.toggle('border-black', href === '#' + id);
              });
            }
          });
        }, { rootMargin: "-40% 0px -60% 0px" });
        sections.forEach(section => observer.observe(section));

        // --- Showcase Modal Logic ---
        const showcase = document.getElementById('showcase');
        const background = document.getElementById('showcase-background');
        const headerInfo = document.getElementById('showcase-header-info');
        const mediaContainer = document.getElementById('showcase-media');
        const details = document.getElementById('showcase-details');
        const thumbnails = document.getElementById('showcase-thumbnails');
        const closeBtn = document.getElementById('showcase-close-btn');
        const prevProjectBtn = document.getElementById('showcase-prev-project-btn');
        const nextProjectBtn = document.getElementById('showcase-next-project-btn');
        
        let currentProjectIndex = 0;
        let currentImageIndex = 0;
        let slideshowTimeout = null;
        
        const sanitizeHTML = (text) => {
          if (!text) return '';
          const temp = document.createElement('div');
          temp.textContent = text;
          return temp.innerHTML.replace(/\\n/g, '<br>');
        };

        function resetSlideshow() {
          clearTimeout(slideshowTimeout);
          slideshowTimeout = null;
          const project = portfolioData.projects[currentProjectIndex];
          if (!project || !project.images || project.images.length <= 1) {
            return;
          }
          const imageCount = project.images.length;
          slideshowTimeout = setTimeout(() => {
            currentImageIndex = (currentImageIndex + 1) % imageCount;
            updateImageGallery(project);
          }, 5000);
        }

        function openProject(index) {
          clearTimeout(slideshowTimeout);
          currentProjectIndex = index;
          currentImageIndex = 0;
          const project = portfolioData.projects[currentProjectIndex];
          if (!project) return;
          
          updateProjectDetails(project);
          updateImageGallery(project);

          showcase.classList.remove('hidden');
          showcase.classList.add('flex');
          document.body.style.overflow = 'hidden';
          
          showcase.addEventListener('click', (e) => {
            if (!e.target.closest('button')) {
              resetSlideshow();
            }
          });
        }
        
        function updateProjectDetails(project) {
          const currentImageName = project.images[currentImageIndex]?.name || '';
          details.innerHTML = \`
            <h1 class="text-4xl md:text-5xl font-bold font-serif text-white mb-4">\${sanitizeHTML(project.title)}</h1>
            <p class="text-gray-300 leading-relaxed mb-6 overflow-y-auto">\${sanitizeHTML(project.description)}</p>
            <div>
              <p class="text-sm text-gray-400 font-semibold mb-2">\${sanitizeHTML(currentImageName)}</p>
              <hr class="border-gray-700 my-4">
              <div class="flex flex-wrap items-center gap-2">
                \${project.tags.map(tag => \`<span class="bg-gray-800 text-gray-300 text-xs font-medium px-3 py-1 rounded-full border border-gray-700">\${sanitizeHTML(tag)}</span>\`).join('')}
              </div>
            </div>
          \`;
          headerInfo.innerHTML = \`
            <h2 class="text-xl font-bold">\${sanitizeHTML(portfolioData.name)}</h2>
            <p class="text-sm text-gray-400">Project \${currentProjectIndex + 1} of \${portfolioData.projects.length}</p>
          \`;
        }

        function updateImageGallery(project) {
          const allImages = project.images || [];
          if(currentImageIndex >= allImages.length) currentImageIndex = 0;

          const currentImage = allImages[currentImageIndex];
          background.style.backgroundImage = \`url(\${currentImage?.url || ''})\`;
          updateProjectDetails(project);

          let mediaHtml = '';
          if (currentImage) {
            mediaHtml = \`<img src="\${currentImage.url}" alt="\${sanitizeHTML(project.title)}" class="max-w-full max-h-full object-contain rounded-lg shadow-2xl">\`;
          } else if (project.fileType === 'pdf') {
            mediaHtml = \`
              <div class="w-full h-full flex flex-col items-center justify-center bg-gray-900/50 rounded-lg p-8 text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                  <p class="mt-4 text-gray-400">This project is a PDF document. <a href="\${project.fileUrl}" target="_blank" rel="noopener noreferrer" class="text-gray-300 hover:underline">Click to view</a>.</p>
              </div>\`;
          } else {
            mediaHtml = '<div class="w-full h-full flex items-center justify-center bg-gray-900/50 rounded-lg"><p>No media available</p></div>';
          }
          
          if(allImages.length > 1) {
            mediaHtml += \`
              <button class="showcase-prev-image-btn absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/40 text-white rounded-full hover:bg-black/60 transition-colors z-[120]"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg></button>
              <button class="showcase-next-image-btn absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/40 text-white rounded-full hover:bg-black/60 transition-colors z-[120]"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg></button>
            \`;
          }
          mediaContainer.innerHTML = mediaHtml;

          thumbnails.innerHTML = allImages.map((img, i) => \`
            <button data-index="\${i}" class="showcase-thumbnail w-16 aspect-[4/3] rounded-md bg-cover bg-center flex-shrink-0 border-2 transition-all duration-300 \${i === currentImageIndex ? 'border-white scale-110 opacity-100' : 'border-transparent opacity-50 hover:opacity-100'}" style="background-image: url('\${img.url || ''}')"></button>
          \`).join('');

          attachImageNavListeners(project, allImages.length);
          resetSlideshow();
        }
        
        function attachImageNavListeners(project, imageCount) {
            document.querySelectorAll('.showcase-thumbnail').forEach(thumb => {
              thumb.addEventListener('click', (e) => {
                e.stopPropagation();
                currentImageIndex = parseInt(thumb.dataset.index, 10);
                updateImageGallery(project);
              });
            });
            const prevImgBtn = document.querySelector('.showcase-prev-image-btn');
            const nextImgBtn = document.querySelector('.showcase-next-image-btn');
            if (prevImgBtn) prevImgBtn.addEventListener('click', (e) => { e.stopPropagation(); currentImageIndex = (currentImageIndex - 1 + imageCount) % imageCount; updateImageGallery(project); });
            if (nextImgBtn) nextImgBtn.addEventListener('click', (e) => { e.stopPropagation(); currentImageIndex = (currentImageIndex + 1) % imageCount; updateImageGallery(project); });
        }
        
        function closeShowcase() {
          clearTimeout(slideshowTimeout);
          showcase.classList.add('hidden');
          showcase.classList.remove('flex');
          document.body.style.overflow = '';
        }

        // Event Listeners
        document.querySelectorAll('.project-card').forEach(card => card.addEventListener('click', () => openProject(parseInt(card.dataset.index, 10))));
        closeBtn.addEventListener('click', closeShowcase);
        const handleNextProject = () => openProject((currentProjectIndex + 1) % portfolioData.projects.length);
        const handlePrevProject = () => openProject((currentProjectIndex - 1 + portfolioData.projects.length) % portfolioData.projects.length);
        nextProjectBtn.addEventListener('click', handleNextProject);
        prevProjectBtn.addEventListener('click', handlePrevProject);
        
        window.addEventListener('keydown', e => {
          if (showcase.classList.contains('hidden')) return;
          if (e.key === 'Escape') closeShowcase();
          if (e.key === 'ArrowRight') handleNextProject();
          if (e.key === 'ArrowLeft') handlePrevProject();
        });
      });
    </script>
  `;

  return `
    <!DOCTYPE html>
    <html lang="en" class="scroll-smooth">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${sanitize(data.name)}'s Portfolio</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Playfair+Display:wght@700&display=swap" rel="stylesheet">
        <style>
          html { scroll-padding-top: 5rem; }
          body { font-family: 'Inter', sans-serif; }
          h1, h2, h3, h4, h5, h6 { font-family: 'Playfair Display', serif; }
          #showcase-thumbnails::-webkit-scrollbar { height: 6px; }
          #showcase-thumbnails::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
          #showcase-thumbnails::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.3); border-radius: 10px; }
        </style>
      </head>
      <body class="bg-gray-50 text-gray-800 font-sans antialiased">
        ${header}
        ${heroSection}
        <main class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          ${aboutSection}
          ${projectsSection}
          ${contactSection}
        </main>
        ${footer}
        ${showcaseModal}
        ${scripts}
      </body>
    </html>
  `;
};

const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, data }) => {
  if (!isOpen) return null;

  const handleDownload = async () => {
    try {
        const zip = new JSZip();
        
        const mainHtml = generateMainHtml(data);
        zip.file('portfolio.html', mainHtml);

        const introduceHtml = generateIntroduceHtml(data);
        zip.file('introduce.html', introduceHtml);

        const content = await zip.generateAsync({ type: 'blob' });
        
        const url = URL.createObjectURL(content);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'portfolio.zip';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error("Failed to generate or download portfolio ZIP:", error);
        alert("Sorry, there was an error creating your portfolio ZIP file.");
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100]"
      aria-modal="true"
      role="dialog"
      onClick={onClose}
    >
      <div
        className="bg-white border border-gray-200 rounded-lg shadow-2xl w-full max-w-lg flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="p-4 flex items-center justify-between border-b border-gray-200">
          <h2 className="text-2xl font-bold text-black">Download Your Portfolio</h2>
          <button onClick={onClose} className="p-2 text-gray-500 hover:text-black transition-colors" aria-label="Close export modal">
            <CloseIcon className="w-6 h-6" />
          </button>
        </header>
        <main className="p-8 flex-grow flex flex-col items-center justify-center text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Your Portfolio is Ready to Go!</h3>
            <p className="text-gray-600 max-w-md mb-8">
                Download a ZIP file containing your complete, multi-page portfolio. Unzip the file and open `portfolio.html` to see your site.
            </p>
            <button
                onClick={handleDownload}
                className="inline-flex items-center justify-center gap-3 bg-indigo-600 text-white font-semibold px-6 py-3 rounded-md hover:bg-indigo-700 transition-all duration-300 hover:scale-105 active:scale-100"
            >
                <DownloadIcon className="w-6 h-6" />
                <span>Download .ZIP File</span>
            </button>
        </main>
      </div>
    </div>
  );
};

export default ExportModal;