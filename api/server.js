// api/server.js
import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, 'database.json');
const JWT_SECRET = 'techyug_super_secret_jwt_key_2026';

const app = express();

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : [];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes('*') || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

app.use(express.json());

// Helper functions to read/write JSON database
function readDatabase() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      writeDatabase(INITIAL_DB_STATE);
      return INITIAL_DB_STATE;
    }
    const raw = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    console.error("Error reading database, using initial state:", e);
    return INITIAL_DB_STATE;
  }
}

function writeDatabase(data) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
  } catch (e) {
    console.error("Error writing database:", e);
  }
}

// Log administrative actions to the immutable audit log
function logAuditAction(userEmail, actionType, details) {
  const db = readDatabase();
  const newLog = {
    id: `audit-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toISOString(),
    user: userEmail,
    action: actionType,
    details: details
  };
  db.auditLog.unshift(newLog);
  writeDatabase(db);
}

// Authentication & Role Authorization Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: "Access token missing" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid or expired token" });
    req.user = user;
    next();
  });
}

function requireRole(allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: "Unauthorized role access blocked" });
    }
    next();
  };
}

// ----------------------------------------------------
// API ROUTES
// ----------------------------------------------------

// 1. Auth Endpoint
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const db = readDatabase();
  const user = db.users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    return res.status(400).json({ error: "Invalid email or password credentials" });
  }

  const token = jwt.sign({ email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '12h' });
  
  logAuditAction(user.email, "USER_LOGIN", `${user.role} logged in from portal`);
  res.json({ token, role: user.role, email: user.email });
});

// 2. Universities Onboarding Endpoints
app.get('/api/universities', authenticateToken, (req, res) => {
  const db = readDatabase();
  res.json(db.universities);
});

app.post('/api/universities', authenticateToken, requireRole(['Operations', 'CEO']), (req, res) => {
  const { name, mouFilename, requirementSheet, initialRoadmap } = req.body;
  if (!name) return res.status(400).json({ error: "University name is required" });

  const db = readDatabase();
  const newUni = {
    id: `uni-${Date.now()}`,
    name,
    mouFilename: mouFilename || "MOU_Signed_Pending.pdf",
    requirementSheet: requirementSheet || "Standard_Requirements_Template.docx",
    initialRoadmap: initialRoadmap || "Semester_1_Orientation_Mapping",
    onboardedAt: new Date().toISOString()
  };

  db.universities.push(newUni);
  writeDatabase(db);

  logAuditAction(req.user.email, "ONBOARD_UNIVERSITY", `Onboarded ${name} with MoU ${newUni.mouFilename}`);
  res.status(201).json(newUni);
});

// 3. Faculty / Trainer Management Endpoints
app.get('/api/faculty', (req, res) => {
  const db = readDatabase();
  res.json(db.faculty);
});

app.post('/api/faculty', authenticateToken, requireRole(['Operations', 'CEO']), (req, res) => {
  const { id, name, expertise, experience, bio, avatar, assignedBatch, technicalScreening, timetableAdherence } = req.body;
  if (!name) return res.status(400).json({ error: "Trainer name is required" });

  const db = readDatabase();
  let facultyItem;

  if (id) {
    // Edit existing trainer
    const idx = db.faculty.findIndex(f => f.id === id);
    if (idx === -1) return res.status(404).json({ error: "Faculty member not found" });

    db.faculty[idx] = {
      ...db.faculty[idx],
      name, expertise, experience, bio, avatar, assignedBatch, technicalScreening, timetableAdherence
    };
    facultyItem = db.faculty[idx];
    logAuditAction(req.user.email, "EDIT_FACULTY", `Modified faculty trainer details for ${name}`);
  } else {
    // Add new trainer
    facultyItem = {
      id: `train-${Date.now()}`,
      name,
      expertise,
      experience,
      bio,
      avatar: avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop",
      assignedBatch: assignedBatch || "Not Assigned",
      technicalScreening: technicalScreening || "Passed",
      timetableAdherence: timetableAdherence || "100%"
    };
    db.faculty.push(facultyItem);
    logAuditAction(req.user.email, "ADD_FACULTY", `Added corporate trainer ${name} to resource pool`);
  }

  writeDatabase(db);
  res.json(facultyItem);
});

app.delete('/api/faculty/:id', authenticateToken, requireRole(['Operations', 'CEO']), (req, res) => {
  const db = readDatabase();
  const fId = req.params.id;
  const trainer = db.faculty.find(f => f.id === fId);
  if (!trainer) return res.status(404).json({ error: "Faculty not found" });

  db.faculty = db.faculty.filter(f => f.id !== fId);
  writeDatabase(db);

  logAuditAction(req.user.email, "DELETE_FACULTY", `Deleted corporate trainer ${trainer.name}`);
  res.json({ success: true, message: "Faculty removed successfully" });
});

// 4. Delivery Tracking Endpoints
app.get('/api/delivery', authenticateToken, (req, res) => {
  const db = readDatabase();
  res.json(db.delivery);
});

app.post('/api/delivery', authenticateToken, requireRole(['Operations', 'CEO']), (req, res) => {
  const { syllabusCompletion, dailyLectureLogs, marksheetFilename } = req.body;
  const db = readDatabase();

  if (syllabusCompletion !== undefined) db.delivery.syllabusCompletion = syllabusCompletion;
  if (dailyLectureLogs !== undefined) db.delivery.dailyLectureLogs = dailyLectureLogs;
  if (marksheetFilename !== undefined) db.delivery.marksheetFilename = marksheetFilename;

  writeDatabase(db);
  logAuditAction(req.user.email, "UPDATE_DELIVERY_TRACKING", `Updated syllabus metrics and lecture schedules`);
  res.json(db.delivery);
});

// 5. Events Manager Endpoints (Dynamic updates for main page view)
app.get('/api/events', (req, res) => {
  const db = readDatabase();
  res.json(db.events);
});

app.post('/api/events', authenticateToken, requireRole(['Operations', 'CEO']), (req, res) => {
  const { id, title, date, venue, description, link, registrationRules } = req.body;
  if (!title) return res.status(400).json({ error: "Event title is required" });

  const db = readDatabase();
  let eventItem;

  if (id) {
    const idx = db.events.findIndex(e => e.id === id);
    if (idx === -1) return res.status(404).json({ error: "Event not found" });
    db.events[idx] = {
      ...db.events[idx],
      title, date, venue, description, link, registrationRules
    };
    eventItem = db.events[idx];
    logAuditAction(req.user.email, "EDIT_EVENT", `Edited educational event details for ${title}`);
  } else {
    eventItem = {
      id: `eve-${Date.now()}`,
      title, date, venue, description, 
      link: link || "#register",
      registrationRules: registrationRules || "Open to all branches"
    };
    db.events.push(eventItem);
    logAuditAction(req.user.email, "ADD_EVENT", `Posted new public event: ${title}`);
  }

  writeDatabase(db);
  res.json(eventItem);
});

app.delete('/api/events/:id', authenticateToken, requireRole(['Operations', 'CEO']), (req, res) => {
  const db = readDatabase();
  const eId = req.params.id;
  const event = db.events.find(e => e.id === eId);
  if (!event) return res.status(404).json({ error: "Event not found" });

  db.events = db.events.filter(e => e.id !== eId);
  writeDatabase(db);

  logAuditAction(req.user.email, "DELETE_EVENT", `Deleted educational event: ${event.title}`);
  res.json({ success: true });
});

// 6. CEO Revenue Management Endpoints (Strict CEO Gate)
app.get('/api/revenue', authenticateToken, requireRole(['CEO']), (req, res) => {
  const db = readDatabase();
  res.json(db.revenue);
});

app.post('/api/revenue', authenticateToken, requireRole(['CEO']), (req, res) => {
  const { annualContractPrice, softwareMilestoneBilled, researchRetainerRule, bulkDiscountPercent } = req.body;
  const db = readDatabase();

  if (annualContractPrice !== undefined) db.revenue.annualContractPrice = annualContractPrice;
  if (softwareMilestoneBilled !== undefined) db.revenue.softwareMilestoneBilled = softwareMilestoneBilled;
  if (researchRetainerRule !== undefined) db.revenue.researchRetainerRule = researchRetainerRule;
  if (bulkDiscountPercent !== undefined) db.revenue.bulkDiscountPercent = bulkDiscountPercent;

  writeDatabase(db);
  logAuditAction(req.user.email, "UPDATE_REVENUE_MATRIX", `Reconfigured commercial billing rules and discount parameters`);
  res.json(db.revenue);
});

// 7. CEO Strategic Funding Endpoints (Strict CEO Gate)
app.get('/api/funding', authenticateToken, requireRole(['CEO']), (req, res) => {
  const db = readDatabase();
  res.json(db.funding);
});

app.post('/api/funding', authenticateToken, requireRole(['CEO']), (req, res) => {
  const { csrFundingTotal, researchPartnershipInflow, ipCommercializationTotal } = req.body;
  const db = readDatabase();

  if (csrFundingTotal !== undefined) db.funding.csrFundingTotal = csrFundingTotal;
  if (researchPartnershipInflow !== undefined) db.funding.researchPartnershipInflow = researchPartnershipInflow;
  if (ipCommercializationTotal !== undefined) db.funding.ipCommercializationTotal = ipCommercializationTotal;

  writeDatabase(db);
  logAuditAction(req.user.email, "UPDATE_STRATEGIC_FUNDING", `Updated financial funding dashboard streams`);
  res.json(db.funding);
});

// 8. CEO Immutable Audit Logs (Strict CEO Gate)
app.get('/api/audit', authenticateToken, requireRole(['CEO']), (req, res) => {
  const db = readDatabase();
  res.json(db.auditLog);
});

// Start API Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`[TechYug API] Server running on http://127.0.0.1:${PORT}`);
});

// ----------------------------------------------------
// DEFAULT INITIAL DATABASE STATE
// ----------------------------------------------------
const INITIAL_DB_STATE = {
  users: [
    { email: "ceo@techyug.in", password: "ceo123", role: "CEO" },
    { email: "manager@techyug.in", password: "manager123", role: "Operations" }
  ],
  universities: [
    {
      id: "uni-1",
      name: "Delhi Technology University",
      mouFilename: "MOU_Signed_DTU_2026.pdf",
      requirementSheet: "DTU_Trainer_Requirements_CSE.docx",
      initialRoadmap: "DTU_Academic_Roadmap_Final.pdf",
      onboardedAt: "2026-06-25T10:00:00.000Z"
    },
    {
      id: "uni-2",
      name: "VTU Belagavi",
      mouFilename: "MOU_VTU_Executed.pdf",
      requirementSheet: "VTU_Trainer_Requirements_ISE.docx",
      initialRoadmap: "VTU_Skill_Development_Timeline.pdf",
      onboardedAt: "2026-06-28T14:30:00.000Z"
    }
  ],
  faculty: [
    {
      id: "train-1",
      name: "Dr. Aravind Swamy",
      expertise: "Artificial Intelligence & Deep Learning",
      experience: "14+ Years (Ex-Microsoft)",
      bio: "Author of 20+ publications and advisor to top-tier universities.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
      assignedBatch: "DTU-CSE-BatchA",
      technicalScreening: "Passed (10/10 Score)",
      timetableAdherence: "98%"
    },
    {
      id: "train-2",
      name: "Sarah Jenkins",
      expertise: "Cloud Architecture & DevSecOps",
      experience: "10+ Years (Senior Architect)",
      bio: "Expert in Kubernetes orchestration and hybrid cloud migrations.",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
      assignedBatch: "VTU-ISE-CloudCore",
      technicalScreening: "Passed (9.5/10 Score)",
      timetableAdherence: "100%"
    }
  ],
  delivery: {
    syllabusCompletion: "82.5%",
    dailyLectureLogs: [
      { date: "2026-06-29", topic: "Intro to Convolutional Networks", batch: "DTU-CSE-A", uploadUrl: "lecture_log_20260629_dtu.mp4" },
      { date: "2026-06-29", topic: "Kubernetes Pod Deployments & Namespaces", batch: "VTU-Cloud", uploadUrl: "lecture_log_20260629_vtu.mp4" }
    ],
    marksheetFilename: "internal_exam_marksheets_q1.xlsx"
  },
  events: [
    {
      id: "eve-1",
      title: "TechYug National Hackathon 2026",
      date: "August 22-24, 2026",
      venue: "TechYug Innovation Hub & Virtual",
      description: "A 48-hour challenge addressing sustainable energy solutions, smart infrastructure, and healthtech.",
      link: "#register",
      registrationRules: "Open to all CS/IT undergraduate streams. Max team size: 4."
    },
    {
      id: "eve-2",
      title: "Hands-on Workshop: Building with Large Language Models",
      date: "July 18, 2026",
      venue: "Online Interactive Sandbox",
      description: "A practical guide to prompt engineering, RAG pipelines, and deploying custom model endpoints.",
      link: "#register",
      registrationRules: "Basic Python knowledge required."
    }
  ],
  revenue: {
    annualContractPrice: "$25,000 / University",
    softwareMilestoneBilled: "$45,000 (VitalsConnect Q2 Completion)",
    researchRetainerRule: "$1,200 / Retainer per PhD scholar",
    bulkDiscountPercent: "15% (for enrollments > 150 candidates)"
  },
  funding: {
    csrFundingTotal: "$120,000 (Govt Skill Development Initiative)",
    researchPartnershipInflow: "$85,000 (AI CoE Corporate Sponsorship)",
    ipCommercializationTotal: "$34,200 (AgriVision Plant Disease Engine License)"
  },
  auditLog: [
    {
      id: "audit-init",
      timestamp: new Date().toISOString(),
      user: "system_initializer",
      action: "DATABASE_INITIALIZATION",
      details: "Default decoupled web database state generated and loaded"
    }
  ]
};
