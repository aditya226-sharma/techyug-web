import React, { useEffect, useRef, useState } from 'react';
import { Globe } from 'lucide-react';

interface ThreatPin {
  name: string;
  x: number;
  y: number;
  intensity: number;
  size: number;
  active: boolean;
}

const GLOBAL_NODES: ThreatPin[] = [
  { name: "Mumbai Node", x: 0.68, y: 0.58, intensity: 0.8, size: 8, active: true },
  { name: "New York Node", x: 0.28, y: 0.38, intensity: 0.6, size: 6, active: true },
  { name: "London Node", x: 0.48, y: 0.32, intensity: 0.4, size: 5, active: true },
  { name: "Tokyo Node", x: 0.84, y: 0.42, intensity: 0.9, size: 9, active: true },
  { name: "Sydney Node", x: 0.88, y: 0.82, intensity: 0.3, size: 4, active: true }
];

export const RiskHeatmap: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [liveAttacks, setLiveAttacks] = useState<string[]>(["Mumbai Node: Intercepted Cyberbullying [BERT]", "Tokyo Node: Blocked Grooming heuristic [GRU]"]);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = 0;

    const resizeCanvas = () => {
      canvas.width = containerRef.current?.clientWidth || 500;
      canvas.height = 220;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Procedural world dot matrix representation coordinates
    const generateWorldDots = () => {
      const dots: { x: number; y: number }[] = [];
      const rows = 28;
      const cols = 60;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          // Simple math function to simulate outline maps of continents
          const x = c / cols;
          const y = r / rows;

          // Simple land mass bounding calculations
          const isLand = (
            // North America
            (x > 0.12 && x < 0.32 && y > 0.2 && y < 0.52) ||
            // South America
            (x > 0.22 && x < 0.36 && y > 0.52 && y < 0.88) ||
            // Eurasia / Africa
            (x > 0.42 && x < 0.86 && y > 0.15 && y < 0.55) ||
            (x > 0.46 && x < 0.62 && y > 0.55 && y < 0.82) ||
            // Australia
            (x > 0.78 && x < 0.92 && y > 0.68 && y < 0.88)
          ) && !(
            // Cut out oceans
            (x > 0.28 && x < 0.42 && y > 0.15 && y < 0.88) ||
            (x > 0.36 && x < 0.45 && y > 0.52 && y < 0.88)
          );

          if (isLand) {
            dots.push({ x, y });
          }
        }
      }
      return dots;
    };

    const mapDots = generateWorldDots();

    // Spawn cyber attack rays
    const attackRays: {
      startX: number;
      startY: number;
      curX: number;
      curY: number;
      targetX: number;
      targetY: number;
      progress: number;
      color: string;
    }[] = [];

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw Grid Matrix Background
      ctx.fillStyle = 'rgba(0, 240, 255, 0.08)';
      mapDots.forEach((dot) => {
        ctx.beginPath();
        ctx.arc(dot.x * canvas.width, dot.y * canvas.height, 1.2, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw Threat Node Pins
      GLOBAL_NODES.forEach((node) => {
        const px = node.x * canvas.width;
        const py = node.y * canvas.height;
        const pulse = 1 + Math.sin(time * 0.1 + node.size) * 0.4;

        // Outer pulse circle
        ctx.strokeStyle = node.intensity > 0.7 ? 'rgba(255, 0, 85, 0.4)' : 'rgba(0, 240, 255, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(px, py, node.size * pulse * 2, 0, Math.PI * 2);
        ctx.stroke();

        // Inner solid core
        ctx.fillStyle = node.intensity > 0.7 ? '#ff0055' : '#00f0ff';
        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fill();
      });

      // Manage attack ray conduits
      if (Math.random() < 0.05 && attackRays.length < 8) {
        const start = GLOBAL_NODES[Math.floor(Math.random() * GLOBAL_NODES.length)];
        const dest = GLOBAL_NODES[Math.floor(Math.random() * GLOBAL_NODES.length)];
        if (start !== dest) {
          attackRays.push({
            startX: start.x * canvas.width,
            startY: start.y * canvas.height,
            curX: start.x * canvas.width,
            curY: start.y * canvas.height,
            targetX: dest.x * canvas.width,
            targetY: dest.y * canvas.height,
            progress: 0,
            color: start.intensity > 0.7 ? '#ff0055' : '#bd00ff'
          });
        }
      }

      for (let i = attackRays.length - 1; i >= 0; i--) {
        const ray = attackRays[i];
        ray.progress += 0.02;

        // Calculate current position along quadratic bezier curve
        const t = ray.progress;
        const midX = (ray.startX + ray.targetX) / 2;
        const midY = (ray.startY + ray.targetY) / 2 - 40; // Curve height offset

        // Quadratic bezier equation
        const x = (1 - t) * (1 - t) * ray.startX + 2 * (1 - t) * t * midX + t * t * ray.targetX;
        const y = (1 - t) * (1 - t) * ray.startY + 2 * (1 - t) * t * midY + t * t * ray.targetY;

        ctx.strokeStyle = ray.color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(ray.startX, ray.startY);
        ctx.quadraticCurveTo(midX, midY, x, y);
        ctx.stroke();

        // Glowing tracer dot
        ctx.fillStyle = '#f3f4f6';
        ctx.shadowColor = ray.color;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0; // Reset

        if (t >= 1) {
          attackRays.splice(i, 1);
        }
      }

      time += 1;
      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  // Update live threat log list simulation
  useEffect(() => {
    const list = [
      "Mumbai Node: Blocked Toxic harassment [BERT]",
      "New York Node: Flagged Suspicious grooming DM [GRU]",
      "London Node: Blocked Financial Phishing link [Autoencoder]",
      "Tokyo Node: Intercepted Inappropriate image attachment [CNN]",
      "Sydney Node: Deflected Cyberbullying chat thread [BERT]"
    ];

    const interval = setInterval(() => {
      const active = [
        list[Math.floor(Math.random() * list.length)],
        list[Math.floor(Math.random() * list.length)]
      ];
      setLiveAttacks(active);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hud-card glass-panel risk-heatmap-card">
      <div className="card-header">
        <div className="icon-container danger">
          <Globe className="glow-icon" />
        </div>
        <div>
          <h3>Live AI Risk Heatmap</h3>
          <span className="card-subtitle">Global Threat Deflection Grid</span>
        </div>
      </div>

      <div className="heatmap-body">
        <div ref={containerRef} className="heatmap-canvas-container" style={{ background: 'rgba(0,0,0,0.15)', borderRadius: '8px', overflow: 'hidden' }}>
          <canvas ref={canvasRef} />
        </div>
        
        {/* Real-time feed logs */}
        <div className="live-attack-ticker" style={{ marginTop: '14px', background: 'rgba(255,0,85,0.02)', padding: '10px', borderRadius: '6px', border: '1px solid rgba(255,0,85,0.1)' }}>
          <span className="info-label" style={{ color: 'var(--color-danger)', fontSize: '10px', textTransform: 'uppercase', fontFamily: 'var(--font-hud)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="pulse-dot" style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#ff0055' }} />
            Active AI Interdictions
          </span>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px', marginTop: '6px', flexWrap: 'wrap' }}>
            {liveAttacks.map((log, idx) => (
              <span key={idx} style={{ fontFamily: 'var(--font-hud)', fontSize: '11px', color: '#f3f4f6' }}>
                🟢 {log}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
