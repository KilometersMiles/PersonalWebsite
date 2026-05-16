import React from 'react';
import NavCard from '../components/NavCard'; // Assuming you kept NavCard logic
import NavImage from '../components/NavImage';
import ScrollRevealItem from '../components/ScrollRevealItem'; // Logic from original useEffect
import { theme } from '../constants/theme';

//import images
import Adrian from '../assets/Adrian Take 2.png';
import FlashPoly from '../assets/FlashPoly.png';
import WhipWeave from '../assets/WhipWeave.png';
import Chopin from '../assets/Frederic_Chopin_photo.png';
import Flowers from '../assets/Wildflower-meadow-garden 2.png';
import WordArtRosty from '../assets/WordArtRosty.png';

const projects = [
  { title: 'Commercial Art Projects', desc: '', type: 'card' },
  { title: 'Adrian', desc: 'A stunning remake of humanity-saving planet', type: 'image', url: Adrian },
  { title: 'PolySunset', desc: 'Geometric sunset and friend', type: 'image', url: FlashPoly },
  { title: 'WhipWeave', desc: 'A classic painting turned into a basket', type: 'image', url: WhipWeave },
  { title: 'Chopin', desc: 'Colorized musical master', type: 'image', url: Chopin },
  { title: 'Flowers', desc: 'A pop of color to a field', type: 'image', url: Flowers },
  { title: 'Rostropovitch', desc: 'Words to describe a master', type: 'image', url: WordArtRosty },
];

export default function Projects() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6rem', padding: '5vh 0 20vh 0' }}>
      {projects.map((proj, i) => (
        <div>
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
  );
}