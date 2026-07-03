import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Play, X, User } from 'lucide-react';
import { loadConfig } from '../services/configStore';

interface JarvisAssistantProps {
  onStartTour: () => void;
}

export const JarvisAssistant: React.FC<JarvisAssistantProps> = ({ onStartTour }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [chatHistory, setChatHistory] = useState<{ sender: 'jarvis' | 'user'; text: string }[]>([
    { sender: 'jarvis', text: "Systems online. Hello, I am J.A.R.V.I.S., your BalKavach AI guide. Ask me a cybersecurity question or speak 'Start Tour'." }
  ]);
  const [textInput, setTextInput] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const recognitionRef = useRef<any>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat drawer
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isOpen]);

  // Handle Holographic Pulse Waveform
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      let baseRadius = 40;
      
      if (isListening) {
        baseRadius = 40 + Math.sin(time * 0.2) * 8 + Math.random() * 3;
      } else if (isSpeaking) {
        baseRadius = 40 + Math.sin(time * 0.15) * 6;
      }

      // Draw concentric holographic circles
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.strokeStyle = i === 0 ? 'rgba(0, 240, 255, 0.8)' : i === 1 ? 'rgba(189, 0, 255, 0.4)' : 'rgba(5, 242, 199, 0.2)';
        ctx.lineWidth = i === 0 ? 3 : 1.5;
        
        const r = baseRadius + i * 14 + Math.sin(time * 0.05 + i) * 4;
        ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
        ctx.stroke();

        // Add cyber HUD tick lines
        if (i === 0) {
          ctx.beginPath();
          ctx.strokeStyle = 'rgba(0, 240, 255, 0.5)';
          ctx.lineWidth = 2;
          ctx.setLineDash([4, 12]);
          ctx.arc(centerX, centerY, r - 6, time * 0.01, Math.PI * 2 + time * 0.01);
          ctx.stroke();
          ctx.setLineDash([]); // Reset
        }
      }

      // Core pulsing dot
      ctx.beginPath();
      ctx.fillStyle = isListening ? '#ff0055' : '#00f0ff';
      ctx.shadowColor = isListening ? '#ff0055' : '#00f0ff';
      ctx.shadowBlur = 10;
      ctx.arc(centerX, centerY, 8 + Math.sin(time * 0.3) * 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0; // Reset

      time += 1;
      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animId);
  }, [isListening, isSpeaking]);

  // Speech Recognition Initialization
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';

      rec.onstart = () => {
        setIsListening(true);
      };

      rec.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        handleUserQuery(text);
      };

      rec.onerror = (err: any) => {
        console.error("Speech recognition error", err);
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Voice speech recognition is not supported in this browser. Please type your queries.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      // Stop any speaking first
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.error(e);
      }
    }
  };

  // Text to Speech
  const speakText = (text: string) => {
    if (isMuted || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel(); // Stop current speech
    
    // Split speech to avoid browser-length constraints and make it smooth
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Find a premium sounding voice if available
    const voices = window.speechSynthesis.getVoices();
    const synthVoice = voices.find(v => v.name.includes("Google US English") || v.name.includes("Microsoft Zira")) || voices[0];
    if (synthVoice) {
      utterance.voice = synthVoice;
    }
    
    utterance.rate = 1.05; // slightly faster futuristic cadence
    utterance.pitch = 0.95; // deeper cyber tone

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  // Scroll to section helper
  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      return true;
    }
    return false;
  };

  const handleUserQuery = (query: string) => {
    if (!query.trim()) return;

    setChatHistory(prev => [...prev, { sender: 'user', text: query }]);
    const cleanQuery = query.toLowerCase();

    let jarvisReply = "Processing query... I'm currently cross-referencing our cyber threat libraries. Could you please specify?";
    
    // Command Routing Heuristics
    if (cleanQuery.includes("start tour") || cleanQuery.includes("guided tour") || cleanQuery.includes("tour")) {
      jarvisReply = "Initializing HUD Guided Website Tour. I'll highlight the critical modules for you.";
      setTimeout(() => {
        onStartTour();
        setIsOpen(false); // Close drawer to let user see tour
      }, 1000);
    } else if (cleanQuery.includes("scanner") || cleanQuery.includes("cyberbullying") || cleanQuery.includes("scan")) {
      const scrolled = scrollToId('scanner-section');
      jarvisReply = scrolled 
        ? "Accessing AI NLP Scanner matrix. You can test preset threads to check toxicity confidence levels."
        : "Navigated to the real-time AI scan interface.";
    } else if (cleanQuery.includes("alerts") || cleanQuery.includes("phone") || cleanQuery.includes("simulator")) {
      const scrolled = scrollToId('alerts-section');
      jarvisReply = scrolled 
        ? "Displaying the Parent App smartphone device simulator. You can witness real-time deflection alerts here."
        : "Navigated to the Parent Alert simulator.";
    } else if (cleanQuery.includes("language") || cleanQuery.includes("globe") || cleanQuery.includes("hindi")) {
      const scrolled = scrollToId('lang-section');
      jarvisReply = scrolled 
        ? "Rotating Language Matrix nodes. Hover or click glyphs to switch active dialects."
        : "Navigated to the multilingual translation globe.";
    } else if (cleanQuery.includes("school") || cleanQuery.includes("campus") || cleanQuery.includes("portal")) {
      const scrolled = scrollToId('school-section');
      jarvisReply = scrolled 
        ? "Displaying institutional networks and school security node indicators."
        : "Navigated to the School Monitoring grid.";
    } else if (cleanQuery.includes("predict") || cleanQuery.includes("wellbeing") || cleanQuery.includes("analytics")) {
      const scrolled = scrollToId('analytics-section');
      jarvisReply = scrolled 
        ? "Analyzing Digital Twin safety wave graphs. These display behavioral anomaly metrics."
        : "Navigated to the digital twin analytics dashboards.";
    } else if (cleanQuery.includes("safety score") || cleanQuery.includes("score")) {
      const configData = loadConfig();
      const alertCount = configData.alerts.filter(a => !a.read).length;
      if (alertCount === 0) {
        jarvisReply = "AI Analysis shows an Excellent Parent Safety Score of 94. All child cyber nodes are currently secure.";
      } else {
        jarvisReply = `Caution. Safety score dropped due to ${alertCount} unread incident reports logged in the device feed.`;
      }
    } else if (cleanQuery.includes("hello") || cleanQuery.includes("hi") || cleanQuery.includes("hey")) {
      jarvisReply = "Hello! Online and ready. Ask me to scroll to 'Scanner', inspect 'Safety Score', or trigger 'Start Tour'.";
    } else if (cleanQuery.includes("features") || cleanQuery.includes("capabilities") || cleanQuery.includes("what does")) {
      jarvisReply = "BalKavach features real-time cyberbullying deflection, grooming detection, parent alerts, school portal oversight, and local language NLP diagnostics.";
    } else if (cleanQuery.includes("privacy") || cleanQuery.includes("spy")) {
      jarvisReply = "Privacy is paramount. BalKavach performs encrypted semantic checks on texts and media. Keystrokes or active screens are not recorded, ensuring child trust.";
    } else if (cleanQuery.includes("who built") || cleanQuery.includes("maker")) {
      jarvisReply = "BalKavach was designed as an advanced AI Child Security Platform utilizing deep learning ensembles: BERT, CNN, GRU, and Autoencoders.";
    }

    setTimeout(() => {
      setChatHistory(prev => [...prev, { sender: 'jarvis', text: jarvisReply }]);
      speakText(jarvisReply);
    }, 600);
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim()) return;
    handleUserQuery(textInput);
    setTextInput("");
  };

  return (
    <>
      {/* Floating Holographic Avatar Bubble */}
      <div 
        className={`jarvis-avatar-bubble ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <canvas ref={canvasRef} width={100} height={100} className="avatar-canvas" />
        <span className="tooltip-hud">JARVIS</span>
      </div>

      {/* Jarvis Chat Drawer Drawer */}
      {isOpen && (
        <div className="jarvis-drawer glass-panel">
          <div className="drawer-header">
            <div className="avatar-small">
              <span className="core-dot" />
            </div>
            <div>
              <h4>J.A.R.V.I.S. Systems</h4>
              <span className="status-label">Voice & Command Interface</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="close-drawer-btn">
              <X size={16} />
            </button>
          </div>

          <div className="drawer-content">
            <div className="chat-history">
              {chatHistory.map((chat, idx) => (
                <div key={idx} className={`chat-bubble-row ${chat.sender}`}>
                  <div className="bubble-icon">
                    {chat.sender === 'jarvis' ? 'J' : <User size={12} />}
                  </div>
                  <div className="bubble-text">
                    <p>{chat.text}</p>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Input actions */}
            <form onSubmit={handleTextSubmit} className="drawer-input-form">
              <input
                type="text"
                placeholder="Ask Jarvis a query or type 'Start Tour'..."
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
              />
              <button type="submit" className="send-text-btn">
                <Play size={12} fill="currentColor" />
              </button>
              <button 
                type="button" 
                onClick={toggleListening} 
                className={`mic-btn ${isListening ? 'listening' : ''}`}
              >
                {isListening ? <MicOff size={14} /> : <Mic size={14} />}
              </button>
              <button 
                type="button" 
                onClick={() => {
                  setIsMuted(!isMuted);
                  if (!isMuted) window.speechSynthesis.cancel();
                }} 
                className="mute-btn"
              >
                {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
