// Home.tsx - Premium Immersive Spatial Aegis HUD Cockpit
import React, { useState, useEffect, useRef } from 'react';
import { AegisHUDCanvas } from '../components/AegisHUDCanvas';
import { AIPlayground } from '../components/AIPlayground';
import { LanguageGlobe } from '../components/LanguageGlobe';
import { PhoneSimulator } from '../components/PhoneSimulator';
import { RiskHeatmap } from '../components/RiskHeatmap';
import { AnalyticsCockpit } from '../components/AnalyticsCockpit';
import { JarvisAssistant } from '../components/JarvisAssistant';
import { DigitalRain } from '../components/DigitalRain';
import { soundSynth } from '../services/soundSynth';
import { loadConfig, saveConfig } from '../services/configStore';
import type { BalKavachConfig } from '../services/configStore';
import { Shield, Activity, GraduationCap, HelpCircle, Heart, Star, X } from 'lucide-react';

const TOUR_STEPS = [
  {
    title: "1. Digital Twin Cocoon",
    text: "At the center of your WebGL cockpit floats your child's 3D holographic twin. Visual colors transition to warning amber or critical red as online risk indicators spike.",
    sectionId: "",
    cameraSection: "hero" as const
  },
  {
    title: "2. AI Threat Playground",
    text: "Here you can inject simulated cyberbullying, grooming, or phishing threads to see how token attention weights evaluate intent using SHAP Explainable AI.",
    sectionId: "scanner-section",
    cameraSection: "scanner" as const
  },
  {
    title: "3. Parent Device App Alerts",
    text: "Observe the real-time smartphone device simulator. Warning banners slide down instantly whenever a toxic thread is mitigated, syncing incident logs.",
    sectionId: "alerts-section",
    cameraSection: "alerts" as const
  },
  {
    title: "4. Global Risk Heatmap",
    text: "A live vector threat tracking feed mapping online malicious activities and interceded connections intercepted globally by our ensemble cloud.",
    sectionId: "heatmap-section",
    cameraSection: "radar" as const
  },
  {
    title: "5. Safety Cockpit & Quizzes",
    text: "Monitor weekly safety scores, review behavioral predictive metrics, and complete interactive quizzes in the Safety Learning Hub.",
    sectionId: "analytics-section",
    cameraSection: "analytics" as const
  }
];

export const Home: React.FC = () => {
  const [config, setConfig] = useState<BalKavachConfig>(loadConfig());
  const [activeSection, setActiveSection] = useState<'hero' | 'scanner' | 'radar' | 'alerts' | 'analytics'>('hero');
  const [currentLang, setCurrentLang] = useState('en');
  const [tourStep, setTourStep] = useState<number | null>(null);
  const behaviorCanvasRef = useRef<HTMLCanvasElement>(null);

  // Update config reactively
  useEffect(() => {
    const handleUpdate = () => {
      setConfig(loadConfig());
    };
    window.addEventListener("balkavach-config-update", handleUpdate);
    return () => {
      window.removeEventListener("balkavach-config-update", handleUpdate);
    };
  }, []);

  // Animate Behavior Analytics Wave Graph
  useEffect(() => {
    if (!behaviorCanvasRef.current) return;
    const canvas = behaviorCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let offset = 0;

    const resizeCanvas = () => {
      canvas.width = canvas.parentElement?.clientWidth || 400;
      canvas.height = 160;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const draw = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw background grid lines
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.03)';
      ctx.lineWidth = 1;
      const gridSpacing = 20;
      for (let x = 0; x < canvas.width; x += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw undulating wave 1 (Behavior Baseline)
      ctx.strokeStyle = config.settings3D.colorPrimary;
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i < canvas.width; i++) {
        const y = canvas.height / 2 + 
                  Math.sin(i * 0.01 + offset) * 20 + 
                  Math.cos(i * 0.02 - offset * 0.5) * 8;
        if (i === 0) ctx.moveTo(i, y);
        else ctx.lineTo(i, y);
      }
      ctx.stroke();

      // Draw undulating wave 2 (Emotional Anomaly Scan)
      ctx.strokeStyle = config.settings3D.colorSecondary;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let i = 0; i < canvas.width; i++) {
        const y = canvas.height / 2.2 + 
                  Math.sin(i * 0.015 - offset * 1.2) * 15 + 
                  Math.cos(i * 0.008 + offset * 0.8) * 12;
        if (i === 0) ctx.moveTo(i, y);
        else ctx.lineTo(i, y);
      }
      ctx.stroke();

      // Draw undulating wave 3 (Deflection Boundary)
      ctx.strokeStyle = config.settings3D.colorAccent;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = 0; i < canvas.width; i++) {
        const y = canvas.height / 1.8 + 
                  Math.sin(i * 0.005 + offset * 0.4) * 28;
        if (i === 0) ctx.moveTo(i, y);
        else ctx.lineTo(i, y);
      }
      ctx.stroke();

      offset += 0.04 * config.settings3D.particleSpeed;
      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [config.settings3D.particleSpeed, config.settings3D.colorPrimary, config.settings3D.colorSecondary, config.settings3D.colorAccent]);

  // Handle intersection observer to toggle active camera modes based on scrolling
  useEffect(() => {
    // Only handle scroll tracking if tour is NOT active to prevent conflict
    if (tourStep !== null) return;

    const handleScroll = () => {
      const scrollPos = window.scrollY;
      const height = window.innerHeight;

      if (scrollPos < height * 0.4) {
        setActiveSection('hero');
      } else if (scrollPos >= height * 0.4 && scrollPos < height * 1.2) {
        setActiveSection('scanner');
      } else if (scrollPos >= height * 1.2 && scrollPos < height * 2.0) {
        setActiveSection('radar');
      } else if (scrollPos >= height * 2.0 && scrollPos < height * 2.8) {
        setActiveSection('alerts');
      } else {
        setActiveSection('analytics');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [tourStep]);

  // Handle Guided Tour Steps
  const runTourStep = (stepIdx: number) => {
    setTourStep(stepIdx);
    const step = TOUR_STEPS[stepIdx];
    
    // Position camera dynamically in WebGL canvas
    setActiveSection(step.cameraSection);

    // Scroll to the targeted section
    if (step.sectionId) {
      const el = document.getElementById(step.sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Speak details if speech synthesis is active
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(step.text);
      window.speechSynthesis.speak(utterance);
    }
  };

  const nextTourStep = () => {
    if (tourStep === null) return;
    if (tourStep < TOUR_STEPS.length - 1) {
      runTourStep(tourStep + 1);
    } else {
      // Finish Tour
      setTourStep(null);
      window.speechSynthesis.cancel();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setActiveSection('hero');
    }
  };

  const closeTour = () => {
    setTourStep(null);
    window.speechSynthesis.cancel();
    setActiveSection('hero');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLanguageChange = (langCode: string) => {
    setCurrentLang(langCode);
    const currentConfig = loadConfig();
    if (langCode === 'hi') {
      currentConfig.heroTitle = "बालकवच: एआई चाइल्ड सुरक्षा हड";
      currentConfig.heroSubtitle = "वास्तविक समय साइबर बुलिंग विक्षेपण, हानिकारक सामग्री स्क्रीनिंग, और बहुभाषी खतरे खुफिया बच्चों की रक्षा करना।";
    } else if (langCode === 'en') {
      currentConfig.heroTitle = "BalKavach: AI Child Security HUD";
      currentConfig.heroSubtitle = "Real-time cyberbullying deflection, harmful content screening, and multilingual threat intelligence protecting children in cyberspace.";
    } else if (langCode === 'ta') {
      currentConfig.heroTitle = "பால்கவாச்: ஏஐ குழந்தை பாதுகாப்பு";
      currentConfig.heroSubtitle = "குழந்தைகளின் இணைய பாதுகாப்பிற்கான நிகழ்நேர செயற்கை நுண்ணறிவு பகுப்பாய்வு மற்றும் பாதுகாப்பு தற்காப்பு.";
    } else {
      currentConfig.heroTitle = "BalKavach: AI child Protection Cockpit";
      currentConfig.heroSubtitle = "AI based multi-modal safety scanner monitoring and deflecting real-time digital risks in regional dialects.";
    }
    saveConfig(currentConfig);
  };

  return (
    <div className="home-page-container">
      {/* 3D WebGL Canvas in Background */}
      <AegisHUDCanvas activeSection={activeSection} />

      {/* Cyberpunk matrix code rain */}
      <DigitalRain />

      {/* Hero Section overlay */}
      <section className="hero-cockpit-overlay">
        <h1 className="hero-title-glitch" onMouseEnter={() => soundSynth.playHover()}>{config.heroTitle}</h1>
        <p className="hero-subtitle-glass">{config.heroSubtitle}</p>
        
        <div className="hero-buttons">
          <button 
            onClick={() => {
              soundSynth.playClick();
              window.scrollTo({
                top: window.innerHeight * 0.9,
                behavior: 'smooth'
              });
            }}
            onMouseEnter={() => soundSynth.playHover()}
            className="hud-btn-primary"
          >
            Enter Threat Cockpit
          </button>
          <a 
            href="#/admin" 
            className="hud-btn-secondary"
            onClick={() => soundSynth.playClick()}
            onMouseEnter={() => soundSynth.playHover()}
          >
            Access Admin System
          </a>
        </div>

        <div className="scroll-indicator-hud">
          <span>Scroll to Inspect Threat Telemetry</span>
          <div className="scroll-mouse">
            <div className="scroll-wheel" />
          </div>
        </div>
      </section>

      {/* Main Interactive HUD Dashboard View */}
      <section className="hud-dashboard-grid">
        
        {/* Module 1: AI Cyberbullying & Threat Simulator Playground */}
        <div id="scanner-section" style={{ gridColumn: 'span 2' }}>
          <AIPlayground />
        </div>

        {/* Module 2: Parent smartphone app simulator */}
        <div id="alerts-section">
          <PhoneSimulator />
        </div>

        {/* Module 3: Multilingual Language selector globe */}
        <div id="lang-section">
          <LanguageGlobe onLanguageChange={handleLanguageChange} currentLang={currentLang} />
        </div>

        {/* Module 4: Live Global Risk Heatmap */}
        <div id="heatmap-section" style={{ gridColumn: 'span 2' }}>
          <RiskHeatmap />
        </div>

        {/* Module 5: Risk Dashboard stats */}
        <div className="hud-card glass-panel risk-radar-card" id="radar-section">
          <div className="card-header">
            <div className="icon-container accent">
              <Activity className="glow-icon" />
            </div>
            <div>
              <h3>AI Threat Analytics & Stats</h3>
              <span className="card-subtitle">Global Security Telemetry Feed</span>
            </div>
          </div>
          
          <div className="stats-grid-hud">
            <div className="hud-stat-box">
              <span className="hud-stat-label">Scanned Data</span>
              <span className="hud-stat-val">{config.aiStats.messagesScanned.toLocaleString()}</span>
            </div>
            <div className="hud-stat-box success">
              <span className="hud-stat-label">Threats Blocked</span>
              <span className="hud-stat-val">{config.aiStats.threatsBlocked.toLocaleString()}</span>
            </div>
            <div className="hud-stat-box">
              <span className="hud-stat-label">AI Accuracy</span>
              <span className="hud-stat-val">{config.aiStats.accuracy}</span>
            </div>
            <div className="hud-stat-box">
              <span className="hud-stat-label">Avg Latency</span>
              <span className="hud-stat-val">{config.aiStats.latency}</span>
            </div>
          </div>

          <div style={{ marginTop: '20px' }}>
            <span className="preset-title">Active AI Models Details:</span>
            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: '1.5' }}>
              Our platform uses a hybrid ensemble neural architecture. BERT performs tokenized context extraction, CNN matches visual patterns inside media files, GRU models conversational thread histories, while an Autoencoder flags out-of-distribution behavioral anomalies.
            </p>
          </div>
        </div>

        {/* Module 6: Child Behaviour Analytics (Undulating wave graphs) */}
        <div className="hud-card glass-panel analytics-card">
          <div className="card-header">
            <div className="icon-container secondary">
              <Heart className="glow-icon" />
            </div>
            <div>
              <h3>Digital Twin Wellbeing Stream</h3>
              <span className="card-subtitle">Simulated Behavioral Pattern Graph</span>
            </div>
          </div>
          <div className="wave-graph-container">
            <div className="wave-graph-overlay">
              <span className="wave-label">🟢 Baseline Activity Pattern</span>
              <span className="wave-label" style={{ color: 'var(--color-secondary)' }}>🟣 Contextual Emotion Index</span>
              <span className="wave-label" style={{ color: 'var(--color-accent)' }}>🟢 Deflection Shield Wave</span>
            </div>
            <canvas ref={behaviorCanvasRef} />
          </div>
        </div>

        {/* Module 7: Parent Safety Score & Quiz Hub */}
        <div id="analytics-section" style={{ gridColumn: 'span 2' }}>
          <AnalyticsCockpit />
        </div>

        {/* Module 8: School Campus Portal layout */}
        <div className="hud-card glass-panel school-campus-card" id="school-section">
          <div className="card-header">
            <div className="icon-container primary">
              <GraduationCap className="glow-icon" />
            </div>
            <div>
              <h3>School Monitoring Nodes</h3>
              <span className="card-subtitle">Active Institutional Boundaries</span>
            </div>
          </div>
          <div className="campus-grid-wireframe">
            {config.schools.map((school) => (
              <div key={school.id} className="campus-node">
                <span className="campus-name">{school.name}</span>
                <span className="campus-details">{school.activeStudents} active nodes</span>
                <span className="campus-threat-count">{school.threatsInterceded} interceded</span>
                <div className="status-indicator">
                  <div className={`status-dot ${school.status}`} />
                  <span>{school.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Module 9: FAQ and Blogs Section */}
        <div className="hud-card glass-panel faq-blogs-card">
          <div className="card-header">
            <div className="icon-container">
              <HelpCircle className="glow-icon" />
            </div>
            <div>
              <h3>Security Knowledgebase</h3>
              <span className="card-subtitle">FAQ & AI Safety Guidelines</span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '220px', overflowY: 'auto' }}>
            {config.faqs.map((faq) => (
              <div key={faq.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '10px' }}>
                <h5 style={{ fontFamily: 'var(--font-hud)', fontSize: '13px', color: 'var(--color-primary)', textTransform: 'uppercase', marginBottom: '4px' }}>
                  {faq.question}
                </h5>
                <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', lineHeight: '1.4' }}>
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Module 10: Testimonials Slider */}
        <div className="hud-card glass-panel testimonials-card" style={{ gridColumn: 'span 2' }}>
          <div className="card-header">
            <div className="icon-container accent">
              <Star className="glow-icon" />
            </div>
            <div>
              <h3>Expert Insights</h3>
              <span className="card-subtitle">Endorsements from Psychologists & Principals</span>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {config.testimonials.map((t) => (
              <div key={t.id} style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.03)' }}>
                <p style={{ fontSize: '13px', fontStyle: 'italic', color: 'var(--color-text-secondary)', marginBottom: '8px', lineHeight: '1.4' }}>
                  "{t.text}"
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', fontWeight: 'bold' }}>{t.name}</span>
                  <span style={{ fontSize: '11px', color: 'var(--color-accent)', textTransform: 'uppercase' }}>{t.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </section>

      {/* Dynamic Guided Website Tour Dialog */}
      {tourStep !== null && (
        <div className="hud-card glass-panel tour-overlay-hud">
          <div className="tour-header">
            <h5>{TOUR_STEPS[tourStep].title}</h5>
            <button 
              onClick={() => { soundSynth.playClick(); closeTour(); }} 
              className="close-drawer-btn"
              onMouseEnter={() => soundSynth.playHover()}
            >
              <X size={14} />
            </button>
          </div>
          <p className="tour-content">{TOUR_STEPS[tourStep].text}</p>
          <div className="tour-actions">
            <span className="tour-step-counter">Step {tourStep + 1} of {TOUR_STEPS.length}</span>
            <div className="tour-nav-btns">
              {tourStep > 0 && (
                <button 
                  onClick={() => { soundSynth.playClick(); runTourStep(tourStep - 1); }} 
                  className="acknowledge-btn" 
                  style={{ borderColor: 'var(--color-text-secondary)', color: 'var(--color-text-secondary)' }}
                  onMouseEnter={() => soundSynth.playHover()}
                >
                  Back
                </button>
              )}
              <button 
                onClick={() => { soundSynth.playClick(); nextTourStep(); }} 
                className="acknowledge-btn" 
                style={{ borderColor: 'var(--color-accent)', color: 'var(--color-accent)' }}
                onMouseEnter={() => soundSynth.playHover()}
              >
                {tourStep === TOUR_STEPS.length - 1 ? "Finish Tour" : "Next Step"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Jarvis Assistant */}
      <JarvisAssistant onStartTour={() => runTourStep(0)} />

      {/* HUD footer */}
      <footer style={{ width: '100%', borderTop: '1px solid rgba(255,255,255,0.05)', padding: '30px 40px', background: 'rgba(3,7,18,0.9)', zIndex: 10, position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: 'var(--font-hud)', fontSize: '12px', color: 'var(--color-text-secondary)', letterSpacing: '1px' }}>
          BALKAVACH COMMAND CENTER VERSION 2.0.0
        </span>
        <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          Built E2E for Child Security | <Shield size={12} color="var(--color-accent)" /> Active Shield
        </span>
      </footer>
    </div>
  );
};
