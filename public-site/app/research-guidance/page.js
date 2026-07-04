"use client";
import React from 'react';
import Link from 'next/link';

export default function ResearchGuidance() {
  return (
    <div className="min-h-screen bg-[#121214] text-white flex flex-col">
      {/* Floating Header */}
      <header className="w-full h-20 px-8 flex items-center justify-between z-20 bg-[#121214]/60 backdrop-blur-md border-b border-white/5">
        <Link href="/" className="flex items-center gap-2 group">
          <svg className="w-4 h-4 text-[#FF9E1B] group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"></polyline></svg>
          <span className="font-sans text-lg font-bold tracking-wide">Back to Gateway</span>
        </Link>
        <span className="text-[#FF9E1B] font-mono text-sm tracking-wider uppercase font-semibold">Pillar 03 // Research Guidance</span>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12 flex-1 w-full">
        {/* Intro */}
        <div className="mb-16 max-w-3xl">
          <h1 className="text-4xl font-extrabold mb-4 bg-gradient-to-r from-white via-slate-100 to-[#38f9d7] bg-clip-text text-transparent">
            Research Publications & PhD Guidance
          </h1>
          <p className="text-[#94a3b8] text-lg leading-relaxed">
            Pioneering academic research and indexing excellence. TechYug Innovations assists scholars, professors, and universities in developing high-impact research, structuring PhD methodologies, and publishing in Scopus and Web of Science index journals.
          </p>
        </div>

        {/* Indexing pipeline */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
            <span className="w-6 h-1 bg-[#38f9d7]"></span>
            Scopus & Web of Science Indexing Pipelines
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-panel p-6 rounded-xl border border-white/5">
              <h3 className="text-[#38f9d7] font-semibold text-lg mb-2">1. Literature Gap Analysis</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                We perform comprehensive database sweeps (IEEE Xplore, Google Scholar, ACM Digital Library) to identify novel research opportunities and formulate robust hypotheses.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-xl border border-white/5">
              <h3 className="text-[#38f9d7] font-semibold text-lg mb-2">2. Experimental Simulation</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                Deploy simulation models in MATLAB, Python, or NS3. We gather quantitative dataset metrics, establish control benchmarks, and write comparative performance profiles.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-xl border border-white/5">
              <h3 className="text-[#38f9d7] font-semibold text-lg mb-2">3. Peer Review Prep</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                Format papers strictly according to target IEEE/ACM styles. We perform technical grammar reviews and resolve potential reviewer critiques to streamline paper approval.
              </p>
            </div>
          </div>
        </section>

        {/* PhD Support & Rankings */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <div className="glass-panel p-8 rounded-2xl border-l-4 border-l-[#FF9E1B]">
            <h3 className="text-xl font-bold text-white mb-4">Comprehensive PhD Mentoring</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <svg className="w-4 h-4 text-[#FF9E1B] mt-1 shrink-0" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <p className="text-slate-300 text-sm leading-relaxed">Systematic research proposal creation and thesis structuring.</p>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-4 h-4 text-[#FF9E1B] mt-1 shrink-0" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <p className="text-slate-300 text-sm leading-relaxed">Weekly check-ins for code simulation, data refinement, and chapter drafts.</p>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-4 h-4 text-[#FF9E1B] mt-1 shrink-0" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <p className="text-slate-300 text-sm leading-relaxed">Comprehensive review of presentation deliverables for doctoral colloquiums.</p>
              </li>
            </ul>
          </div>

          <div className="glass-panel p-8 rounded-2xl border-l-4 border-l-[#38f9d7]">
            <h3 className="text-xl font-bold text-white mb-4">Institutional Ranking Advantages</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              Universities that prioritize active research publications enjoy a significant competitive edge in national rankings (NIRF, NAAC accreditation, and global QS rankings). 
            </p>
            <p className="text-slate-400 text-sm leading-relaxed">
              We consult directly with academic directors to establish active Institutional Research Centers, raising college profiles and attracting premium student enrollments.
            </p>
          </div>
        </section>

        {/* New Rich Content: Research Domains */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
            <span className="w-6 h-1 bg-[#38f9d7]"></span>
            Active Research Domains
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Post-Quantum Cryptography", desc: "Developing algorithms resistant to quantum computing attacks for bank networks." },
              { title: "Algorithmic Bioinformatics", desc: "Optimizing sequence-alignment runtimes for fast cancer mutation mapping." },
              { title: "Autonomous Edge Systems", desc: "Energy-efficient model deployment on IoT devices for agricultural intelligence." },
              { title: "Zero-Trust Architecture Protocols", desc: "Formal verification of security policies in distributed cloud deployments." },
              { title: "Digital Green Computing", desc: "Cooling and load allocation algorithms to minimize data center emissions." },
              { title: "Federated Learning Engines", desc: "Collaborative machine learning model training without centralizing sensitive datasets." }
            ].map((domain, i) => (
              <div key={i} className="glass-panel p-6 rounded-xl border border-white/5 hover:border-[#38f9d7]/35 transition-all">
                <div className="text-xs text-[#38f9d7] font-mono mb-2 uppercase">DOMAIN AREA // 0{i+1}</div>
                <h3 className="text-lg font-bold text-white mb-2">{domain.title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed">{domain.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* New Rich Content: Recent Publications */}
        <section>
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
            <span className="w-6 h-1 bg-[#FF9E1B]"></span>
            Recent Guided Publications (Scopus / Web of Science)
          </h2>
          <div className="overflow-x-auto glass-panel rounded-2xl border border-white/5">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/10 bg-slate-900/40 text-slate-400">
                  <th className="p-4 font-mono">PAPER ID</th>
                  <th className="p-4">PUBLICATION TITLE</th>
                  <th className="p-4">AUTHORS</th>
                  <th className="p-4">JOURNAL INDEXING</th>
                  <th className="p-4 text-right">CITATIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[
                  { id: "TY-RES-042", title: "Optimizing Distributed Load Allocation for Low-Emission Data Centers", authors: "Dr. A. Swamy, Dr. E. Vance", journal: "IEEE Transactions on Green Computing", citations: "47" },
                  { id: "TY-RES-059", title: "Lattice-Based Post-Quantum Secure Schemes for Banking Infrastructure", authors: "E. Rostova, Prof. S. Sen", journal: "Journal of Cryptographic Engineering", citations: "31" },
                  { id: "TY-RES-071", title: "Federated Learning Pipelines in Multi-tenant Health Informatics", authors: "Dr. Sophia Chen, Marcus Vance", journal: "Bioinformatics Research Letters", citations: "24" }
                ].map((paper, i) => (
                  <tr key={i} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-mono text-[#38f9d7]">{paper.id}</td>
                    <td className="p-4 font-bold text-white">{paper.title}</td>
                    <td className="p-4 text-slate-350">{paper.authors}</td>
                    <td className="p-4 text-[#FF9E1B] font-mono">{paper.journal}</td>
                    <td className="p-4 text-right font-mono font-bold text-white">{paper.citations}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
