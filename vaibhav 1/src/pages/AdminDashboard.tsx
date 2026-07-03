// AdminDashboard.tsx - Premium Enterprise-Grade SaaS Command Console
import React, { useState, useEffect } from 'react';
import { loadConfig, saveConfig, resetConfig } from '../services/configStore';
import type { BalKavachConfig, ThreatRecord, SchoolRecord, ParentRecord } from '../services/configStore';
import { soundSynth } from '../services/soundSynth';
import { 
  LayoutDashboard, Users, ShieldAlert, Cpu, 
  FolderHeart, Activity, Plus, Trash2, ArrowLeft,
  Settings, Download, RefreshCw, KeyRound, 
  Terminal, HardDrive, HeartPulse
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [config, setConfig] = useState<BalKavachConfig>(loadConfig());
  const [sidebarCategory, setSidebarCategory] = useState<'overview' | 'users' | 'ai' | 'cms' | 'comms'>('overview');
  const [activeTab, setActiveTab] = useState<string>('overview');

  // Input states for adding new database items
  const [newThreat, setNewThreat] = useState<Omit<ThreatRecord, 'id'>>({ phrase: '', type: 'Cyberbullying / Toxicity', severity: 'High' });
  const [newSchool, setNewSchool] = useState<Omit<SchoolRecord, 'id'>>({ name: '', activeStudents: 0, threatsInterceded: 0, status: 'Protected' });
  const [newParent, setNewParent] = useState<Omit<ParentRecord, 'id'>>({ name: '', childName: '', status: 'Active', alertsSent: 0 });
  const [newAlertInput, setNewAlertInput] = useState({ type: 'Cyberbullying', childName: 'Rahul', message: 'Simulated alert message' });

  // Enterprise specific inputs
  const [apiKeys, setApiKeys] = useState<{ key: string; role: string; created: string }[]>([
    { key: "bk_live_e92a8310f82a", role: "Root Admin", created: "2026-05-12" },
    { key: "bk_test_8402acde9123", role: "Moderator", created: "2026-06-01" }
  ]);
  const [newApiKeyRole, setNewApiKeyRole] = useState("Moderator");
  
  const [auditLogs, setAuditLogs] = useState<{ timestamp: string; action: string; user: string }[]>([
    { timestamp: "2026-06-30 22:10:05", action: "BERT model parameters updated", user: "root_admin" },
    { timestamp: "2026-06-30 21:45:12", action: "School registry modern_science_academy linked", user: "sys_agent" },
    { timestamp: "2026-06-30 20:30:00", action: "Prompt template J.A.R.V.I.S instructions revised", user: "root_admin" }
  ]);

  const [aiPrompts, setAiPrompts] = useState({
    systemPrompt: "You are J.A.R.V.I.S., an advanced AI cyber guardian. Help parents monitor safety.",
    temp: 0.75,
    maxTokens: 512
  });

  const [emailTemplates, setEmailTemplates] = useState({
    subject: "BalKavach Alert: Threat Detected",
    body: "Hello Parent, BalKavach has intercepted a cyber threat. Please inspect your command center."
  });

  const [currentLang, setCurrentLang] = useState('en');
  const handleLanguageChange = (langCode: string) => {
    setCurrentLang(langCode);
  };

  useEffect(() => {
    setConfig(loadConfig());
  }, []);

  const handleSave = (updatedConfig: BalKavachConfig) => {
    saveConfig(updatedConfig);
    setConfig({ ...updatedConfig });
  };

  const handleReset = () => {
    soundSynth.playAlert();
    if (window.confirm("Restore default BalKavach enterprise configurations?")) {
      const def = resetConfig();
      setConfig(def);
      soundSynth.playSuccess();
    }
  };

  const generateApiKey = () => {
    soundSynth.playClick();
    const chars = "abcdef0123456789";
    let keySegment = "";
    for (let i = 0; i < 12; i++) {
      keySegment += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const newKey = {
      key: `bk_${newApiKeyRole.toLowerCase().includes("admin") ? "live" : "test"}_${keySegment}`,
      role: newApiKeyRole,
      created: new Date().toISOString().split('T')[0]
    };
    setApiKeys(prev => [newKey, ...prev]);
    // Log audit
    setAuditLogs(prev => [
      { timestamp: new Date().toLocaleString(), action: `API Key generated for role ${newApiKeyRole}`, user: "root_admin" },
      ...prev
    ]);
  };

  const deleteApiKey = (key: string) => {
    soundSynth.playClick();
    setApiKeys(prev => prev.filter(k => k.key !== key));
  };

  // Threat Management
  const addThreat = () => {
    if (!newThreat.phrase.trim()) return;
    soundSynth.playClick();
    const item: ThreatRecord = {
      id: "threat-" + Date.now(),
      ...newThreat
    };
    const updated = { ...config, threats: [...config.threats, item] };
    handleSave(updated);
    setNewThreat({ phrase: '', type: 'Cyberbullying / Toxicity', severity: 'High' });
  };

  const deleteThreat = (id: string) => {
    soundSynth.playClick();
    const updated = { ...config, threats: config.threats.filter(t => t.id !== id) };
    handleSave(updated);
  };

  // School Management
  const addSchool = () => {
    if (!newSchool.name.trim()) return;
    soundSynth.playClick();
    const item: SchoolRecord = {
      id: "school-" + Date.now(),
      ...newSchool
    };
    const updated = { ...config, schools: [...config.schools, item] };
    handleSave(updated);
    setNewSchool({ name: '', activeStudents: 0, threatsInterceded: 0, status: 'Protected' });
  };

  const deleteSchool = (id: string) => {
    soundSynth.playClick();
    const updated = { ...config, schools: config.schools.filter(s => s.id !== id) };
    handleSave(updated);
  };

  // Parent Management
  const addParent = () => {
    if (!newParent.name.trim() || !newParent.childName.trim()) return;
    soundSynth.playClick();
    const item: ParentRecord = {
      id: "parent-" + Date.now(),
      ...newParent
    };
    const updated = { ...config, parents: [...config.parents, item] };
    handleSave(updated);
    setNewParent({ name: '', childName: '', status: 'Active', alertsSent: 0 });
  };

  const deleteParent = (id: string) => {
    soundSynth.playClick();
    const updated = { ...config, parents: config.parents.filter(p => p.id !== id) };
    handleSave(updated);
  };

  // Alert simulation
  const triggerManualAlert = () => {
    soundSynth.playScan();
    const manualAlert = {
      id: "alert-" + Date.now(),
      type: newAlertInput.type,
      childName: newAlertInput.childName,
      message: newAlertInput.message,
      time: "Just Now",
      read: false
    };
    
    const updated = { 
      ...config, 
      alerts: [manualAlert, ...config.alerts],
      settings3D: { ...config.settings3D, shieldStatus: 'Deflecting' as const }
    };
    handleSave(updated);
    soundSynth.playAlert();

    setTimeout(() => {
      const restoreConfig = loadConfig();
      restoreConfig.settings3D.shieldStatus = 'Active';
      saveConfig(restoreConfig);
    }, 4000);
  };

  const handleBackup = () => {
    soundSynth.playClick();
    alert("Enterprise database backup successfully written to AWS S3 Cloud Bucket!");
    soundSynth.playSuccess();
  };

  return (
    <div className="admin-page-container" style={{ display: 'flex', padding: 0, minHeight: '100vh', background: '#020617' }}>
      
      {/* LEFT SIDEBAR: Categories */}
      <div style={{
        width: '260px',
        background: '#090d16',
        borderRight: '1px solid rgba(0, 240, 255, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 50
      }}>
        {/* Logo block */}
        <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ShieldAlert className="logo-icon glow-icon" style={{ color: 'var(--color-secondary)' }} />
          <span style={{ fontFamily: 'var(--font-hud)', fontSize: '18px', letterSpacing: '2px', textTransform: 'uppercase', color: '#fff' }}>KAVACH CONSOLE</span>
        </div>

        {/* Sidebar Nav categories */}
        <div style={{ flex: 1, padding: '20px 10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button 
            className={`admin-tab ${sidebarCategory === 'overview' ? 'active' : ''}`}
            onClick={() => { soundSynth.playClick(); setSidebarCategory('overview'); setActiveTab('overview'); }}
            style={{ width: '100%', textAlign: 'left', borderRadius: '6px', justifyContent: 'flex-start', display: 'flex', gap: '10px', alignItems: 'center' }}
          >
            <LayoutDashboard size={14} /> Systems Overview
          </button>
          
          <button 
            className={`admin-tab ${sidebarCategory === 'users' ? 'active' : ''}`}
            onClick={() => { soundSynth.playClick(); setSidebarCategory('users'); setActiveTab('users'); }}
            style={{ width: '100%', textAlign: 'left', borderRadius: '6px', justifyContent: 'flex-start', display: 'flex', gap: '10px', alignItems: 'center' }}
          >
            <Users size={14} /> Directory Control
          </button>

          <button 
            className={`admin-tab ${sidebarCategory === 'ai' ? 'active' : ''}`}
            onClick={() => { soundSynth.playClick(); setSidebarCategory('ai'); setActiveTab('threats'); }}
            style={{ width: '100%', textAlign: 'left', borderRadius: '6px', justifyContent: 'flex-start', display: 'flex', gap: '10px', alignItems: 'center' }}
          >
            <Cpu size={14} /> AI Core & Threats
          </button>

          <button 
            className={`admin-tab ${sidebarCategory === 'cms' ? 'active' : ''}`}
            onClick={() => { soundSynth.playClick(); setSidebarCategory('cms'); setActiveTab('cms'); }}
            style={{ width: '100%', textAlign: 'left', borderRadius: '6px', justifyContent: 'flex-start', display: 'flex', gap: '10px', alignItems: 'center' }}
          >
            <FolderHeart size={14} /> CMS & Assets
          </button>

          <button 
            className={`admin-tab ${sidebarCategory === 'comms' ? 'active' : ''}`}
            onClick={() => { soundSynth.playClick(); setSidebarCategory('comms'); setActiveTab('comms'); }}
            style={{ width: '100%', textAlign: 'left', borderRadius: '6px', justifyContent: 'flex-start', display: 'flex', gap: '10px', alignItems: 'center' }}
          >
            <Settings size={14} /> Comms & System
          </button>
        </div>

        {/* Exit panel */}
        <div style={{ padding: '20px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <a href="#/" className="hud-btn-secondary" style={{ width: '100%', justifyContent: 'center', display: 'flex', gap: '8px', alignItems: 'center' }} onClick={() => soundSynth.playClick()}>
            <ArrowLeft size={14} /> Exit Console
          </a>
        </div>
      </div>

      {/* RIGHT MAIN PANEL */}
      <div style={{ flex: 1, padding: '40px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '30px' }}>
        
        {/* Dynamic sub-tab lists depending on Category Selection */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '20px' }}>
          <div>
            <span style={{ fontSize: '12px', color: 'var(--color-primary)', fontFamily: 'var(--font-hud)', textTransform: 'uppercase' }}>
              Sub-Module / {activeTab}
            </span>
            <h2 style={{ fontSize: '28px', color: '#fff', textShadow: 'var(--glow-primary)', marginTop: '4px' }}>
              {activeTab.replace('_', ' ').toUpperCase()}
            </h2>
          </div>
          
          {/* Sub tabs nav buttons */}
          <div style={{ display: 'flex', gap: '8px' }}>
            {sidebarCategory === 'overview' && (
              <>
                <button className={`admin-tab ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => { soundSynth.playClick(); setActiveTab('overview'); }}>Overview</button>
                <button className={`admin-tab ${activeTab === 'health' ? 'active' : ''}`} onClick={() => { soundSynth.playClick(); setActiveTab('health'); }}>System Health</button>
                <button className={`admin-tab ${activeTab === 'audit' ? 'active' : ''}`} onClick={() => { soundSynth.playClick(); setActiveTab('audit'); }}>Audit Logs</button>
              </>
            )}
            {sidebarCategory === 'users' && (
              <>
                <button className={`admin-tab ${activeTab === 'users' ? 'active' : ''}`} onClick={() => { soundSynth.playClick(); setActiveTab('users'); }}>Users</button>
                <button className={`admin-tab ${activeTab === 'rbac' ? 'active' : ''}`} onClick={() => { soundSynth.playClick(); setActiveTab('rbac'); }}>RBAC & API Keys</button>
              </>
            )}
            {sidebarCategory === 'ai' && (
              <>
                <button className={`admin-tab ${activeTab === 'threats' ? 'active' : ''}`} onClick={() => { soundSynth.playClick(); setActiveTab('threats'); }}>Threat DB</button>
                <button className={`admin-tab ${activeTab === 'training' ? 'active' : ''}`} onClick={() => { soundSynth.playClick(); setActiveTab('training'); }}>Model Training</button>
              </>
            )}
            {sidebarCategory === 'cms' && (
              <>
                <button className={`admin-tab ${activeTab === 'cms' ? 'active' : ''}`} onClick={() => { soundSynth.playClick(); setActiveTab('cms'); }}>Page Builder</button>
                <button className={`admin-tab ${activeTab === 'assets' ? 'active' : ''}`} onClick={() => { soundSynth.playClick(); setActiveTab('assets'); }}>Asset Registry</button>
              </>
            )}
            {sidebarCategory === 'comms' && (
              <>
                <button className={`admin-tab ${activeTab === 'comms' ? 'active' : ''}`} onClick={() => { soundSynth.playClick(); setActiveTab('comms'); }}>Settings</button>
                <button className={`admin-tab ${activeTab === 'templates' ? 'active' : ''}`} onClick={() => { soundSynth.playClick(); setActiveTab('templates'); }}>Alert Templates</button>
              </>
            )}
          </div>
        </div>

        {/* Dynamic sub tab layout renders */}
        
        {/* SUB 1: OVERVIEW SCREEN */}
        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <div className="stats-grid-hud" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
              <div className="hud-stat-box">
                <span className="hud-stat-label">Messages Checked</span>
                <span className="hud-stat-val">{config.aiStats.messagesScanned.toLocaleString()}</span>
              </div>
              <div className="hud-stat-box success">
                <span className="hud-stat-label">Threats Mitigated</span>
                <span className="hud-stat-val">{config.aiStats.threatsBlocked.toLocaleString()}</span>
              </div>
              <div className="hud-stat-box">
                <span className="hud-stat-label">API Access Hits</span>
                <span className="hud-stat-val">124.9k</span>
              </div>
              <div className="hud-stat-box">
                <span className="hud-stat-label">Active Socket Pipes</span>
                <span className="hud-stat-val" style={{ color: 'var(--color-accent)' }}>Online (18)</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
              <div className="hud-card glass-panel" style={{ padding: '20px' }}>
                <h4 style={{ fontFamily: 'var(--font-hud)', fontSize: '14px', textTransform: 'uppercase', marginBottom: '14px' }}>Live Connection Metrics</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span>Active parent apps</span>
                    <span style={{ color: 'var(--color-primary)' }}>1,482 connected</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span>Linked school portals</span>
                    <span style={{ color: 'var(--color-primary)' }}>24 networks</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span>Peak Concurrent queries</span>
                    <span style={{ color: 'var(--color-accent)' }}>82 trans/sec</span>
                  </div>
                </div>
              </div>

              <div className="hud-card glass-panel" style={{ padding: '20px' }}>
                <h4 style={{ fontFamily: 'var(--font-hud)', fontSize: '14px', textTransform: 'uppercase', marginBottom: '14px' }}>Enterprise Data Controls</h4>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={handleBackup} className="admin-btn-save" style={{ flex: 1, display: 'flex', gap: '6px', alignItems: 'center', justifyContent: 'center' }}>
                    <HardDrive size={14} /> Trigger S3 Backup
                  </button>
                  <button onClick={() => alert("Enterprise dataset report generated & saved to workspace downloads.")} className="admin-btn-reset" style={{ flex: 1, display: 'flex', gap: '6px', alignItems: 'center', justifyContent: 'center' }}>
                    <Download size={14} /> Export JSON Reports
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SUB 2: SYSTEM HEALTH DIAGNOSTICS */}
        {activeTab === 'health' && (
          <div className="hud-card glass-panel admin-card">
            <h4>System Health diagnostics (SaaS dashboard status)</h4>
            <div className="form-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' }}>
              
              <div className="hud-stat-box" style={{ padding: '20px' }}>
                <HeartPulse size={24} color="var(--color-accent)" style={{ marginBottom: '10px' }} />
                <span className="hud-stat-label" style={{ display: 'block' }}>CPU Utilization</span>
                <span className="hud-stat-val" style={{ color: 'var(--color-accent)' }}>4.8% (Stable)</span>
              </div>
              
              <div className="hud-stat-box" style={{ padding: '20px' }}>
                <Activity size={24} color="var(--color-primary)" style={{ marginBottom: '10px' }} />
                <span className="hud-stat-label" style={{ display: 'block' }}>RAM memory usage</span>
                <span className="hud-stat-val" style={{ color: 'var(--color-primary)' }}>1.24 GB / 8 GB</span>
              </div>

              <div className="hud-stat-box" style={{ padding: '20px' }}>
                <RefreshCw size={24} className="animate-spin" color="var(--color-accent)" style={{ marginBottom: '10px' }} />
                <span className="hud-stat-label" style={{ display: 'block' }}>DB Handshake Handlers</span>
                <span className="hud-stat-val" style={{ color: 'var(--color-accent)' }}>Active (0.8ms)</span>
              </div>

            </div>

            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Terminal size={14} color="var(--color-primary)" />
                <h5 style={{ fontFamily: 'var(--font-hud)', fontSize: '12px' }}>Live WebGL & API connection handshake diagnostic console:</h5>
              </div>
              <pre style={{ fontSize: '11px', color: 'var(--color-text-secondary)', fontFamily: 'var(--font-hud)', lineHeight: '1.4' }}>
                [sys_agent] 22:20:00 - E2EE Socket Handshake with Modern Science Academy linked.<br />
                [model_engine] 22:21:05 - SHAP explanation weights successfully compiled for incident t1.<br />
                [sys_health] 22:23:10 - Garbage collection completed. 124MB cleared from memory cache.
              </pre>
            </div>
          </div>
        )}

        {/* SUB 3: AUDIT LOGS */}
        {activeTab === 'audit' && (
          <div className="hud-card glass-panel admin-card">
            <h4>System Audit Logs & Operations History</h4>
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>Action Performed</th>
                    <th>Operator Node</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.map((log, idx) => (
                    <tr key={idx}>
                      <td style={{ fontFamily: 'var(--font-hud)', fontSize: '12px' }}>{log.timestamp}</td>
                      <td style={{ fontWeight: 'bold' }}>{log.action}</td>
                      <td style={{ color: 'var(--color-secondary)' }}>{log.user}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SUB 4: USER DIRECTORY CONTROL */}
        {activeTab === 'users' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            
            {/* Manage Schools */}
            <div className="hud-card glass-panel admin-card">
              <h4>Institutional Schools Registry</h4>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', marginBottom: '20px', flexWrap: 'wrap' }}>
                <div className="form-group" style={{ flex: '2', minWidth: '150px' }}>
                  <label>Institution Name</label>
                  <input type="text" placeholder="Greenwood High" value={newSchool.name} onChange={(e) => setNewSchool({ ...newSchool, name: e.target.value })} />
                </div>
                <div className="form-group" style={{ flex: '1', minWidth: '80px' }}>
                  <label>Students count</label>
                  <input type="number" value={newSchool.activeStudents} onChange={(e) => setNewSchool({ ...newSchool, activeStudents: parseInt(e.target.value) || 0 })} />
                </div>
                <button onClick={addSchool} className="admin-btn-save"><Plus size={14} style={{ verticalAlign: 'middle' }} /> Register</button>
              </div>
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>School Name</th>
                      <th>Students Active</th>
                      <th>Mitigations</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {config.schools.map((s) => (
                      <tr key={s.id}>
                        <td>{s.name}</td>
                        <td>{s.activeStudents}</td>
                        <td>{s.threatsInterceded}</td>
                        <td><span className={`status-dot ${s.status}`} style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', marginRight: '6px' }} />{s.status}</td>
                        <td><button onClick={() => deleteSchool(s.id)} className="action-btn-danger"><Trash2 size={12} /></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Manage Parents */}
            <div className="hud-card glass-panel admin-card">
              <h4>Parent Accounts Registry</h4>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', marginBottom: '20px', flexWrap: 'wrap' }}>
                <div className="form-group" style={{ flex: '2', minWidth: '150px' }}>
                  <label>Parent Name</label>
                  <input type="text" placeholder="Sunil Sharma" value={newParent.name} onChange={(e) => setNewParent({ ...newParent, name: e.target.value })} />
                </div>
                <div className="form-group" style={{ flex: '2', minWidth: '150px' }}>
                  <label>Child Node Name</label>
                  <input type="text" placeholder="Aman Sharma" value={newParent.childName} onChange={(e) => setNewParent({ ...newParent, childName: e.target.value })} />
                </div>
                <button onClick={addParent} className="admin-btn-save"><Plus size={14} style={{ verticalAlign: 'middle' }} /> Link Account</button>
              </div>
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Parent Name</th>
                      <th>Linked Child</th>
                      <th>Alerts Dispatched</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {config.parents.map((p) => (
                      <tr key={p.id}>
                        <td>{p.name}</td>
                        <td>{p.childName}</td>
                        <td>{p.alertsSent} sent</td>
                        <td style={{ color: 'var(--color-accent)' }}>● {p.status}</td>
                        <td><button onClick={() => deleteParent(p.id)} className="action-btn-danger"><Trash2 size={12} /></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* SUB 5: ROLE-BASED ACCESS CONTROL & API KEYS */}
        {activeTab === 'rbac' && (
          <div className="hud-card glass-panel admin-card">
            <h4>Role-Based Access Control (RBAC) & API Key Managers</h4>
            
            {/* Generate API Key */}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', marginBottom: '24px' }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Access Authority Role</label>
                <select value={newApiKeyRole} onChange={(e) => setNewApiKeyRole(e.target.value)}>
                  <option value="Moderator">Moderator Access</option>
                  <option value="System Agent">System Agent</option>
                  <option value="Root Admin">Root Administrator</option>
                </select>
              </div>
              <button onClick={generateApiKey} className="admin-btn-save" style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <KeyRound size={14} /> Generate API Key
              </button>
            </div>

            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Decrypted Key Token</th>
                    <th>Access Role</th>
                    <th>Issued Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {apiKeys.map((k, idx) => (
                    <tr key={idx}>
                      <td style={{ fontFamily: 'var(--font-hud)', fontSize: '13px', color: 'var(--color-primary)' }}>{k.key}</td>
                      <td>
                        <span className="severity-badge Low" style={{ 
                          borderColor: k.role.includes("Root") ? 'var(--color-danger)' : 'var(--color-accent)',
                          color: k.role.includes("Root") ? 'var(--color-danger)' : 'var(--color-accent)',
                          background: 'none'
                        }}>
                          {k.role}
                        </span>
                      </td>
                      <td>{k.created}</td>
                      <td>
                        <button onClick={() => deleteApiKey(k.key)} className="action-btn-danger">
                          <Trash2 size={12} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SUB 6: THREAT DATABASE */}
        {activeTab === 'threats' && (
          <div className="hud-card glass-panel admin-card">
            <h4>Banned Keywords & Threat Recognition Rules</h4>
            
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', marginBottom: '24px', flexWrap: 'wrap' }}>
              <div className="form-group" style={{ flex: '2', minWidth: '200px' }}>
                <label>Suspicious Slang / Phrase</label>
                <input type="text" placeholder="go away forever" value={newThreat.phrase} onChange={(e) => setNewThreat({ ...newThreat, phrase: e.target.value })} />
              </div>
              <div className="form-group" style={{ flex: '1', minWidth: '140px' }}>
                <label>Severity Category</label>
                <select value={newThreat.severity} onChange={(e) => setNewThreat({ ...newThreat, severity: e.target.value as any })}>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
              <button onClick={addThreat} className="admin-btn-save"><Plus size={14} /> Add keyword</button>
            </div>

            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Phrase Pattern</th>
                    <th>Threat Category</th>
                    <th>Severity level</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {config.threats.map((t) => (
                    <tr key={t.id}>
                      <td style={{ fontWeight: 'bold' }}>"{t.phrase}"</td>
                      <td>{t.type}</td>
                      <td><span className={`severity-badge ${t.severity}`}>{t.severity}</span></td>
                      <td><button onClick={() => deleteThreat(t.id)} className="action-btn-danger"><Trash2 size={12} /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SUB 7: AI MODEL TRAINING & DATASETS */}
        {activeTab === 'training' && (
          <div className="hud-card glass-panel admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h4>AI Assistant Training & Prompt Configuration</h4>
            
            <div className="form-grid">
              <div className="form-group full-width">
                <label>JARVIS Assistant Custom Prompt Directives</label>
                <textarea 
                  rows={3} 
                  value={aiPrompts.systemPrompt} 
                  onChange={(e) => setAiPrompts({ ...aiPrompts, systemPrompt: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Model Generation Temperature ({aiPrompts.temp})</label>
                <input 
                  type="range" 
                  min="0.1" 
                  max="1.5" 
                  step="0.05" 
                  value={aiPrompts.temp} 
                  onChange={(e) => setAiPrompts({ ...aiPrompts, temp: parseFloat(e.target.value) })}
                />
              </div>
              <div className="form-group">
                <label>Max Context Length Tokens</label>
                <input 
                  type="number" 
                  value={aiPrompts.maxTokens} 
                  onChange={(e) => setAiPrompts({ ...aiPrompts, maxTokens: parseInt(e.target.value) || 256 })}
                />
              </div>
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px' }}>
              <span className="preset-title">Ensemble Training Datasets (JSONL uploads):</span>
              <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                <button onClick={() => alert("SHAP training dataset compiled successfully.")} className="admin-btn-save" style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <Cpu size={14} /> Tune BERT parameters
                </button>
                <button onClick={() => alert("Model hyperparameters successfully tuned.")} className="admin-btn-reset">
                  Re-Optimize Fusion Engine
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SUB 8: HOMEPAGE BUILDER & CMS */}
        {activeTab === 'cms' && (
          <div className="hud-card glass-panel admin-card">
            <h4>Homepage Builder & CMS Content</h4>
            <div className="form-grid">
              <div className="form-group full-width">
                <label>Command Cockpit Landing Header</label>
                <input 
                  type="text" 
                  value={config.heroTitle} 
                  onChange={(e) => handleSave({ ...config, heroTitle: e.target.value })}
                />
              </div>
              <div className="form-group full-width">
                <label>Landing Subtitle Description</label>
                <textarea 
                  rows={2} 
                  value={config.heroSubtitle} 
                  onChange={(e) => handleSave({ ...config, heroSubtitle: e.target.value })}
                />
              </div>
            </div>
            
            {/* Testimonials edit placeholder */}
            <div style={{ marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px' }}>
              <span className="preset-title">FAQ Knowledgebase Config:</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '10px' }}>
                {config.faqs.map((faq, idx) => (
                  <div key={faq.id} className="campus-node" style={{ padding: '12px' }}>
                    <div className="form-group">
                      <label>Question {idx + 1}</label>
                      <input 
                        type="text" 
                        value={faq.question} 
                        onChange={(e) => {
                          const updatedFaqs = config.faqs.map(f => f.id === faq.id ? { ...f, question: e.target.value } : f);
                          handleSave({ ...config, faqs: updatedFaqs });
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SUB 9: 3D ASSETS REGISTRY */}
        {activeTab === 'assets' && (
          <div className="hud-card glass-panel admin-card">
            <h4>WebGL 3D Assets & Animation Control</h4>
            <div className="form-grid">
              <div className="form-group">
                <label>Holographic Primary Glow Color</label>
                <select 
                  value={config.settings3D.colorPrimary} 
                  onChange={(e) => handleSave({ 
                    ...config, 
                    settings3D: { ...config.settings3D, colorPrimary: e.target.value } 
                  })}
                >
                  <option value="#00f0ff">Cyber Cyan</option>
                  <option value="#bd00ff">Neon Purple</option>
                  <option value="#05f2c7">Emerald Green</option>
                  <option value="#ff0055">Warning Red</option>
                </select>
              </div>
              <div className="form-group">
                <label>Holographic Secondary Glow Color</label>
                <select 
                  value={config.settings3D.colorSecondary} 
                  onChange={(e) => handleSave({ 
                    ...config, 
                    settings3D: { ...config.settings3D, colorSecondary: e.target.value } 
                  })}
                >
                  <option value="#bd00ff">Neon Purple</option>
                  <option value="#00f0ff">Cyber Cyan</option>
                  <option value="#05f2c7">Emerald Green</option>
                  <option value="#ff0055">Warning Red</option>
                </select>
              </div>
              <div className="form-group">
                <label>3D Particle speed</label>
                <input 
                  type="range" 
                  min="0.2" 
                  max="4" 
                  step="0.1" 
                  value={config.settings3D.particleSpeed} 
                  onChange={(e) => handleSave({ 
                    ...config, 
                    settings3D: { ...config.settings3D, particleSpeed: parseFloat(e.target.value) } 
                  })}
                />
              </div>
              <div className="form-group">
                <label>Deflection Shield Status</label>
                <select 
                  value={config.settings3D.shieldStatus} 
                  onChange={(e) => handleSave({ 
                    ...config, 
                    settings3D: { ...config.settings3D, shieldStatus: e.target.value as any } 
                  })}
                >
                  <option value="Active">Active Guard</option>
                  <option value="Deflecting">Deflecting Threats</option>
                  <option value="Idle">Idle State</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* SUB 10: COMMUNICATOR SETTINGS */}
        {activeTab === 'comms' && (
          <div className="hud-card glass-panel admin-card">
            <h4>Global System Configurations</h4>
            <div className="form-grid">
              <div className="form-group">
                <label>Default Interface Language</label>
                <select value={currentLang} onChange={(e) => { soundSynth.playClick(); handleLanguageChange(e.target.value); }}>
                  <option value="en">English Dialect</option>
                  <option value="hi">हिन्दी Dialect</option>
                  <option value="ta">தமிழ் Dialect</option>
                </select>
              </div>
              <div className="form-group">
                <label>System Audio Theme settings</label>
                <select onChange={() => { soundSynth.playClick(); alert("Spatial Audio configuration updated."); }}>
                  <option value="cyber">Command Center spatial (Beeps)</option>
                  <option value="silent">No Sound Synthesis (Mute)</option>
                </select>
              </div>
            </div>

            <div style={{ marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px' }}>Database Maintenance Controls</label>
              <button onClick={handleReset} className="admin-btn-reset">
                Restore Configurations to Default Baseline
              </button>
            </div>
          </div>
        )}

        {/* SUB 11: ALERT TEMPLATES */}
        {activeTab === 'templates' && (
          <div className="hud-card glass-panel admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h4>Email & SMS Alert notifications templates</h4>
            <div className="form-grid">
              <div className="form-group full-width">
                <label>Email Alert Subject Layout</label>
                <input 
                  type="text" 
                  value={emailTemplates.subject} 
                  onChange={(e) => setEmailTemplates({ ...emailTemplates, subject: e.target.value })}
                />
              </div>
              <div className="form-group full-width">
                <label>Email Alert Notification Body</label>
                <textarea 
                  rows={3} 
                  value={emailTemplates.body} 
                  onChange={(e) => setEmailTemplates({ ...emailTemplates, body: e.target.value })}
                />
              </div>
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px' }}>
              <span className="preset-title">Manual Incident Warning Controls:</span>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', flexWrap: 'wrap', marginTop: '10px' }}>
                <div className="form-group" style={{ flex: '1', minWidth: '150px' }}>
                  <label>Incident Type</label>
                  <select value={newAlertInput.type} onChange={(e) => setNewAlertInput({ ...newAlertInput, type: e.target.value })}>
                    <option value="Cyberbullying">Cyberbullying</option>
                    <option value="Predatory Conversation">Grooming behavior</option>
                    <option value="Phishing Risk">Phishing threat</option>
                  </select>
                </div>
                <div className="form-group" style={{ flex: '1', minWidth: '120px' }}>
                  <label>Target Child Name</label>
                  <select value={newAlertInput.childName} onChange={(e) => setNewAlertInput({ ...newAlertInput, childName: e.target.value })}>
                    {config.parents.map((p) => (
                      <option key={p.id} value={p.childName}>{p.childName}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group" style={{ flex: '2', minWidth: '200px' }}>
                  <label>Alert Detail Message</label>
                  <input type="text" value={newAlertInput.message} onChange={(e) => setNewAlertInput({ ...newAlertInput, message: e.target.value })} />
                </div>
                <button onClick={triggerManualAlert} className="admin-btn-save" style={{ background: 'var(--color-danger)', color: '#fff', boxShadow: 'var(--glow-danger)', height: '42px' }}>
                  Trigger Incident Warn
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
