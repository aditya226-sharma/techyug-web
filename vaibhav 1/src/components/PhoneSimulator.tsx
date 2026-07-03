import React, { useState, useEffect } from 'react';
import { Smartphone, Shield, BellRing, CheckCircle, Wifi } from 'lucide-react';
import { loadConfig, saveConfig } from '../services/configStore';
import type { AlertNotification } from '../services/configStore';

export const PhoneSimulator: React.FC = () => {
  const [alerts, setAlerts] = useState<AlertNotification[]>([]);
  const [newAlert, setNewAlert] = useState<AlertNotification | null>(null);

  useEffect(() => {
    // Initial load
    const config = loadConfig();
    setAlerts(config.alerts);

    // Listen to changes in config (triggered by scanner or admin settings)
    const handleUpdate = () => {
      const updatedConfig = loadConfig();
      setAlerts(updatedConfig.alerts);

      // Check if a new unread alert was added
      const unreadAlert = updatedConfig.alerts.find(a => !a.read);
      if (unreadAlert) {
        setNewAlert(unreadAlert);
        // Play alert sound if wanted, or just flash
        setTimeout(() => {
          setNewAlert(null); // auto dismiss push notification banner after 5s
        }, 5000);
      }
    };

    window.addEventListener("balkavach-config-update", handleUpdate);
    return () => {
      window.removeEventListener("balkavach-config-update", handleUpdate);
    };
  }, []);

  const handleAcknowledge = (id: string) => {
    const config = loadConfig();
    config.alerts = config.alerts.map(a => a.id === id ? { ...a, read: true } : a);
    saveConfig(config);
    setAlerts(config.alerts);
  };

  const handleClearAll = () => {
    const config = loadConfig();
    config.alerts = [];
    saveConfig(config);
    setAlerts([]);
  };

  // Determine threat level color
  const getRiskScore = () => {
    const unreadCount = alerts.filter(a => !a.read).length;
    if (unreadCount === 0) return { score: 12, label: 'Excellent', color: '#05f2c7' };
    if (unreadCount === 1) return { score: 48, label: 'Warning', color: '#f59e0b' };
    return { score: 85, label: 'Critical Alert', color: '#ff0055' };
  };

  const risk = getRiskScore();

  return (
    <div className="hud-card glass-panel phone-simulator-card">
      <div className="card-header">
        <div className="icon-container danger">
          <Smartphone className="glow-icon" />
        </div>
        <div>
          <h3>Parent Alert System</h3>
          <span className="card-subtitle">Active 3D Smartphone Device Feed</span>
        </div>
      </div>

      <div className="phone-body-wrapper">
        {/* Smartphone Shell */}
        <div className="smartphone-frame">
          <div className="smartphone-inner">
            {/* Status Bar */}
            <div className="phone-header">
              <span className="phone-time">22:15</span>
              <div className="speaker-notch" />
              <div className="phone-icons">
                <Wifi size={12} />
                <span className="battery-icon">84%</span>
              </div>
            </div>

            {/* Mobile Push Notification Banner */}
            {newAlert && (
              <div className="push-notification-banner pulse-border">
                <div className="push-header">
                  <BellRing size={12} className="bell-pulse" />
                  <span className="app-name">BalKavach Security</span>
                  <span className="push-time">Now</span>
                </div>
                <div className="push-content">
                  <h5>{newAlert.type} Threat Detected!</h5>
                  <p>{newAlert.message}</p>
                </div>
              </div>
            )}

            {/* App UI */}
            <div className="app-container">
              {/* App Navbar */}
              <div className="app-nav">
                <Shield size={16} color="#00f0ff" />
                <span className="app-title">KAVACH MONITOR</span>
                <span className="dot-active" />
              </div>

              {/* Main Content Area */}
              <div className="app-content">
                {/* Circular Risk Score */}
                <div className="risk-dial-container">
                  <div className="risk-dial" style={{ border: `3px solid ${risk.color}` }}>
                    <span className="dial-value">{risk.score}</span>
                    <span className="dial-label">RISK SCORE</span>
                  </div>
                  <span className="risk-status" style={{ color: risk.color }}>
                    Status: {risk.label}
                  </span>
                </div>

                {/* Device Status indicators */}
                <div className="mobile-stats-row">
                  <div className="mobile-stat-box">
                    <span className="label">APP STATUS</span>
                    <span className="value active">E2EE SECURE</span>
                  </div>
                  <div className="mobile-stat-box">
                    <span className="label">SCAN RATE</span>
                    <span className="value">14 ms/tx</span>
                  </div>
                </div>

                {/* Notification list */}
                <div className="phone-alert-list">
                  <div className="list-title-row">
                    <h6>Incident Reports</h6>
                    {alerts.length > 0 && (
                      <button onClick={handleClearAll} className="clear-btn">Clear All</button>
                    )}
                  </div>

                  {alerts.length === 0 ? (
                    <div className="phone-empty-state">
                      <CheckCircle size={32} color="#05f2c7" />
                      <p>No safety incidents flagged. Child cyberspace is secure.</p>
                    </div>
                  ) : (
                    <div className="alert-scroll-list">
                      {alerts.map((alert) => (
                        <div 
                          key={alert.id} 
                          className={`phone-alert-item ${alert.read ? 'acknowledged' : 'unread'}`}
                        >
                          <div className="alert-meta">
                            <span className="alert-badge">{alert.type}</span>
                            <span className="alert-time">{alert.time}</span>
                          </div>
                          <p className="alert-desc">{alert.message}</p>
                          {!alert.read && (
                            <button 
                              onClick={() => handleAcknowledge(alert.id)}
                              className="acknowledge-btn"
                            >
                              Acknowledge Threat
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
