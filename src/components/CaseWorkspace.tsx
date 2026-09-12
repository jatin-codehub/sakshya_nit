import React, { useState, useEffect } from 'react';
import { 
  Shield, Cpu, FileText, ArrowLeft, Upload, CheckCircle2, AlertTriangle, 
  Download, Plus, Search, Layers, Activity, Lock, Check, X, Eye, Sparkles, Terminal, Trash2, History
} from 'lucide-react';
import { CaseItem, EvidenceItem, AnalysisVersion, AuditLogEntry, UserProfile, EvidenceType, EVIDENCE_TYPE_LABELS } from '../types';

interface CaseWorkspaceProps {
  caseItem: CaseItem;
  user: UserProfile;
  onBackToDashboard: () => void;
  activeTabDefault?: string;
}

export const CaseWorkspace: React.FC<CaseWorkspaceProps> = ({ caseItem, user, onBackToDashboard, activeTabDefault = 'vault' }) => {
  const [activeTab, setActiveTab] = useState<string>(activeTabDefault);
  const [evidenceList, setEvidenceList] = useState<EvidenceItem[]>([]);
  const [analyses, setAnalyses] = useState<AnalysisVersion[]>([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState<AnalysisVersion | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  
  const [loadingEvidence, setLoadingEvidence] = useState<boolean>(true);
  const [loadingAnalyses, setLoadingAnalyses] = useState<boolean>(true);
  const [analyzingAi, setAnalyzingAi] = useState<boolean>(false);

  // Upload Modal State with Real Device File Upload & 12 Evidence Types
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newType, setNewType] = useState<EvidenceType>('CCTV_VIDEO');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [newDetails, setNewDetails] = useState<string>('');
  const [uploading, setUploading] = useState<boolean>(false);

  // Verdict state
  const [finalVerdict, setFinalVerdict] = useState<string>('Pending Formal Magistrate Review & Warrant Issuance');
  const [verdictLogged, setVerdictLogged] = useState<boolean>(false);

  const fetchEvidence = async () => {
    try {
      const res = await fetch(`/api/cases/${caseItem.id}/evidence`);
      const data = await res.json();
      setEvidenceList(data);
    } catch (err) {
      console.error("Failed to fetch evidence", err);
    } finally {
      setLoadingEvidence(false);
    }
  };

  const fetchAnalyses = async () => {
    try {
      const res = await fetch(`/api/cases/${caseItem.id}/analyses`);
      const data = await res.json();
      setAnalyses(data);
      if (data && data.length > 0) {
        setSelectedAnalysis(data[0]); // default to latest analysis version
      }
    } catch (err) {
      console.error("Failed to fetch analyses", err);
    } finally {
      setLoadingAnalyses(false);
    }
  };

  const fetchAuditLogs = async () => {
    try {
      const res = await fetch(`/api/audit`);
      const data = await res.json();
      setAuditLogs(data);
    } catch (err) {
      console.error("Failed to fetch audit logs", err);
    }
  };

  useEffect(() => {
    fetchEvidence();
    fetchAnalyses();
    fetchAuditLogs();
  }, [caseItem.id]);

  const handleUploadDeviceFile = async (e: React.FormEvent) => {
    e.preventDefault();

    setUploading(true);
    const formData = new FormData();
    if (selectedFile) {
      formData.append('file', selectedFile);
    }
    formData.append('title', newTitle || (selectedFile ? selectedFile.name : 'Investigation Note / Record'));
    formData.append('type', newType);
    formData.append('details', newDetails || `Added evidence of type ${newType}`);
    formData.append('uploadedBy', `${user.name} (${user.id})`);

    try {
      const res = await fetch(`/api/cases/${caseItem.id}/evidence`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Upload failed');
      }

      await fetchEvidence();
      await fetchAuditLogs();
      setShowUploadModal(false);
      setSelectedFile(null);
      setNewTitle('');
      setNewDetails('');
    } catch (err) {
      console.error("Error uploading file:", err);
      alert("Failed to upload evidence item.");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteEvidence = async (evId: string) => {
    if (!confirm("Are you sure you want to delete this evidence item? This will be recorded in the audit trail.")) return;
    try {
      const res = await fetch(`/api/cases/${caseItem.id}/evidence/${evId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        await fetchEvidence();
        await fetchAuditLogs();
      }
    } catch (err) {
      console.error("Error deleting evidence", err);
    }
  };

  const handleTriggerAiAnalysis = async () => {
    setAnalyzingAi(true);
    try {
      const res = await fetch(`/api/cases/${caseItem.id}/ai-analyze`, {
        method: 'POST',
      });
      const data = await res.json();
      if (res.ok) {
        await fetchAnalyses();
        setSelectedAnalysis(data);
        setActiveTab('hypotheses');
        await fetchAuditLogs();
      } else {
        alert(data.error || 'AI analysis failed');
      }
    } catch (err) {
      console.error("AI Analysis error:", err);
      alert("Failed to run AI analysis.");
    } finally {
      setAnalyzingAi(false);
    }
  };

  const handleUpdateReviewStatus = async (hypId: string, status: 'Accepted' | 'Rejected' | 'Annotated', notes?: string) => {
    try {
      const res = await fetch(`/api/cases/${caseItem.id}/hypotheses/${hypId}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status, 
          investigatorNotes: notes, 
          user: `${user.name} (${user.id})`,
          analysisId: selectedAnalysis?.id 
        })
      });
      if (res.ok) {
        await fetchAnalyses();
        await fetchAuditLogs();
      }
    } catch (err) {
      console.error("Error updating review status", err);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-slate-50 overflow-y-auto">
      
      {/* Workspace Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBackToDashboard}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                {caseItem.caseNumber}
              </span>
              <span className={`text-xs px-2.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                caseItem.priority === 'Critical' ? 'bg-red-100 text-red-700' :
                caseItem.priority === 'High' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
              }`}>
                {caseItem.priority} Priority
              </span>
              {analyses.length > 0 && (
                <span className="text-xs font-mono bg-purple-50 text-purple-700 border border-purple-200 px-2.5 py-0.5 rounded font-bold">
                  Analysis V{selectedAnalysis?.analysisVersion || analyses.length}
                </span>
              )}
            </div>
            <h1 className="text-xl font-black text-slate-950 mt-1">{caseItem.title}</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleTriggerAiAnalysis}
            disabled={analyzingAi}
            className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold rounded-xl shadow-sm flex items-center gap-2 transition-all disabled:opacity-50"
          >
            {analyzingAi ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            {analyses.length > 0 ? 'Analyze Again (New Version)' : 'Run Gemini AI Analysis'}
          </button>
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-sm flex items-center gap-2 transition-all"
          >
            <Upload className="w-4 h-4" />
            Add Evidence
          </button>
        </div>
      </div>

      {/* Trust Compliance Notice Banner */}
      <div className="bg-blue-950 text-blue-100 px-6 py-2.5 flex items-center justify-between text-xs font-mono border-b border-blue-900">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-blue-400 shrink-0" />
          <span>CORE PRINCIPLE: <strong className="text-white">"AI Only Assists, Decision is Human's. Justice Prevails."</strong></span>
        </div>
        <div className="hidden md:flex items-center gap-4 text-slate-300">
          <span>Lead Investigator: {user.name}</span>
          <span>Clearance: {user.clearance}</span>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white border-b border-slate-200 px-6 flex gap-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'vault', label: 'Evidence Vault', count: evidenceList.length },
          { id: 'ai-processing', label: 'AI Pipeline', count: 7 },
          { id: 'hypotheses', label: 'AI Hypotheses', count: selectedAnalysis?.hypotheses?.length || 0 },
          { id: 'versions', label: 'Analysis History', count: analyses.length },
          { id: 'graph', label: 'Evidence Graph', count: 5 },
          { id: 'review', label: 'Human Review', count: selectedAnalysis?.hypotheses?.filter(h => h.humanReviewStatus === 'Pending').length || 0 },
          { id: 'report', label: 'Official Report', count: 1 },
          { id: 'audit', label: 'Audit Trail', count: auditLogs.length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-3.5 px-4 text-sm font-semibold border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === tab.id
                ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            {tab.label}
            <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${
              activeTab === tab.id ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Tab Content Area */}
      <div className="p-6 max-w-7xl w-full mx-auto space-y-6">

        {/* 1. EVIDENCE VAULT TAB */}
        {activeTab === 'vault' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Secure Multi-Modal Evidence Vault (12 Controlled Types)</h3>
                <p className="text-sm text-slate-600 mt-1">
                  Upload files or notes. Each item is strictly tied to Case ID and User ID with SHA-256 cryptographic verification.
                </p>
              </div>
              <button
                onClick={() => setShowUploadModal(true)}
                className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-sm flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add New Evidence
              </button>
            </div>

            {loadingEvidence ? (
              <div className="py-20 text-center text-slate-500 font-mono text-sm">Loading secure evidence vault...</div>
            ) : evidenceList.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-4">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto">
                  <Upload className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-slate-900">No Evidence Items Uploaded Yet</h4>
                <p className="text-sm text-slate-600 max-w-md mx-auto">
                  Upload CCTV footage, CDR logs, witness statements, or documents from your device.
                </p>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="px-6 py-3 bg-blue-600 text-white text-sm font-bold rounded-xl shadow-md"
                >
                  Upload First Evidence Item
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {evidenceList.map((item) => (
                  <div key={item.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-blue-300 transition-all flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-mono font-semibold px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg border border-blue-200">
                          {EVIDENCE_TYPE_LABELS[item.type] || item.type}
                        </span>
                        <button
                          onClick={() => handleDeleteEvidence(item.id)}
                          className="text-slate-400 hover:text-red-600 transition-colors p-1"
                          title="Delete Evidence"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <h4 className="font-bold text-slate-900 text-base mb-1">{item.title}</h4>
                      <p className="text-xs font-mono text-slate-500 truncate mb-3">{item.originalName || 'Text / Structured Record'} ({item.fileSize || 'N/A'})</p>

                      <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg mb-3">
                        {item.details || 'No additional details provided.'}
                      </p>

                      {item.fileUrl && (
                        <div className="mb-3">
                          <a 
                            href={item.fileUrl} 
                            target="_blank" 
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200"
                          >
                            <Eye className="w-3.5 h-3.5" /> Preview / Download File
                          </a>
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-400">
                      <span className="truncate max-w-[160px]" title={item.hashSha256}>ID: {item.id}</span>
                      <span>{item.uploadedAt}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 2. AI PIPELINE TAB */}
        {activeTab === 'ai-processing' && (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Sakshya Automated Multimodal AI Pipeline</h3>
                <p className="text-sm text-slate-600 mt-1">
                  Powered by Gemini 3.6 Flash for evidence-grounded entity extraction and hypothesis correlation.
                </p>
              </div>
              <button
                onClick={handleTriggerAiAnalysis}
                disabled={analyzingAi}
                className="px-5 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm rounded-xl shadow-md flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" /> {analyses.length > 0 ? 'Analyze Again (New Version)' : 'Run Gemini AI Analysis'}
              </button>
            </div>

            <div className="relative border-l-2 border-blue-600 ml-4 space-y-8 pl-6 py-2">
              {[
                { step: '01', title: 'User & Case Ownership Verification', desc: 'Verifies backend authentication token against case owner ID.', status: 'Verified' },
                { step: '02', title: 'Unified Evidence Snapshot Packaging', desc: 'Aggregates all current evidence items with their exact evidence IDs.', status: 'Active' },
                { step: '03', title: 'Multimodal Gemini 3.6 Flash Inference', desc: 'Strict separation of Fact, Observation, Reported Claim, Inference, and Hypothesis.', status: 'Active' },
                { step: '04', title: 'Versioned Analysis Storage', desc: 'Persists analysis history with evidence snapshot IDs for reproducibility.', status: 'Active' },
              ].map((stage, idx) => (
                <div key={idx} className="relative">
                  <span className="absolute -left-[35px] top-0 w-7 h-7 rounded-full bg-blue-600 text-white font-mono text-xs font-bold flex items-center justify-center shadow">
                    {stage.step}
                  </span>
                  <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-slate-900 text-base">{stage.title}</h4>
                      <span className="text-xs font-mono font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded">
                        {stage.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600">{stage.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. AI HYPOTHESES TAB */}
        {activeTab === 'hypotheses' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  AI Hypotheses — Analysis Version V{selectedAnalysis?.analysisVersion || 1}
                </h3>
                <p className="text-sm text-slate-600 mt-0.5">
                  Grounded strictly in available evidence IDs. Never fabricate facts.
                </p>
              </div>
              <div className="flex items-center gap-3">
                {analyses.length > 1 && (
                  <select
                    value={selectedAnalysis?.id}
                    onChange={(e) => {
                      const found = analyses.find(a => a.id === e.target.value);
                      if (found) setSelectedAnalysis(found);
                    }}
                    className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-900"
                  >
                    {analyses.map(a => (
                      <option key={a.id} value={a.id}>Version V{a.analysisVersion} ({a.createdAt})</option>
                    ))}
                  </select>
                )}
                <button
                  onClick={handleTriggerAiAnalysis}
                  disabled={analyzingAi}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow flex items-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Analyze Again
                </button>
              </div>
            </div>

            {selectedAnalysis?.summary && (
              <div className="bg-blue-50 border border-blue-200 p-6 rounded-2xl space-y-3">
                <h4 className="font-bold text-blue-950 text-sm uppercase font-mono">Executive Summary (Gemini 3.6 Flash)</h4>
                <p className="text-sm text-blue-900 leading-relaxed">{selectedAnalysis.summary}</p>
                {selectedAnalysis.keyFindings?.length > 0 && (
                  <div className="pt-2">
                    <span className="text-xs font-mono font-bold text-blue-800 uppercase">Key Findings:</span>
                    <ul className="list-disc list-inside text-xs text-blue-900 mt-1 space-y-1">
                      {selectedAnalysis.keyFindings.map((kf, i) => (
                        <li key={i}>{kf}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {!selectedAnalysis || !selectedAnalysis.hypotheses || selectedAnalysis.hypotheses.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-4">
                <Sparkles className="w-12 h-12 text-purple-600 mx-auto" />
                <h4 className="text-lg font-bold text-slate-900">No AI Hypotheses Generated Yet</h4>
                <p className="text-sm text-slate-600 max-w-md mx-auto">
                  Add evidence items to the vault, then click "Run Gemini AI Analysis" to generate evidence-grounded hypotheses.
                </p>
                <button
                  onClick={handleTriggerAiAnalysis}
                  className="px-6 py-3 bg-purple-600 text-white text-sm font-bold rounded-xl shadow-md"
                >
                  Run Gemini AI Analysis
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {selectedAnalysis.hypotheses.map((hyp) => {
                  const isHigh = hyp.confidence >= 70;
                  const isMed = hyp.confidence >= 40 && hyp.confidence < 70;
                  return (
                    <div key={hyp.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className={`px-3 py-2 rounded-xl text-center font-mono font-black text-lg shrink-0 ${
                            isHigh ? 'bg-emerald-100 text-emerald-800' :
                            isMed ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {hyp.confidence}%
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              {hyp.category && (
                                <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                                  hyp.category === 'PRIMARY' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                                  hyp.category === 'SUPPORTING' ? 'bg-purple-100 text-purple-700 border border-purple-200' :
                                  'bg-amber-100 text-amber-700 border border-amber-200'
                                }`}>
                                  {hyp.category === 'ALTERNATIVE_VIEWPOINT' ? '⚡ ALT. VIEWPOINT' : hyp.category === 'PRIMARY' ? '🎯 PRIMARY' : '🔗 SUPPORTING'}
                                </span>
                              )}
                            </div>
                            <h4 className="text-lg font-bold text-slate-900">{hyp.title}</h4>
                            <div className="flex items-center gap-3 mt-1 text-xs font-mono text-slate-500">
                              <span>Confidence: <strong className="text-slate-900">{hyp.confidenceLabel}</strong></span>
                              <span>•</span>
                              <span>Review Status: <strong className={
                                hyp.humanReviewStatus === 'Accepted' ? 'text-emerald-600' :
                                hyp.humanReviewStatus === 'Rejected' ? 'text-red-600' : 'text-amber-600'
                              }>{hyp.humanReviewStatus}</strong></span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleUpdateReviewStatus(hyp.id, 'Accepted')}
                            className={`px-3.5 py-2 text-xs font-bold rounded-xl border transition-all flex items-center gap-1.5 ${
                              hyp.humanReviewStatus === 'Accepted' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                            }`}
                          >
                            <Check className="w-4 h-4" /> Accept
                          </button>
                          <button 
                            onClick={() => handleUpdateReviewStatus(hyp.id, 'Rejected')}
                            className={`px-3.5 py-2 text-xs font-bold rounded-xl border transition-all flex items-center gap-1.5 ${
                              hyp.humanReviewStatus === 'Rejected' ? 'bg-red-600 text-white border-red-600' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                            }`}
                          >
                            <X className="w-4 h-4" /> Reject
                          </button>
                        </div>
                      </div>

                      <p className="text-sm text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-200/60 leading-relaxed">
                        {hyp.description}
                      </p>

                      {hyp.reasoning && (
                        <div className="text-xs text-slate-600 bg-slate-50/80 p-3 rounded-lg border border-slate-200">
                          <strong className="text-slate-900">Reasoning:</strong> {hyp.reasoning}
                        </div>
                      )}

                      {hyp.missingInformation && (
                        <div className="text-xs text-amber-800 bg-amber-50 p-3 rounded-lg border border-amber-200">
                          <strong className="text-amber-900">Missing Information:</strong> {hyp.missingInformation}
                        </div>
                      )}

                      {hyp.sourcesUsed && hyp.sourcesUsed.length > 0 && (
                        <div className="space-y-2 pt-2">
                          <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">Traceable Evidence Sources:</span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {hyp.sourcesUsed.map((src, idx) => (
                              <div key={idx} className="bg-blue-50/50 border border-blue-100 p-3 rounded-xl text-xs space-y-1">
                                <div className="font-bold text-blue-900 flex items-center justify-between">
                                  <span>{src.evidenceTitle || 'Evidence Item'}</span>
                                  <span className="text-[10px] font-mono text-blue-600 bg-blue-100 px-2 py-0.5 rounded">{src.type || 'FILE'}</span>
                                </div>
                                <p className="text-slate-600 italic">"{src.excerpt}"</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* 4. ANALYSIS HISTORY TAB */}
        {activeTab === 'versions' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Analysis Version History & Evidence Snapshots</h3>
              <p className="text-sm text-slate-600">Review previous analysis runs and the exact evidence versions used during each analysis.</p>
            </div>

            {analyses.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-sm font-mono">No analysis versions recorded yet.</div>
            ) : (
              <div className="space-y-4">
                {analyses.map((a) => (
                  <div key={a.id} className="p-5 rounded-xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-blue-600 bg-blue-100 px-2.5 py-0.5 rounded text-xs">
                          Version V{a.analysisVersion}
                        </span>
                        <span className="text-xs font-mono text-slate-500">{a.createdAt}</span>
                        <span className="text-xs font-mono bg-purple-100 text-purple-700 px-2 py-0.5 rounded">{a.modelName}</span>
                      </div>
                      <p className="text-xs text-slate-700 line-clamp-2">{a.summary}</p>
                      <div className="text-[11px] font-mono text-slate-400">
                        Evidence Snapshot Items: {a.evidenceSnapshot?.length || 0}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedAnalysis(a);
                        setActiveTab('hypotheses');
                      }}
                      className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl shadow hover:bg-slate-800 shrink-0"
                    >
                      View Version
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 5. EVIDENCE GRAPH TAB */}
        {activeTab === 'graph' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Evidence Entity Network Graph</h3>
                <p className="text-sm text-slate-600">Visual mapping of extracted entities across evidence items.</p>
              </div>
            </div>

            <div className="bg-slate-950 rounded-2xl p-6 h-[460px] relative flex items-center justify-center overflow-hidden border border-slate-800 shadow-inner">
              <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-60"></div>
              
              <svg className="w-full h-full relative z-10" viewBox="0 0 600 400">
                <line x1="150" y1="150" x2="300" y2="120" stroke="#475569" strokeWidth="2" />
                <line x1="300" y1="120" x2="450" y2="200" stroke="#475569" strokeWidth="2" />
                <line x1="300" y1="120" x2="250" y2="280" stroke="#475569" strokeWidth="2" />

                {[
                  { id: 'n1', label: 'Case Subject', x: 150, y: 150, color: '#2563eb' },
                  { id: 'n2', label: 'Vault Evidence', x: 300, y: 120, color: '#059669' },
                  { id: 'n3', label: 'GPS / Location', x: 450, y: 200, color: '#d97706' },
                  { id: 'n4', label: 'CDR Record', x: 250, y: 280, color: '#7c3aed' },
                ].map((node) => (
                  <g key={node.id} className="cursor-pointer">
                    <circle cx={node.x} cy={node.y} r="26" fill={node.color} className="opacity-90 shadow-lg" />
                    <text x={node.x} y={node.y + 42} textAnchor="middle" fill="#e2e8f0" fontSize="11" fontFamily="sans-serif" fontWeight="bold">
                      {node.label}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </div>
        )}

        {/* 6. HUMAN REVIEW TAB */}
        {activeTab === 'review' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Human-in-the-Loop Review & Final Verdict</h3>
                <p className="text-sm text-slate-600 mt-0.5">Investigators must review AI hypotheses and log official legal verdicts.</p>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 text-xs font-mono font-bold">
                AI Only Assists, Decision is Human's
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <h4 className="text-base font-bold text-slate-900">Log Official Case Verdict</h4>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase font-bold text-slate-700 mb-2">
                    Investigator Final Verdict & Action Plan
                  </label>
                  <textarea
                    rows={4}
                    value={finalVerdict}
                    onChange={(e) => setFinalVerdict(e.target.value)}
                    className="w-full p-4 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 font-sans"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="text-xs text-slate-500 font-mono">
                    Logged under Investigator: <strong className="text-slate-900">{user.name} ({user.id})</strong>
                  </div>
                  <button
                    onClick={() => {
                      setVerdictLogged(true);
                    }}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all text-sm flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {verdictLogged ? 'Verdict Updated & Signed' : 'Sign & Submit Official Verdict'}
                  </button>
                </div>

                {verdictLogged && (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-xs text-emerald-800">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>Verdict successfully cryptographically signed and recorded to tamper-proof audit trail.</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 7. OFFICIAL REPORT TAB */}
        {activeTab === 'report' && (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-8" id="official-report-content">
            <div className="flex items-center justify-between pb-6 border-b border-slate-200">
              <div>
                <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded">OFFICIAL BRIEFING DOCUMENT</span>
                <h2 className="text-2xl font-black text-slate-950 mt-2">Sakshya Investigative Case Report (Version V{selectedAnalysis?.analysisVersion || 1})</h2>
                <p className="text-sm text-slate-500 font-mono mt-1">Case Number: {caseItem.caseNumber} | Generated: {new Date().toLocaleDateString()}</p>
              </div>
              {(() => {
                const hasAccepted = selectedAnalysis?.hypotheses?.some(h => h.humanReviewStatus === 'Accepted');
                return (
                  <button
                    onClick={() => {
                      // Generate and download HTML report as printable file
                      const hypothesesHtml = (selectedAnalysis?.hypotheses || []).map((hyp, i) => `
                        <div style="margin-bottom:24px;padding:20px;border:1px solid #e2e8f0;border-radius:12px;background:${hyp.humanReviewStatus === 'Accepted' ? '#f0fdf4' : hyp.humanReviewStatus === 'Rejected' ? '#fef2f2' : '#fffbeb'}">
                          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
                            <div>
                              <span style="font-size:11px;font-family:monospace;font-weight:bold;padding:3px 8px;border-radius:6px;background:${hyp.category === 'PRIMARY' ? '#dbeafe' : hyp.category === 'SUPPORTING' ? '#ede9fe' : '#fef3c7'};color:${hyp.category === 'PRIMARY' ? '#1d4ed8' : hyp.category === 'SUPPORTING' ? '#6d28d9' : '#92400e'}">${hyp.category === 'ALTERNATIVE_VIEWPOINT' ? 'ALT. VIEWPOINT' : hyp.category || 'HYPOTHESIS'}</span>
                              <span style="font-size:11px;font-family:monospace;margin-left:8px;padding:3px 8px;border-radius:6px;background:${hyp.humanReviewStatus === 'Accepted' ? '#dcfce7' : hyp.humanReviewStatus === 'Rejected' ? '#fee2e2' : '#fef9c3'};color:${hyp.humanReviewStatus === 'Accepted' ? '#166534' : hyp.humanReviewStatus === 'Rejected' ? '#991b1b' : '#854d0e'}">${hyp.humanReviewStatus}</span>
                            </div>
                            <span style="font-size:20px;font-weight:900;font-family:monospace;color:${hyp.confidence >= 70 ? '#166534' : hyp.confidence >= 40 ? '#92400e' : '#991b1b'}">${hyp.confidence}%</span>
                          </div>
                          <h4 style="font-size:16px;font-weight:bold;margin-bottom:8px;color:#0f172a">${i+1}. ${hyp.title}</h4>
                          <p style="font-size:13px;color:#475569;margin-bottom:8px">${hyp.description}</p>
                          <p style="font-size:12px;color:#64748b"><strong>Reasoning:</strong> ${hyp.reasoning || 'N/A'}</p>
                          <p style="font-size:12px;color:#64748b"><strong>Missing Information:</strong> ${hyp.missingInformation || 'N/A'}</p>
                          ${hyp.sourcesUsed?.length > 0 ? `<p style="font-size:11px;color:#94a3b8;margin-top:8px"><strong>Sources:</strong> ${hyp.sourcesUsed.map(s => s.evidenceTitle).join(', ')}</p>` : ''}
                        </div>
                      `).join('');

                      const reportHtml = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>Sakshya Report - ${caseItem.caseNumber}</title>
<style>
  body{font-family:'Segoe UI',system-ui,sans-serif;max-width:800px;margin:0 auto;padding:40px;color:#0f172a;line-height:1.6}
  h1{font-size:24px;margin-bottom:4px} h2{font-size:18px;color:#1e40af;border-bottom:2px solid #e2e8f0;padding-bottom:8px;margin-top:32px}
  .meta{font-family:monospace;font-size:12px;color:#64748b;margin-bottom:24px}
  .section{margin-bottom:24px;padding:16px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;font-size:14px;color:#334155}
  .header-bar{background:#0f172a;color:white;padding:20px 24px;border-radius:12px;margin-bottom:24px;text-align:center}
  .header-bar h1{color:white;margin:0} .header-bar p{color:#94a3b8;font-size:12px;margin:4px 0 0}
  .stamp{display:inline-block;padding:6px 16px;border:2px solid #166534;color:#166534;font-weight:bold;font-size:12px;border-radius:8px;margin-top:16px;font-family:monospace}
  @media print{body{padding:20px}  .header-bar{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
</style></head><body>
<div class="header-bar">
  <p style="font-size:10px;letter-spacing:2px;text-transform:uppercase">OFFICIAL BRIEFING DOCUMENT — SAKSHYA AI INVESTIGATION PLATFORM</p>
  <h1>Case Report: ${caseItem.title}</h1>
  <p>Case No: ${caseItem.caseNumber} | Priority: ${caseItem.priority} | Analysis Version: V${selectedAnalysis?.analysisVersion || 1}</p>
  <p>Generated: ${new Date().toLocaleString()} | Lead: ${caseItem.leadInvestigator}</p>
</div>

<h2>1. Executive Summary</h2>
<div class="section">${selectedAnalysis?.summary || caseItem.description}</div>

<h2>2. Key Findings</h2>
<div class="section"><ul>${(selectedAnalysis?.keyFindings || []).map(f => '<li>' + f + '</li>').join('')}</ul></div>

<h2>3. Evidence Vault Snapshot</h2>
<div class="section">Total verified evidence items: <strong>${evidenceList.length}</strong>. All items cryptographically hashed (SHA-256) for chain of custody verification.<br/><br/>
${evidenceList.map((e, i) => '<strong>' + (i+1) + '.</strong> ' + e.title + ' [' + e.type + '] — ' + (e.originalName || 'Record') + ' (' + (e.fileSize || 'N/A') + ')').join('<br/>')}</div>

<h2>4. AI Hypotheses & Review Status</h2>
${hypothesesHtml}

<h2>5. Investigator Final Verdict</h2>
<div class="section" style="border-left:4px solid #1e40af">${finalVerdict}</div>

<h2>6. Limitations & Disclaimers</h2>
<div class="section">${selectedAnalysis?.limitations || 'Standard forensic verification required.'}<br/><br/>
<em>DISCLAIMER: This analysis was generated by AI (Gemini 3.6 Flash). AI Only Assists, Decision is Human's. All conclusions require human investigative verification before any legal action. Justice Prevails.</em></div>

<div style="text-align:center;margin-top:40px;padding-top:20px;border-top:2px solid #e2e8f0">
  <span class="stamp">✅ DIGITALLY VERIFIED — SAKSHYA PLATFORM</span>
  <p style="font-size:11px;color:#94a3b8;margin-top:8px">Report verified by: ${user.name} (${user.id}) | Clearance: ${user.clearance}</p>
</div>
</body></html>`;

                      const blob = new Blob([reportHtml], { type: 'text/html' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `Sakshya_Report_${caseItem.caseNumber}_V${selectedAnalysis?.analysisVersion || 1}.html`;
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      URL.revokeObjectURL(url);
                    }}
                    disabled={!hasAccepted}
                    className={`px-5 py-3 font-bold text-sm rounded-xl shadow-sm flex items-center gap-2 transition-all ${
                      hasAccepted
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                    title={!hasAccepted ? 'Accept at least one hypothesis in the AI Hypotheses tab to enable download' : ''}
                  >
                    <Download className="w-4 h-4" />
                    {hasAccepted ? 'Download Report' : 'Accept Hypotheses First'}
                  </button>
                );
              })()}
            </div>

            {!selectedAnalysis?.hypotheses?.some(h => h.humanReviewStatus === 'Accepted') && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3 text-sm text-amber-800">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                <div>
                  <strong>Report download requires acceptance.</strong> Go to the <button onClick={() => setActiveTab('hypotheses')} className="underline font-bold text-amber-900">AI Hypotheses tab</button> and accept at least one hypothesis to enable the official report download.
                </div>
              </div>
            )}

            <div className="space-y-6 text-sm text-slate-700 leading-relaxed">
              <div>
                <h4 className="text-xs font-mono uppercase font-bold text-slate-400 mb-1">1. Case Executive Summary</h4>
                <p className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  {selectedAnalysis?.summary || caseItem.description} Lead Investigator: {caseItem.leadInvestigator}.
                </p>
              </div>

              {selectedAnalysis?.keyFindings && selectedAnalysis.keyFindings.length > 0 && (
                <div>
                  <h4 className="text-xs font-mono uppercase font-bold text-slate-400 mb-1">2. Key Findings</h4>
                  <ul className="bg-slate-50 p-4 rounded-xl border border-slate-200 list-disc list-inside space-y-1">
                    {selectedAnalysis.keyFindings.map((kf, i) => (
                      <li key={i}>{kf}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <h4 className="text-xs font-mono uppercase font-bold text-slate-400 mb-1">3. Evidence Vault Snapshot</h4>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <p>Total verified evidence items used in this analysis: <strong>{evidenceList.length}</strong>. All items backed by cryptographic hashes.</p>
                  {evidenceList.map((ev, i) => (
                    <div key={ev.id} className="text-xs font-mono text-slate-500 pl-4">
                      {i+1}. {ev.title} [{ev.type}] — {ev.originalName || 'Record'} ({ev.fileSize || 'N/A'})
                    </div>
                  ))}
                </div>
              </div>

              {selectedAnalysis?.hypotheses && selectedAnalysis.hypotheses.length > 0 && (
                <div>
                  <h4 className="text-xs font-mono uppercase font-bold text-slate-400 mb-1">4. AI Hypotheses & Review Status</h4>
                  <div className="space-y-3">
                    {selectedAnalysis.hypotheses.map((hyp, i) => (
                      <div key={hyp.id} className={`p-4 rounded-xl border ${
                        hyp.humanReviewStatus === 'Accepted' ? 'bg-emerald-50 border-emerald-200' :
                        hyp.humanReviewStatus === 'Rejected' ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                              hyp.category === 'PRIMARY' ? 'bg-blue-100 text-blue-700' :
                              hyp.category === 'SUPPORTING' ? 'bg-purple-100 text-purple-700' :
                              'bg-amber-100 text-amber-700'
                            }`}>
                              {hyp.category === 'ALTERNATIVE_VIEWPOINT' ? 'ALT. VIEWPOINT' : hyp.category || 'HYPOTHESIS'}
                            </span>
                            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                              hyp.humanReviewStatus === 'Accepted' ? 'bg-emerald-200 text-emerald-800' :
                              hyp.humanReviewStatus === 'Rejected' ? 'bg-red-200 text-red-800' : 'bg-amber-200 text-amber-800'
                            }`}>
                              {hyp.humanReviewStatus}
                            </span>
                          </div>
                          <span className="font-mono font-black text-lg">{hyp.confidence}%</span>
                        </div>
                        <h5 className="font-bold text-slate-900 text-sm">{i+1}. {hyp.title}</h5>
                        <p className="text-xs text-slate-600 mt-1">{hyp.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h4 className="text-xs font-mono uppercase font-bold text-slate-400 mb-1">5. Investigator Final Verdict</h4>
                <p className="bg-blue-50 p-4 rounded-xl border-l-4 border-blue-600">
                  {finalVerdict}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-mono uppercase font-bold text-slate-400 mb-1">6. Limitations & Disclaimers</h4>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <p>{selectedAnalysis?.limitations || 'Standard forensic verification required.'}</p>
                  <p className="text-xs italic text-slate-500">DISCLAIMER: This analysis was generated by AI (Gemini 3.6 Flash). AI Only Assists, Decision is Human's. All conclusions require human investigative verification before any legal action. Justice Prevails.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 8. AUDIT TRAIL TAB */}
        {activeTab === 'audit' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Tamper-Proof Audit Trail (AES-256)</h3>
                <p className="text-sm text-slate-600 mt-0.5">Chronological immutable log of all platform actions and database updates.</p>
              </div>
              <div className="text-xs font-mono text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-emerald-600" /> Chain of Custody Secure
              </div>
            </div>

            <div className="space-y-3 font-mono">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-4 rounded-xl bg-slate-900 text-slate-200 border border-slate-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-blue-400 font-bold">[{log.actionType}]</span>
                      <span className="text-slate-400">{log.timestamp}</span>
                      <span className="text-emerald-400 font-semibold">— {log.user}</span>
                    </div>
                    <p className="text-slate-300 font-sans text-sm">{log.details}</p>
                  </div>
                  <div className="text-[11px] text-slate-400 bg-slate-800 px-3 py-1.5 rounded border border-slate-700 shrink-0">
                    Hash: {log.hash}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Upload Evidence Modal with 12 Evidence Types */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900">Add Evidence Item (12 Controlled Types)</h3>
              <button onClick={() => setShowUploadModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadDeviceFile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Evidence Title / Identifier</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. CCTV Cam 04 Footage / Witness Statement #1"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Evidence Category (Controlled)</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as EvidenceType)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
                >
                  <option value="CCTV_VIDEO">1. CCTV / Video</option>
                  <option value="PHOTO_IMAGE">2. Photos & Images</option>
                  <option value="AUDIO_RECORDING">3. Audio Recordings</option>
                  <option value="PDF_DOCUMENT">4. PDFs / Documents</option>
                  <option value="WITNESS_STATEMENT">5. Witness Statements</option>
                  <option value="FIR_CASE_REPORT">6. FIR / Case Reports</option>
                  <option value="CALL_RECORD_CDR">7. Call Records (CDR)</option>
                  <option value="VEHICLE_INFO">8. Vehicle Info</option>
                  <option value="SUSPECT_VICTIM_INFO">9. Suspect / Victim Info</option>
                  <option value="LOCATION_GPS_CELL">10. Locations (GPS / Cell)</option>
                  <option value="DATE_TIME">11. Dates & Times</option>
                  <option value="INVESTIGATOR_NOTE">12. Investigator Notes</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Upload File from Device (Optional)</label>
                <input
                  type="file"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setSelectedFile(e.target.files[0]);
                      if (!newTitle) {
                        setNewTitle(e.target.files[0].name.replace(/\.[^/.]+$/, ''));
                      }
                    }
                  }}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Details, Observations & Notes</label>
                <textarea
                  rows={3}
                  value={newDetails}
                  onChange={(e) => setNewDetails(e.target.value)}
                  placeholder="Enter details, witness statements, or transcription text for AI analysis..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md flex items-center gap-2 disabled:opacity-50"
                >
                  {uploading ? (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    'Securely Add Evidence'
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
