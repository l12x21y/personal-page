import React from 'react';
import { HashRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/Header.tsx';
import Footer from './components/Footer.tsx';
import HomePage from './pages/HomePage.tsx';
import AboutPage from './pages/AboutPage.tsx';
import ResumePage from './pages/ResumePage.tsx';
import LifePage from './pages/LifePage.tsx';
import { usePortfolioData } from './hooks/usePortfolioData.ts';

const App: React.FC = () => {
  const { portfolioData } = usePortfolioData();
  const isViewMode = true;

  const AnimatedRoutes: React.FC = () => {
    const location = useLocation();

    return (
      <div key={location.pathname} className="animate-page-in">
        <Routes location={location}>
          <Route
            path="/"
            element={<HomePage portfolioData={portfolioData} isViewMode={isViewMode} />}
          />
          <Route
            path="/life"
            element={<LifePage portfolioData={portfolioData} />}
          />
          <Route
            path="/about"
            element={<AboutPage portfolioData={portfolioData} />}
          />
          <Route
            path="/resume"
            element={<ResumePage portfolioData={portfolioData} isViewMode={isViewMode} />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    );
  };

  return (
    <HashRouter>
      <div className="bg-gradient-to-b from-[#eef7fd] via-[#f6fbff] to-[#eef7fd] text-gray-800 font-sans antialiased flex flex-col min-h-screen">
        <Header
          name={portfolioData.name}
          email={portfolioData.contact.email}
          phone={portfolioData.contact.phone}
          github={portfolioData.contact.github}
        />

        <main className="flex-grow">
          <AnimatedRoutes />
        </main>

        <Footer name={portfolioData.name} />
      </div>
    </HashRouter>
  );
};

export default App;