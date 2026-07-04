"use client";
import React, { useState } from 'react';
import Link from 'next/link';

export default function PlacementTraining() {
  const [code, setCode] = useState(`function rotateMatrix(matrix) {
  // Write your in-place O(1) space matrix rotation here...
  return matrix;
}`);
  const [runStatus, setRunStatus] = useState("");
  const [running, setRunning] = useState(false);

  const simulateCodeRun = (e) => {
    e.preventDefault();
    setRunning(true);
    setRunStatus("");
    setTimeout(() => {
      setRunning(false);
      setRunStatus("Compilation Successful! 15/15 test cases passed. Complexity: O(N^2) Time, O(1) Space.");
    }, 1500);
  };
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
        <section className="mb-20">
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

        {/* New Rich Content: Interactive Coding Sandbox */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
            <span className="w-6 h-1 bg-[#43e97b]"></span>
            Interactive Algorithmic Sandbox
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Coding Challenge Details */}
            <div className="glass-panel p-6 rounded-2xl border border-white/5">
              <span className="px-3 py-1 rounded bg-amber-500/10 border border-amber-500/35 text-amber-500 text-xs font-mono font-bold uppercase">CHALLENGE OF THE DAY</span>
              <h3 className="text-xl font-bold mt-3 mb-2 text-white">Rotate Image Matrix</h3>
              <p className="text-slate-400 text-xs leading-relaxed mb-4">
                You are given an n x n 2D matrix representing an image, rotate the image by 90 degrees (clockwise) **in-place**. You have to rotate the image in-place, which means you have to modify the input 2D matrix directly. **DO NOT** allocate another 2D matrix and do the rotation.
              </p>
              <div className="bg-slate-950/40 p-4 rounded-xl border border-white/5 font-mono text-xs text-slate-300">
                <span className="text-[#FF9E1B] font-bold block mb-1">Example Input:</span>
                matrix = [[1,2,3],[4,5,6],[7,8,9]]<br />
                <span className="text-[#43e97b] font-bold block mt-2 mb-1">Expected Output:</span>
                [[7,4,1],[8,5,2],[9,6,3]]
              </div>
            </div>

            {/* Simulated Live Editor */}
            <form onSubmit={simulateCodeRun} className="glass-panel p-6 rounded-2xl border border-[#43e97b]/20 flex flex-col justify-between">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-2">LIVE CODE COMPILER (JAVASCRIPT)</label>
                <textarea
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  rows="6"
                  className="w-full bg-slate-950/80 border border-white/10 rounded-xl p-4 text-xs font-mono text-glow-navy focus:outline-none focus:border-[#43e97b]/50 text-white resize-none"
                />
              </div>
              
              <div className="mt-4 flex flex-col sm:flex-row items-center gap-4 justify-between">
                <button
                  type="submit"
                  disabled={running}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-lg font-bold text-xs bg-gradient-to-r from-[#43e97b] to-[#38f9d7] text-slate-950 hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  {running ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                      COMPILING TESTS...
                    </>
                  ) : "RUN CODE TESTS"}
                </button>

                {runStatus && (
                  <span className="text-[10px] font-mono text-emerald-400 text-center sm:text-right animate-pulse">
                    {runStatus}
                  </span>
                )}
              </div>
            </form>
          </div>
        </section>

        {/* New Rich Content: Student success testimonials */}
        <section>
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
            <span className="w-6 h-1 bg-[#38f9d7]"></span>
            Student Success Stories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { name: "Rohit Deshmukh", role: "Software Engineer @ Google", text: "The daily coding drills and simulated mock interview sessions at TechYug completely changed my perspective on solving complex matrix and graph queries. I cleared my Google technical round in 35 minutes!" },
              { name: "Ananya Roy", role: "Cloud Architect @ Atlassian", text: "Building Kubernetes clusters and deploying real-world API microservices during the certifications bootcamp gave me the exact hands-on edge recruiters look for. Highly recommend!" }
            ].map((story, i) => (
              <div key={i} className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-[#38f9d7]/20 transition-all flex flex-col justify-between">
                <p className="text-slate-300 text-xs italic leading-relaxed mb-4">&quot;{story.text}&quot;</p>
                <div className="flex items-center gap-3 border-t border-white/5 pt-3">
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs text-[#FF9E1B]">{story.name[0]}</div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{story.name}</h4>
                    <span className="text-[10px] text-[#38f9d7] font-mono">{story.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
