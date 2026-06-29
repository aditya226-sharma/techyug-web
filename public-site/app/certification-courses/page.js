"use client";
import React, { useState } from 'react';
import Link from 'next/link';

export default function CertificationCourses() {
  const [courses] = useState([
    {
      id: "course-1",
      name: "Advanced Full-Stack Systems Engineering",
      duration: "16 Weeks",
      audience: "Undergraduate Students & Working Professionals",
      description: "A comprehensive, hands-on path spanning database engineering, responsive frontends, microservices architectures, and cloud DevSecOps.",
      syllabus: [
        { title: "Phase 1: UI/UX & Client Architecture", topics: ["ES6+ Syntax patterns", "React.js Hooks, state management, router", "Next.js rendering strategies (SSR, ISR, static)", "Tailwind custom styling frameworks"] },
        { title: "Phase 2: High-Performance API Engineering", topics: ["Node.js microservices with Express", "Database systems (PostgreSQL, indexes, normal forms)", "RESTful APIs & GraphQL schemas", "Redis cache integrations"] },
        { title: "Phase 3: System Design & Scalability", topics: ["Horizontal scaling vs Vertical scaling", "Load balancer models (Nginx, HAProxy)", "Message queue topologies (RabbitMQ, Kafka)", "Database replication and sharding"] },
        { title: "Phase 4: DevSecOps & Deployments", topics: ["Containerization with Docker", "Kubernetes cluster orchestrations", "CI/CD automated pipeline builds", "AWS AWS EC2, S3, RDS cloud operations"] }
      ]
    },
    {
      id: "course-2",
      name: "Practical Data Science & Deep Learning Pipelines",
      duration: "12 Weeks",
      audience: "Graduate Students & Research Scholars",
      description: "An intensive training program focused on building, deploying, and auditing machine learning models in production environments.",
      syllabus: [
        { title: "Phase 1: Advanced Statistical Analysis", topics: ["Exploratory Data Analysis (EDA)", "Probability distributions & hypothesis testing", "Data cleaning & feature engineering pipelines"] },
        { title: "Phase 2: Core Machine Learning Models", topics: ["Regression, decision trees, random forests", "Support Vector Machines (SVM)", "Unsupervised clustering algorithms"] },
        { title: "Phase 3: Deep Neural Networks", topics: ["TensorFlow & PyTorch fundamentals", "Convolutional Neural Networks (CNN) for computer vision", "Recurrent Neural Networks (RNN) & Transformer models"] },
        { title: "Phase 4: MLOps: Continuous Integration", topics: ["Model serving with FastAPI", "Model metrics monitoring in production", "Pipeline scaling with MLflow"] }
      ]
    }
  ]);

  const [openAccordion, setOpenAccordion] = useState(null);

  const toggleAccordion = (courseId, phaseIndex) => {
    const key = `${courseId}-${phaseIndex}`;
    setOpenAccordion(openAccordion === key ? null : key);
  };

  return (
    <div className="min-h-screen bg-[#121214] text-white flex flex-col">
      {/* Floating Header */}
      <header className="w-full h-20 px-8 flex items-center justify-between z-20 bg-[#121214]/60 backdrop-blur-md border-b border-white/5">
        <Link href="/" className="flex items-center gap-2 group">
          <svg className="w-4 h-4 text-[#FF9E1B] group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"></polyline></svg>
          <span className="font-sans text-lg font-bold tracking-wide">Back to Gateway</span>
        </Link>
        <span className="text-[#FF9E1B] font-mono text-sm tracking-wider uppercase font-semibold">Pillar 05 // Certifications</span>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12 flex-1 w-full">
        {/* Intro */}
        <div className="mb-16 max-w-3xl">
          <h1 className="text-4xl font-extrabold mb-4 bg-gradient-to-r from-white via-slate-100 to-[#f093fb] bg-clip-text text-transparent">
            Industry-Recognized Certification Courses
          </h1>
          <p className="text-[#94a3b8] text-lg leading-relaxed">
            Acquire actual production skills. Our curriculum paths are developed and taught by active software architects. Learn the skills recruiters demand and get placement-ready.
          </p>
        </div>

        {/* Dynamic Courses Accordions */}
        <section className="space-y-12">
          {courses.map(c => (
            <div key={c.id} className="glass-panel p-8 rounded-2xl border border-white/5">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">{c.name}</h2>
                  <div className="text-sm text-slate-400 font-mono">TARGET AUDIENCE: {c.audience}</div>
                </div>
                <div className="px-4 py-2 rounded-lg bg-[#f093fb]/10 border border-[#f093fb]/30 text-[#f093fb] text-sm font-bold font-mono">
                  {c.duration}
                </div>
              </div>

              <p className="text-slate-300 text-sm leading-relaxed mb-8">{c.description}</p>

              {/* Syllabus Accordion list */}
              <div className="space-y-4">
                <div className="text-xs font-bold text-[#FF9E1B] tracking-wider mb-2 font-mono">SYLLABUS CURRICULUM MAP</div>
                
                {c.syllabus.map((phase, idx) => {
                  const key = `${c.id}-${idx}`;
                  const isOpen = openAccordion === key;
                  return (
                    <div key={idx} className="border border-white/5 rounded-xl overflow-hidden bg-slate-900/20">
                      <button
                        onClick={() => toggleAccordion(c.id, idx)}
                        className="w-full px-6 py-4 flex justify-between items-center bg-slate-900/40 hover:bg-slate-900/60 transition-colors text-left"
                      >
                        <span className="font-semibold text-sm text-slate-200">{phase.title}</span>
                        <svg className={`w-4 h-4 text-[#f093fb] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"></polyline></svg>
                      </button>
                      
                      <div className={`transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-60 border-t border-white/5' : 'max-h-0'}`}>
                        <div className="p-6 bg-slate-950/20">
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 list-disc list-inside">
                            {phase.topics.map((t, tIdx) => (
                              <li key={tIdx} className="text-xs text-slate-400 leading-normal">{t}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
