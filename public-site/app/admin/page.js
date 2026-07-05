"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminPortal() {
  const [token, setToken] = useState(null);
  const [email, setEmail] = useState('');
  const [view, setView] = useState('faculty');

  // Database States
  const [universities, setUniversities] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [delivery, setDelivery] = useState({ syllabusCompletion: "0%", dailyLectureLogs: [] });
  const [events, setEvents] = useState([]);

  // Login inputs
  const [loginEmail, setLoginEmail] = useState('manager@techyug.in');
  const [loginPassword, setLoginPassword] = useState('manager123');
  const [loginError, setLoginError] = useState('');

  // Modal / Form States
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'faculty' or 'event'
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({});

  // Onboard university inputs
  const [uniName, setUniName] = useState('');
  const [mouFile, setMouFile] = useState('');

  // Toast feedback
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    const savedToken = localStorage.getItem('admin_token');
    const savedEmail = localStorage.getItem('admin_email');
    requestAnimationFrame(() => {
      if (savedToken) {
        setToken(savedToken);
        setEmail(savedEmail || 'manager@techyug.in');
      }
    });
  }, []);

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  // Sync / Fetch Mock Database helpers
  const fetchUniversities = () => {
    const data = localStorage.getItem('mock_universities');
    if (data) {
      setUniversities(JSON.parse(data));
    } else {
      const initial = [
        {
          id: "uni-1",
          name: "Delhi Technology University",
          mouFilename: "MOU_Signed_DTU_2026.pdf",
          requirementSheet: "DTU_Trainer_Requirements_CSE.docx",
          initialRoadmap: "DTU_Academic_Roadmap_Final.pdf",
          onboardedAt: "2026-06-25T10:00:00.000Z"
        },
        {
          id: "uni-2",
          name: "VTU Belagavi",
          mouFilename: "MOU_VTU_Executed.pdf",
          requirementSheet: "VTU_Trainer_Requirements_ISE.docx",
          initialRoadmap: "VTU_Skill_Development_Timeline.pdf",
          onboardedAt: "2026-06-28T14:30:00.000Z"
        }
      ];
      localStorage.setItem('mock_universities', JSON.stringify(initial));
      setUniversities(initial);
    }
  };

  const fetchFaculty = () => {
    const data = localStorage.getItem('mock_faculty');
    if (data) {
      setFaculty(JSON.parse(data));
    } else {
      const initial = [
        {
          id: "train-1",
          name: "Dr. Aravind Swamy",
          expertise: "Artificial Intelligence & Deep Learning",
          experience: "14+ Years (Ex-Microsoft)",
          bio: "Author of 20+ publications and advisor to top-tier universities.",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
          assignedBatch: "DTU-CSE-BatchA",
          timetableAdherence: "98%"
        },
        {
          id: "train-2",
          name: "Sarah Jenkins",
          expertise: "Cloud Architecture & DevSecOps",
          experience: "10+ Years (Senior Architect)",
          bio: "Expert in Kubernetes orchestration and hybrid cloud migrations.",
          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
          assignedBatch: "VTU-ISE-CloudCore",
          timetableAdherence: "100%"
        },
        {
          id: "train-3",
          name: "Elena Rostova",
          expertise: "Quantum Computing & Cryptography",
          experience: "8+ Years (Ex-IBM Quantum)",
          bio: "Leading joint research project with IIT Bombay on post-quantum secure protocols.",
          avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop",
          assignedBatch: "IITB-Quantum-Core",
          timetableAdherence: "100%"
        },
        {
          id: "train-4",
          name: "Marcus Vance",
          expertise: "Advanced Cybersecurity & PenTesting",
          experience: "12+ Years (Ex-NSA Consultant)",
          bio: "Specializes in zero-trust architectures and defensive red-teaming exercises.",
          avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
          assignedBatch: "RVCE-Cyber-BatchB",
          timetableAdherence: "97%"
        }
      ];
      localStorage.setItem('mock_faculty', JSON.stringify(initial));
      setFaculty(initial);
    }
  };

  const fetchDelivery = () => {
    const data = localStorage.getItem('mock_delivery');
    if (data) {
      setDelivery(JSON.parse(data));
    } else {
      const initial = {
        syllabusCompletion: "87.2%",
        dailyLectureLogs: [
          {
            date: "2026-06-29",
            topic: "Intro to Convolutional Networks",
            batch: "DTU-CSE-A",
            uploadUrl: "lecture_log_20260629_dtu.mp4"
          },
          {
            date: "2026-06-29",
            topic: "Kubernetes Pod Deployments & Namespaces",
            batch: "VTU-Cloud",
            uploadUrl: "lecture_log_20260629_vtu.mp4"
          }
        ],
        marksheetFilename: "internal_exam_marksheets_q2_draft.xlsx"
      };
      localStorage.setItem('mock_delivery', JSON.stringify(initial));
      setDelivery(initial);
    }
  };

  const fetchEvents = () => {
    const data = localStorage.getItem('mock_events');
    if (data) {
      setEvents(JSON.parse(data));
    } else {
      const initial = [
        {
          id: "eve-1",
          title: "TechYug National Hackathon 2026",
          date: "August 22-24, 2026",
          venue: "TechYug Innovation Hub & Virtual",
          description: "A 48-hour challenge addressing sustainable energy solutions, smart infrastructure, and healthtech.",
          link: "#register",
          registrationRules: "Open to all CS/IT undergraduate streams. Max team size: 4."
        },
        {
          id: "eve-2",
          title: "Hands-on Workshop: Building with Large Language Models",
          date: "July 18, 2026",
          venue: "Online Interactive Sandbox",
          description: "A practical guide to prompt engineering, RAG pipelines, and deploying custom model endpoints.",
          link: "#register",
          registrationRules: "Basic Python knowledge required."
        },
        {
          id: "eve-3",
          title: "National Ideathon 2026: Green Computing Initiatives",
          date: "September 12, 2026",
          venue: "IIT Delhi Seminar Hall & Webex",
          description: "A collaborative brainstorming event seeking architectural ideas to optimize data center power consumption and reduce digital carbon footprints.",
          link: "#register",
          registrationRules: "Open to post-graduates and researchers. Max team size: 3."
        },
        {
          id: "eve-4",
          title: "PhD Research Colloquium: Frontiers in Artificial Intelligence",
          date: "October 5, 2026",
          venue: "TechYug Academic Auditorium",
          description: "Paper presentations and panel discussions with peer-reviewed publications indexed in Scopus and Web of Science.",
          link: "#submit-paper",
          registrationRules: "Submission guidelines: PDF format, IEEE standard template."
        }
      ];
      localStorage.setItem('mock_events', JSON.stringify(initial));
      setEvents(initial);
    }
  };

  useEffect(() => {
    if (!token) return;
    requestAnimationFrame(() => {
      if (view === 'universities') fetchUniversities();
      if (view === 'faculty') fetchFaculty();
      if (view === 'delivery-tracking') fetchDelivery();
      if (view === 'events-manager') fetchEvents();
    });
  }, [token, view]);

  // Authentications
  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError('');
    if (loginEmail === 'manager@techyug.in' && loginPassword === 'manager123') {
      const mockToken = "mock-admin-token-123456";
      localStorage.setItem('admin_token', mockToken);
      localStorage.setItem('admin_email', loginEmail);
      setToken(mockToken);
      setEmail(loginEmail);
      triggerToast("Welcome back! Login authorized.");
    } else {
      setLoginError("Invalid Operations credentials");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_email');
    setToken(null);
    setEmail('');
  };

  // University onboarding
  const handleOnboardUniversity = (e) => {
    e.preventDefault();
    if (!uniName) return;

    const list = [...universities, {
      id: `uni-${Date.now()}`,
      name: uniName,
      mouFilename: mouFile ? mouFile.split('\\').pop() : "MoU_Signed_Copy.pdf",
      requirementSheet: "Trainer_Requirements.docx",
      initialRoadmap: "Skill_Development_Timeline.pdf",
      onboardedAt: new Date().toISOString()
    }];
    localStorage.setItem('mock_universities', JSON.stringify(list));
    setUniversities(list);
    setUniName('');
    setMouFile('');
    triggerToast("New University MOU onboarded and filed!");
  };

  // Trainers CRUD
  const handleSaveFaculty = (e) => {
    e.preventDefault();
    let list;
    if (editId) {
      list = faculty.map(f => f.id === editId ? { ...f, ...formData } : f);
    } else {
      list = [...faculty, {
        ...formData,
        id: `train-${Date.now()}`,
        avatar: formData.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop",
        assignedBatch: formData.assignedBatch || "Not Assigned",
        timetableAdherence: "100%"
      }];
    }
    localStorage.setItem('mock_faculty', JSON.stringify(list));
    setFaculty(list);
    setShowModal(false);
    triggerToast(editId ? "Trainer details updated!" : "New corporate trainer added!");
  };

  const handleDeleteFaculty = (id) => {
    if (!confirm("Remove this trainer from active directory pool?")) return;
    const list = faculty.filter(f => f.id !== id);
    localStorage.setItem('mock_faculty', JSON.stringify(list));
    setFaculty(list);
    triggerToast("Faculty member removed from system.");
  };

  // Events CRUD
  const handleSaveEvent = (e) => {
    e.preventDefault();
    let list;
    if (editId) {
      list = events.map(ev => ev.id === editId ? { ...ev, ...formData } : ev);
    } else {
      list = [...events, {
        ...formData,
        id: `eve-${Date.now()}`,
        link: formData.link || "#register",
        registrationRules: formData.registrationRules || "Open to all branches"
      }];
    }
    localStorage.setItem('mock_events', JSON.stringify(list));
    setEvents(list);
    setShowModal(false);
    triggerToast(editId ? "Event details modified!" : "New hackathon posted live!");
  };

  const handleDeleteEvent = (id) => {
    if (!confirm("Are you sure you want to cancel and delete this event?")) return;
    const list = events.filter(ev => ev.id !== id);
    localStorage.setItem('mock_events', JSON.stringify(list));
    setEvents(list);
    triggerToast("Event removed from listings.");
  };

  // Delivery Tracking Update
  const handleUpdateSyllabus = (percentage) => {
    const updated = { ...delivery, syllabusCompletion: `${percentage}%` };
    localStorage.setItem('mock_delivery', JSON.stringify(updated));
    setDelivery(updated);
    triggerToast("Syllabus completion metrics synced!");
  };

  // 1. Render Login Interface
  if (!token) {
    return (
      <div className="w-screen h-screen flex justify-center items-center bg-[#121214] text-white">
        <div className="w-full max-w-md p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center border border-white/10">
              <svg className="w-6 h-6 text-[#FF9E1B]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center mb-2">TechYug Operations</h2>
          <p className="text-slate-400 text-xs text-center mb-6">Log in to manage university curricula and trainer operations.</p>
          
          {loginError && (
            <div className="p-3 mb-4 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-xs">{loginError}</div>
          )}
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 font-mono">EMAIL ADDRESS</label>
              <input 
                type="email" 
                value={loginEmail} 
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full bg-slate-900/50 border border-white/10 rounded-lg p-2.5 text-sm focus:outline-none focus:border-[#FF9E1B] text-slate-200"
                required 
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 font-mono">PASSWORD</label>
              <input 
                type="password" 
                value={loginPassword} 
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full bg-slate-900/50 border border-white/10 rounded-lg p-2.5 text-sm focus:outline-none focus:border-[#FF9E1B] text-slate-200"
                required 
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-gradient-to-r from-[#FF9E1B] to-[#b19ffb] hover:opacity-90 text-slate-950 font-bold py-2.5 rounded-lg text-sm transition-all shadow-[0_0_15px_rgba(255,158,27,0.2)] cursor-pointer"
            >
              Sign In
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <Link href="/" className="text-xs text-slate-400 hover:text-white font-mono">← Go to Public Gateway</Link>
          </div>
        </div>
      </div>
    );
  }

  // 2. Render Dashboard Interface
  return (
    <div className="w-screen h-screen flex bg-[#121214] text-slate-100 overflow-hidden font-sans relative">
      {/* Toast */}
      {toastMsg && (
        <div className="absolute top-6 right-6 px-4 py-2 bg-emerald-500 text-slate-950 text-xs font-bold rounded-lg shadow-lg z-50 animate-bounce">
          {toastMsg}
        </div>
      )}

      {/* Sidebar */}
      <aside className="w-64 bg-slate-950 border-r border-white/5 p-6 flex flex-col justify-between shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-8">
            <div className="w-3.5 h-3.5 rounded-full bg-[#FF9E1B] shadow-[0_0_10px_#FF9E1B]"></div>
            <span className="font-sans font-bold text-lg text-white">TechYug Ops</span>
          </div>

          <nav className="space-y-1">
            <button 
              onClick={() => setView('faculty')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${view === 'faculty' ? 'bg-white/5 text-[#FF9E1B] border-l-2 border-l-[#FF9E1B]' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
            >
              Corporate Trainers
            </button>
            <button 
              onClick={() => setView('universities')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${view === 'universities' ? 'bg-white/5 text-[#FF9E1B] border-l-2 border-l-[#FF9E1B]' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
            >
              University MoUs
            </button>
            <button 
              onClick={() => setView('delivery-tracking')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${view === 'delivery-tracking' ? 'bg-white/5 text-[#FF9E1B] border-l-2 border-l-[#FF9E1B]' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
            >
              Delivery Tracking
            </button>
            <button 
              onClick={() => setView('events-manager')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${view === 'events-manager' ? 'bg-white/5 text-[#FF9E1B] border-l-2 border-l-[#FF9E1B]' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
            >
              Events Manager
            </button>
          </nav>
        </div>

        <div>
          <div className="p-3 mb-4 rounded-lg bg-white/5 border border-white/5 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#FF9E1B]/20 flex items-center justify-center text-xs font-bold text-[#FF9E1B]">
              OP
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold truncate text-white">Operations Admin</div>
              <div className="text-[10px] text-slate-500 truncate">{email}</div>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-red-600/10 border border-red-500/20 hover:bg-red-600/20 text-red-400 text-xs font-bold transition-all cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Workspace Viewport */}
      <main className="flex-1 p-8 overflow-y-auto flex flex-col">
        {/* Module Header */}
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/5">
          <div>
            <h1 className="text-2xl font-bold capitalize text-white">{view.replace('-', ' ')} Workspace</h1>
            <p className="text-slate-400 text-xs">Manage active assets and databases synced directly on the client.</p>
          </div>
          
          {(view === 'faculty' || view === 'events-manager') && (
            <button 
              onClick={() => {
                setModalType(view === 'faculty' ? 'faculty' : 'event');
                setEditId(null);
                setFormData({});
                setShowModal(true);
              }}
              className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded-lg text-sm flex items-center gap-2 shadow-md border border-white/10 transition-all cursor-pointer"
            >
              + Add Record
            </button>
          )}
        </div>

        {/* Dynamic Workspace Content */}
        <div className="flex-1">
          {view === 'faculty' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {faculty.map(f => (
                <div key={f.id} className="glass-panel p-6 rounded-2xl border border-white/5 flex gap-4 justify-between items-start">
                  <div className="flex gap-4">
                    <img src={f.avatar} alt={f.name} className="w-12 h-12 rounded-full object-cover border border-white/10" />
                    <div>
                      <h3 className="font-bold text-white text-sm">{f.name}</h3>
                      <span className="text-xs text-[#FF9E1B] font-mono">{f.expertise}</span>
                      <p className="text-[10px] text-slate-400 mt-2 max-w-xs">{f.bio}</p>
                      <div className="flex gap-4 mt-3 text-[10px] font-mono text-slate-500">
                        <span>EXP: {f.experience}</span>
                        <span>BATCH: {f.assignedBatch}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        setModalType('faculty');
                        setEditId(f.id);
                        setFormData(f);
                        setShowModal(true);
                      }}
                      className="p-1.5 bg-white/5 rounded border border-white/5 text-slate-300 hover:text-white"
                    >
                      ✏️
                    </button>
                    <button 
                      onClick={() => handleDeleteFaculty(f.id)}
                      className="p-1.5 bg-red-500/10 rounded border border-red-500/10 text-red-400 hover:bg-red-500/20"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {view === 'universities' && (
            <div className="space-y-6">
              <form onSubmit={handleOnboardUniversity} className="glass-panel p-6 rounded-2xl border border-white/5 max-w-md space-y-4">
                <h3 className="font-bold text-sm">Onboard New University MoU</h3>
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 mb-1">UNIVERSITY NAME</label>
                  <input 
                    type="text" 
                    value={uniName}
                    onChange={e => setUniName(e.target.value)}
                    placeholder="E.g., IIT Madras CoE"
                    className="w-full bg-[#121214]/50 border border-white/10 rounded-lg p-2 text-xs focus:outline-none focus:border-[#FF9E1B]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 mb-1">MOU SIGNED DOCUMENT (FILENAME)</label>
                  <input 
                    type="text" 
                    value={mouFile}
                    onChange={e => setMouFile(e.target.value)}
                    placeholder="MOU_IITM_Executed_2026.pdf"
                    className="w-full bg-[#121214]/50 border border-white/10 rounded-lg p-2 text-xs focus:outline-none focus:border-[#FF9E1B]"
                  />
                </div>
                <button type="submit" className="px-4 py-2 bg-[#FF9E1B] text-slate-950 font-bold text-xs rounded-lg hover:opacity-90">
                  Onboard MoU
                </button>
              </form>

              <div className="overflow-x-auto glass-panel rounded-2xl border border-white/5">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-white/10 bg-slate-900/40 text-slate-400">
                      <th className="p-4">UNIVERSITY</th>
                      <th className="p-4">MOU DOCUMENT</th>
                      <th className="p-4 font-mono">ONBOARDED DATE</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-300">
                    {universities.map(uni => (
                      <tr key={uni.id} className="hover:bg-white/5">
                        <td className="p-4 font-bold text-white">{uni.name}</td>
                        <td className="p-4 font-mono text-emerald-400">{uni.mouFilename}</td>
                        <td className="p-4 font-mono">{new Date(uni.onboardedAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {view === 'delivery-tracking' && (
            <div className="max-w-md space-y-6">
              <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4">
                <h3 className="font-bold text-sm">Ecosystem Syllabus Completion</h3>
                <div className="flex justify-between items-center text-xs font-mono">
                  <span>CURRENT METRIC:</span>
                  <span className="text-[#FF9E1B] font-bold">{delivery.syllabusCompletion}</span>
                </div>
                <div className="flex gap-2">
                  {[75, 80, 85, 90, 95, 100].map(pct => (
                    <button 
                      key={pct}
                      onClick={() => handleUpdateSyllabus(pct)}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 rounded border border-white/5 text-xs font-mono text-slate-300 hover:text-white"
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              </div>

              <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4">
                <h3 className="font-bold text-sm">Recent Lecture Logs</h3>
                <div className="space-y-3">
                  {delivery.dailyLectureLogs?.map((log, idx) => (
                    <div key={idx} className="p-3 bg-slate-900/40 rounded-lg border border-white/5 flex justify-between items-center text-xs">
                      <div>
                        <div className="font-semibold text-white">{log.topic}</div>
                        <div className="text-[10px] text-slate-500 font-mono">BATCH: {log.batch}</div>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">{log.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {view === 'events-manager' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {events.map(ev => (
                <div key={ev.id} className="glass-panel p-6 rounded-2xl border border-white/5 flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-white text-sm">{ev.title}</h3>
                    <div className="text-[10px] text-[#FF9E1B] font-mono mt-1">{ev.date} {" // "} {ev.venue}</div>
                    <p className="text-[11px] text-slate-400 mt-2 max-w-sm">{ev.description}</p>
                    <span className="inline-block mt-3 text-[10px] text-slate-500 font-mono">RULES: {ev.registrationRules}</span>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        setModalType('event');
                        setEditId(ev.id);
                        setFormData(ev);
                        setShowModal(true);
                      }}
                      className="p-1.5 bg-white/5 rounded border border-white/5 text-slate-300 hover:text-white"
                    >
                      ✏️
                    </button>
                    <button 
                      onClick={() => handleDeleteEvent(ev.id)}
                      className="p-1.5 bg-red-500/10 rounded border border-red-500/10 text-red-400 hover:bg-red-500/20"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Editor Modal */}
      {showModal && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-[#121214] border border-white/10 rounded-2xl p-8 max-w-md w-full relative">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-6 right-6 w-8 h-8 rounded-full border border-white/5 flex items-center justify-center hover:bg-white/5 text-slate-400 hover:text-white font-mono"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold mb-6 text-white">{editId ? "Edit Record" : "Add Record"}</h2>

            {modalType === 'faculty' ? (
              <form onSubmit={handleSaveFaculty} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1 font-mono">FULL NAME</label>
                  <input 
                    type="text" 
                    value={formData.name || ''} 
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-900 border border-white/10 rounded p-2 text-white" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-mono">EXPERTISE</label>
                  <input 
                    type="text" 
                    value={formData.expertise || ''} 
                    onChange={e => setFormData({ ...formData, expertise: e.target.value })}
                    className="w-full bg-slate-900 border border-white/10 rounded p-2 text-white" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-mono">EXPERIENCE (BIO RANGE)</label>
                  <input 
                    type="text" 
                    value={formData.experience || ''} 
                    onChange={e => setFormData({ ...formData, experience: e.target.value })}
                    className="w-full bg-slate-900 border border-white/10 rounded p-2 text-white" 
                    placeholder="E.g., 10+ Years (Senior Lead)"
                    required 
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-mono">BIO DESCRIPTION</label>
                  <textarea 
                    value={formData.bio || ''} 
                    onChange={e => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full bg-slate-900 border border-white/10 rounded p-2 text-white resize-none" 
                    rows="3"
                    required 
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-mono">ASSIGNED ACTIVE BATCH</label>
                  <input 
                    type="text" 
                    value={formData.assignedBatch || ''} 
                    onChange={e => setFormData({ ...formData, assignedBatch: e.target.value })}
                    className="w-full bg-slate-900 border border-white/10 rounded p-2 text-white" 
                    required 
                  />
                </div>
                <button type="submit" className="w-full py-2 bg-[#FF9E1B] text-slate-950 font-bold rounded">
                  Save Trainer
                </button>
              </form>
            ) : (
              <form onSubmit={handleSaveEvent} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1 font-mono">EVENT TITLE</label>
                  <input 
                    type="text" 
                    value={formData.title || ''} 
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-slate-900 border border-white/10 rounded p-2 text-white" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-mono">DATE / TIMEFRAME</label>
                  <input 
                    type="text" 
                    value={formData.date || ''} 
                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-slate-900 border border-white/10 rounded p-2 text-white" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-mono">VENUE / LOCATION</label>
                  <input 
                    type="text" 
                    value={formData.venue || ''} 
                    onChange={e => setFormData({ ...formData, venue: e.target.value })}
                    className="w-full bg-slate-900 border border-white/10 rounded p-2 text-white" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-mono">DESCRIPTION</label>
                  <textarea 
                    value={formData.description || ''} 
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-slate-900 border border-white/10 rounded p-2 text-white resize-none" 
                    rows="3"
                    required 
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-mono">RULES / ELIGIBILITY</label>
                  <input 
                    type="text" 
                    value={formData.registrationRules || ''} 
                    onChange={e => setFormData({ ...formData, registrationRules: e.target.value })}
                    className="w-full bg-slate-900 border border-white/10 rounded p-2 text-white" 
                    required 
                  />
                </div>
                <button type="submit" className="w-full py-2 bg-[#FF9E1B] text-slate-950 font-bold rounded">
                  Save Event
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
