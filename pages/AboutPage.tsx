import React from 'react';
import UserIcon from '../components/icons/UserIcon.tsx';
import { PortfolioData } from '../types.ts';

interface AboutPageProps {
	portfolioData: PortfolioData;
}

const AboutPage: React.FC<AboutPageProps> = ({ portfolioData }) => {
	const { aboutSections } = portfolioData;

	const TextCard: React.FC<{ title: string; text: string; className?: string }> = ({ title, text, className }) => (
		<div className={`relative ${className || ''} transition-transform duration-500 hover:rotate-0 hover:translate-y-[-4px]`}>
			<div className="absolute -top-6 left-4 w-20 h-9 bg-[#d7ecfb]/75 rounded-sm rotate-[-14deg] shadow-sm"></div>
			<div className="absolute -bottom-5 right-8 w-16 h-7 bg-[#dff3e8]/75 rounded-sm rotate-[10deg] shadow-sm"></div>
			<div className="relative rounded-[14px] bg-[#9ecfe8] text-[#17324a] shadow-[0_12px_28px_rgba(101,149,176,0.14)] px-5 py-5 sm:px-7 sm:py-6 border border-[#8bb9d4]/40">
				<h3 className="text-[1.45rem] sm:text-[2.1rem] leading-[0.98] font-extrabold font-mono tracking-widest capitalize mb-3">{title.toLowerCase()}</h3>
				<p className="max-w-[26rem] text-[0.93rem] sm:text-[1rem] leading-[1.55] text-[#183246]/90 whitespace-pre-line">{text}</p>
			</div>
		</div>
	);

	const PhotoCard: React.FC<{ title: string; imageUrl?: string; className?: string }> = ({ title, imageUrl, className }) => (
		<div className={`relative ${className || ''} transition-transform duration-500 hover:rotate-0 hover:translate-y-[-4px]`}>
			<div className="absolute -top-4 left-[42%] w-28 h-9 bg-[#dff3e8]/75 rounded-sm shadow-sm"></div>
			<div className="relative rounded-[18px] bg-[#fbfeff] shadow-[0_18px_40px_rgba(130,146,168,0.12)] p-3 sm:p-4 border border-[#d5e7f3]">
				<div className="aspect-[4/3] overflow-hidden rounded-[4px] bg-[#f7fbff]">
					{imageUrl ? (
						<img src={imageUrl} alt={title} className="w-full h-full object-cover" />
					) : (
						<div className="w-full h-full bg-gray-200 flex items-center justify-center">
							<UserIcon className="w-20 h-20 text-gray-400" />
						</div>
					)}
				</div>
				<p className="mt-4 text-center text-[0.96rem] sm:text-[1.02rem] tracking-[0.12em] text-[#57809f] font-mono uppercase">
					{title}
				</p>
			</div>
		</div>
	);

	const OverlapPair: React.FC<{ title: string; text: string; imageUrl?: string; reverse?: boolean }> = ({
		title,
		text,
		imageUrl,
		reverse,
	}) => (
		<article className="relative">
			<div className="hidden md:block">
				<div className={`flex items-center gap-4 min-h-[380px] ${reverse ? 'flex-row-reverse' : 'flex-row'}`}>
					{reverse ? (
						<>
							<div className="relative z-10 w-[46%] pt-5">
								<PhotoCard title={title} imageUrl={imageUrl} className="rotate-[-2deg]" />
							</div>
							<div className="relative z-30 w-[54%] -ml-6 self-center">
								<TextCard title={title} text={text} className="rotate-[1.4deg]" />
							</div>
						</>
					) : (
						<>
							<div className="relative z-10 w-[46%] pt-5">
								<PhotoCard title={title} imageUrl={imageUrl} className="rotate-[1.8deg]" />
							</div>
							<div className="relative z-30 w-[54%] -mr-6 self-center">
								<TextCard title={title} text={text} className="rotate-[-1.4deg]" />
							</div>
						</>
					)}
				</div>
			</div>

			<div className="md:hidden grid grid-cols-1 gap-6">
				<TextCard title={title} text={text} className="rotate-[-1deg]" />
				<PhotoCard title={title} imageUrl={imageUrl} className="rotate-[1deg]" />
			</div>
		</article>
	);

	return (
		<div className="w-full px-4 sm:px-6 lg:px-8">
			<section id="about-page" className="py-14 sm:py-16">
				<div className="mx-auto max-w-5xl space-y-16 md:space-y-20">
					{/* Lead paragraph at top — large text without box, keywords highlighted */}
					<div>
							<p
								className="text-3xl sm:text-4xl md:text-5xl mb-6"
								style={{ fontFamily: 'Helvetica, Arial, sans-serif', fontWeight: 300, lineHeight: 1.6 }}
							>
							{(() => {
								const lead = `Through design, computation, and music, I explore how everyday spatial experience is shaped by unseen systems.`;
								const keywords = ['design', 'computation', 'music', 'spatial experience'];
								const nodes: React.ReactNode[] = [];
								let cursor = 0;
								const lower = lead.toLowerCase();

								while (cursor < lead.length) {
									let foundIndex = -1;
									let foundKey = '';
									for (const kw of keywords) {
										const re = new RegExp('\\b' + kw.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&') + '\\b', 'i');
										const match = re.exec(lead.slice(cursor));
										if (match) {
											const idx = match.index + cursor;
											if (foundIndex === -1 || idx < foundIndex) {
												foundIndex = idx;
												foundKey = match[0];
											}
										}
									}

									if (foundIndex === -1) {
										nodes.push(lead.slice(cursor));
										break;
									}

									if (foundIndex > cursor) {
										nodes.push(lead.slice(cursor, foundIndex));
									}

									nodes.push(
										<span key={cursor + '-' + foundIndex} className="text-sky-400">
											{lead.slice(foundIndex, foundIndex + foundKey.length)}
										</span>
									);

									cursor = foundIndex + foundKey.length;
								}

								return nodes;
							})()}
						</p>
					</div>
					{aboutSections.map((section, index) => (
						<OverlapPair
							key={section.id}
							title={section.title}
							text={section.text}
							imageUrl={section.imageUrl}
							reverse={index % 2 === 1}
						/>
					))}
				</div>
			</section>
		</div>
	);
};

export default AboutPage;
