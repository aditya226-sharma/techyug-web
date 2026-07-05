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
    },
    {
      id: "course-3",
      name: "Cybersecurity & DefSecOps Engineering",
      duration: "14 Weeks",
      audience: "IT Officers & Systems Analysts",
      description: "Specialized training in offensive red-teaming, defensive zero-trust architectures, and cloud security compliance structures.",
      syllabus: [
        { title: "Phase 1: Offensive Red Teaming", topics: ["Vulnerability scanning & exploit discovery", "Metasploit & custom scripting", "Social engineering methodologies"] },
        { title: "Phase 2: Zero-Trust Network Design", topics: ["IAM roles & perimeter security", "Public Key Infrastructures (PKI)", "VPC peering & subnet segmentation"] },
        { title: "Phase 3: Security Audits & SIEM", topics: ["ELK stack monitoring & logging", "Wazuh / Splunk alerts handling", "Compliance checks (ISO 27001, SOC2)"] }
      ]
    },
    {
      id: "course-4",
      name: "Bioinformatics Algorithmic Architectures",
      duration: "18 Weeks",
      audience: "Graduate Researchers & Bio-Scientists",
      description: "Building algorithmic search tools and mathematical models for processing large-scale genomic, proteomic, and molecular structures.",
      syllabus: [
        { title: "Phase 1: Genomic Sequence Alignment", topics: ["Dynamic programming algorithms (Smith-Waterman)", "Heuristic alignment methods (BLAST)", "Burrows-Wheeler transform indexing"] },
        { title: "Phase 2: Structural Bioinformatics", desc: "3D Molecular modeling, structural superpositions, and protein folding prediction models.", topics: ["PDB file coordinates parsing", "3D alignment & superpositions", "AlphaFold metrics analysis (pLDDT)"] }
      ]
    }
  ]);

  const [openAccordion, setOpenAccordion] = useState(null);
  
  // Interactive Form States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("course-1");
  const [formLoading, setFormLoading] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);

  const toggleAccordion = (courseId, phaseIndex) => {
    const key = `${courseId}-${phaseIndex}`;
    setOpenAccordion(openAccordion === key ? null : key);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!name || !email) return;

    setFormLoading(true);

    const newConsultation = {
      id: `cons-${Date.now()}`,
      name,
      email,
      courseTrack: selectedCourse === 'course-1' ? 'Full-Stack Systems Engineering' :
                   selectedCourse === 'course-2' ? 'Data Science & Deep Learning' :
                   selectedCourse === 'course-3' ? 'Cybersecurity & DefSecOps' :
                   'Bioinformatics Algorithmic Architectures',
      requestedAt: new Date().toISOString()
    };

    const existing = localStorage.getItem('mock_course_consultations');
    const list = existing ? JSON.parse(existing) : [];
    list.push(newConsultation);
    localStorage.setItem('mock_course_consultations', JSON.stringify(list));

    setTimeout(() => {
      setFormLoading(false);
      setFormSuccess(true);
      setName("");
      setEmail("");
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => setFormSuccess(false), 5000);
    }, 1200);
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
        <section className="space-y-12 mb-20">
          {courses.map(c => (
            <div key={c.id} className="glass-panel p-8 rounded-2xl border border-white/5 hover:border-[#f093fb]/20 transition-all">
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

        {/* Interactive Course Consultation Form */}
        <section className="max-w-xl mx-auto glass-panel p-8 rounded-2xl border border-[#f093fb]/20 relative">
          {formSuccess && (
            <div className="absolute inset-0 bg-[#121214]/90 rounded-2xl flex flex-col items-center justify-center p-6 text-center z-35 animate-fade-in">
              <svg className="w-16 h-16 text-emerald-400 mb-4 animate-bounce" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <h3 className="text-xl font-bold text-white mb-2">Request Received!</h3>
              <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
                Thank you! A TechYug systems training specialist will reach out to you within 24 hours to map your certification track.
              </p>
            </div>
          )}

          <h2 className="text-2xl font-bold mb-4 text-center">Schedule Syllabus Consultation</h2>
          <p className="text-slate-400 text-xs text-center mb-6 leading-relaxed">
            Need guidance choosing a track? Provide your contact details and an advisor will coordinate a 1-on-1 curricular alignment session.
          </p>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">YOUR FULL NAME</label>
              <input 
                type="text" 
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Aditya Sharma" 
                className="w-full bg-[#121214]/50 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#f093fb]/50 font-sans text-white transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">EMAIL ADDRESS</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="aditya@example.com" 
                className="w-full bg-[#121214]/50 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#f093fb]/50 font-sans text-white transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">COURSE TRACK OF INTEREST</label>
              <select
                value={selectedCourse}
                onChange={e => setSelectedCourse(e.target.value)}
                className="w-full bg-[#121214]/50 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#f093fb]/50 font-sans text-white transition-colors"
              >
                <option value="course-1">Full-Stack Systems Engineering</option>
                <option value="course-2">Data Science & Deep Learning</option>
                <option value="course-3">Cybersecurity & DefSecOps</option>
                <option value="course-4">Bioinformatics Algorithmic Architectures</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={formLoading}
              className="w-full py-3 rounded-lg font-bold text-sm bg-gradient-to-r from-[#f093fb] to-[#f5576c] hover:opacity-90 active:scale-[0.99] text-white transition-all shadow-[0_0_15px_rgba(240,147,251,0.25)] flex items-center justify-center gap-2"
            >
              {formLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  SUBMITTING REGISTRATION...
                </>
              ) : "SUBMIT CONSULTATION REQUEST"}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
