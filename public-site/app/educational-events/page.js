"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function EducationalEvents() {
  const [events, setEvents] = useState([
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
  ]);
  const [loading, setLoading] = useState(false);
  const [registeredId, setRegisteredId] = useState(null);

  // Removed useEffect fetch to central API server

  const handleRegister = (eventId) => {
    setRegisteredId(eventId);
    // Mimic API register submission trigger
    setTimeout(() => {
      alert("Registration request submitted to TechYug central API database!");
      setRegisteredId(null);
    }, 1000);
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
                    onClick={() => handleRegister(e.id)}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#b19ffb] to-[#764ba2] hover:shadow-[0_0_15px_rgba(177,159,251,0.25)] text-white font-bold text-sm transition-all cursor-pointer"
                  >
                    {registeredId === e.id ? 'Connecting to API...' : 'Register for Event'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
