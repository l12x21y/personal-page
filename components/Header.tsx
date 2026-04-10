import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import MailIcon from './icons/MailIcon.tsx';
import PhoneIcon from './icons/PhoneIcon.tsx';
import GithubIcon from './icons/GithubIcon.tsx';

interface HeaderProps {
    name: string;
    email?: string;
    phone?: string;
    github?: string;
}

const Header: React.FC<HeaderProps> = ({ name, email, phone, github }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobileMenuOpen]);
  
  const navLinks = [
    { to: '/', label: 'project' },
    { to: '/life', label: 'life' },
    { to: '/about', label: 'about' },
    { to: '/resume', label: 'resume' },
  ];

  const primaryEmail = (email || '')
    .split('|')
    .map((p) => p.trim())
    .find((p) => p.includes('2353274'))
    || (email || '').split('|').map((p) => p.trim()).find(Boolean)
    || '2353274@tongji.edu.cn';

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${isMobileMenuOpen ? 'bg-transparent shadow-none border-b-0' : isScrolled ? 'bg-white/80 backdrop-blur-lg shadow-md border-b border-gray-200' : 'bg-transparent'}`}>
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <NavLink to="/" className="text-3xl font-mono tracking-widest" style={{ color: '#000' }}>
            {name}
          </NavLink>
          <div className="flex items-center space-x-4">
            <nav className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) => `transition-colors duration-300 text-sm tracking-wider lowercase ${
                    isActive
                      ? 'text-black font-semibold'
                      : 'text-black hover:text-[var(--primary)]'
                  }`}
                >
                  {link.label}
                </NavLink>
              ))}

              <div className="flex items-center gap-3 text-black">
                <a href={`mailto:${primaryEmail}`} className="hover:text-[var(--primary)] transition-colors" aria-label="Email 2353274" title="Email">
                  <MailIcon className="w-5 h-5" />
                </a>
                <a href={`tel:${phone || ''}`} className="hover:text-[var(--primary)] transition-colors" aria-label="Phone" title="Phone">
                  <PhoneIcon className="w-5 h-5" />
                </a>
                {github ? (
                  <a href={github} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--primary)] transition-colors" aria-label="GitHub" title="GitHub">
                    <GithubIcon className="w-5 h-5" />
                  </a>
                ) : null}
              </div>
            </nav>

            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center w-10 h-10 text-gray-700 hover:text-black"
              aria-label="Open menu"
              onClick={() => setIsMobileMenuOpen((v) => !v)}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                {isMobileMenuOpen ? (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </>
                ) : (
                  <>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 w-screen h-screen z-[120] bg-[#eaf5fd]">
            <div className="h-full w-full px-6 pt-6 pb-10 flex flex-col">
              <div className="flex items-center justify-between pb-8 border-b border-gray-200">
                <NavLink
                  to="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-3xl font-mono tracking-widest text-black"
                >
                  {name}
                </NavLink>
                <button
                  type="button"
                  className="inline-flex items-center justify-center w-12 h-12 text-gray-700 hover:text-black"
                  aria-label="Close menu"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>

              <nav className="flex-1 flex flex-col justify-center gap-8 text-black">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) => `text-3xl font-mono tracking-widest lowercase transition-colors ${isActive ? 'text-black' : 'text-black hover:text-[var(--primary)]'}`}
                  >
                    {link.label}
                  </NavLink>
                ))}
              </nav>

              <div className="pt-8 border-t border-gray-200 flex items-center gap-8 text-black">
                <a href={`mailto:${primaryEmail}`} className="hover:text-[var(--primary)] transition-colors" aria-label="Email 2353274" title="Email">
                  <MailIcon className="w-7 h-7" />
                </a>
                <a href={`tel:${phone || ''}`} className="hover:text-[var(--primary)] transition-colors" aria-label="Phone" title="Phone">
                  <PhoneIcon className="w-7 h-7" />
                </a>
                {github ? (
                  <a href={github} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--primary)] transition-colors" aria-label="GitHub" title="GitHub">
                    <GithubIcon className="w-7 h-7" />
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;