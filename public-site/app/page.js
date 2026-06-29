"use client";
import React from 'react';
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
  const adminPortalUrl = process.env.NEXT_PUBLIC_ADMIN_PORTAL_URL || 'http://127.0.0.1:5173';
  const ceoPortalUrl = process.env.NEXT_PUBLIC_CEO_PORTAL_URL || 'http://127.0.0.1:5174';

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
          <Link href="/corporate-trainers" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
            Services
          </Link>
          <a href={adminPortalUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-medium px-4 py-2 rounded-full bg-slate-800/80 hover:bg-slate-700/80 border border-white/10 text-slate-300 hover:text-white transition-all">
            Admin Portal
          </a>
          <a href={ceoPortalUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-bold px-4 py-2 rounded-full bg-[#0F3D7A]/40 hover:bg-[#0F3D7A]/60 border border-[#0F3D7A]/50 text-[#4facfe] hover:text-[#00f2fe] transition-all shadow-[0_0_15px_rgba(15,61,122,0.3)]">
            CEO Dashboard
          </a>
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
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs text-slate-500 font-mono">SYSTEM API: CONNECTED</span>
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
    </main>
  );
}
