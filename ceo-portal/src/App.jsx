// ceo-portal/src/App.jsx
import React, { useState, useEffect } from 'react';
import { 
  Lock, Key, DollarSign, BarChart2, ShieldAlert, LogOut, CheckCircle, Save, TrendingUp
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5001/api';

export default function App() {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [view, setView] = useState('revenue-matrix'); // Default sub-route

  // Authentication State
  const [loginEmail, setLoginEmail] = useState('ceo@techyug.in');
  const [loginPassword, setLoginPassword] = useState('ceo123');
  const [tempToken, setTempToken] = useState(null); // Auth token before MFA verify
  const [mfaCode, setMfaCode] = useState('');
  const [mfaError, setMfaError] = useState('');
  const [loginError, setLoginError] = useState('');

  // Financial & Audit Data States
  const [revenue, setRevenue] = useState({});
  const [funding, setFunding] = useState({});
  const [auditLogs, setAuditLogs] = useState([]);

  // Form input bindings
  const [revPrice, setRevPrice] = useState('');
  const [revMilestone, setRevMilestone] = useState('');
  const [revRetainer, setRevRetainer] = useState('');
  const [revDiscount, setRevDiscount] = useState('');

  const [fundCsr, setFundCsr] = useState('');
  const [fundPartner, setFundPartner] = useState('');
  const [fundIp, setFundIp] = useState('');

  // Toast feedback
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    const savedToken = localStorage.getItem('ceo_token');
    const savedRole = localStorage.getItem('ceo_role');
    const savedEmail = localStorage.getItem('ceo_email');
    if (savedToken && savedRole === 'CEO') {
      setToken(savedToken);
      setRole(savedRole);
      setEmail(savedEmail);
    }
  }, []);

  // Fetch data on view changes
  useEffect(() => {
    if (!token) return;
    if (view === 'revenue-matrix') fetchRevenue();
    if (view === 'strategic-funding') fetchFunding();
    if (view === 'system-audit') fetchAuditLogs();
  }, [token, view]);

  // Toast notifier
  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const fetchRevenue = () => {
    fetch(`${API_BASE}/revenue`, { headers: { 'Authorization': `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => {
        setRevenue(data);
        setRevPrice(data.annualContractPrice || '');
        setRevMilestone(data.softwareMilestoneBilled || '');
        setRevRetainer(data.researchRetainerRule || '');
        setRevDiscount(data.bulkDiscountPercent || '');
      })
      .catch(err => console.error(err));
  };

  const fetchFunding = () => {
    fetch(`${API_BASE}/funding`, { headers: { 'Authorization': `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => {
        setFunding(data);
        setFundCsr(data.csrFundingTotal || '');
        setFundPartner(data.researchPartnershipInflow || '');
        setFundIp(data.ipCommercializationTotal || '');
      })
      .catch(err => console.error(err));
  };

  const fetchAuditLogs = () => {
    fetch(`${API_BASE}/audit`, { headers: { 'Authorization': `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => setAuditLogs(data))
      .catch(err => console.error(err));
  };

  // Auth Handler
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoginError('');
    
    fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: loginEmail, password: loginPassword })
    })
    .then(res => {
      if (!res.ok) throw new Error("Invalid login credentials");
      return res.json();
    })
    .then(data => {
      if (data.role !== 'CEO') {
        throw new Error("Access denied: CEO Super Admin role required");
      }
      setTempToken(data);
    })
    .catch(err => {
      setLoginError(err.message);
    });
  };

  // Multi-Factor Authentication Verification
  const handleMfaVerify = (e) => {
    e.preventDefault();
    setMfaError('');
    
    // Simulate checking MFA code (valid code = 123456)
    if (mfaCode === '123456') {
      localStorage.setItem('ceo_token', tempToken.token);
      localStorage.setItem('ceo_role', tempToken.role);
      localStorage.setItem('ceo_email', tempToken.email);
      setToken(tempToken.token);
      setRole(tempToken.role);
      setEmail(tempToken.email);
      setTempToken(null);
      setMfaCode('');
      triggerToast("CEO Authorization Verified!");
    } else {
      setMfaError("MFA Verification Failed. Enter code 123456.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('ceo_token');
    localStorage.removeItem('ceo_role');
    localStorage.removeItem('ceo_email');
    setToken(null);
    setRole('');
    setEmail('');
  };

  // Update Revenue Values
  const handleSaveRevenue = (e) => {
    e.preventDefault();
    fetch(`${API_BASE}/revenue`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        annualContractPrice: revPrice,
        softwareMilestoneBilled: revMilestone,
        researchRetainerRule: revRetainer,
        bulkDiscountPercent: revDiscount
      })
    })
    .then(res => res.json())
    .then(data => {
      setRevenue(data);
      triggerToast("Revenue pricing models updated!");
    })
    .catch(err => console.error(err));
  };

  // Update Funding Values
  const handleSaveFunding = (e) => {
    e.preventDefault();
    fetch(`${API_BASE}/funding`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        csrFundingTotal: fundCsr,
        researchPartnershipInflow: fundPartner,
        ipCommercializationTotal: fundIp
      })
    })
    .then(res => res.json())
    .then(data => {
      setFunding(data);
      triggerToast("Financial investment logs updated!");
    })
    .catch(err => console.error(err));
  };

  // Login View
  if (!token) {
    return (
      <div className="w-screen h-screen flex justify-center items-center bg-[#121214] text-white">
        <div className="w-full max-w-md p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 bg-red-950/40 rounded-xl flex items-center justify-center border border-red-500/30">
              <Lock className="w-6 h-6 text-accent" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center mb-2">CEO Super Admin</h2>
          
          {!tempToken ? (
            // Phase 1: Credentials Entry
            <>
              <p className="text-slate-400 text-xs text-center mb-6">Enter executive credentials. Requires Multi-Factor Authentication.</p>
              {loginError && <div className="p-3 mb-4 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-xs">{loginError}</div>}
              
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">CEO EMAIL</label>
                  <input 
                    type="email" 
                    value={loginEmail} 
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full bg-slate-900/50 border border-white/10 rounded-lg p-2.5 text-sm focus:outline-none focus:border-accent text-slate-200"
                    required 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">PASSWORD</label>
                  <input 
                    type="password" 
                    value={loginPassword} 
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full bg-slate-900/50 border border-white/10 rounded-lg p-2.5 text-sm focus:outline-none focus:border-accent text-slate-200"
                    required 
                  />
                </div>
                <button 
                  type="submit" 
                  className="w-full bg-red-900/80 hover:bg-red-800 text-white font-bold py-2.5 rounded-lg text-sm transition-all shadow-[0_0_10px_rgba(220,38,38,0.2)] cursor-pointer"
                >
                  Verify Credentials
                </button>
              </form>
            </>
          ) : (
            // Phase 2: MFA Code Entry
            <>
              <p className="text-slate-400 text-xs text-center mb-6">Enter the 2FA code sent to your Authenticator App. (Demo Code: 123456)</p>
              {mfaError && <div className="p-3 mb-4 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-xs">{mfaError}</div>}
              
              <form onSubmit={handleMfaVerify} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">MFA AUTH CODE</label>
                  <input 
                    type="text" 
                    value={mfaCode} 
                    onChange={(e) => setMfaCode(e.target.value)}
                    placeholder="123456"
                    className="w-full text-center bg-slate-900/50 border border-white/10 rounded-lg p-2.5 text-lg font-mono tracking-widest focus:outline-none focus:border-accent text-slate-200"
                    maxLength={6}
                    required 
                  />
                </div>
                <button 
                  type="submit" 
                  className="w-full bg-emerald-700 hover:bg-emerald-600 text-white font-bold py-2.5 rounded-lg text-sm transition-all shadow-[0_0_10px_rgba(16,185,129,0.2)] cursor-pointer"
                >
                  Confirm 2FA
                </button>
              </form>
            </>
          )}
          
          <div className="mt-6 text-center">
            <a href={import.meta.env.VITE_PUBLIC_SITE_URL || 'http://127.0.0.1:3000'} className="text-xs text-accent hover:underline font-mono">← Go to Public Gateway</a>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard Page View
  return (
    <div className="w-screen h-screen flex bg-[#121214] text-slate-100 overflow-hidden font-sans">
      {/* 1. Sidebar Navigation */}
      <aside className="w-64 bg-slate-950 border-r border-white/5 p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-8">
            <div className="w-3.5 h-3.5 rounded-full bg-red-600 shadow-[0_0_10px_#ef4444]"></div>
            <span className="font-sans font-bold text-lg text-white">TechYug CEO</span>
          </div>

          <nav className="space-y-1">
            <button 
              onClick={() => setView('revenue-matrix')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${view === 'revenue-matrix' ? 'bg-red-950/20 text-accent border-l-3 border-l-red-600' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
            >
              <DollarSign className="w-4 h-4" />
              Revenue Matrix
            </button>
            <button 
              onClick={() => setView('strategic-funding')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${view === 'strategic-funding' ? 'bg-red-950/20 text-accent border-l-3 border-l-red-600' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
            >
              <TrendingUp className="w-4 h-4" />
              Strategic Funding
            </button>
            <button 
              onClick={() => setView('system-audit')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${view === 'system-audit' ? 'bg-red-950/20 text-accent border-l-3 border-l-red-600' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
            >
              <ShieldAlert className="w-4 h-4" />
              System Audit Logs
            </button>
          </nav>
        </div>

        <div>
          <div className="p-3 mb-4 rounded-lg bg-red-950/10 border border-red-500/10 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-red-900 flex items-center justify-center text-xs font-bold text-accent">
              CEO
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold truncate text-white">Super Administrator</div>
              <div className="text-[10px] text-slate-500 truncate">{email}</div>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-red-600/10 border border-red-500/20 hover:bg-red-600/20 text-red-400 text-xs font-bold transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* 2. Workspace Viewport */}
      <main className="flex-1 p-8 overflow-y-auto flex flex-col">
        {/* Module Header */}
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/5">
          <div>
            <h1 className="text-2xl font-bold capitalize text-white">{view.replace('-', ' ')} Executive Dashboard</h1>
            <p className="text-slate-400 text-xs">High-level insights, commercial pricing matrix, and security auditing logs.</p>
          </div>
        </div>

        {/* Dynamic Inner Subpage Content */}
        <div className="flex-1">
          {view === 'revenue-matrix' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Parameter Editor */}
              <div className="lg:col-span-1 p-6 rounded-xl bg-white/5 border border-white/5 h-fit">
                <h3 className="font-bold text-white text-lg mb-4 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-accent" />
                  Commercial Configurations
                </h3>
                <form onSubmit={handleSaveRevenue} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">ANNUAL UNIVERSITY CONTRACTS</label>
                    <input 
                      type="text" 
                      value={revPrice}
                      onChange={(e) => setRevPrice(e.target.value)}
                      className="w-full bg-slate-900/50 border border-white/10 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-accent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">SOFTWARE DEVELOPMENT MILESTONE BILLING</label>
                    <input 
                      type="text" 
                      value={revMilestone}
                      onChange={(e) => setRevMilestone(e.target.value)}
                      className="w-full bg-slate-900/50 border border-white/10 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-accent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">RESEARCH PhD RETAINER FEES</label>
                    <input 
                      type="text" 
                      value={revRetainer}
                      onChange={(e) => setRevRetainer(e.target.value)}
                      className="w-full bg-slate-900/50 border border-white/10 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-accent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">BULK ENROLLMENT DISCOUNTS</label>
                    <input 
                      type="text" 
                      value={revDiscount}
                      onChange={(e) => setRevDiscount(e.target.value)}
                      className="w-full bg-slate-900/50 border border-white/10 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-accent"
                      required
                    />
                  </div>
                  <button 
                    type="submit"
                    className="w-full bg-[#0F3D7A] hover:bg-sky-800 text-white font-bold py-2.5 rounded-lg text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    Save Pricing Matrix
                  </button>
                </form>
              </div>

              {/* Active Matrix Dashboard */}
              <div className="lg:col-span-2 space-y-6">
                <h3 className="font-bold text-white text-lg flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  Live Commercial Rules
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-900/40 border border-white/5">
                    <span className="text-[10px] font-mono text-slate-500 block">UNIVERSITY PARTNERSHIPS</span>
                    <span className="text-xl font-bold text-white">{revenue.annualContractPrice}</span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900/40 border border-white/5">
                    <span className="text-[10px] font-mono text-slate-500 block">SOFTWARE REVENUE BILLINGS</span>
                    <span className="text-xl font-bold text-white">{revenue.softwareMilestoneBilled}</span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900/40 border border-white/5">
                    <span className="text-[10px] font-mono text-slate-500 block">PhD SCHOLARS RETAINER RULES</span>
                    <span className="text-xl font-bold text-white">{revenue.researchRetainerRule}</span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900/40 border border-white/5">
                    <span className="text-[10px] font-mono text-slate-500 block">BULK CERTIFICATE ENROLLMENT DISCOUNTS</span>
                    <span className="text-xl font-bold text-[#FF9E1B]">{revenue.bulkDiscountPercent}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {view === 'strategic-funding' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Financial Inputs Form */}
              <div className="lg:col-span-1 p-6 rounded-xl bg-white/5 border border-white/5 h-fit">
                <h3 className="font-bold text-white text-lg mb-4 flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-accent" />
                  Inflow Configurations
                </h3>
                <form onSubmit={handleSaveFunding} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">GOVT & CSR INFLOW TOTALS</label>
                    <input 
                      type="text" 
                      value={fundCsr}
                      onChange={(e) => setFundCsr(e.target.value)}
                      className="w-full bg-slate-900/50 border border-white/10 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-accent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">SPONSORED RESEARCH LAB INFLOWS</label>
                    <input 
                      type="text" 
                      value={fundPartner}
                      onChange={(e) => setFundPartner(e.target.value)}
                      className="w-full bg-slate-900/50 border border-white/10 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-accent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">PROPRIETARY IP LICENSE ROYALTIES</label>
                    <input 
                      type="text" 
                      value={fundIp}
                      onChange={(e) => setFundIp(e.target.value)}
                      className="w-full bg-slate-900/50 border border-white/10 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-accent"
                      required
                    />
                  </div>
                  <button 
                    type="submit"
                    className="w-full bg-[#0F3D7A] hover:bg-sky-800 text-white font-bold py-2.5 rounded-lg text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    Save Inflow Details
                  </button>
                </form>
              </div>

              {/* Funding Monitor Charts overlay */}
              <div className="lg:col-span-2 space-y-6">
                <h3 className="font-bold text-white text-lg flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#FF9E1B]" />
                  Active Investment Nodes
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-slate-900/40 border border-white/5">
                    <span className="text-[10px] font-mono text-slate-500 block">GOVT & CSR PROJECTS</span>
                    <span className="text-xl font-bold text-white">{funding.csrFundingTotal}</span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900/40 border border-white/5">
                    <span className="text-[10px] font-mono text-slate-500 block">RESEARCH LAB SPONSORSHIPS</span>
                    <span className="text-xl font-bold text-white">{funding.researchPartnershipInflow}</span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900/40 border border-white/5">
                    <span className="text-[10px] font-mono text-slate-500 block">IP COMMERCIALIZATIONS</span>
                    <span className="text-xl font-bold text-[#FF9E1B]">{funding.ipCommercializationTotal}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {view === 'system-audit' && (
            <div className="p-6 rounded-xl bg-white/5 border border-white/5">
              <h3 className="font-bold text-white text-lg mb-4 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-red-500" />
                Immutable System Audit Trail
              </h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 uppercase font-mono">
                    <tr>
                      <th className="p-3">TIMESTAMP</th>
                      <th className="p-3">OPERATOR</th>
                      <th className="p-3">ACTION EVENT</th>
                      <th className="p-3">DETAILS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-mono">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-white/2 text-slate-300">
                        <td className="p-3 whitespace-nowrap text-slate-500">{new Date(log.timestamp).toLocaleString()}</td>
                        <td className="p-3 text-red-400 whitespace-nowrap">{log.user}</td>
                        <td className="p-3 text-[#FF9E1B] whitespace-nowrap">{log.action}</td>
                        <td className="p-3 text-slate-400">{log.details}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* 3. Feedback Toast */}
      {toastMsg && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-accent text-slate-950 font-bold px-6 py-3 rounded-full text-xs z-50 shadow-lg tracking-wide">
          {toastMsg}
        </div>
      )}
    </div>
  );
}
