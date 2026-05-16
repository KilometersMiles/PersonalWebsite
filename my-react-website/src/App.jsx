import React, { useState, useEffect } from 'react';
import Home from './pages/Home';
import Projects from './pages/Projects';
import About from './pages/About';
import MagneticButton from './components/MagneticButton';
import NavBar from './components/NavBar';
import AtmosphericBackground from './components/AtmosphericBackground';
import { theme } from './constants/theme';
import './style.css';

export default function App() {
  const [page, setPage] = useState('home');

  useEffect(() => {
    const handleMouseMove = (e) => {
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const renderContent = () => {
    switch (page) {
      case 'projects': return <Projects />;
      case 'about': return <About />;
      default: return <Home />;
    }
  };

  return (
    <div style={{ backgroundColor: theme.bg, color: theme.text, minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      {/* Background Glow */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: `radial-gradient(400px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(56, 189, 248, 0.12), transparent 80%)`
      }} />

      <NavBar setPage={setPage} currentPage={page} />
      <AtmosphericBackground strength={0.1} driftSpeed={0.15} />

      <main key={page} style={{ position: 'relative', zIndex: 5, animation: 'fadeInUp 0.5s ease-out forwards' }}>
        {renderContent()}
      </main>
    </div>
  );
}