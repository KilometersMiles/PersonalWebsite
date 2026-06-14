import React, { useState } from 'react';
import DecodingText from '../components/DecodingText';
import { theme } from '../constants/theme';

export default function Skills() {
  // Track card hover using index
  const [hoveredCard, setHoveredCard] = useState(null);

  const cardStyle = (index) => ({
    padding: '2rem',
    borderRadius: '16px',
    background: theme.glass,
    border: `1px solid ${hoveredCard === index ? theme.primary : theme.glassBorder}`,
    borderLeft: `${hoveredCard === index ? '8px' : '4px'} solid ${theme.primary}`,
    backdropFilter: 'blur(10px)',
    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    transform: hoveredCard === index ? 'translateX(5px)' : 'translateX(0)',
    boxShadow: hoveredCard === index ? `0 10px 30px -10px ${theme.primary}44` : 'none',
    cursor: 'default',
    position: 'relative',
    zIndex: 2,
    flex: '1 1 0',
  });

  return (
    <div style={{
      textAlign: 'center',
      maxWidth: '600px',
      margin: '0 auto',
      padding: '2rem',
    }}>
      <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1.5rem', color: theme.primary }}>SKILLS</h2>
      <div style={{ textAlign: 'left', fontSize: '1.2rem', color: theme.text, display: 'flex', flexDirection: 'column', alignItems: 'left', gap: '2rem', padding: '4vh 0 20vh 0' }}>
        <div style={cardStyle(0)} onMouseEnter={() => setHoveredCard(0)}
          onMouseLeave={() => setHoveredCard(null)}

        >
          <DecodingText text="Programming" />
          <ul>
            <li className="skill-item">HTML/CSS/Javascript</li>
            <li className="skill-item">React</li>
            <li className="skill-item">Node.js</li>
            <li className="skill-item">Java</li>
            <li className="skill-item">C#</li>
            <li className="skill-item">C++</li>
          </ul>
        </div>
        <div style={cardStyle(1)} onMouseEnter={() => setHoveredCard(1)}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <DecodingText text="Design" />
          <ul>
            <li className='skill-item'>Fusion 360</li>
            <li className='skill-item'>Onshape</li>
            <li className='skill-item'>Photoshop</li>
            <li className='skill-item'>Illustrator</li>
          </ul>
        </div>
        <div style={cardStyle(2)} onMouseEnter={() => setHoveredCard(2)}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <DecodingText text="Cello" />
          <ul>
            <li className='skill-item'>Classical performance</li>
            <li className='skill-item'>Chamber music</li>
          </ul>
        </div>
      </div>
    </div>
  );
}