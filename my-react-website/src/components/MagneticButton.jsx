import React, { useState } from 'react';
import { theme } from '../constants/theme';

const MagneticButton = ({ children, onClick, active }) => {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    const { clientX, clientY, currentTarget } = e;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    // 0.15 is a nice middle ground for magnetic strength
    const x = (clientX - (left + width / 2)) * 0.15;
    const y = (clientY - (top + height / 2)) * 0.15;
    setOffset({ x, y });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setOffset({ x: 0, y: 0 });
    setIsHovered(false);
  };

  // The electric blue color from your theme or a brighter variant
  const electricBlue = "#7dd3fc"; 

  return (
    <>
      {/* 1. THE FILTER DEFINITION (Hidden) */}
      <svg style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }}>
        <filter id="electric-glow">
          <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="1" seed="1">
            <animate attributeName="seed" from="1" to="100" dur="2.5s" repeatCount="indefinite" />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" scale="5" />
        </filter>
      </svg>

      {/* 2. THE BUTTON */}
      <button
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
        style={{
          position: 'relative',
          transform: `translate(${offset.x}px, ${offset.y}px)`,
          transition: offset.x === 0 ? 'all 0.5s cubic-bezier(0.23, 1, 0.32, 1)' : 'none',
          background: active ? 'rgba(56, 189, 248, 0.1)' : 'transparent',
          border: `1px solid ${active ? theme.primary : 'rgba(255, 255, 255, 0.15)'}`,
          backdropFilter: 'blur(8px)',
          padding: '8px 20px',
          borderRadius: '12px',
          color: active ? theme.primary : theme.text,
          cursor: 'pointer',
          textTransform: 'capitalize',
          fontWeight: '600',
          fontSize: '0.9rem',
          outline: 'none',
          overflow: 'visible', // Critical for the bolt to be seen
        }}
      >
        <span style={{ position: 'relative', zIndex: 2 }}>{children}</span>

        {/* 3. THE ELECTRIC BOLT LAYER */}
        <div
          style={{
            position: 'absolute',
            inset: '-1px', // Sits perfectly over the border
            borderRadius: '12px',
            border: `2px solid ${electricBlue}`,
            pointerEvents: 'none',
            opacity: isHovered || active ? 1 : 0,
            filter: 'url(#electric-glow)',
            boxShadow: `0 0 10px ${theme.primary}, inset 0 0 5px ${theme.primary}`,
            transition: 'opacity 0.3s ease',
            zIndex: 1,
          }}
        />
      </button>
    </>
  );
};

export default MagneticButton;