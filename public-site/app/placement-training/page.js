"use client";
import React from 'react';
import Link from 'next/link';

export default function PlacementTraining() {
  return (
    <div className="min-h-screen bg-[#121214] text-white flex flex-col">
      {/* Floating Header */}
      <header className="w-full h-20 px-8 flex items-center justify-between z-20 bg-[#121214]/60 backdrop-blur-md border-b border-white/5">
        <Link href="/" className="flex items-center gap-2 group">
          <svg className="w-4 h-4 text-[#FF9E1B] group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"></polyline></svg>
          <span className="font-sans text-lg font-bold tracking-wide">Back to Gateway</span>
        </Link>
        <span className="text-[#FF9E1B] font-mono text-sm tracking-wider uppercase font-semibold">Pillar 06 // Placement Ready</span>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12 flex-1 w-full">
        {/* Intro */}
        <div className="mb-16 max-w-3xl">
          <h1 className="text-4xl font-extrabold mb-4 bg-gradient-to-r from-white via-slate-100 to-[#43e97b] bg-clip-text text-transparent">
            Placement-Ready Training & Bootcamps
          </h1>
          <p className="text-[#94a3b8] text-lg leading-relaxed">
            Fast-track your transition from classroom to company. TechYug Innovations provides data-driven career ready mock evaluations, algorithm drills, resume auditing, and corporate placement pipelines with hiring partners.
          </p>
        </div>

        {/* Training Pillars Grid */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
            <span className="w-6 h-1 bg-[#43e97b]"></span>
            Career Preparedness Roadmap
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-panel p-6 rounded-xl border border-white/5">
              <h3 className="text-lg font-bold text-white mb-3">Algorithmic Coding Drills</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Daily, structured coding sessions covering advanced data structures, algorithmic complexity optimization, and system design mock interview walkthroughs.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-xl border border-white/5">
              <h3 className="text-lg font-bold text-white mb-3">Soft-Skill Architecture</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Refine verbal communications, group discussion strategies, resume presentation guidelines, and behavioral counseling matching corporate expectations.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-xl border border-white/5">
              <h3 className="text-lg font-bold text-white mb-3">Simulated Mock Panels</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Periodic technical mock interviews conducted by actual engineers from top tech organizations, followed by granular score cards and targeted growth reviews.
              </p>
            </div>
          </div>
        </section>

        {/* Hiring Partners Logos */}
        <section>
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
            <span className="w-6 h-1 bg-[#FF9E1B]"></span>
            Hiring Placement Partners
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div className="glass-panel py-8 px-4 rounded-xl flex items-center justify-center border border-white/5 text-center font-bold text-slate-400 tracking-wider">
              GOOGLE (EX-ALUMNI)
            </div>
            <div className="glass-panel py-8 px-4 rounded-xl flex items-center justify-center border border-white/5 text-center font-bold text-[#00f2fe] tracking-wider">
              TECHYUG DEVELOPMENTS
            </div>
            <div className="glass-panel py-8 px-4 rounded-xl flex items-center justify-center border border-white/5 text-center font-bold text-slate-400 tracking-wider">
              ATLASSIAN CORP
            </div>
            <div className="glass-panel py-8 px-4 rounded-xl flex items-center justify-center border border-white/5 text-center font-bold text-[#FF9E1B] tracking-wider">
              INNOVATE LABS
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
