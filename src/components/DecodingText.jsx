import React, { useState } from 'react';
import { theme } from '../constants/theme';

export default function DecodingText({ text }) {
  const [phase, setPhase] = useState('typing');
  const duration = Math.max(0.6, text.length * 0.1);

  return (
    <div style={{ position: 'relative', display: 'inline-block', '--char-count': text.length }}>
      <span style={{ opacity: phase === 'typing' ? 0.8 : 1, color: theme.subtext }}>{text}</span>
      <div
        onAnimationEnd={() => {
          setPhase('blinking');
          setTimeout(() => setPhase('done'), 1200);
        }}
        style={{
          position: 'absolute',
          inset: 0,
          background: theme.bg,
          left: phase === 'typing' ? '0%' : '100%',
          animation: phase === 'typing' ? `revealSteps ${duration}s steps(var(--char-count)) forwards` : phase === 'blinking' ? 'cursorBlink 0.8s steps(1) 3' : 'none',
          borderLeft: phase === 'done' ? 'none' : `2px solid ${theme.primary}`,
        }}
      />
    </div>
  );
}