import React, { useEffect, useRef } from 'react';
import NavCard from '../components/NavCard'; 
import NavImage from '../components/NavImage';
import { theme } from '../constants/theme';

//import images
import Adrian from '../assets/Adrian Take 2.png';
import FlashPoly from '../assets/FlashPoly.png';
import WhipWeave from '../assets/WhipWeave.png';
import Chopin from '../assets/Frederic_Chopin_photo.png';
import Flowers from '../assets/Wildflower-meadow-garden 2.png';
import WordArtRosty from '../assets/WordArtRosty.png';

const projects = [
  { title: 'FTC Path Follower', desc: 'A unique path follower for FTC robots, using LQR control to quicly and accurately follow trajectories. Visualizer and optimizer in progress.', url: 'https://previews.123rf.com/images/kchung/kchung1610/kchung161001354/64508202-test-written-by-hand-hand-writing-on-transparent-board-photo.avif', type: 'image'},
  { title: 'Portfolio Site', desc: 'This site! Built with React and custom CSS, featuring a dynamic background and eletric buttons.', url: '', type: 'image'},
  { title: 'Aluminum Falcons Website', desc: 'Aluminum Falcons team site. Check it out at aluminumfalcons.com', url: '', type: 'image'},

];

export default function Projects() {
  return (
    <div style={{
      textAlign: 'center',
      margin: '0 auto',
      padding: '2rem',
    }}>
      <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1.5rem', color: theme.primary}}>PROJECTS</h2>
      <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: '3rem', padding: '5vh 0 20vh 0' }}>
        {projects.map((proj, i) => (
          <div key={proj.title}>
          {/* <ScrollRevealItem key={proj.title} delay={i * 0.1}> */}
            {proj.type === 'card' ? (
              <div style={{ padding: '2rem', borderRadius: '16px', background: theme.glass, border: `1px solid ${theme.glassBorder}`, color: theme.text }}>
                <h3>{proj.title}</h3>
              </div>
            ) : (
              <NavImage title={proj.title} description={proj.desc} imageUrl={proj.url} />
            )}
          {/* </ScrollRevealItem> */}
          </div>
        ))}
      </div>
    </div>
  );
}