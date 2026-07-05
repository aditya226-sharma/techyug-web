"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function SoftwareDevelopment() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    requestAnimationFrame(() => {
      setProjects([
        {
          id: "dev-1",
          title: "EduPortal LMS Ecosystem",
          category: "Enterprise Software",
          tech: ["Node.js", "React.js", "GraphQL", "PostgreSQL"],
          description: "A comprehensive Learning Management System deployed across 15+ universities, supporting real-time student analytics, automated grading, and live video lectures.",
          image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&h=300&fit=crop"
        },
        {
          id: "dev-2",
          title: "VitalsConnect Healthcare App",
          category: "Mobile Application",
          tech: ["Flutter", "Firebase", "WebRTC", "Node.js"],
          description: "Cross-platform mobile telemedicine application enabling real-time vitals monitoring via IoT integration, secure e-prescriptions, and encrypted video consultations.",
          image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&h=300&fit=crop"
        },
        {
          id: "dev-3",
          title: "AgriVision AI Platform",
          category: "Web & AI Solution",
          tech: ["Python", "TensorFlow", "FastAPI", "React"],
          description: "Computer vision web portal for smart farms to detect early crop diseases, estimate yields via drone imagery, and generate automated watering schedules.",
          image: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=500&h=300&fit=crop"
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
        <span className="text-[#FF9E1B] font-mono text-sm tracking-wider uppercase font-semibold">Pillar 02 // Software Development</span>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12 flex-1 w-full">
        {/* Intro Header */}
        <div className="mb-16 max-w-3xl">
          <h1 className="text-4xl font-extrabold mb-4 bg-gradient-to-r from-white via-slate-100 to-[#00f2fe] bg-clip-text text-transparent">
            Software, Web & App Development
          </h1>
          <p className="text-[#94a3b8] text-lg leading-relaxed">
            From design to scalable cloud architectures. TechYug Innovations delivers custom enterprise-grade software products, responsive web portals, and cross-platform native mobile applications.
          </p>
        </div>

        {/* Dynamic Showcase Grid */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
            <span className="w-6 h-1 bg-[#00f2fe]"></span>
            Product Portfolio
          </h2>

          {loading ? (
            <div className="text-center py-12 text-slate-500 font-mono">LOADING PROJECTS PORTFOLIO...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {projects.map(p => (
                <div key={p.id} className="glass-panel rounded-2xl overflow-hidden group flex flex-col justify-between border border-white/5 hover:border-[#00f2fe]/40 transition-all duration-300">
                  <div>
                    <img 
                      src={p.image} 
                      alt={p.title}
                      className="w-full h-48 object-cover opacity-85 group-hover:opacity-100 transition-opacity duration-300"
                    />
                    <div className="p-6">
                      <span className="text-xs uppercase text-[#FF9E1B] font-bold font-mono tracking-widest block mb-2">{p.category}</span>
                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#00f2fe] transition-colors">{p.title}</h3>
                      <p className="text-slate-400 text-sm leading-relaxed mb-4">{p.description}</p>
                    </div>
                  </div>
                  
                  <div className="px-6 pb-6 pt-3 border-t border-white/5 flex flex-wrap gap-2">
                    {p.tech.map(t => (
                      <span key={t} className="text-xs px-2.5 py-1 rounded-md bg-slate-800/60 border border-white/5 text-slate-400 font-mono">{t}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Development Capabilities Cards */}
        <section>
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
            <span className="w-6 h-1 bg-[#FF9E1B]"></span>
            Technical Capabilities
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass-panel p-8 rounded-2xl border-l-4 border-l-[#00f2fe]">
              <h3 className="text-lg font-bold text-white mb-2">High-Throughput Backend Architecture</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                We construct scalable server topologies using containerized microservices (Docker & Kubernetes) running on Node.js/Go, ensuring lightning-fast RESTful or gRPC communication layers with zero downtime.
              </p>
            </div>

            <div className="glass-panel p-8 rounded-2xl border-l-4 border-l-[#FF9E1B]">
              <h3 className="text-lg font-bold text-white mb-2">Interactive, High-Fidelity Frontends</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Utilizing React, Next.js, and advanced styling modules, our frontend systems feature smooth, fluid micro-interactions, accessibility adherence (WCAG compliance), and search engine optimization.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
