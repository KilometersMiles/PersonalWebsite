import React from 'react';
import MagneticButton from './MagneticButton';
import { theme } from '../constants/theme';

export default function Navbar({ setPage, currentPage }) {
  return (
    <nav style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '1.5rem 4rem',
      position: 'relative',
      zIndex: 10,
    }}>
        {/* Left side can be a logo or initials */}
      {/* <div 
        onClick={() => setPage('home')}
        style={{ color: theme.primary, fontWeight: 'bold', cursor: 'pointer', fontSize: '1.2rem' }}
      >
        MH
      </div> */}
        <div>  </div>

      <div style={{ display: 'flex', gap: '1rem' }}>
        {['home', 'projects', 'about'].map((item) => (
          <MagneticButton 
            key={item} 
            onClick={() => setPage(item)} 
            active={currentPage === item}
          >
            {item}
          </MagneticButton>
        ))}
      </div>
      
      <div style={{ width: '40px' }} /> {/* Visual spacer to help centering */}
    </nav>
  );
}