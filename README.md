# 访问链接

https://github.com/l12x21y/personal-page

# Personal Portfolio

A personal portfolio website built with React, TypeScript, and Vite. It presents a homepage, project gallery, about/life pages, and a resume page with a downloadable CV.

## Features

- Responsive portfolio homepage with hero, projects, and contact sections
- Separate pages for `project`, `life`, `about`, and `resume`
- Sticky-note inspired visual style with page transition animations
- Data-driven content generated from the files in `dataset/`
- Resume page with a PDF CV button
- Mobile-friendly navigation

## Tech Stack

- React 19
- TypeScript
- Vite
- React Router
- Tailwind CSS via CDN

## Project Structure

- `App.tsx` - app shell and routing
- `pages/` - page-level views
- `components/` - reusable UI components
- `dataset/` - source content for projects, skills, experience, and life/about sections
- `scripts/generate-portfolio-data.mjs` - generates `hooks/generatedPortfolioData.ts`

## Getting Started

### Install dependencies

```bash
npm install
```

### Run locally

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

### Preview the production build

```bash
npm run preview
```

## Notes

- The content in `hooks/generatedPortfolioData.ts` is generated from the dataset files. If you edit the JSON in `dataset/`, run the app or build again to regenerate the data.
- The CV button on the resume page opens the PDF at `Personal Info/XinyaoLyu-CV.pdf`.

## GitHub

Repository: [l12x21y/personal-page](https://github.com/l12x21y/personal-page)
