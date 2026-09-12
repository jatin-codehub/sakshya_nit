import React, { useState, useEffect } from 'react';
import { 
  Shield, Cpu, LayoutDashboard, FolderKanban, Database, Sparkles, 
  Share2, Network, UserCheck, FileText, Lock, Settings, LogOut, 
  Bell, Search, Plus, Upload, ArrowRight, CheckCircle2, ChevronRight
} from 'lucide-react';
import { CaseItem, UserProfile } from '../types';

interface DashboardScreenProps {
  user: UserProfile;
  onLogout: () => void;
  onOpenCase: (caseItem: CaseItem, defaultTab?: string) => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ user, onLogout, onOpenCase }) => {
  const [activeNav, setActiveNav] = useState<string>('Dashboard');
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [loadingCases, setLoadingCases] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // New Case Modal
  const [showNewCaseModal, setShowNewCaseModal] = useState<boolean>(false);
  const [newCaseTitle, setNewCaseTitle] = useState<string>('');
  const [newCaseDesc, setNewCaseDesc] = useState<string>('');
  const [newCasePriority, setNewCasePriority] = useState<'Low' | 'Medium' | 'High' | 'Critical'>('High');
  const [submitting, setSubmitting] = useState<boolean>(false);

  const fetchCases = async () => {
    try {
      const res = await fetch('/api/cases');
      const data = await res.json();
      setCases(data);
    } catch (err) {
      console.error("Failed to fetch cases", err);
    } finally {
      setLoadingCases(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const handleCreateCase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCaseTitle) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newCaseTitle,
          description: newCaseDesc,
          priority: newCasePriority,
          leadInvestigator: `${user.name} (${user.id})`
        })
      });
      const newCase = await res.json();
      if (res.ok) {
        setShowNewCaseModal(false);
        setNewCaseTitle('');
        setNewCaseDesc('');
        onOpenCase(newCase);
      }
    } catch (err) {
      console.error("Failed to create case", err);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredCases = cases.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.caseNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-slate-100 font-sans text-slate-900 overflow-hidden selection:bg-blue-600 selection:text-white">
      
      {/* Fixed Left Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between hidden md:flex shrink-0">
        <div>
          {/* Logo Brand */}
          <div className="p-6 border-b border-slate-200 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-blue-600 flex items-center justify-center shadow-md">
              <Shield className="w-5 h-5 text-blue-500 absolute" />
              <Cpu className="w-3.5 h-3.5 text-white z-10" />
            </div>
            <div>
              <h2 className="text-base font-black tracking-tight text-slate-950">SAKSHYA</h2>
              <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Secure Workstation</p>
            </div>
          </div>

          {/* Operational Menu Nav */}
          <div className="px-4 py-6 space-y-1">
            <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest px-3 mb-2">
              Operational Menu
            </div>

            {[
              { id: 'Dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'Cases', label: 'Cases', icon: FolderKanban, badge: cases.length },
              { id: 'Evidence Vault', label: 'Evidence Vault', icon: Database },
              { id: 'AI Hypotheses', label: 'AI Hypotheses', icon: Sparkles },
              { id: 'Cross-Evidence Links', label: 'Cross-Evidence Links', icon: Share2 },
              { id: 'Evidence Graph', label: 'Evidence Graph', icon: Network },
              { id: 'Human Review', label: 'Human Review', icon: UserCheck },
              { id: 'Official Report', label: 'Official Report', icon: FileText },
              { id: 'Audit Trail', label: 'Audit Trail', icon: Lock },
              { id: 'Settings', label: 'Settings', icon: Settings },
            ].map((item) => {
              const IconComponent = item.icon;
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveNav(item.id);
                    if (cases.length > 0 && (item.id === 'Cases' || item.id === 'Evidence Vault')) {
                      onOpenCase(cases[0], 'vault');
                    }
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25' 
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <IconComponent className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* User Card & Logout Bottom */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/50 space-y-3">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-white border border-slate-200">
            <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-lg object-cover" />
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-slate-900 truncate">{user.name}</div>
              <div className="text-[10px] font-mono text-blue-600 font-semibold">{user.clearance}</div>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl border border-red-200 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Secure Logout
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 px-6 h-18 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 text-xs font-mono text-slate-500">
            <span>Investigation Workstation</span>
            <span>/</span>
            <span className="text-slate-900 font-bold">Secure Console</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search database cases..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <button className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-600"></span>
            </button>

            <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
              <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover border border-slate-300" />
              <div className="hidden lg:block text-left">
                <div className="text-xs font-bold text-slate-900">{user.name}</div>
                <div className="text-[10px] font-mono text-slate-500">{user.id}</div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* 1. Welcome Banner Card */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-64 h-full bg-gradient-to-l from-blue-50 to-transparent opacity-60 pointer-events-none"></div>
            
            <div className="space-y-2 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold font-mono">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Database Connected & Synchronized
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
                Welcome back, {user.name}
              </h1>
              <p className="text-sm text-slate-600">
                Investigation workspace ready · Clearance: <strong className="text-slate-900">{user.clearance}</strong>
              </p>
            </div>

            <div className="flex items-center gap-3 relative z-10">
              <button
                onClick={() => setShowNewCaseModal(true)}
                className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-md shadow-blue-600/25 flex items-center gap-2 transition-all"
              >
                <Plus className="w-4 h-4" />
                + New Case File
              </button>
            </div>
          </div>

          {/* 2. Row of 4 Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono uppercase font-bold text-slate-500">Active Database Cases</span>
                <FolderKanban className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-3xl font-black text-slate-950 mb-1">{cases.length}</div>
              <div className="text-xs text-emerald-600 font-mono font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Persistent JSON DB
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono uppercase font-bold text-slate-500">Device Evidence Items</span>
                <Database className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-3xl font-black text-slate-950 mb-1">
                {cases.reduce((acc, c) => acc + (c.evidenceCount || 0), 0)}
              </div>
              <div className="text-xs text-slate-500 font-mono">SHA-256 Hashed & Stored</div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono uppercase font-bold text-slate-500">Vault Storage Used</span>
                <Lock className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-3xl font-black text-slate-950 mb-2">
                {cases.reduce((acc, c) => acc + (c.storageGb || 0), 0).toFixed(2)} <span className="text-sm font-normal text-slate-500">GB</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full w-[25%] rounded-full"></div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono uppercase font-bold text-slate-500">Gemini AI Status</span>
                <Cpu className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-lg font-black text-emerald-600 mb-1 flex items-center gap-1.5 mt-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span> Ready
              </div>
              <div className="text-xs text-slate-500 font-mono">Model: gemini-3.6-flash</div>
            </div>
          </div>

          {/* 3. Active Investigation Cases Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-950">Active Database Cases</h3>
                <p className="text-xs text-slate-500 mt-0.5">Select a case to open its dedicated workspace and evidence vault.</p>
              </div>
              <button 
                onClick={() => setShowNewCaseModal(true)}
                className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> New Case
              </button>
            </div>

            {loadingCases ? (
              <div className="py-16 text-center text-slate-500 font-mono text-sm">Loading database cases...</div>
            ) : filteredCases.length === 0 ? (
              <div className="py-16 text-center space-y-4">
                <FolderKanban className="w-12 h-12 text-slate-300 mx-auto" />
                <h4 className="text-base font-bold text-slate-900">No Cases Found in Database</h4>
                <p className="text-sm text-slate-600">Create your first investigative case file to get started.</p>
                <button
                  onClick={() => setShowNewCaseModal(true)}
                  className="px-5 py-2.5 bg-blue-600 text-white text-xs font-bold rounded-xl shadow"
                >
                  Create First Case File
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs uppercase font-mono text-slate-500 bg-slate-50">
                      <th className="py-3.5 px-6">Case Number</th>
                      <th className="py-3.5 px-6">Title</th>
                      <th className="py-3.5 px-6">Priority</th>
                      <th className="py-3.5 px-6">Status</th>
                      <th className="py-3.5 px-6">Evidence</th>
                      <th className="py-3.5 px-6 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {filteredCases.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-4 px-6 font-mono font-bold text-blue-600">{c.caseNumber}</td>
                        <td className="py-4 px-6 font-semibold text-slate-900">{c.title}</td>
                        <td className="py-4 px-6">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-semibold ${
                            c.priority === 'Critical' ? 'bg-red-100 text-red-700' :
                            c.priority === 'High' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {c.priority}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-100 text-emerald-800">
                            {c.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 font-mono text-slate-600">{c.evidenceCount || 0} items</td>
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => onOpenCase(c)}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all inline-flex items-center gap-1.5"
                          >
                            Open Workspace <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* New Case Modal */}
      {showNewCaseModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900">Initiate New Database Case File</h3>
              <button onClick={() => setShowNewCaseModal(false)} className="text-slate-400 hover:text-slate-700">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCase} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Case Title</label>
                <input
                  type="text"
                  required
                  value={newCaseTitle}
                  onChange={(e) => setNewCaseTitle(e.target.value)}
                  placeholder="e.g. Operation Cyber Shield - Sector 4"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Case Description & Objective</label>
                <textarea
                  rows={3}
                  value={newCaseDesc}
                  onChange={(e) => setNewCaseDesc(e.target.value)}
                  placeholder="Describe initial briefing and objective..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Priority Level</label>
                <select
                  value={newCasePriority}
                  onChange={(e) => setNewCasePriority(e.target.value as any)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="Low">Low Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="High">High Priority</option>
                  <option value="Critical">Critical Priority</option>
                </select>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowNewCaseModal(false)}
                  className="px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md flex items-center gap-2 disabled:opacity-50"
                >
                  {submitting ? (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    'Create & Save to Database'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
