import React from 'react';
import MagneticButton from './MagneticButton';
import { theme } from '../constants/theme';

export default function Navbar({ setPage, currentPage }) {
  return (
    <nav style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      position: 'relative',
      zIndex: 10,
      flexWrap: 'wrap',
      gap: '0.5rem'
    }}>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        {['home', 'projects', 'skills', 'about'].map((item) => (
          <MagneticButton 
            key={item} 
            onClick={() => setPage(item)} 
            active={currentPage === item}
          >
            {item}
          </MagneticButton>
        ))}
      </div>
    </nav>
  );
}