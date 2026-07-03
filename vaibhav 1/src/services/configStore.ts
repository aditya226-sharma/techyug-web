// configStore.ts - BalKavach Global State Management Service

export interface AIStats {
  messagesScanned: number;
  threatsBlocked: number;
  accuracy: string;
  latency: string;
}

export interface ThreatRecord {
  id: string;
  phrase: string;
  type: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
}

export interface SchoolRecord {
  id: string;
  name: string;
  activeStudents: number;
  threatsInterceded: number;
  status: 'Protected' | 'Alerting' | 'Offline';
}

export interface ParentRecord {
  id: string;
  name: string;
  childName: string;
  status: 'Active' | 'Inactive';
  alertsSent: number;
}

export interface BlogRecord {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
}

export interface FAQRecord {
  id: string;
  question: string;
  answer: string;
}

export interface TestimonialRecord {
  id: string;
  name: string;
  role: string;
  text: string;
  rating: number;
}

export interface Settings3D {
  particleSpeed: number;
  particleDensity: number;
  colorPrimary: string;
  colorSecondary: string;
  colorAccent: string;
  modelStyle: 'wireframe' | 'particles' | 'solid';
  shieldStatus: 'Active' | 'Deflecting' | 'Idle';
}

export interface AlertNotification {
  id: string;
  type: string;
  childName: string;
  message: string;
  time: string;
  read: boolean;
}

export interface BalKavachConfig {
  heroTitle: string;
  heroSubtitle: string;
  aiStats: AIStats;
  threats: ThreatRecord[];
  schools: SchoolRecord[];
  parents: ParentRecord[];
  blogs: BlogRecord[];
  faqs: FAQRecord[];
  testimonials: TestimonialRecord[];
  settings3D: Settings3D;
  alerts: AlertNotification[];
}

const DEFAULT_CONFIG: BalKavachConfig = {
  heroTitle: "BalKavach: AI Child Security HUD",
  heroSubtitle: "Real-time cyberbullying deflection, harmful content screening, and multilingual threat intelligence protecting children in cyberspace.",
  aiStats: {
    messagesScanned: 1842010,
    threatsBlocked: 14290,
    accuracy: "99.4%",
    latency: "12ms"
  },
  threats: [
    { id: "t1", phrase: "nobody likes you, go away", type: "Cyberbullying / Toxicity", severity: "High" },
    { id: "t2", phrase: "don't tell your mom about this", type: "Suspicious Chat / Grooming", severity: "Critical" },
    { id: "t3", phrase: "i will find you after school", type: "Threat / Harassment", severity: "Critical" },
    { id: "t4", phrase: "you are so fat and stupid", type: "Cyberbullying / Toxicity", severity: "Medium" }
  ],
  schools: [
    { id: "s1", name: "Modern Science Academy", activeStudents: 1240, threatsInterceded: 184, status: "Protected" },
    { id: "s2", name: "Greenwood International School", activeStudents: 850, threatsInterceded: 92, status: "Protected" },
    { id: "s3", name: "St. Xavier Central Academy", activeStudents: 1480, threatsInterceded: 312, status: "Protected" }
  ],
  parents: [
    { id: "p1", name: "Devendra Sharma", childName: "Rahul Sharma", status: "Active", alertsSent: 5 },
    { id: "p2", name: "Sunita Verma", childName: "Riya Verma", status: "Active", alertsSent: 2 },
    { id: "p3", name: "Rajesh Iyer", childName: "Karthik Iyer", status: "Active", alertsSent: 12 }
  ],
  blogs: [
    { id: "b1", title: "Protecting Children in the Age of Generative AI", excerpt: "An in-depth analysis of new vectors used by online malicious actors and how multi-modal neural nets flag toxic interactions.", category: "AI Safety", date: "2026-06-25" },
    { id: "b2", title: "The Role of NLP Models (BERT) in Cyberbullying Prevention", excerpt: "How contextual analysis outclasses traditional keyword blacklists in regional Indian dialects.", category: "Research", date: "2026-06-18" }
  ],
  faqs: [
    { id: "f1", question: "How does BalKavach protect privacy while monitoring?", answer: "All analysis is done locally or via end-to-end encrypted pipelines. BalKavach does not record active screens or store keystrokes; it runs anomaly-detection heuristics and only alerts parents when high-severity threats are verified by AI models." },
    { id: "f2", question: "Does the system support local Indian languages?", answer: "Yes, our hybrid GRU-BERT models are trained on major regional scripts (Hindi, Bengali, Tamil, Telugu, Marathi, etc.) to analyze transliterated texts (e.g., Hinglish) and regional slang." }
  ],
  testimonials: [
    { id: "e1", name: "Dr. Anirban Sen", role: "Child Psychologist", text: "BalKavach doesn't just block websites; it actively screens behavior and detects mental health anomalies, allowing early support.", rating: 5 },
    { id: "e2", name: "Meera Deshmukh", role: "Principal, Greenwood School", text: "Integrating the School Portal was seamless. It helps us monitor community-wide cybersecurity safety without intruding on children's trust.", rating: 5 }
  ],
  settings3D: {
    particleSpeed: 1.2,
    particleDensity: 1500,
    colorPrimary: "#00f0ff", // Cyber Cyan
    colorSecondary: "#bd00ff", // Neon Purple
    colorAccent: "#05f2c7", // Emerald Green
    modelStyle: "wireframe",
    shieldStatus: "Active"
  },
  alerts: [
    { id: "a1", type: "Cyberbullying", childName: "Rahul", message: "Highly abusive message flagged on Instagram DM.", time: "Just Now", read: false },
    { id: "a2", type: "Inappropriate Content", childName: "Riya", message: "Blocked access to toxic online forum.", time: "10 mins ago", read: false },
    { id: "a3", type: "Suspicious Conversation", childName: "Karthik", message: "Conversation pattern matched social engineering / grooming heuristic.", time: "1 hour ago", read: true }
  ]
};

const STORAGE_KEY = "balkavach_config_dashboard";

export const loadConfig = (): BalKavachConfig => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      // Merge defaults with parsed config to ensure compatibility with older localStorage structures
      return {
        ...DEFAULT_CONFIG,
        ...parsed,
        aiStats: { ...DEFAULT_CONFIG.aiStats, ...(parsed.aiStats || {}) },
        settings3D: { ...DEFAULT_CONFIG.settings3D, ...(parsed.settings3D || {}) },
        threats: parsed.threats || DEFAULT_CONFIG.threats,
        schools: parsed.schools || DEFAULT_CONFIG.schools,
        parents: parsed.parents || DEFAULT_CONFIG.parents,
        blogs: parsed.blogs || DEFAULT_CONFIG.blogs,
        faqs: parsed.faqs || DEFAULT_CONFIG.faqs,
        testimonials: parsed.testimonials || DEFAULT_CONFIG.testimonials,
        alerts: parsed.alerts || DEFAULT_CONFIG.alerts
      };
    }
  } catch (e) {
    console.error("Failed to load BalKavach configuration from localStorage, using default", e);
  }
  return DEFAULT_CONFIG;
};

export const saveConfig = (config: BalKavachConfig): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    // Dispatch custom event to notify all components in the active page
    window.dispatchEvent(new Event("balkavach-config-update"));
  } catch (e) {
    console.error("Failed to save config to localStorage", e);
  }
};

export const resetConfig = (): BalKavachConfig => {
  saveConfig(DEFAULT_CONFIG);
  return DEFAULT_CONFIG;
};
