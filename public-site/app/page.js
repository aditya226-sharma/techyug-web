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
  const adminPortalUrl = process.env.NEXT_PUBLIC_ADMIN_PORTAL_URL || 'http://localhost:5173';
  const ceoPortalUrl = process.env.NEXT_PUBLIC_CEO_PORTAL_URL || 'http://127.0.0.1:5174';
  const [aboutOpen, setAboutOpen] = useState(false);

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
            <a 
              href={adminPortalUrl}
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-xs text-[#FF9E1B]/80 hover:text-[#FF9E1B] transition-colors font-mono tracking-wider flex items-center gap-1.5"
            >
              • ECOSYSTEM CONTROL CENTER →
            </a>
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
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="glass-panel p-3 rounded-lg border border-white/5">
                    <h5 className="font-bold text-white mb-0.5">Dr. Aravind Swamy</h5>
                    <span className="text-[10px] text-[#FF9E1B] font-mono">Academic Manager</span>
                  </div>
                  <div className="glass-panel p-3 rounded-lg border border-[#0F3D7A]/40">
                    <h5 className="font-bold text-white mb-0.5">Executive Office</h5>
                    <span className="text-[10px] text-[#00f2fe] font-mono">CEO Board</span>
                  </div>
                </div>
              </div>
              <p className="text-[10px] font-mono text-slate-500 text-center">
                © 2026 TechYug Innovations. All rights reserved.
              </p>
            </div>
          </div>

          <style jsx>{`
            @keyframes slideIn {
              from { transform: translateX(100%); }
              to { transform: translateX(0); }
            }
            .animate-slide-in {
              animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
          `}</style>
        </div>
      )}
    </main>
  );
}
