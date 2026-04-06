
import React from 'react';

const SparklesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6-10.375A1 1 0 0 1 3.437 2.5l10.375 6a2 2 0 0 0 1.437 1.437l6 10.375a1 1 0 0 1-1.125 1.563l-10.375-6z" />
    <path d="M5 3v4" />
    <path d="M3 5h4" />
    <path d="M17 13h4" />
    <path d="M19 11v4" />
  </svg>
);

export default SparklesIcon;
