import React, { useMemo, useState } from 'react';
import { PortfolioData } from '../types.ts';
import ChevronLeftIcon from '../components/icons/ChevronLeftIcon.tsx';
import ChevronRightIcon from '../components/icons/ChevronRightIcon.tsx';
import { getAssetUrl } from '../utils/assetUrl.ts';

interface LifePageProps {
  portfolioData: PortfolioData;
}

const LifePage: React.FC<LifePageProps> = ({ portfolioData }) => {
  const { lifeSections } = portfolioData;
  const initialIndexMap = useMemo(
    () => Object.fromEntries(lifeSections.map((section) => [section.id, { left: 0, right: 0 }])) as Record<number, { left: number; right: number }>,
    [lifeSections]
  );
  const [activeIndices, setActiveIndices] = useState<Record<number, { left: number; right: number }>>(initialIndexMap);

  const goPrevFrame = (sectionId: number, side: 'left' | 'right', arrLength: number) => {
    if (arrLength <= 1) return;
    setActiveIndices((prev) => {
      const current = prev[sectionId] ? prev[sectionId][side] : 0;
      const next = (current - 1 + arrLength) % arrLength;
      return { ...prev, [sectionId]: { ...(prev[sectionId] || { left: 0, right: 0 }), [side]: next } };
    });
  };

  const goNextFrame = (sectionId: number, side: 'left' | 'right', arrLength: number) => {
    if (arrLength <= 1) return;
    setActiveIndices((prev) => {
      const current = prev[sectionId] ? prev[sectionId][side] : 0;
      const next = (current + 1) % arrLength;
      return { ...prev, [sectionId]: { ...(prev[sectionId] || { left: 0, right: 0 }), [side]: next } };
    });
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      <section id="life" className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl space-y-14 md:space-y-18">
          {lifeSections.map((section) => {
            const leftArr = section.media.filter((_, i) => i % 2 === 0);
            const rightArr = section.media.filter((_, i) => i % 2 === 1);
            const leftIdx = activeIndices[section.id]?.left ?? 0;
            const rightIdx = activeIndices[section.id]?.right ?? 0;

            const leftMedia = leftArr[leftIdx] ?? null;
            const rightMedia = rightArr[rightIdx] ?? null;

            const renderFrame = (
              mediaItem: (typeof section.media)[number] | null,
              frameKey: 'left' | 'right',
              frameList: typeof section.media,
              currentIndex: number
            ) => {
              if (!mediaItem) {
                return (
                  <div className="p-3 shadow-lg bg-[var(--primary)]/6 border border-[var(--primary)]/20 rounded-lg">
                    <div className="aspect-[4/3] bg-gray-100 flex items-center justify-center text-gray-500">No image</div>
                  </div>
                );
              }

              return (
                <figure className="relative p-3 shadow-lg transition-transform duration-400 bg-[var(--primary)]/6 border border-[var(--primary)]/20 rounded-lg">
                  <div className="aspect-[4/3] overflow-hidden bg-white">
                    {mediaItem.type === 'video' ? (
                      <video src={getAssetUrl(mediaItem.url)} controls className="w-full h-full object-cover" preload="metadata" />
                    ) : (
                      <img src={getAssetUrl(mediaItem.url)} alt={mediaItem.caption || section.title} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <figcaption className="text-sm text-gray-600 min-h-5">{mediaItem.caption || ''}</figcaption>
                    {frameList.length > 1 ? (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => goPrevFrame(section.id, frameKey, frameList.length)}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-full border bg-white text-gray-700"
                          aria-label={`Previous media in ${section.title}`}
                        >
                          <ChevronLeftIcon className="w-4 h-4" />
                        </button>
                        <span className="text-xs text-gray-600 min-w-10 text-center">
                          {currentIndex + 1}/{frameList.length}
                        </span>
                        <button
                          type="button"
                          onClick={() => goNextFrame(section.id, frameKey, frameList.length)}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-full border bg-white text-gray-700"
                          aria-label={`Next media in ${section.title}`}
                        >
                          <ChevronRightIcon className="w-4 h-4" />
                        </button>
                      </div>
                    ) : null}
                  </div>
                </figure>
              );
            };

            return (
              <article key={section.id} className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-start">
                <div className="md:col-span-4 md:sticky md:top-28 self-start md:pr-3">
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 font-mono tracking-widest">{section.title}</h3>
                  <p className="mt-3 text-gray-700 leading-relaxed whitespace-pre-line">{section.text}</p>
                </div>

                <div className="md:col-span-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
                    {leftArr.length > 0 ? renderFrame(leftMedia, 'left', leftArr, leftIdx) : null}
                    {rightArr.length > 0 ? renderFrame(rightMedia, 'right', rightArr, rightIdx) : null}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default LifePage;