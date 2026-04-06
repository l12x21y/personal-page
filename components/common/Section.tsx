import React, { useState, useEffect } from 'react';

interface SectionProps {
  id: string;
  title: string;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ id, title, children }) => {
  const [isMounted, setIsMounted] = useState(false);

  // Trigger the animation shortly after the component mounts.
  // Using a small timeout ensures that the initial (invisible) state is rendered
  // before the class for the visible state is applied, which reliably triggers the CSS transition.
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 50); // A small delay is sufficient.
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      id={id}
      className={`py-20 sm:py-28 transition-all duration-1000 ease-out ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
    >
      <div className="flex items-center mb-12">
        <h2 className="text-4xl font-bold text-black tracking-tight">{title}</h2>
        <div className="flex-grow h-px bg-gray-300 ml-6"></div>
      </div>
      {children}
    </section>
  );
};

export default Section;