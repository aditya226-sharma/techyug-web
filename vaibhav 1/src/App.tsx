// App.tsx - Root component with Boot Loader, Sound Synthesis, and Lightweight Hash Routing
import { useState, useEffect } from 'react';
import { Home } from './pages/Home';
import { AdminDashboard } from './pages/AdminDashboard';
import { BootLoader } from './components/BootLoader';
import { soundSynth } from './services/soundSynth';
import { Shield } from 'lucide-react';

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.hash || '#/');
  const [isBooted, setIsBooted] = useState(false);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPath(window.location.hash || '#/');
      soundSynth.playClick(); // Play click noise on hash path routing changes
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const renderPage = () => {
    if (currentPath === '#/admin') {
      return <AdminDashboard />;
    }
    return <Home />;
  };

  // Nav scroll helper for single-page jumps with sound triggers
  const scrollToId = (id: string) => {
    soundSynth.playClick();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!isBooted && currentPath !== '#/admin') {
    return <BootLoader onBootComplete={() => setIsBooted(true)} />;
  }

  return (
    <>
      {/* High-tech overlay scanlines */}
      <div className="scanlines-overlay" />

      {/* Global Navbar only visible on the main page */}
      {currentPath !== '#/admin' && (
        <nav className="hud-navbar">
          <div 
            className="hud-logo"
            onMouseEnter={() => soundSynth.playHover()}
          >
            <Shield className="logo-icon" size={24} />
            <span>BalKavach</span>
          </div>
          
          <div className="hud-nav-links">
            <button 
              className="nav-link" 
              onClick={() => {
                soundSynth.playClick();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onMouseEnter={() => soundSynth.playHover()}
            >
              Cockpit
            </button>
            <button 
              className="nav-link" 
              onClick={() => scrollToId('scanner-section')}
              onMouseEnter={() => soundSynth.playHover()}
            >
              AI Simulator
            </button>
            <button 
              className="nav-link" 
              onClick={() => scrollToId('alerts-section')}
              onMouseEnter={() => soundSynth.playHover()}
            >
              Alert Feed
            </button>
            <button 
              className="nav-link" 
              onClick={() => scrollToId('heatmap-section')}
              onMouseEnter={() => soundSynth.playHover()}
            >
              Risk Heatmap
            </button>
            <button 
              className="nav-link" 
              onClick={() => scrollToId('school-section')}
              onMouseEnter={() => soundSynth.playHover()}
            >
              School Portal
            </button>
            <button 
              className="nav-link" 
              onClick={() => scrollToId('analytics-section')}
              onMouseEnter={() => soundSynth.playHover()}
            >
              Safety Cockpit
            </button>
          </div>

          <a 
            href="#/admin" 
            className="nav-admin-btn"
            onClick={() => soundSynth.playClick()}
            onMouseEnter={() => soundSynth.playHover()}
          >
            Admin Console
          </a>
        </nav>
      )}

      {renderPage()}
    </>
  );
}

export default App;
