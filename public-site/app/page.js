"use client";
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

// Dynamically import Three.js Canvas to prevent SSR issues in NextJS App Router
const ThreeCanvas = dynamic(() => import('@/components/ThreeCanvas'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-[#121214]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF9E1B]"></div>
      <p className="mt-4 text-[#94a3b8] text-sm tracking-wider font-mono">LOADING 3D ECOSYSTEM...</p>
    </div>
  )
});

export default function Home() {
  const adminPortalUrl = process.env.NEXT_PUBLIC_ADMIN_PORTAL_URL || 'http://localhost:5000';
  const ceoPortalUrl = process.env.NEXT_PUBLIC_CEO_PORTAL_URL || 'http://127.0.0.1:5174';
  const [aboutOpen, setAboutOpen] = useState(false);
  const [ceoBioOpen, setCeoBioOpen] = useState(false);

  return (
    <main className="relative w-screen h-screen bg-[#121214] overflow-hidden flex flex-col">
      {/* Immersive Background Grid Traces */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>

      {/* Floating Header */}
      <header className="absolute top-0 left-0 w-full h-20 px-8 flex items-center justify-between z-20 bg-gradient-to-b from-[#121214]/80 to-transparent backdrop-blur-sm border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#FF9E1B] rounded-full shadow-[0_0_10px_#FF9E1B]"></div>
          <span className="font-sans text-xl font-bold bg-gradient-to-r from-white via-slate-200 to-[#FF9E1B] bg-clip-text text-transparent tracking-wide">
            TechYug Innovations
          </span>
        </div>
        <nav className="flex items-center gap-6">
          <button 
            onClick={() => setAboutOpen(true)}
            className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
          >
            About Us
          </button>
          <Link href="/corporate-trainers" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
            Services
          </Link>
        </nav>
      </header>

      {/* Hero Title overlays (Left aligned) */}
      <div className="absolute top-36 left-12 max-w-lg z-10 pointer-events-none select-none">
        <div className="glass-panel p-8 rounded-2xl border-l-4 border-l-[#FF9E1B]">
          <div className="text-xs font-bold uppercase tracking-widest text-[#FF9E1B] mb-2 font-mono">
            Visionary Web Ecosystem
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white mb-4 leading-none">
            Bridging Academia <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4facfe] to-[#FF9E1B]">
              & Technical Industry
            </span>
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed mb-4">
            TechYug Innovations connects educational structures with active tech landscapes. Hover and select an orbital service node to explore our six functional pillars.
          </p>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs text-slate-500 font-mono">SYSTEM API: CONNECTED</span>
            </div>
            <Link 
              href="/admin"
              className="text-xs text-[#FF9E1B]/80 hover:text-[#FF9E1B] transition-colors font-mono tracking-wider flex items-center gap-1.5"
            >
              • ECOSYSTEM CONTROL CENTER →
            </Link>
          </div>
        </div>
      </div>

      {/* Floating Scroll / Interaction Instruction */}
      <div className="absolute bottom-6 right-12 z-10 pointer-events-none text-right">
        <p className="text-xs font-mono text-slate-500 tracking-wider">
          MOUSE PAN TO ORBIT • HOVER NODE TO EXPOND • CLICK TO ENTER
        </p>
      </div>

      {/* Full Screen WebGL Canvas */}
      <div className="w-full h-full z-0">
        <ThreeCanvas />
      </div>

      {/* About Us Slide-over Panel */}
      {aboutOpen && (
        <div className="absolute inset-0 z-30 flex justify-end bg-black/60 backdrop-blur-sm transition-all duration-300">
          {/* Backdrop click to close */}
          <div className="absolute inset-0 cursor-pointer" onClick={() => setAboutOpen(false)} />
          
          {/* Panel content */}
          <div className="relative w-full max-w-lg h-full bg-[#121214]/95 border-l border-white/10 p-10 flex flex-col justify-between shadow-[0_0_50px_rgba(0,0,0,0.8)] z-40 animate-slide-in">
            <div>
              {/* Header */}
              <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/5">
                <div>
                  <h2 className="text-xl font-bold bg-gradient-to-r from-white to-[#FF9E1B] bg-clip-text text-transparent">About TechYug</h2>
                  <p className="text-[10px] font-mono text-slate-500 tracking-wider">ACADEMIC & TECHNOLOGY INTEGRATIONS</p>
                </div>
                <button 
                  onClick={() => setAboutOpen(false)}
                  className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-all text-sm font-semibold"
                >
                  ✕
                </button>
              </div>

              {/* Company Info */}
              <div className="space-y-6 text-sm leading-relaxed">
                <div>
                  <h3 className="text-xs font-mono font-bold text-[#FF9E1B] uppercase tracking-wider mb-2">Our Mission</h3>
                  <p className="text-slate-350">
                    To bridge the gap between academic theory and practical software engineering by integrating industry experts directly into university curriculums and delivering premium software services.
                  </p>
                </div>

                <div>
                  <h3 className="text-xs font-mono font-bold text-[#00f2fe] uppercase tracking-wider mb-2">Our Vision</h3>
                  <p className="text-slate-350">
                    To become the global standard for high-performance university-to-corporate pipelines, fostering cutting-edge publications, top-tier placements, and scalable custom developments.
                  </p>
                </div>

                <div>
                  <h3 className="text-xs font-mono font-bold text-[#38f9d7] uppercase tracking-wider mb-2">The TechYug Paradigm</h3>
                  <p className="text-slate-350">
                    We coordinate university alliances, deploy specialized trainers, host hackathons, and publish peer-reviewed papers to build an ecosystem where students are day-one ready.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer / Leadership info */}
            <div className="border-t border-white/5 pt-6 space-y-4">
              <div>
                <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest mb-3">Leadership Team</h4>
                
                {/* CEO Card */}
                <div 
                  onClick={() => setCeoBioOpen(true)}
                  className="glass-panel p-4 rounded-xl border border-[#FF9E1B]/20 hover:border-[#FF9E1B]/40 hover:bg-white/[0.04] transition-all flex gap-4 items-center mb-4 bg-white/[0.02] cursor-pointer animate-pulse-slow"
                >
                  <img 
                    src="/ceo.png" 
                    alt="CEO & Founder" 
                    className="w-16 h-16 rounded-lg object-cover border border-white/10" 
                  />
                  <div>
                    <h5 className="font-bold text-sm text-white">MR. Kewal Metha</h5>
                    <span className="text-xs text-[#FF9E1B] font-mono block">CEO & Founder</span>
                    <p className="text-[10px] text-slate-400 mt-1 leading-normal font-sans">
                      Pioneering digital architecture and premium security standards across academic networks. Click to view credentials.
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-[10px] font-mono text-slate-500 text-center">
                © 2026 TechYug Innovations. All rights reserved.
              </p>
            </div>
          </div>

          {/* CEO Profile Modal */}
          {ceoBioOpen && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md transition-all duration-300">
              {/* Close click backdrop */}
              <div className="absolute inset-0" onClick={() => setCeoBioOpen(false)} />

              <div className="relative w-full max-w-2xl bg-[#121214] border border-white/10 p-8 rounded-3xl shadow-[0_0_60px_rgba(255,158,27,0.15)] z-50 flex flex-col md:flex-row gap-8 animate-zoom-in max-h-[90vh] overflow-y-auto m-4">
                {/* Close Button */}
                <button 
                  onClick={() => setCeoBioOpen(false)}
                  className="absolute top-6 right-6 w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-all text-sm cursor-pointer"
                >
                  ✕
                </button>

                {/* Profile Sidebar */}
                <div className="flex flex-col items-center text-center shrink-0 w-full md:w-48">
                  <img 
                    src="/ceo.png" 
                    alt="MR. Kewal Metha" 
                    className="w-32 h-32 rounded-2xl object-cover border border-[#FF9E1B]/30 shadow-lg mb-4" 
                  />
                  <h3 className="text-sm font-bold text-white mb-0.5">MR. Kewal Metha</h3>
                  <p className="text-[9px] font-mono text-[#FF9E1B] tracking-wider uppercase mb-3">CEO & Founder</p>
                  
                  <div className="w-full space-y-1.5 pt-4 border-t border-white/5 text-left text-[9px] font-mono text-slate-500">
                    <div className="flex justify-between">
                      <span>COMPANY:</span>
                      <span className="text-white">TechYug</span>
                    </div>
                    <div className="flex justify-between">
                      <span>FIELD:</span>
                      <span className="text-white">Cyber Security</span>
                    </div>
                    <div className="flex justify-between">
                      <span>COMPLIANCE:</span>
                      <span className="text-emerald-400 font-bold">Authorized</span>
                    </div>
                  </div>
                </div>

                {/* Content Details */}
                <div className="flex-1 space-y-4 text-slate-300 text-xs leading-relaxed text-left">
                  <div>
                    <h4 className="text-[9px] font-mono font-bold text-slate-500 tracking-widest uppercase mb-1">DESIGNATION & ALIGNMENT</h4>
                    <div className="text-[10px] font-bold text-white bg-slate-900/60 p-2.5 rounded-lg border border-white/5 font-mono leading-relaxed">
                      CEO & Founder | TechYug Innovations | Cyber Security<br/>
                      <span className="text-[#FF9E1B]">🔐 Cyber Security Professional | Team Lead & Operations Manager | Academic Coordinator</span>
                    </div>
                  </div>

                  <div className="space-y-3 text-slate-300 text-xs leading-relaxed">
                    <p>
                      Experienced Cyber Security professional with strong expertise in cyber security training, academic operations, and team leadership. Currently handling end-to-end coordination of lectures, labs, examinations, timetables, and faculty management, while actively contributing to cyber security initiatives and skill development programs.
                    </p>
                    <p>
                      Proven ability to manage 30+ team members, collaborate with HODs and Deans, and ensure smooth academic and operational workflows across multiple universities. Skilled in Cyber Security, Programming, Data Structures, and C, with hands-on experience in CTF platforms, lab management, and compliance handling.
                    </p>
                    <p>
                      Passionate about knowledge sharing, operational excellence, and continuous learning, with a strong focus on building industry-ready talent through structured training and real-world cyber security exposure.
                    </p>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {['Cyber Security', 'Team Leadership', 'Academic Operations', 'Data Structures', 'C Programming', 'CTF Training', 'Lab Management'].map((tag) => (
                      <span key={tag} className="px-2 py-1 rounded bg-[#FF9E1B]/10 border border-[#FF9E1B]/20 text-[#FF9E1B] font-mono text-[9px]">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <style jsx>{`
            @keyframes slideIn {
              from { transform: translateX(100%); }
              to { transform: translateX(0); }
            }
            @keyframes zoomIn {
              from { opacity: 0; transform: scale(0.95); }
              to { opacity: 1; transform: scale(1); }
            }
            @keyframes pulseGlow {
              0%, 100% { border-color: rgba(255, 158, 27, 0.2); box-shadow: 0 0 10px rgba(255, 158, 27, 0); }
              50% { border-color: rgba(255, 158, 27, 0.4); box-shadow: 0 0 15px rgba(255, 158, 27, 0.1); }
            }
            .animate-slide-in {
              animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
            .animate-zoom-in {
              animation: zoomIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
            .animate-pulse-slow {
              animation: pulseGlow 3s ease-in-out infinite;
            }
          `}</style>
        </div>
      )}
    </main>
  );
}
