import React, { useState } from 'react';

export default function MagneticItem({ children }) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const { clientX, clientY, currentTarget } = e;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const x = (clientX - (left + width / 2)) * 0.05; // Subtler strength than the button
    const y = (clientY - (top + height / 2)) * 0.05;
    setOffset({ x, y });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setOffset({ x: 0, y: 0 })}
      style={{
        transform: `translate(${offset.x}px, ${offset.y}px)`,
        transition: offset.x === 0 ? 'all 0.5s cubic-bezier(0.23, 1, 0.32, 1)' : 'none',
      }}
    >
      {children}
    </div>
  );
}