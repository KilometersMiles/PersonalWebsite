import React from 'react';
import DecodingText from '../components/DecodingText';
import { theme } from '../constants/theme';

export default function Home() {
  return (
    <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
      <h1 style={{ fontSize: '4rem', fontWeight: '800', letterSpacing: '-2px', marginBottom: '1rem' }}>
        MILES <span style={{ color: theme.primary }}>HIGGINSON</span>
      </h1>
      <div style={{ color: theme.subtext, fontSize: '1.25rem', maxWidth: '500px', margin: '0 auto' }}>
        <DecodingText text="Robotics nerd. Cello player" />
      </div>
    </div>
  );
}