
import React, { useRef, useState, useEffect } from 'react';
import EditableInput from './common/EditableInput.tsx';
import CameraIcon from './icons/CameraIcon.tsx';
import UserIcon from './icons/UserIcon.tsx';

interface HeroSectionProps {
  name: string;
  aboutText?: string;
  profileImageUrl?: string;
  heroImageUrl: string;
  onNameChange: (value: string) => void;
  onHeroImageChange: (file: File) => void;
  isViewMode?: boolean;
}

const HeroSection: React.FC<HeroSectionProps> = ({ name, aboutText = '', profileImageUrl, heroImageUrl, onNameChange, onHeroImageChange, isViewMode }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [textColorClass, setTextColorClass] = useState('text-white');
  const [placeholderColorClass, setPlaceholderColorClass] = useState('placeholder-gray-300');
  const [textShadowStyle, setTextShadowStyle] = useState({ textShadow: '0 2px 4px rgba(0,0,0,0.5)' });
  const [typedText, setTypedText] = useState('');

  useEffect(() => {
    setTypedText('');
    if (!aboutText) return;

    let charIndex = 0;
    let mounted = true;

    const baseDelay = 22;

    const typeNext = () => {
      if (!mounted) return;
      charIndex += 1;
      setTypedText(aboutText.slice(0, charIndex));

      if (charIndex >= aboutText.length) return;

      const nextChar = aboutText.charAt(charIndex - 1);
      const upcomingChar = aboutText.charAt(charIndex);

      // Add rhythm: longer pauses after commas and sentence ends
      let delay = baseDelay;
      if (nextChar === ',' || nextChar === ';') delay = 180;
      if (nextChar === '.' || nextChar === '!' || nextChar === '?' ) delay = 420;
      if (nextChar === ' ' && upcomingChar === ' ') delay = 80;

      window.setTimeout(typeNext, delay);
    };

    // start typing
    window.setTimeout(typeNext, 200);

    return () => { mounted = false; };
  }, [aboutText]);

  useEffect(() => {
    if (!heroImageUrl) return;

    const img = new Image();
    // For external URLs like unsplash, we need to handle CORS
    const isData = resolvedHeroImagePath.startsWith('data:');
    if (!isData) {
      img.crossOrigin = 'Anonymous';
    }

    img.src = resolvedHeroImagePath ? encodeURI(decodeURI(resolvedHeroImagePath)) : heroImageUrl;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const size = 10; // Analyze a small 10x10 sample for performance
      canvas.width = size;
      canvas.height = size;
      ctx.drawImage(img, 0, 0, size, size);

      const imageData = ctx.getImageData(0, 0, size, size);
      const data = imageData.data;
      let r = 0, g = 0, b = 0;

      for (let i = 0; i < data.length; i += 4) {
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
      }

      const pixelCount = data.length / 4;
      const avgR = r / pixelCount;
      const avgG = g / pixelCount;
      const avgB = b / pixelCount;
      
      // A common formula for perceived brightness
      const brightness = (avgR * 299 + avgG * 587 + avgB * 114) / 1000;
      
      if (brightness > 128) {
        // Light background
        setTextColorClass('text-gray-900');
        setPlaceholderColorClass('placeholder-gray-600');
        setTextShadowStyle({ textShadow: '0 1px 3px rgba(255,255,255,0.7)' });
      } else {
        // Dark background
        setTextColorClass('text-white');
        setPlaceholderColorClass('placeholder-gray-300');
        setTextShadowStyle({ textShadow: '0 2px 4px rgba(0,0,0,0.5)' });
      }
    };
    img.onerror = () => {
      // Fallback in case the image fails to load
      setTextColorClass('text-white');
      setPlaceholderColorClass('placeholder-gray-300');
      setTextShadowStyle({ textShadow: '0 2px 4px rgba(0,0,0,0.5)' });
    }
  }, [heroImageUrl]);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onHeroImageChange(file);
    }
  };

  // Resolve hero image path once (ensure leading '/' for public assets) and URL-encode it
  const resolvedHeroImagePath = heroImageUrl
    ? (() => {
        const isAbsolute = heroImageUrl.startsWith('data:') || heroImageUrl.startsWith('http') || heroImageUrl.startsWith('/');
        return isAbsolute ? heroImageUrl : `/${heroImageUrl}`;
      })()
    : '';

  const backgroundStyle = resolvedHeroImagePath
    ? { backgroundImage: `url("${encodeURI(decodeURI(resolvedHeroImagePath))}")` } as React.CSSProperties
    : undefined;

  return (
    <section id="home" className="relative flex items-center min-h-screen -mt-20 pt-20 overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={backgroundStyle}
        aria-hidden="true"
      ></div>
      {/* Bottom fade for smooth transition into next section */}
      <div className="absolute inset-x-0 bottom-0 h-48 sm:h-64 bg-gradient-to-b from-transparent to-gray-50 z-10" aria-hidden="true"></div>
      
      {/* Content */}
      <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 items-center">
          <div className="md:col-span-3 text-left order-2 md:order-1">
            <h1 
              className="text-5xl sm:text-6xl md:text-7xl font-bold leading-tight tracking-tighter animate-fade-in-up"
              style={{ ...textShadowStyle, animationDelay: '200ms' }}
            >
              <EditableInput 
                value={name}
                onChange={onNameChange}
                className={`text-5xl sm:text-6xl md:text-7xl font-bold text-left leading-tight tracking-tighter bg-transparent ${textColorClass} ${placeholderColorClass}`}
                ariaLabel="Your Name"
                isViewMode={isViewMode}
              />
            </h1>

            <p
              className={`mt-6 text-lg sm:text-xl max-w-2xl whitespace-pre-line animate-fade-in-up ${textColorClass} font-sans`}
              style={{ ...textShadowStyle, animationDelay: '400ms', lineHeight: 1.9 }}
              aria-label="About summary"
            >
              {/** render typed text with highlighted keywords */}
              {(() => {
                const text = typedText || '';
                const keywords = ['people', 'space', 'systems', 'experiences', 'music', 'photography', 'overlooked', 'observation'];

                if (!text) return null;

                // Build nodes by scanning for keyword occurrences (word-boundary, case-insensitive)
                const nodes: React.ReactNode[] = [];
                let lastIndex = 0;
                const lower = text.toLowerCase();

                // find earliest match repeatedly
                while (lastIndex < text.length) {
                  let matchIndex = -1;
                  let matchWord = '';
                  for (const kw of keywords) {
                    const re = new RegExp('\\b' + kw + '\\b', 'i');
                    const m = re.exec(text.slice(lastIndex));
                    if (m) {
                      const idx = m.index + lastIndex;
                      if (matchIndex === -1 || idx < matchIndex) {
                        matchIndex = idx;
                        matchWord = m[0];
                      }
                    }
                  }

                  if (matchIndex === -1) {
                    // no more matches
                    nodes.push(text.slice(lastIndex));
                    break;
                  }

                  if (matchIndex > lastIndex) {
                    nodes.push(text.slice(lastIndex, matchIndex));
                  }

                  // push highlighted span only if full word is present in current typed text
                  nodes.push(
                    <span
                      key={lastIndex + '-' + matchIndex}
                      className="text-black"
                      style={{
                        // wider, lower marker band under the letters without shifting baseline
                        backgroundImage: 'linear-gradient(transparent 0%, rgba(209,240,255,0.55) 0%, rgba(209,240,255,0.55) 100%, transparent 100%)',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: '100% 48%',
                        backgroundPosition: '0 75%',
                        padding: '0 0.18rem',
                        borderRadius: 0,
                        verticalAlign: 'baseline',
                        display: 'inline',
                      }}
                    >
                      {text.slice(matchIndex, matchIndex + matchWord.length)}
                    </span>
                  );

                  lastIndex = matchIndex + matchWord.length;
                }

                return nodes;
              })()}

              <span className="inline-block w-2 ml-1 animate-pulse">|</span>
            </p>
          </div>

          <div className="md:col-span-2 order-1 md:order-2 flex md:justify-end justify-start">
            <div className="relative w-52 h-52 sm:w-64 sm:h-64 animate-fade-in-up" style={{ animationDelay: '260ms' }}>
              <div className="absolute -top-3 left-8 w-16 h-7 bg-[#f4e8b8]/85 rounded-sm rotate-[-8deg] shadow-sm"></div>
              <div className="absolute -bottom-4 right-6 w-14 h-6 bg-[#cfead7]/80 rounded-sm rotate-[9deg] shadow-sm"></div>

              <div className="relative w-full h-full p-3 bg-[#e8f4fb] shadow-2xl border border-[#c8dfea] rotate-[-3deg] hover:rotate-0 transition-transform duration-500">
                <div className="w-full h-full bg-[#f1faf5] border border-[#cae5d3] overflow-hidden">
                  {profileImageUrl ? (
                    <img src={profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
                      <UserIcon className="w-16 h-16 text-gray-500" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
       {!isViewMode && (
        <>
          <button
            onClick={handleUploadClick}
            className="absolute bottom-6 right-6 z-30 inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white font-semibold px-4 py-2 rounded-md hover:bg-white/30 transition-colors"
            aria-label="Change cover image"
          >
            <CameraIcon className="w-5 h-5" />
            <span className="hidden sm:inline">Change Cover Image</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/png, image/jpeg, image/webp"
            className="hidden"
            aria-hidden="true"
          />
        </>
      )}
    </section>
  );
};

export default HeroSection;
