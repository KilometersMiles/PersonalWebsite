import React, { useState } from 'react';
import { theme } from '../constants/theme';

const NavCard = React.memo(({ title, description }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '2rem',
        borderRadius: '16px',
        background: theme.glass,
        border: `1px solid ${hovered ? theme.primary : theme.glassBorder}`,
        backdropFilter: 'blur(10px)',
        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        transform: hovered ? 'translateY(-5px) scale(1.02)' : 'translateY(0)',
        boxShadow: hovered ? `0 10px 30px -10px ${theme.primary}44` : 'none',
        maxWidth: '300px',
        cursor: 'default',
        position: 'relative',
        zIndex: 2,
      }}
    >
      <h3 style={{ margin: '0 0 1rem 0', color: hovered ? theme.primary : theme.text }}>
        {title}
      </h3>
      <p style={{ margin: 0, color: theme.subtext, fontSize: '0.9rem', lineHeight: '1.6' }}>
        {description}
      </p>
    </div>
  );
});

export default NavCard;