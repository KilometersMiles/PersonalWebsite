import React from 'react';
import DecodingText from '../components/DecodingText';
import { theme } from '../constants/theme';

export default function Home() {
  return (
    <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
      <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 4rem)', fontWeight: '800', letterSpacing: '-1px', marginBottom: '1rem' }}>
        MILES <span style={{ color: theme.primary, filter: 'drop-shadow(8px 8px 10px rgba(0, 0, 0, 0.5))' }}>HIGGINSON</span>
      </h1>
      <div style={{ color: theme.subtext, fontSize: '1.25rem', maxWidth: '500px', margin: '0 auto' , filter: 'drop-shadow(8px 8px 10px rgba(0, 0, 0, 0.5))'}}>
        <DecodingText text="Robotics nerd. Cello player." />
      </div>
    </div>
  );
}