import React, { useState } from 'react';
import { theme } from '../constants/theme';

const NavImage = React.memo(({ title, description, imageUrl }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: '16px',
        background: theme.glass,
        border: `1px solid ${hovered ? theme.primary : theme.glassBorder}`,
        backdropFilter: 'blur(10px)',
        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        transform: hovered ? 'translateY(-8px) scale(1.02)' : 'translateY(0)',
        boxShadow: hovered ? `0 20px 40px -15px ${theme.primary}33` : 'none',
        maxWidth: '30rem',
        overflow: 'hidden',
      }}
    >
      <div style={{ width: '100%', height: '20rem', overflow: 'hidden' }}>
        <img
          src={imageUrl}
          alt={title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.6s ease',
            transform: hovered ? 'scale(1.1)' : 'scale(1)',
            opacity: hovered ? 1 : 0.8,
          }}
        />
      </div>
      <div style={{ padding: '1.5rem' }}>
        <h3 style={{ margin: '0 0 0.5rem 0', color: hovered ? theme.primary : theme.text }}>{title}</h3>
        <p style={{ margin: 0, color: theme.subtext, fontSize: '0.9rem', lineHeight: '1.6' }}>{description}</p>
      </div>
    </div>
  );
});

export default NavImage;