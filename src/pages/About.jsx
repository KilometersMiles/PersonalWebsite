import React from 'react';
import DecodingText from '../components/DecodingText';
import { theme } from '../constants/theme';

export default function About() {
  return (
    <div style={{
      textAlign: 'center',
      maxWidth: '600px',
      margin: '0 auto',
      padding: '2rem',
    }}>
      <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1.5rem', color: theme.primary}}>ABOUT</h2>
      <p style={{ color: theme.subtext, lineHeight: '1.8', fontSize: '1.1rem' }}>
        I am a cellist in Salt Lake City, Utah. I am also a member of the FTC Robotics Team 17230 Aluminum Falcons. 
      </p>
      
      <div style={{ margin: '2rem 0' }}>
        <DecodingText text="Pretty cool stuff" />
      </div>

      <h2 style={{ fontSize: '1.5rem', marginTop: '3rem' }}>Contact</h2>
      <p style={{ color: theme.primary, fontSize: '1.1rem', cursor: 'pointer' }}>
        miles.l.higginson@gmail.com
      </p>
    </div>
  );
}