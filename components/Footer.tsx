
import React from 'react';

interface FooterProps {
    name: string;
}

const Footer: React.FC<FooterProps> = ({ name }) => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="py-8 border-t border-gray-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500">
        <p>&copy; {currentYear} {name}. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;