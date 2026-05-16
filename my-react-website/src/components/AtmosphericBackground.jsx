import React, { useEffect, useRef } from 'react';

export default function AtmosphericBackground({ 
  strength = 0.2, // Control sensitivity (0.1 to 1.0)
  driftSpeed = 0.4 // Control idle movement speed
}) {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: null, y: null, radius: 150 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        
        // Base position for returning after mouse push
        this.baseX = this.x;
        this.baseY = this.y;

        // Slight random drift velocity
        this.vx = (Math.random() - 0.5) * driftSpeed;
        this.vy = (Math.random() - 0.5) * driftSpeed;

        this.density = (Math.random() * 20) + 1;
        this.color = 'rgba(56, 189, 248, 0.25)';
      }

      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }

      update() {
        // --- Idle Drift ---
        // We move the "base" position slowly so the particle's home is always shifting
        this.baseX += this.vx;
        this.baseY += this.vy;

        // Screen wrap (so particles don't disappear forever)
        if (this.baseX > canvas.width) this.baseX = 0;
        if (this.baseX < 0) this.baseX = canvas.width;
        if (this.baseY > canvas.height) this.baseY = 0;
        if (this.baseY < 0) this.baseY = canvas.height;

        // --- Mouse Interaction ---
        let dx = mouse.current.x - this.x;
        let dy = mouse.current.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < mouse.current.radius) {
          const force = (mouse.current.radius - distance) / mouse.current.radius;
          // Use the strength prop here
          const directionX = (dx / distance) * force * this.density * strength;
          const directionY = (dy / distance) * force * this.density * strength;
          
          this.x -= directionX;
          this.y -= directionY;
        } else {
          // Return to drifting base position
          if (this.x !== this.baseX) {
            let dx = this.x - this.baseX;
            this.x -= dx / 20;
          }
          if (this.y !== this.baseY) {
            let dy = this.y - this.baseY;
            this.y -= dy / 20;
          }
        }
      }
    }

    const init = () => {
      particles = [];
      const numberOfParticles = (canvas.width * canvas.height) / 10000;
      for (let i = 0; i < numberOfParticles; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    window.addEventListener('resize', () => { resize(); init(); });
    window.addEventListener('mousemove', handleMouseMove);
    
    resize();
    init();
    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [strength, driftSpeed]); // Re-init if props change

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1,
      }}
    />
  );
}