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

  const getColumnsClass = (slotCount: number) => {
    return slotCount <= 1 ? 'sm:grid-cols-1' : 'sm:grid-cols-2';
  };

  // Determine slot count per section (based on explicit `slot` fields if present)
  const slotCountForSection = (section: typeof lifeSections[number]) => {
    const hasSlots = Array.isArray(section.media) && section.media.some((m) => typeof m.slot === 'number');
    if (!hasSlots) return 2; // default two columns
    const maxSlot = section.media.reduce((max, m) => {
      const s = typeof m.slot === 'number' ? m.slot : 0;
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
          {/* Lead paragraph at top — large text with keywords highlighted in blue */}
          <div>
            <p
              className="text-3xl sm:text-4xl md:text-5xl mb-6"
              style={{ fontFamily: 'Helvetica, Arial, sans-serif', fontWeight: 300, lineHeight: 1.6 }}
            >
              {(() => {
                const lead = `I pay attention to everyday moments, atmospheres, and subtle shifts in perception.`;
                const keywords = ['moments', 'atmospheres', 'subtle shifts'];
                const nodes: React.ReactNode[] = [];
                let cursor = 0;

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
          {lifeSections.map((section) => {
            const slotCount = slotCountForSection(section);

            // build arrays per slot; if no explicit slot defined, distribute by index % slotCount
            const slotArrays: Array<typeof section.media> = Array.from({ length: slotCount }, () => []);
            section.media.forEach((m, i) => {
              const s = typeof m.slot === 'number' ? m.slot : (i % slotCount);
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
                  <div className="relative transition-transform duration-500 hover:rotate-0 hover:translate-y-[-4px]">
                    <div className="relative rounded-[18px] bg-[#fbfeff] shadow-[0_18px_40px_rgba(130,146,168,0.12)] p-3 sm:p-4 border border-[#d5e7f3]">
                      <div className="overflow-hidden rounded-[4px] bg-gray-100 flex items-center justify-center text-gray-500 py-8">No image</div>
                      <p className="mt-4 text-center text-[0.96rem] sm:text-[1.02rem] tracking-[0.12em] text-[#57809f] font-mono uppercase">{section.title}</p>
                    </div>
                  </div>
                );
              }

              return (
                <div className="relative transition-transform duration-500 hover:rotate-0 hover:translate-y-[-4px]">
                  <div className="absolute -top-4 left-[42%] w-28 h-9 bg-[#dff3e8]/75 rounded-sm shadow-sm"></div>
                  <div className="relative rounded-[18px] bg-[#fbfeff] shadow-[0_18px_40px_rgba(130,146,168,0.12)] p-3 sm:p-4 border border-[#d5e7f3]">
                    <div className="overflow-hidden rounded-[4px] bg-[#f7fbff]">
                      {mediaItem.type === 'video' ? (
                        <video src={getAssetUrl(mediaItem.url)} controls className="w-full h-auto" preload="metadata" />
                      ) : (
                        <img src={getAssetUrl(mediaItem.url)} alt={mediaItem.caption || section.title} className="w-full h-auto object-cover" />
                      )}
                    </div>

                    <p className="mt-4 text-center text-[0.96rem] sm:text-[1.02rem] tracking-[0.12em] text-[#57809f] font-mono uppercase">
                      {mediaItem.caption || section.title}
                    </p>

                    {frameList.length > 1 ? (
                      <div className="mt-3 flex items-center justify-center gap-3">
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
                </div>
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
                  <div className={`grid grid-cols-1 ${getColumnsClass(slotCount)} gap-4 md:gap-5 items-start`}>
                    {slotArrays.map((arr, si) => (
                      <div key={si}>
                        {renderFrame(arr[activeForSection[si]] ?? null, si, arr, activeForSection[si] ?? 0)}
                      </div>
                    ))}
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