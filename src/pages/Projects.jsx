import React from 'react';
import NavCard from '../components/NavCard';
import NavImage from '../components/NavImage';
import { theme } from '../constants/theme';

const projects = [
  {
    title: 'FTC Path Follower',
    desc: 'A unique path follower for FTC robots, using LQR control to quickly and accurately follow trajectories. Visualizer and optimizer in progress.',
    url: '/assets/VisualizerScreenshot.png',
    type: 'image'
  },
  {
    title: 'Portfolio Site',
    desc: 'This site! Built with React and custom CSS, featuring a dynamic background and electric buttons.',
    url: '/assets/PortfolioScreenshot.png',
    type: 'image'
  },
  {
    title: 'Aluminum Falcons Website',
    desc: 'Aluminum Falcons team site. Check it out at aluminumfalcons.com',
    url: '/assets/AluminumScreenshot.png',
    type: 'image'
  },
];

export default function Projects() {
  return (
    <div style={{
      textAlign: 'center',
      margin: '0 auto',
      padding: '1rem',
      maxWidth: '1200px'
    }}>
      <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1.5rem', color: theme.primary }}>PROJECTS</h2>
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'stretch',
        gap: '2rem',
        padding: '2vh 0 10vh 0'
      }}>
        {projects.map((proj) => (
          <div key={proj.title} style={{ flex: '1 1 300px', maxWidth: '100%' }}>
            {proj.type === 'card' ? (
              <div style={{ padding: '2rem', borderRadius: '16px', background: theme.glass, border: `1px solid ${theme.glassBorder}`, color: theme.text }}>
                <h3>{proj.title}</h3>
              </div>
            ) : (
              <NavImage title={proj.title} description={proj.desc} imageUrl={proj.url} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}