"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function EducationalEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Registration Form States
  const [registeringEvent, setRegisteringEvent] = useState(null);
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentPhone, setStudentPhone] = useState('');
  const [studentCollege, setStudentCollege] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem('mock_events');
    requestAnimationFrame(() => {
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
      setLoading(false);
    });
  }, []);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!studentName || !studentEmail || !studentPhone || !studentCollege) return;

    const newReg = {
      id: `reg-${Date.now()}`,
      eventId: registeringEvent.id,
      eventTitle: registeringEvent.title,
      studentName,
      studentEmail,
      studentPhone,
      studentCollege,
      registeredAt: new Date().toISOString()
    };

    const existing = localStorage.getItem('mock_event_registrations');
    const list = existing ? JSON.parse(existing) : [];
    list.push(newReg);
    localStorage.setItem('mock_event_registrations', JSON.stringify(list));

    // Clear form inputs
    setStudentName('');
    setStudentEmail('');
    setStudentPhone('');
    setStudentCollege('');

    setRegistrationSuccess(true);
  };

  return (
    <div className="min-h-screen bg-[#121214] text-white flex flex-col">
      {/* Floating Header */}
      <header className="w-full h-20 px-8 flex items-center justify-between z-20 bg-[#121214]/60 backdrop-blur-md border-b border-white/5">
        <Link href="/" className="flex items-center gap-2 group">
          <svg className="w-4 h-4 text-[#FF9E1B] group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"></polyline></svg>
          <span className="font-sans text-lg font-bold tracking-wide">Back to Gateway</span>
        </Link>
        <span className="text-[#FF9E1B] font-mono text-sm tracking-wider uppercase font-semibold">Pillar 04 // Events Hub</span>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12 flex-1 w-full">
        {/* Intro */}
        <div className="mb-16 max-w-3xl">
          <h1 className="text-4xl font-extrabold mb-4 bg-gradient-to-r from-white via-slate-100 to-[#b19ffb] bg-clip-text text-transparent">
            Workshops, Hackathons & Ideathons
          </h1>
          <p className="text-[#94a3b8] text-lg leading-relaxed">
            Unlocking collaborative innovation. TechYug Innovations designs national-level programming hackathons, conceptual ideathons, and deep-dive technical workshops for students and industry professionals alike.
          </p>
        </div>

        {/* Dynamic Events List */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
            <span className="w-6 h-1 bg-[#b19ffb]"></span>
            Active & Upcoming Events
          </h2>

          {loading ? (
            <div className="text-center py-12 text-slate-500 font-mono">LOADING EVENTS CALENDAR...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {events.map(e => (
                <div key={e.id} className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col justify-between hover:border-[#b19ffb]/40 transition-all duration-300">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-xs px-2.5 py-1 rounded-full bg-[#b19ffb]/10 text-[#b19ffb] font-bold font-mono">
                        {e.title.includes('Workshop') ? 'Workshop' : 'Hackathon'}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">{e.date}</span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-2">{e.title}</h3>
                    <p className="text-slate-350 text-sm leading-relaxed mb-4">{e.description}</p>
                    
                    <div className="bg-slate-900/50 p-4 rounded-xl mb-6 border border-white/5">
                      <div className="text-xs font-bold text-[#FF9E1B] font-mono mb-1">REGISTRATION RULES</div>
                      <p className="text-xs text-slate-400 leading-normal">{e.registrationRules || "Open entry"}</p>
                      <div className="text-xs text-slate-500 font-mono mt-3">VENUE: {e.venue}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => setRegisteringEvent(e)}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#b19ffb] to-[#764ba2] hover:shadow-[0_0_15px_rgba(177,159,251,0.25)] text-white font-bold text-sm transition-all cursor-pointer"
                  >
                    Register for Event
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Registration Modal */}
      {registeringEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-[#121214] border border-white/10 p-8 rounded-2xl w-full max-w-md relative shadow-2xl">
            <button 
              onClick={() => {
                setRegisteringEvent(null);
                setRegistrationSuccess(false);
              }}
              className="absolute top-6 right-6 w-8 h-8 rounded-full border border-white/5 flex items-center justify-center hover:bg-white/5 text-slate-400 hover:text-white font-mono text-sm cursor-pointer"
            >
              ✕
            </button>

            {registrationSuccess ? (
              <div className="text-center space-y-4 py-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-2xl font-bold">
                  ✓
                </div>
                <h3 className="text-lg font-bold text-white">Registration Complete!</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Your registration for <span className="text-[#FF9E1B] font-bold">{registeringEvent.title}</span> has been logged. The operations team will reach out with the orientation agenda.
                </p>
                <button 
                  onClick={() => {
                    setRegisteringEvent(null);
                    setRegistrationSuccess(false);
                  }}
                  className="px-6 py-2 bg-[#FF9E1B] text-slate-950 font-bold rounded-lg text-xs cursor-pointer"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4 text-left">
                <div>
                  <h3 className="text-lg font-bold text-white leading-snug">{registeringEvent.title}</h3>
                  <p className="text-[10px] text-slate-400 font-mono tracking-wider mt-1">STUDENT REGISTRATION FORM</p>
                </div>

                <div className="space-y-3.5 pt-2">
                  <div>
                    <label className="block text-[10px] font-mono text-slate-500 mb-1">FULL NAME</label>
                    <input 
                      type="text" 
                      value={studentName}
                      onChange={e => setStudentName(e.target.value)}
                      className="w-full bg-slate-900 border border-white/10 rounded-lg p-2 text-xs focus:outline-none focus:border-[#FF9E1B] text-slate-200"
                      placeholder="E.g., Arjun Mehta"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-slate-500 mb-1">EMAIL ADDRESS</label>
                    <input 
                      type="email" 
                      value={studentEmail}
                      onChange={e => setStudentEmail(e.target.value)}
                      className="w-full bg-slate-900 border border-white/10 rounded-lg p-2 text-xs focus:outline-none focus:border-[#FF9E1B] text-slate-200"
                      placeholder="arjun@university.edu"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-slate-500 mb-1">PHONE NUMBER</label>
                    <input 
                      type="tel" 
                      value={studentPhone}
                      onChange={e => setStudentPhone(e.target.value)}
                      className="w-full bg-slate-900 border border-white/10 rounded-lg p-2 text-xs focus:outline-none focus:border-[#FF9E1B] text-slate-200"
                      placeholder="+91 98765 43210"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-slate-500 mb-1">COLLEGE / UNIVERSITY</label>
                    <input 
                      type="text" 
                      value={studentCollege}
                      onChange={e => setStudentCollege(e.target.value)}
                      className="w-full bg-slate-900 border border-white/10 rounded-lg p-2 text-xs focus:outline-none focus:border-[#FF9E1B] text-slate-200"
                      placeholder="E.g., IIT Bombay"
                      required
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="w-full py-2.5 bg-[#FF9E1B] text-slate-950 font-bold text-xs rounded-lg transition-all hover:opacity-90 cursor-pointer"
                >
                  Submit Registration
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
