import React, { useState, useEffect } from 'react';
import { theme } from '../constants/theme';

export default function DecodingText({ text }) {
  const [displayedText, setDisplayedText] = useState('');
  const [phase, setPhase] = useState('typing');

  useEffect(() => {
    setDisplayedText('');
    setPhase('typing');
  }, [text]);

  useEffect(() => {
    let timeout;
    
    if (phase === 'typing') {
      if (displayedText.length < text.length) {
        const totalDuration = Math.max(0.6, text.length * 0.1);
        const timePerChar = (totalDuration * 1000) / text.length;

        timeout = setTimeout(() => {
          setDisplayedText(text.slice(0, displayedText.length + 1));
        }, timePerChar);
      } else {
        setPhase('blinking');
        setTimeout(() => {
          setPhase('done');
        }, 1200);
      }
    }
    
    return;
  }, [displayedText, phase, text]);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <span style={{ opacity: phase === 'typing' ? 0.8 : 1, color: theme.subtext }}>
        {displayedText}
      </span>
      
      <span
        style={{
          borderLeft: phase === 'done' ? 'none' : `2px solid ${theme.primary}`,
          animation: phase === 'blinking' ? 'cursorBlink 0.8s steps(1) 3' : 'none',
          marginLeft: '2px',
        }}
      >
        &#8203;
      </span>
    </div>
  );
}