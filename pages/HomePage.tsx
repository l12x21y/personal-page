import React from 'react';
import HeroSection from '../components/HeroSection.tsx';
import ProjectsSection from '../components/ProjectsSection.tsx';
import { PortfolioData } from '../types.ts';

interface HomePageProps {
	portfolioData: PortfolioData;
	isViewMode: boolean;
}

const HomePage: React.FC<HomePageProps> = ({ portfolioData, isViewMode }) => {
	const openProjectDetail = (projectSlug: string | number) => {
		window.location.href = `project.html?project=${encodeURIComponent(String(projectSlug))}`;
	};

	return (
		<>
			<HeroSection
				name={portfolioData.name}
				aboutText={portfolioData.about.summary}
				profileImageUrl={portfolioData.about.photoUrl}
				heroImageUrl={portfolioData.heroImageUrl}
				onNameChange={() => {}}
				onHeroImageChange={() => {}}
				isViewMode={isViewMode}
			/>

			<div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
				<ProjectsSection
					projects={portfolioData.projects}
					onUpdateProject={() => {}}
					onUpdateProjectImage={() => {}}
					onProjectClick={(project) => openProjectDetail(project.slug ?? project.id)}
					onAddProjectTag={() => {}}
					onDeleteProjectTag={() => {}}
					onDeleteProject={() => {}}
					onReorderProjects={() => {}}
					isViewMode={isViewMode}
				/>
			</div>
		</>
	);
};

export default HomePage;
