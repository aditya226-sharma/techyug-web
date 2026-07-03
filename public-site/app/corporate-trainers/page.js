"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function CorporateTrainers() {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:5001';
    fetch(`${apiBase}/api/faculty`)
      .then(res => {
        if (!res.ok) throw new Error("API Offline");
        return res.text();
      })
      .then(text => {
        if (!text || text.trim() === "") return [];
        return JSON.parse(text);
      })
      .then(data => {
        setTrainers(data);
        setLoading(false);
      })
      .catch(err => {
        console.warn("API offline, loading default trainer fallback dataset:", err);
        // Fallback mockup dataset
        setTrainers([
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
          }
        ]);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#121214] text-white flex flex-col">
      {/* Floating Header */}
      <header className="w-full h-20 px-8 flex items-center justify-between z-20 bg-[#121214]/60 backdrop-blur-md border-b border-white/5">
        <Link href="/" className="flex items-center gap-2 group">
          <svg className="w-4 h-4 text-[#FF9E1B] group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"></polyline></svg>
          <span className="font-sans text-lg font-bold tracking-wide">Back to Gateway</span>
        </Link>
        <span className="text-[#FF9E1B] font-mono text-sm tracking-wider uppercase font-semibold">Pillar 01 // Corporate Trainers</span>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-6 py-12 flex-1 w-full">
        {/* Intro */}
        <div className="mb-16 max-w-3xl">
          <h1 className="text-4xl font-extrabold mb-4 bg-gradient-to-r from-white via-slate-100 to-[#4facfe] bg-clip-text text-transparent">
            Corporate Trainers as Faculty
          </h1>
          <p className="text-[#94a3b8] text-lg leading-relaxed">
            TechYug Innovations deploys battle-tested industry technical consultants directly into university classrooms. We integrate corporate experience directly into college timetables to build industry-ready graduates.
          </p>
        </div>

        {/* Lifecycle Section */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
            <span className="w-6 h-1 bg-[#4facfe]"></span>
            Academic Delivery Model
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="glass-panel p-6 rounded-xl border-t-2 border-t-[#4facfe]">
              <div className="text-[#4facfe] font-mono font-bold text-lg mb-3">01 // Recruit</div>
              <h3 className="font-semibold text-lg mb-2">Expert Screening</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Select top consultants from leading tech firms (Microsoft, AWS, Google) with over 8+ years of technical experience.</p>
            </div>
            
            <div className="glass-panel p-6 rounded-xl border-t-2 border-t-[#FF9E1B]">
              <div className="text-[#FF9E1B] font-mono font-bold text-lg mb-3">02 // Integrate</div>
              <h3 className="font-semibold text-lg mb-2">Timetable Mapping</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Map trainer schedules directly into college timetables to deliver lectures as guest Assistant Professors.</p>
            </div>

            <div className="glass-panel p-6 rounded-xl border-t-2 border-t-[#38f9d7]">
              <div className="text-[#38f9d7] font-mono font-bold text-lg mb-3">03 // Deliver</div>
              <h3 className="font-semibold text-lg mb-2">Hands-on Learning</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Conduct lecture series using actual production scenarios, system architectures, and live coding exercises.</p>
            </div>

            <div className="glass-panel p-6 rounded-xl border-t-2 border-t-[#b19ffb]">
              <div className="text-[#b19ffb] font-mono font-bold text-lg mb-3">04 // Validate</div>
              <h3 className="font-semibold text-lg mb-2">Quality Tracking</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Audit lecturer performance, monitor batch completion metrics, and review internal exam marksheets.</p>
            </div>
          </div>
        </section>

        {/* Dynamic Expert Grid */}
        <section>
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
            <span className="w-6 h-1 bg-[#FF9E1B]"></span>
            Curated Trainer Resource Pool
          </h2>

          {loading ? (
            <div className="text-center py-12 text-slate-500 font-mono">LOADING TRAINER POOL...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {trainers.map(t => (
                <div key={t.id} className="glass-panel p-6 rounded-2xl flex flex-col sm:flex-row gap-6 items-start">
                  <img 
                    src={t.avatar} 
                    alt={t.name}
                    className="w-20 h-20 rounded-full object-cover border-2 border-[#4facfe]"
                    onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop"; }}
                  />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white">{t.name}</h3>
                    <div className="text-sm text-[#38f9d7] font-semibold mb-2">{t.expertise}</div>
                    <div className="text-xs text-slate-500 font-mono mb-3">{t.experience}</div>
                    <p className="text-slate-350 text-sm leading-relaxed mb-4">{t.bio}</p>
                    
                    <div className="flex gap-4 border-t border-white/5 pt-3">
                      <div className="text-xs">
                        <span className="text-slate-500 block font-mono">ASSIGNED BATCH</span>
                        <span className="font-semibold text-slate-300">{t.assignedBatch || "Available"}</span>
                      </div>
                      <div className="text-xs">
                        <span className="text-slate-500 block font-mono">ADHERENCE AUDIT</span>
                        <span className="font-semibold text-[#FF9E1B]">{t.timetableAdherence || "100%"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
