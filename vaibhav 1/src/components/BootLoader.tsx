import React, { useState, useEffect } from 'react';
import { Shield, Cpu } from 'lucide-react';
import { soundSynth } from '../services/soundSynth';

interface BootLoaderProps {
  onBootComplete: () => void;
}

const BOOT_LOGS = [
  { p: 0, text: "SYS: Initializing BalKavach cyber cockpit..." },
  { p: 15, text: "SYS: Spinning WebGL rendering context..." },
  { p: 30, text: "AI: Loading BERT NLP vocabulary matrices..." },
  { p: 48, text: "AI: Spinning up Gated Recurrent Units (GRU)..." },
  { p: 65, text: "AI: Map convolutional visual layers (CNN)..." },
  { p: 80, text: "SYS: Syncing decentralized parents registry..." },
  { p: 95, text: "KAVACH: Decryption check: Secure E2EE handshake." },
  { p: 100, text: "KAVACH: ALL SYSTEMS ACTIVE. DEFENSIVE GRID SHIELD ARMED." }
];

export const BootLoader: React.FC<BootLoaderProps> = ({ onBootComplete }) => {
  const [progress, setProgress] = useState(0);
  const [activeLogs, setActiveLogs] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isBooted, setIsBooted] = useState(false);

  useEffect(() => {
    // Lock scroll of body
    document.body.style.overflow = 'hidden';

    let logIdx = 0;
    const interval = setInterval(() => {
      setProgress(prev => {
        const next = Math.min(100, prev + Math.floor(Math.random() * 8) + 2);
        
        // Push log entries corresponding to progress percentages
        while (logIdx < BOOT_LOGS.length && next >= BOOT_LOGS[logIdx].p) {
          setActiveLogs(logs => [...logs, BOOT_LOGS[logIdx].text]);
          logIdx++;
        }

        if (next >= 100) {
          clearInterval(interval);
          setIsLoaded(true);
        }
        return next;
      });
    }, 150);

    return () => {
      // Clean up body overflow override
      document.body.style.overflow = '';
      clearInterval(interval);
    };
  }, []);

  const handleExecuteBoot = () => {
    soundSynth.playBoot();
    setIsBooted(true);
    
    // Delay transition animation to allow fade
    setTimeout(() => {
      document.body.style.overflow = '';
      onBootComplete();
    }, 850);
  };

  if (isBooted) {
    return (
      <div 
        className="boot-loader-container booted"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(3, 7, 18, 0.95)',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 0.8s cubic-bezier(0.85, 0, 0.15, 1), opacity 0.8s ease',
          transform: 'translateY(-100%)',
          opacity: 0,
          pointerEvents: 'none'
        }}
      />
    );
  }

  return (
    <div 
      className="boot-loader-container"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: '#030712',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-hud)',
        padding: '20px'
      }}
    >
      {/* Glitch Grid matrix backplate */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: 0.05,
          background: 'linear-gradient(rgba(0,240,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,0.1) 1px, transparent 1px)',
          backgroundSize: '30px 30px',
          pointerEvents: 'none'
        }}
      />

      <div style={{ zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '550px', width: '100%', textAlign: 'center' }}>
        {/* Core Pulsing Icon */}
        <div style={{
          width: '90px',
          height: '90px',
          borderRadius: '50%',
          border: '1px solid rgba(0,240,255,0.3)',
          boxShadow: '0 0 20px rgba(0,240,255,0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '30px',
          background: 'rgba(0,0,0,0.3)'
        }}>
          {isLoaded ? (
            <Shield size={38} className="logo-icon glow-icon" style={{ color: 'var(--color-primary)' }} />
          ) : (
            <Cpu size={38} className="logo-icon glow-icon" style={{ color: 'var(--color-secondary)' }} />
          )}
        </div>

        {/* Boot title */}
        <h2 style={{ fontSize: '24px', letterSpacing: '3px', textTransform: 'uppercase', color: '#fff', textShadow: 'var(--glow-primary)', marginBottom: '8px' }}>
          BalKavach Security OS
        </h2>
        <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)', letterSpacing: '1px', textTransform: 'uppercase' }}>
          SYSTEM BOOT SEQUENCE REVISION 2.6
        </span>

        {/* Progress bar */}
        <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', margin: '30px 0 20px 0', position: 'relative', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg, var(--color-secondary), var(--color-primary))', boxShadow: 'var(--glow-primary)', transition: 'width 0.1s ease' }} />
        </div>

        {/* Percentage text */}
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: '14px', marginBottom: '30px' }}>
          <span>TELEMETRY SYNC STATUS</span>
          <span style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>{progress}%</span>
        </div>

        {/* Simulated logs panel */}
        <div 
          style={{
            width: '100%',
            height: '160px',
            background: 'rgba(0,0,0,0.4)',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '8px',
            padding: '16px',
            textAlign: 'left',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            scrollbarWidth: 'none',
            fontSize: '11px',
            color: 'var(--color-text-secondary)'
          }}
        >
          {activeLogs.map((log, idx) => (
            <div key={idx} style={{ 
              color: idx === activeLogs.length - 1 ? 'var(--color-primary)' : 'var(--color-text-secondary)',
              textShadow: idx === activeLogs.length - 1 ? 'var(--glow-primary)' : 'none'
            }}>
              {log}
            </div>
          ))}
        </div>

        {/* Big Boot Action Button */}
        {isLoaded && (
          <button
            onClick={handleExecuteBoot}
            className="hud-btn-primary animated-fade-in"
            style={{
              marginTop: '30px',
              padding: '14px 38px',
              fontSize: '15px',
              letterSpacing: '2.5px',
              background: 'var(--color-accent)',
              color: '#030712',
              boxShadow: 'var(--glow-accent)',
              animation: 'pulse-node 1.2s infinite alternate',
              border: 'none',
              borderRadius: '4px'
            }}
          >
            EXECUTE COCKPIT BOOT
          </button>
        )}
      </div>
    </div>
  );
};
export default BootLoader;
