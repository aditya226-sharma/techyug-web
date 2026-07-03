// DigitalRain.tsx - Multilingual Matrix Digital Rain Background Canvas
import React, { useEffect, useRef } from 'react';

const CHARS = "010101ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789अकतमकகதநசம";

export const DigitalRain: React.FC = React.memo(() => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize columns
    const fontSize = 14;
    const columns = Math.ceil(canvas.width / fontSize);
    const rainDrops = new Array(columns).fill(1).map(() => Math.floor(Math.random() * -100)); // Spawn offscreen

    const draw = () => {
      // Draw semi-transparent black background to create trail effect
      ctx.fillStyle = 'rgba(3, 7, 18, 0.09)'; // Mapped to var(--color-bg)
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `bold ${fontSize}px "Share Tech Mono", monospace`;

      for (let i = 0; i < rainDrops.length; i++) {
        // Random character from set
        const char = CHARS.charAt(Math.floor(Math.random() * CHARS.length));

        // Draw character
        const x = i * fontSize;
        const y = rainDrops[i] * fontSize;

        // Head is white/cyan, body is faded cyan/purple
        if (rainDrops[i] <= 0) {
          // Offscreen update
        } else {
          const isHead = Math.random() > 0.98;
          ctx.fillStyle = isHead ? '#ffffff' : Math.random() > 0.5 ? 'rgba(0, 240, 255, 0.18)' : 'rgba(189, 0, 255, 0.08)';
          
          if (isHead) {
            ctx.shadowColor = '#00f0ff';
            ctx.shadowBlur = 8;
          }
          
          ctx.fillText(char, x, y);
          ctx.shadowBlur = 0; // Reset
        }

        // Reset drop to top if it reaches bottom
        if (y > canvas.height && Math.random() > 0.975) {
          rainDrops[i] = 0;
        }

        rainDrops[i]++;
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        pointerEvents: 'none',
        opacity: 0.8
      }}
    />
  );
});

DigitalRain.displayName = 'DigitalRain';
