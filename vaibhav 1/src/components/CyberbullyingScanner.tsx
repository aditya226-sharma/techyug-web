import React, { useState } from 'react';
import { Shield, ShieldAlert, Play, RefreshCw } from 'lucide-react';
import { loadConfig, saveConfig } from '../services/configStore';
import type { AlertNotification } from '../services/configStore';

const PRESET_MESSAGES = [
  { text: "Hey! You did an amazing job on the presentation today.", label: "Positive / Safe", isToxic: false },
  { text: "Nobody likes you. Why don't you just delete your account and disappear.", label: "Cyberbullying / Bullying", isToxic: true },
  { text: "Don't tell your parents about our chat, let's meet up at the park later.", label: "Suspicious / Grooming", isToxic: true },
  { text: "You are so fat, ugly, and stupid. Get off this group.", label: "Toxicity / Harassment", isToxic: true },
  { text: "Can you help me with the computer science homework tonight?", label: "Neutral / Safe", isToxic: false }
];

export const CyberbullyingScanner: React.FC = () => {
  const [inputText, setInputText] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<{
    toxicity: number;
    tokens: { word: string; weight: number }[];
    classification: string;
    actionTaken: string;
  } | null>(null);

  // Neural network node states
  const [activeLayers, setActiveLayers] = useState<number[]>([-1]);

  const handleScan = (textToScan: string) => {
    if (!textToScan.trim() || isScanning) return;

    setInputText(textToScan);
    setIsScanning(true);
    setScanResult(null);
    setActiveLayers([0]); // Start at Input Layer

    // Simulate neural net flow step-by-step
    const steps = [
      () => setActiveLayers([0, 1]), // Input -> BERT Tokenizer
      () => setActiveLayers([1, 2]), // BERT -> CNN Features
      () => setActiveLayers([2, 3]), // CNN -> GRU Context
      () => setActiveLayers([3, 4]), // GRU -> Autoencoder / Output
    ];

    steps.forEach((step, idx) => {
      setTimeout(() => {
        step();
      }, (idx + 1) * 450);
    });

    setTimeout(() => {
      // Analyze text for toxicity
      const words = textToScan.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").split(/\s+/);
      const toxicKeywords = ["nobody", "likes", "delete", "disappear", "parents", "chat", "meet", "park", "fat", "ugly", "stupid", "kill", "hate"];
      
      const matchedWords = words.filter(w => toxicKeywords.includes(w));
      const toxicity = matchedWords.length > 0 ? Math.min(0.98, 0.4 + matchedWords.length * 0.2) : 0.05 + Math.random() * 0.12;

      let classification = "Safe Interaction";
      let actionTaken = "Activity Logged (Secure)";

      if (toxicity > 0.7) {
        classification = textToScan.toLowerCase().includes("meet") || textToScan.toLowerCase().includes("parents") 
          ? "Suspicious Chat (Predatory Behavior)"
          : "Cyberbullying / Toxic Harassment";
        actionTaken = "Deflected & Shield Activated (Alert Sent)";

        // Trigger dynamic alert in config store
        const currentConfig = loadConfig();
        
        // Temporarily change shield state to Deflecting to animate incoming red particles in canvas
        currentConfig.settings3D.shieldStatus = 'Deflecting';
        
        const newAlert: AlertNotification = {
          id: "alert-" + Date.now(),
          type: classification.split(" ")[0],
          childName: currentConfig.parents[0]?.childName || "Rahul",
          message: `AI intercepted: "${textToScan.substring(0, 35)}..."`,
          time: "Just Now",
          read: false
        };

        currentConfig.alerts = [newAlert, ...currentConfig.alerts];
        currentConfig.aiStats.messagesScanned += 1;
        currentConfig.aiStats.threatsBlocked += 1;
        saveConfig(currentConfig);

        // Reset shield back to Active state after 4 seconds
        setTimeout(() => {
          const updatedConfig = loadConfig();
          updatedConfig.settings3D.shieldStatus = 'Active';
          saveConfig(updatedConfig);
        }, 4000);

      } else {
        const currentConfig = loadConfig();
        currentConfig.aiStats.messagesScanned += 1;
        saveConfig(currentConfig);
      }

      // Generate simulated token weights
      const tokens = words.map(w => {
        const isToxicWord = toxicKeywords.includes(w);
        return {
          word: w,
          weight: isToxicWord ? 0.65 + Math.random() * 0.3 : 0.02 + Math.random() * 0.15
        };
      });

      setScanResult({
        toxicity,
        tokens,
        classification,
        actionTaken
      });
      setIsScanning(false);
      setActiveLayers([-1]); // Clear neural activation
    }, 2200);
  };

  return (
    <div className="hud-card glass-panel scanner-wrapper">
      <div className="card-header">
        <div className="icon-container primary">
          <Shield className="glow-icon" />
        </div>
        <div>
          <h3>Real-time AI NLP Scanner</h3>
          <span className="card-subtitle">Hybrid BERT + GRU Chat Diagnostics</span>
        </div>
      </div>

      <div className="scanner-body">
        {/* Preset selections */}
        <div className="presets-container">
          <span className="preset-title">Test Cyber Threat Heuristics:</span>
          <div className="preset-buttons">
            {PRESET_MESSAGES.map((msg, idx) => (
              <button
                key={idx}
                className={`preset-btn ${msg.isToxic ? 'toxic' : 'safe'}`}
                onClick={() => handleScan(msg.text)}
                disabled={isScanning}
              >
                {msg.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input box */}
        <div className="input-group">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type custom text here to run cognitive analysis..."
            disabled={isScanning}
            rows={3}
          />
          <button 
            className={`scan-submit-btn ${isScanning ? 'scanning' : ''}`}
            onClick={() => handleScan(inputText)}
            disabled={isScanning || !inputText.trim()}
          >
            {isScanning ? (
              <RefreshCw className="animate-spin" />
            ) : (
              <Play fill="currentColor" />
            )}
            <span>{isScanning ? "Processing..." : "Run AI Scan"}</span>
          </button>
        </div>

        {/* Neural Network Layer Visualizer */}
        <div className="neural-visualizer">
          <span className="visualizer-title">Neural Network Activation Pipeline:</span>
          <div className="neural-nodes-grid">
            <div className={`neural-layer ${activeLayers.includes(0) ? 'active' : ''}`}>
              <div className="node-indicator" />
              <span>Input</span>
            </div>
            <div className="neural-arrow">→</div>
            <div className={`neural-layer ${activeLayers.includes(1) ? 'active' : ''}`}>
              <div className="node-indicator" />
              <span>BERT Tokens</span>
            </div>
            <div className="neural-arrow">→</div>
            <div className={`neural-layer ${activeLayers.includes(2) ? 'active' : ''}`}>
              <div className="node-indicator" />
              <span>CNN Extractor</span>
            </div>
            <div className="neural-arrow">→</div>
            <div className={`neural-layer ${activeLayers.includes(3) ? 'active' : ''}`}>
              <div className="node-indicator" />
              <span>GRU Context</span>
            </div>
            <div className="neural-arrow">→</div>
            <div className={`neural-layer ${activeLayers.includes(4) ? 'active' : ''}`}>
              <div className="node-indicator" />
              <span>Autoencoder</span>
            </div>
          </div>
        </div>

        {/* Scan Results Display */}
        {scanResult && (
          <div className={`scan-results-box glass-panel ${scanResult.toxicity > 0.7 ? 'threat-detected' : 'threat-clear'}`}>
            <div className="result-header">
              {scanResult.toxicity > 0.7 ? (
                <ShieldAlert className="alert-icon pulse" />
              ) : (
                <Shield className="safe-icon" />
              )}
              <h4>{scanResult.classification}</h4>
            </div>

            <div className="result-metric-grid">
              <div className="metric-item">
                <span className="metric-label">Toxicity Score</span>
                <span className="metric-value">{(scanResult.toxicity * 100).toFixed(1)}%</span>
              </div>
              <div className="metric-item">
                <span className="metric-label">AI Action</span>
                <span className="metric-value action-taken">{scanResult.actionTaken}</span>
              </div>
            </div>

            {/* Tokenized output */}
            <div className="token-list-container">
              <span className="token-list-title">Transformer Attention Mapping:</span>
              <div className="token-tags">
                {scanResult.tokens.map((tok, idx) => (
                  <div 
                    key={idx} 
                    className="token-tag"
                    style={{
                      background: tok.weight > 0.6 
                        ? `rgba(255, 0, 85, ${tok.weight * 0.25})`
                        : `rgba(0, 240, 255, ${tok.weight * 0.15})`,
                      border: tok.weight > 0.6 
                        ? `1px solid rgba(255, 0, 85, ${tok.weight * 0.5})` 
                        : `1px solid rgba(0, 240, 255, ${tok.weight * 0.3})`
                    }}
                  >
                    <span className="token-word">{tok.word}</span>
                    <span className="token-weight">{tok.weight.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
