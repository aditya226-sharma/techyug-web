// admin-portal/src/App.jsx
import React, { useState, useEffect } from 'react';
import { 
  Building, Users, Activity, Calendar, LogOut, Plus, Edit, Trash2, Shield, Upload, FileText, CheckCircle
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5001/api';

export default function App() {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [view, setView] = useState('faculty'); // Default sub-route

  // Data States
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

  // Load token from local storage
  useEffect(() => {
    const savedToken = localStorage.getItem('admin_token');
    const savedRole = localStorage.getItem('admin_role');
    const savedEmail = localStorage.getItem('admin_email');
    if (savedToken && savedRole === 'Operations') {
      setToken(savedToken);
      setRole(savedRole);
      setEmail(savedEmail);
    }
  }, []);

  // Fetch data on view change
  useEffect(() => {
    if (!token) return;
    if (view === 'universities') fetchUniversities();
    if (view === 'faculty') fetchFaculty();
    if (view === 'delivery-tracking') fetchDelivery();
    if (view === 'events-manager') fetchEvents();
  }, [token, view]);

  // Toast notifier
  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  // API Call Helpers (Sync to localStorage)
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
          technicalScreening: "Passed",
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
          technicalScreening: "Passed",
          timetableAdherence: "100%"
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
        }
      ];
      localStorage.setItem('mock_events', JSON.stringify(initial));
      setEvents(initial);
    }
  };

  // Auth Handler
  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError('');
    if (loginEmail === 'manager@techyug.in' && loginPassword === 'manager123') {
      const mockToken = "mock-admin-token-123456";
      localStorage.setItem('admin_token', mockToken);
      localStorage.setItem('admin_role', 'Operations');
      localStorage.setItem('admin_email', loginEmail);
      setToken(mockToken);
      setRole('Operations');
      setEmail(loginEmail);
      triggerToast("Welcome back! Login authorized.");
    } else {
      setLoginError("Invalid Operations credentials");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_role');
    localStorage.removeItem('admin_email');
    setToken(null);
    setRole('');
    setEmail('');
  };

  // University Onboard submit
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

  // Faculty CRUD Operations
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
        technicalScreening: "Passed",
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

  // Events Manager CRUD Operations
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

  // Login Page View
  if (!token) {
    return (
      <div className="w-screen h-screen flex justify-center items-center bg-[#121214] text-white">
        <div className="w-full max-w-md p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center border border-[#0F3D7A]/50">
              <Shield className="w-6 h-6 text-accent" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center mb-2">TechYug Operations</h2>
          <p className="text-slate-400 text-xs text-center mb-6">Log in to manage university curricula and trainer operations.</p>
          
          {loginError && <div className="p-3 mb-4 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-xs">{loginError}</div>}
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">EMAIL ADDRESS</label>
              <input 
                type="email" 
                value={loginEmail} 
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full bg-slate-900/50 border border-white/10 rounded-lg p-2.5 text-sm focus:outline-none focus:border-accent text-slate-200"
                required 
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">PASSWORD</label>
              <input 
                type="password" 
                value={loginPassword} 
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full bg-slate-900/50 border border-white/10 rounded-lg p-2.5 text-sm focus:outline-none focus:border-accent text-slate-200"
                required 
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-[#0F3D7A] hover:bg-sky-800 text-white font-bold py-2.5 rounded-lg text-sm transition-all shadow-[0_0_10px_rgba(15,61,122,0.4)] cursor-pointer"
            >
              Sign In
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <a href={import.meta.env.VITE_PUBLIC_SITE_URL || 'http://127.0.0.1:3000'} className="text-xs text-accent hover:underline font-mono">← Go to Public Gateway</a>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard Page View
  return (
    <div className="w-screen h-screen flex bg-[#121214] text-slate-100 overflow-hidden font-sans">
      {/* 1. Sidebar Navigation */}
      <aside className="w-64 bg-slate-950 border-r border-white/5 p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-8">
            <div className="w-3.5 h-3.5 rounded-full bg-accent shadow-[0_0_10px_#FF9E1B]"></div>
            <span className="font-sans font-bold text-lg text-white">TechYug Ops</span>
          </div>

          <nav className="space-y-1">
            <button 
              onClick={() => setView('faculty')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${view === 'faculty' ? 'bg-[#0F3D7A]/20 text-accent border-l-3 border-l-accent' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
            >
              <Users className="w-4 h-4" />
              Corporate Trainers
            </button>
            <button 
              onClick={() => setView('universities')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${view === 'universities' ? 'bg-[#0F3D7A]/20 text-accent border-l-3 border-l-accent' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
            >
              <Building className="w-4 h-4" />
              University MoUs
            </button>
            <button 
              onClick={() => setView('delivery-tracking')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${view === 'delivery-tracking' ? 'bg-[#0F3D7A]/20 text-accent border-l-3 border-l-accent' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
            >
              <Activity className="w-4 h-4" />
              Delivery Tracking
            </button>
            <button 
              onClick={() => setView('events-manager')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${view === 'events-manager' ? 'bg-[#0F3D7A]/20 text-accent border-l-3 border-l-accent' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
            >
              <Calendar className="w-4 h-4" />
              Events Manager
            </button>
          </nav>
        </div>

        <div>
          <div className="p-3 mb-4 rounded-lg bg-white/5 border border-white/5 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#0F3D7A] flex items-center justify-center text-xs font-bold text-accent">
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
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* 2. Workspace Viewport */}
      <main className="flex-1 p-8 overflow-y-auto flex flex-col">
        {/* Module Header */}
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/5">
          <div>
            <h1 className="text-2xl font-bold capitalize text-white">{view.replace('-', ' ')} Workspace</h1>
            <p className="text-slate-400 text-xs">Manage active assets and databases synchronized with the public API.</p>
          </div>
          
          {(view === 'faculty' || view === 'events-manager') && (
            <button 
              onClick={() => {
                setModalType(view === 'faculty' ? 'faculty' : 'event');
                setEditId(null);
                setFormData({});
                setShowModal(true);
              }}
              className="bg-[#0F3D7A] hover:bg-sky-800 text-white font-bold py-2 px-4 rounded-lg text-sm flex items-center gap-2 shadow-[0_0_10px_rgba(15,61,122,0.4)] transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add Record
            </button>
          )}
        </div>

        {/* Dynamic Inner Subpage Content */}
        <div className="flex-1">
          {view === 'faculty' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {faculty.map(t => (
                <div key={t.id} className="p-6 rounded-xl bg-white/5 border border-white/5 flex flex-col justify-between">
                  <div className="flex gap-4 items-start">
                    <img 
                      src={t.avatar} 
                      alt={t.name} 
                      className="w-14 h-14 rounded-full object-cover border border-[#0F3D7A]"
                      onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop"; }}
                    />
                    <div>
                      <h3 className="font-bold text-white text-lg">{t.name}</h3>
                      <div className="text-xs text-[#00f2fe] font-semibold mb-1">{t.expertise}</div>
                      <div className="text-[10px] text-slate-500 font-mono mb-2">{t.experience}</div>
                      <p className="text-slate-400 text-xs leading-relaxed">{t.bio}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
                    <div className="flex gap-4">
                      <div className="text-[10px]">
                        <span className="text-slate-500 block">BATCH MAPPING</span>
                        <span className="font-bold text-slate-300">{t.assignedBatch || "None"}</span>
                      </div>
                      <div className="text-[10px]">
                        <span className="text-slate-500 block">TIMETABLE ADHERENCE</span>
                        <span className="font-bold text-[#FF9E1B]">{t.timetableAdherence || "100%"}</span>
                      </div>
                      <div className="text-[10px]">
                        <span className="text-slate-500 block">SCREENING</span>
                        <span className="font-bold text-emerald-500">{t.technicalScreening || "Passed"}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          setModalType('faculty');
                          setEditId(t.id);
                          setFormData(t);
                          setShowModal(true);
                        }}
                        className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-slate-300"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => handleDeleteFaculty(t.id)}
                        className="p-1.5 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {view === 'universities' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Onboard Form */}
              <div className="lg:col-span-1 p-6 rounded-xl bg-white/5 border border-white/5 h-fit">
                <h3 className="font-bold text-white text-lg mb-4 flex items-center gap-2">
                  <Upload className="w-4 h-4 text-accent" />
                  Onboard University
                </h3>
                <form onSubmit={handleOnboardUniversity} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">UNIVERSITY NAME</label>
                    <input 
                      type="text" 
                      value={uniName}
                      onChange={(e) => setUniName(e.target.value)}
                      placeholder="e.g., Delhi University"
                      className="w-full bg-slate-900/50 border border-white/10 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-accent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">SIGNED MOU DOCUMENT (.PDF)</label>
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-white/10 border-dashed rounded-lg cursor-pointer bg-slate-900/30 hover:bg-slate-900/50">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <FileText className="w-8 h-8 text-slate-500 mb-2" />
                          <p className="text-xs text-slate-400 font-semibold">
                            {mouFile ? mouFile.split('\\').pop() : 'Click to select MoU PDF'}
                          </p>
                        </div>
                        <input 
                          type="file" 
                          accept=".pdf"
                          value={mouFile}
                          onChange={(e) => setMouFile(e.target.value)}
                          className="hidden" 
                        />
                      </label>
                    </div>
                  </div>
                  <button 
                    type="submit"
                    className="w-full bg-[#0F3D7A] hover:bg-sky-800 text-white font-bold py-2 rounded-lg text-xs transition-all cursor-pointer"
                  >
                    Onboard MoU Contract
                  </button>
                </form>
              </div>

              {/* Onboarded List */}
              <div className="lg:col-span-2 space-y-4">
                <h3 className="font-bold text-white text-lg mb-4 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  Active MoU Partnerships
                </h3>
                
                {universities.map(u => (
                  <div key={u.id} className="p-4 rounded-xl bg-white/5 border border-white/5 flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-white text-sm">{u.name}</h4>
                      <p className="text-xs text-slate-400 mt-1 font-mono">MoU: {u.mouFilename}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">Onboarded: {new Date(u.onboardedAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-[10px] px-2.5 py-1 rounded bg-[#0F3D7A]/30 text-[#00f2fe] border border-[#0F3D7A]/50 font-semibold font-mono">
                        Active Partner
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {view === 'delivery-tracking' && (
            <div className="space-y-8">
              {/* Syllabus metrics card */}
              <div className="p-6 rounded-xl bg-white/5 border border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <h3 className="font-bold text-white text-lg mb-1">Academic Syllabus Completion Audit</h3>
                  <p className="text-slate-400 text-xs">Verify current syllabus metrics across active university timetables.</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-3xl font-extrabold text-accent">{delivery.syllabusCompletion}</span>
                  <div className="flex flex-col gap-1.5">
                    <button 
                      onClick={() => handleUpdateSyllabus(85)}
                      className="px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/5 rounded text-xs font-semibold text-slate-300 cursor-pointer"
                    >
                      Audit: Set 85%
                    </button>
                    <button 
                      onClick={() => handleUpdateSyllabus(95)}
                      className="px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/5 rounded text-xs font-semibold text-slate-300 cursor-pointer"
                    >
                      Audit: Set 95%
                    </button>
                  </div>
                </div>
              </div>

              {/* Lecture Logs Table */}
              <div className="p-6 rounded-xl bg-white/5 border border-white/5">
                <h3 className="font-bold text-white text-lg mb-4">Daily Lecture Upload Logs</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950 text-slate-400 uppercase font-mono">
                      <tr>
                        <th className="p-3">DATE</th>
                        <th className="p-3">TOPIC</th>
                        <th className="p-3">BATCH</th>
                        <th className="p-3">UPLOAD FILE</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {(delivery.dailyLectureLogs || []).map((log, idx) => (
                        <tr key={idx} className="hover:bg-white/2">
                          <td className="p-3 text-slate-300 font-mono">{log.date}</td>
                          <td className="p-3 font-semibold text-white">{log.topic}</td>
                          <td className="p-3 text-slate-400">{log.batch}</td>
                          <td className="p-3 text-accent font-mono hover:underline cursor-pointer">{log.uploadUrl}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {view === 'events-manager' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {events.map(e => (
                <div key={e.id} className="p-6 rounded-xl bg-white/5 border border-white/5 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#0f3d7a]/30 border border-[#0f3d7a]/50 text-accent font-mono font-bold">
                        {e.title.includes('Workshop') ? 'Workshop' : 'Hackathon'}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">{e.date}</span>
                    </div>
                    <h3 className="font-bold text-white text-lg mb-2">{e.title}</h3>
                    <p className="text-slate-450 text-xs leading-normal mb-3">{e.description}</p>
                    <div className="p-3 bg-slate-900/50 rounded-lg text-[10px] border border-white/5 space-y-1">
                      <div><span className="text-slate-500">RULES:</span> <span className="text-slate-350">{e.registrationRules}</span></div>
                      <div><span className="text-slate-500">VENUE:</span> <span className="text-slate-350">{e.venue}</span></div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-white/5 flex justify-end gap-2">
                    <button 
                      onClick={() => {
                        setModalType('event');
                        setEditId(e.id);
                        setFormData(e);
                        setShowModal(true);
                      }}
                      className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-slate-300"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => handleDeleteEvent(e.id)}
                      className="p-1.5 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* 3. Reusable Editor Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex justify-center items-center p-4">
          <div className="w-full max-w-lg bg-[#121214] border border-white/10 rounded-2xl p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-4">
              {editId ? 'Edit Record' : 'Add New Record'}
            </h2>
            
            <form onSubmit={modalType === 'faculty' ? handleSaveFaculty : handleSaveEvent} className="space-y-4">
              {modalType === 'faculty' ? (
                <>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 mb-1">TRAINER NAME</label>
                    <input 
                      type="text" 
                      value={formData.name || ''} 
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-slate-900 border border-white/5 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-accent"
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 mb-1">EXPERTISE DOMAIN</label>
                    <input 
                      type="text" 
                      value={formData.expertise || ''} 
                      onChange={(e) => setFormData({ ...formData, expertise: e.target.value })}
                      placeholder="e.g. Cloud Security"
                      className="w-full bg-slate-900 border border-white/5 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-accent"
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 mb-1">EXPERIENCE DETAILS</label>
                    <input 
                      type="text" 
                      value={formData.experience || ''} 
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                      className="w-full bg-slate-900 border border-white/5 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-accent"
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 mb-1">BIOGRAPHY</label>
                    <textarea 
                      value={formData.bio || ''} 
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      className="w-full bg-slate-900 border border-white/5 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-accent h-20"
                      required 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-400 mb-1">ASSIGNED BATCH</label>
                      <input 
                        type="text" 
                        value={formData.assignedBatch || ''} 
                        onChange={(e) => setFormData({ ...formData, assignedBatch: e.target.value })}
                        className="w-full bg-slate-900 border border-white/5 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-accent"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-400 mb-1">SCREENING SCORE</label>
                      <input 
                        type="text" 
                        value={formData.technicalScreening || ''} 
                        onChange={(e) => setFormData({ ...formData, technicalScreening: e.target.value })}
                        className="w-full bg-slate-900 border border-white/5 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-accent"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 mb-1">EVENT TITLE</label>
                    <input 
                      type="text" 
                      value={formData.title || ''} 
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full bg-slate-900 border border-white/5 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-accent"
                      required 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-400 mb-1">DATE</label>
                      <input 
                        type="text" 
                        value={formData.date || ''} 
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full bg-slate-900 border border-white/5 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-accent"
                        required 
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-400 mb-1">VENUE</label>
                      <input 
                        type="text" 
                        value={formData.venue || ''} 
                        onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                        className="w-full bg-slate-900 border border-white/5 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-accent"
                        required 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 mb-1">DESCRIPTION</label>
                    <textarea 
                      value={formData.description || ''} 
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full bg-slate-900 border border-white/5 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-accent h-20"
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 mb-1">REGISTRATION RULES</label>
                    <input 
                      type="text" 
                      value={formData.registrationRules || ''} 
                      onChange={(e) => setFormData({ ...formData, registrationRules: e.target.value })}
                      className="w-full bg-slate-900 border border-white/5 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-accent"
                    />
                  </div>
                </>
              )}
              
              <div className="flex justify-end gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/5 text-slate-350 text-xs font-bold rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-[#0F3D7A] hover:bg-sky-800 text-white text-xs font-bold rounded-lg cursor-pointer"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Feedback Toast */}
      {toastMsg && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-accent text-slate-950 font-bold px-6 py-3 rounded-full text-xs z-50 shadow-lg tracking-wide">
          {toastMsg}
        </div>
      )}
    </div>
  );
}
