import React from 'react';
import DecodingText from '../components/DecodingText';
import { theme } from '../constants/theme';

export default function Skills() {
  return (
    <div style={{
      textAlign: 'center',
      maxWidth: '600px',
      margin: '0 auto',
      padding: '2rem',
    }}>
      <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1.5rem', color: theme.primary }}>SKILLS</h2>
      <div style={{ textAlign: 'left', fontSize: '1.2rem', color: theme.text, display: 'flex', flexDirection: 'column', alignItems: 'left', gap: '2rem', padding: '4vh 0 20vh 0' }}>
        <div style={{
          padding: '1.5rem',
          borderRadius: '16px',
          background: theme.glass,
          border: `1px solid ${theme.glassBorder}`,
          borderLeft: `4px solid ${theme.primary}`,
          backdropFilter: 'blur(10px)',
          transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          transform: 'translateY(0)',
          cursor: 'default',
          position: 'relative',
          zIndex: 2,
          flex: '1 1 0',

        }}
        >
        <DecodingText text="Programming" />
          <ul>
            <li>HTML/CSS/Javascript</li>
            <li>React</li>
            <li>Node.js</li>
            <li>Java</li>
            <li>C#</li>
            <li>C++</li>
          </ul>
        </div>
                <div style={{
          padding: '1.5rem',
          borderRadius: '16px',
          background: theme.glass,
          border: `1px solid ${theme.glassBorder}`,
          borderLeft: `4px solid ${theme.primary}`,
          backdropFilter: 'blur(10px)',
          transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          transform: 'translateY(0)',
          cursor: 'default',
          position: 'relative',
          zIndex: 2,
          flex: '1 1 0',
        }}
        >
        <DecodingText text="Design" />
          <ul>
            <li>Fusion 360</li>
            <li>Onshape</li>
            <li>Photoshop</li>
            <li>Illustrator</li>
          </ul>
          </div>
                  <div style={{
          padding: '1.5rem',
          borderRadius: '16px',
          background: theme.glass,
          border: `1px solid ${theme.glassBorder}`,
          borderLeft: `4px solid ${theme.primary}`,
          backdropFilter: 'blur(10px)',
          transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          transform: 'translateY(0)',
          cursor: 'default',
          position: 'relative',
          zIndex: 2,
          flex: '1 1 0',
        }}
        >
        <DecodingText text="Cello" />
          <ul>
            <li>Classical performance</li>
            <li>Chamber music</li>
          </ul>
          </div>
      </div>
    </div>
  );
}