import React, { useState } from 'react';
import { Play, ShieldAlert, Cpu, Sparkles, BookOpen, AlertCircle } from 'lucide-react';
import { loadConfig, saveConfig } from '../services/configStore';
import type { AlertNotification } from '../services/configStore';
import { soundSynth } from '../services/soundSynth';

const THREAT_PRESETS = [
  {
    category: "Cyberbullying",
    phrase: "Go jump off a cliff, nobody wants you here. Everyone hates you.",
    type: "Cyberbullying / Harassment",
    toxicity: 0.94,
    sentiment: "Extremely Negative",
    confidence: "98.6% (BERT)",
    xaiExplain: "Flagged due to severe harassment phrases ('go jump off', 'nobody wants you') and active encouragement of self-harm, triggering BERT toxicity classifiers.",
    timeline: ["Message Intercepted", "BERT Token Parsing", "Negative Sentiment Tagged", "Risk Score: 94%", "Parent App Alert Triggered"]
  },
  {
    category: "Online Grooming",
    phrase: "Please keep this a secret between us, do not show these chats to your mother.",
    type: "Suspicious Conversation / Grooming",
    toxicity: 0.88,
    sentiment: "Manipulative / Secrecy Heuristics",
    confidence: "92.4% (GRU)",
    xaiExplain: "Flagged due to request for secrecy ('keep this a secret', 'do not show') combined with parent exclusion patterns, triggering GRU conversational context sequences.",
    timeline: ["Chat Stream Intercepted", "GRU Conversation Contextualizing", "Secrecy Pattern Mapped", "Risk Score: 88%", "Parent Shield Active"]
  },
  {
    category: "Phishing Risk",
    phrase: "Hey kids! Enter your mother's credit card number here to win 50,000 free Robux instantly!",
    type: "Digital Risk / Financial Phishing",
    toxicity: 0.85,
    sentiment: "Urgent / Inducement",
    confidence: "89.1% (Autoencoder)",
    xaiExplain: "Flagged as phishing. Query requests sensitive credit card numbers from a minor account node in exchange for virtual currency incentives.",
    timeline: ["Data Packet Inspected", "Regex/Semantic Check", "Financial Inducement Mapped", "Risk Score: 85%", "Form Submissions Blocked"]
  },
  {
    category: "Suspicious Behavior",
    phrase: "Late night active sessions (02:00 AM) sending encrypted packets to multiple foreign server endpoints.",
    type: "Behavioral Anomaly",
    toxicity: 0.76,
    sentiment: "Abnormal Routine",
    confidence: "91.8% (Autoencoder)",
    xaiExplain: "Flagged by Autoencoders tracking behavioral baseline anomalies. Access occurs outside normal hours (02:00 AM) and interacts with unverified routing nodes.",
    timeline: ["Device Usage Logged", "Autoencoder Baseline Check", "Late Night Spike Flagged", "Risk Score: 76%", "School/Parent Node Sign-off"]
  }
];

const MODELS_DATA = [
  {
    name: "BERT Model",
    description: "NLP Transformer Model",
    details: "Bidirectional Encoder Representations from Transformers. Processes textual message streams and handles dialect translations (transliterated text like Hinglish/Benglish) with advanced token attention matrices.",
    accuracy: "99.2%",
    role: "Semantic Extraction"
  },
  {
    name: "CNN Classifier",
    description: "Convolutional Neural Network",
    details: "Inspects attachments, images, and visual components. Identifies adult content, violent symbols, and cyberbullying text embedded inside images using custom spatial grid convolutions.",
    accuracy: "98.5%",
    role: "Visual Content Screening"
  },
  {
    name: "GRU Sequence Net",
    description: "Gated Recurrent Unit",
    details: "Tracks long-term conversation sequences over time. Analyzes patterns of conversation (e.g., groomers slowly building trust) rather than looking at isolated phrases.",
    accuracy: "97.9%",
    role: "Conversational Heuristics"
  },
  {
    name: "Autoencoder",
    description: "Unsupervised Anomaly Model",
    details: "Monitors child behavior metadata. Compares active session details (hours, apps, data volumes) to historical baselines to flag anomalous activity profiles.",
    accuracy: "96.4%",
    role: "Behavioral Prediction"
  },
  {
    name: "Fusion Layer",
    description: "Decision Engine Node",
    details: "A mathematical ensemble model that merges the probability outputs of BERT, CNN, GRU, and Autoencoders, compiling a final consolidated Cyber Threat Index.",
    accuracy: "99.4%",
    role: "Risk Score Assembly"
  }
];

export const AIPlayground: React.FC = () => {
  const [activePlaygroundTab, setActivePlaygroundTab] = useState<'sim' | 'models' | 'xai'>('sim');
  const [selectedPreset, setSelectedPreset] = useState(THREAT_PRESETS[0]);
  const [inputText, setInputText] = useState(THREAT_PRESETS[0].phrase);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationStep, setSimulationStep] = useState(0);
  const [simResult, setSimResult] = useState<typeof THREAT_PRESETS[0] | null>(null);

  const runSimulation = (preset: typeof THREAT_PRESETS[0]) => {
    if (isSimulating) return;
    
    soundSynth.playScan();
    setSelectedPreset(preset);
    setInputText(preset.phrase);
    setIsSimulating(true);
    setSimResult(null);
    setSimulationStep(0);

    // Step-by-step timeline animation simulation
    const stepsCount = preset.timeline.length;
    let currentStep = 0;

    const interval = setInterval(() => {
      setSimulationStep(prev => prev + 1);
      currentStep++;
      if (currentStep >= stepsCount) {
        clearInterval(interval);
        setIsSimulating(false);
        setSimResult(preset);
        soundSynth.playAlert();

        // Inject alert into config store dynamically
        const config = loadConfig();
        config.settings3D.shieldStatus = 'Deflecting';
        
        const newAlert: AlertNotification = {
          id: "alert-sim-" + Date.now(),
          type: preset.category,
          childName: config.parents[0]?.childName || "Rahul",
          message: `Interceded threat: "${preset.phrase.substring(0, 30)}..."`,
          time: "Just Now",
          read: false
        };

        config.alerts = [newAlert, ...config.alerts];
        config.aiStats.messagesScanned += 1;
        config.aiStats.threatsBlocked += 1;
        saveConfig(config);

        // Reset shield state
        setTimeout(() => {
          const restoreConfig = loadConfig();
          restoreConfig.settings3D.shieldStatus = 'Active';
          saveConfig(restoreConfig);
        }, 4000);
      }
    }, 500);
  };

  return (
    <div className="hud-card glass-panel playground-main-card">
      <div className="card-header">
        <div className="icon-container primary">
          <Sparkles className="glow-icon" />
        </div>
        <div>
          <h3>Premium AI Simulation & Showcase</h3>
          <span className="card-subtitle">Test Detection Engines, View Models, and XAI Explanations</span>
        </div>
      </div>

      {/* Control Tabs */}
      <div className="admin-tabs" style={{ marginBottom: '16px' }}>
        <button 
          className={`admin-tab ${activePlaygroundTab === 'sim' ? 'active' : ''}`}
          onClick={() => { soundSynth.playClick(); setActivePlaygroundTab('sim'); }}
          onMouseEnter={() => soundSynth.playHover()}
        >
          <Play size={12} style={{ marginRight: '6px' }} />
          Threat Simulator
        </button>
        <button 
          className={`admin-tab ${activePlaygroundTab === 'models' ? 'active' : ''}`}
          onClick={() => { soundSynth.playClick(); setActivePlaygroundTab('models'); }}
          onMouseEnter={() => soundSynth.playHover()}
        >
          <Cpu size={12} style={{ marginRight: '6px' }} />
          AI Model Showcase
        </button>
        <button 
          className={`admin-tab ${activePlaygroundTab === 'xai' ? 'active' : ''}`}
          onClick={() => { soundSynth.playClick(); setActivePlaygroundTab('xai'); }}
          onMouseEnter={() => soundSynth.playHover()}
        >
          <BookOpen size={12} style={{ marginRight: '6px' }} />
          Explainable AI (XAI)
        </button>
      </div>

      {/* Tab Contents */}
      <div className="playground-tab-content">
        
        {/* TAB 1: THREAT SIMULATOR */}
        {activePlaygroundTab === 'sim' && (
          <div className="threat-sim-body">
            <div className="preset-selector-row">
              <span className="preset-title">Select Threat Profile to Inject:</span>
              <div className="preset-buttons">
                {THREAT_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    className="preset-btn toxic"
                    onClick={() => { soundSynth.playClick(); runSimulation(preset); }}
                    onMouseEnter={() => soundSynth.playHover()}
                    disabled={isSimulating}
                  >
                    {preset.category}
                  </button>
                ))}
              </div>
            </div>

            <div className="sim-console-group">
              <div className="input-group">
                <textarea
                  value={inputText}
                  disabled={true}
                  rows={2}
                  style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)' }}
                />
              </div>

              {/* Dynamic Timeline visualization */}
              <div className="timeline-hud-container">
                <span className="preset-title">AI Detection Timeline & Data Flow:</span>
                <div className="timeline-flow">
                  {selectedPreset.timeline.map((step, idx) => (
                    <div 
                      key={idx} 
                      className={`timeline-step ${simulationStep > idx ? 'complete' : simulationStep === idx ? 'active' : ''}`}
                    >
                      <div className="step-circle">
                        {simulationStep > idx ? '✓' : idx + 1}
                      </div>
                      <span className="step-label">{step}</span>
                      {idx < selectedPreset.timeline.length - 1 && <span className="step-connector">---</span>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Simulation Result Output */}
              {simResult && (
                <div className="scan-results-box glass-panel threat-detected animated-fade-in" style={{ marginTop: '16px' }}>
                  <div className="result-header">
                    <ShieldAlert className="alert-icon pulse" />
                    <h4>Threat Intercepted: {simResult.type}</h4>
                  </div>
                  
                  <div className="result-metric-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                    <div className="metric-item">
                      <span className="metric-label">Toxicity Score</span>
                      <span className="metric-value">{(simResult.toxicity * 100).toFixed(0)}%</span>
                    </div>
                    <div className="metric-item">
                      <span className="metric-label">Ensemble Engine</span>
                      <span className="metric-value">{simResult.confidence}</span>
                    </div>
                    <div className="metric-item">
                      <span className="metric-label">Sentiment Index</span>
                      <span className="metric-value">{simResult.sentiment}</span>
                    </div>
                  </div>

                  <div className="xai-explanation-box">
                    <span className="metric-label" style={{ color: 'var(--color-primary)' }}>Explainable AI (XAI) Verdict:</span>
                    <p style={{ fontSize: '12px', marginTop: '4px', lineHeight: '1.4' }}>{simResult.xaiExplain}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: AI MODEL SHOWCASE */}
        {activePlaygroundTab === 'models' && (
          <div className="models-showcase-grid">
            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '16px', lineHeight: '1.5' }}>
              BalKavach uses a hybrid decision framework. Each layer evaluates specific dimensions of cyberspace monitoring and routes their assessments to a central risk fusion node.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
              {MODELS_DATA.map((model, idx) => (
                <div key={idx} className="campus-node" style={{ padding: '16px', cursor: 'default' }}>
                  <span className="campus-name" style={{ color: 'var(--color-primary)' }}>{model.name}</span>
                  <span className="campus-details" style={{ fontSize: '11px', color: 'var(--color-accent)' }}>{model.role}</span>
                  <p style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: '8px', lineHeight: '1.3' }}>
                    {model.details}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '8px' }}>
                    <span style={{ fontSize: '10px', color: 'var(--color-text-secondary)' }}>Accuracy Rating</span>
                    <span style={{ fontFamily: 'var(--font-hud)', fontSize: '12px', color: 'var(--color-accent)', fontWeight: 'bold' }}>{model.accuracy}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: EXPLAINABLE AI ENGINE */}
        {activePlaygroundTab === 'xai' && (
          <div className="xai-details-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="glass-panel" style={{ padding: '16px', background: 'rgba(0, 240, 255, 0.02)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <AlertCircle color="var(--color-primary)" size={16} />
                <h5 style={{ fontFamily: 'var(--font-hud)', textTransform: 'uppercase', fontSize: '13px' }}>Why Explainable AI (XAI)?</h5>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', lineHeight: '1.5' }}>
                Cybersecurity models should not operate in a black box. BalKavach integrates SHAP (Shapley Additive exPlanations) and attention mapping to show parents and school admins precisely which tokens and behavior attributes triggered threat responses. This eliminates false positives and builds operational trust.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="campus-node" style={{ padding: '14px' }}>
                <h6 style={{ fontFamily: 'var(--font-hud)', textTransform: 'uppercase', fontSize: '12px', marginBottom: '8px', color: 'var(--color-danger)' }}>Toxicity Weights (SHAP)</h6>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
                      <span>Abuse Phrase weight</span>
                      <span>+0.42</span>
                    </div>
                    <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px' }}>
                      <div style={{ height: '100%', width: '84%', background: 'var(--color-danger)' }} />
                    </div>
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
                      <span>Urgency indicator</span>
                      <span>+0.18</span>
                    </div>
                    <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px' }}>
                      <div style={{ height: '100%', width: '36%', background: 'var(--color-danger)' }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="campus-node" style={{ padding: '14px' }}>
                <h6 style={{ fontFamily: 'var(--font-hud)', textTransform: 'uppercase', fontSize: '12px', marginBottom: '8px', color: 'var(--color-accent)' }}>Mitigation Factors</h6>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
                      <span>Educational context mitigation</span>
                      <span>-0.25</span>
                    </div>
                    <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px' }}>
                      <div style={{ height: '100%', width: '50%', background: 'var(--color-accent)' }} />
                    </div>
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
                      <span>Verified child friend list status</span>
                      <span>-0.15</span>
                    </div>
                    <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px' }}>
                      <div style={{ height: '100%', width: '30%', background: 'var(--color-accent)' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
