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
  // Determine slot count per section (based on explicit `slot` fields if present)
  const slotCountForSection = (section: typeof lifeSections[number]) => {
    const hasSlots = Array.isArray(section.media) && section.media.some((m) => typeof (m as any).slot === 'number');
    if (!hasSlots) return 2; // default two columns
    const maxSlot = section.media.reduce((max, m) => {
      const s = typeof (m as any).slot === 'number' ? (m as any).slot : 0;
      return Math.max(max, s);
    }, 0);
    return Math.max(1, maxSlot + 1);
  };

  const initialIndexMap = useMemo(() => {
    const map: Record<number, number[]> = {};
    for (const section of lifeSections) {
      const count = slotCountForSection(section);
      map[section.id] = Array.from({ length: count }, () => 0);
    }
    return map;
  }, [lifeSections]);

  const [activeIndices, setActiveIndices] = useState<Record<number, number[]>>(initialIndexMap);

  const goPrevFrame = (sectionId: number, slotIndex: number, arrLength: number) => {
    if (arrLength <= 1) return;
    setActiveIndices((prev) => {
      const prevArr = prev[sectionId] ? [...prev[sectionId]] : [...initialIndexMap[sectionId]];
      const current = prevArr[slotIndex] ?? 0;
      prevArr[slotIndex] = (current - 1 + arrLength) % arrLength;
      return { ...prev, [sectionId]: prevArr };
    });
  };

  const goNextFrame = (sectionId: number, slotIndex: number, arrLength: number) => {
    if (arrLength <= 1) return;
    setActiveIndices((prev) => {
      const prevArr = prev[sectionId] ? [...prev[sectionId]] : [...initialIndexMap[sectionId]];
      const current = prevArr[slotIndex] ?? 0;
      prevArr[slotIndex] = (current + 1) % arrLength;
      return { ...prev, [sectionId]: prevArr };
    });
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      <section id="life" className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl space-y-14 md:space-y-18">
          {lifeSections.map((section) => {
            const slotCount = slotCountForSection(section);

            // build arrays per slot; if no explicit slot defined, distribute by index % slotCount
            const slotArrays: Array<typeof section.media> = Array.from({ length: slotCount }, () => [] as any);
            section.media.forEach((m, i) => {
              const s = typeof (m as any).slot === 'number' ? (m as any).slot : (i % slotCount);
              const idx = Math.max(0, Math.min(slotCount - 1, s));
              slotArrays[idx].push(m);
            });

            const renderFrame = (
              mediaItem: (typeof section.media)[number] | null,
              slotIdx: number,
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
                          onClick={() => goPrevFrame(section.id, slotIdx, frameList.length)}
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
                          onClick={() => goNextFrame(section.id, slotIdx, frameList.length)}
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

            const activeForSection = activeIndices[section.id] || Array.from({ length: slotCount }, () => 0);

            return (
              <article key={section.id} className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-start">
                <div className="md:col-span-4 md:sticky md:top-28 self-start md:pr-3">
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 font-mono tracking-widest">{section.title}</h3>
                  <p className="mt-3 text-gray-700 leading-relaxed whitespace-pre-line">{section.text}</p>
                </div>

                <div className="md:col-span-8">
                  {(() => {
                    // Map slotCount to fixed Tailwind classes so Tailwind can generate them
                    const capped = Math.min(4, slotCount);
                    const gridColsClass = capped === 1 ? 'sm:grid-cols-1' : capped === 2 ? 'sm:grid-cols-2' : capped === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-4';
                    return (
                      <div className={`grid grid-cols-1 ${gridColsClass} gap-4 md:gap-5`}>
                        {slotArrays.map((arr, si) => (
                          <div key={si}>
                            {renderFrame(arr[activeForSection[si]] ?? null, si, arr, activeForSection[si] ?? 0)}
                          </div>
                        ))}
                      </div>
                    );
                  })()}
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