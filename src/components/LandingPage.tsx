import React from 'react';
import { Shield, Cpu, Lock, ArrowRight, CheckCircle2, FileText, Video, Mic, MapPin, Users, Database, Sparkles, Activity, Search, ShieldCheck } from 'lucide-react';

interface LandingPageProps {
  onOpenAuth: (mode: 'login' | 'signup') => void;
  onExploreDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenAuth, onExploreDemo }) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={onExploreDemo}>
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-blue-600 flex items-center justify-center shadow-md">
              <Shield className="w-5 h-5 text-blue-500 absolute" />
              <Cpu className="w-3.5 h-3.5 text-white z-10" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-slate-950">Sakshya</span>
              <span className="hidden sm:inline-block ml-2 text-xs px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-mono font-medium">
                साक्ष्य
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#how-it-works" className="hover:text-blue-600 transition-colors">How it works</a>
            <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
            <a href="#evidence-vault" className="hover:text-blue-600 transition-colors">Evidence Types</a>
            <a href="#about" className="hover:text-blue-600 transition-colors">About</a>
          </nav>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => onOpenAuth('login')}
              className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors"
            >
              Log In
            </button>
            <button 
              onClick={() => onOpenAuth('signup')}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm shadow-blue-600/30 transition-all flex items-center gap-2 group"
            >
              Get Started
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 overflow-hidden bg-gradient-to-b from-white via-slate-50 to-slate-100">
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold tracking-wide font-mono">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                AI Only Assists, Decision is Human's
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-950 leading-[1.15]">
                Connect Every Clue. <br />
                <span className="text-blue-600">Let Investigators Decide.</span>
              </h1>

              <p className="text-lg text-slate-600 max-w-2xl leading-relaxed font-normal">
                Sakshya (<span className="font-semibold text-slate-800">साक्ष्य</span>) is an advanced AI-powered investigation & decision-support platform built for law enforcement. Unifying multi-modal evidence into tamper-proof insights.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                <button 
                  onClick={() => onOpenAuth('signup')}
                  className="px-8 py-4 text-base font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2 group"
                >
                  Get Started Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button 
                  onClick={onExploreDemo}
                  className="px-8 py-4 text-base font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <Activity className="w-5 h-5 text-blue-600" />
                  Explore Secure Demo
                </button>
              </div>

              <div className="pt-6 flex items-center gap-6 text-xs text-slate-500 font-mono">
                <div className="flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-emerald-600" />
                  AES-256 Vault Encryption
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  Chain of Custody Verified
                </div>
              </div>
            </div>

            {/* Hero Visual Mock */}
            <div className="lg:col-span-5">
              <div className="relative bg-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-800 text-white overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Shield className="w-48 h-48 text-blue-500" />
                </div>
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-xs font-mono text-slate-300">SECURE WORKSTATION ACTIVE</span>
                  </div>
                  <span className="text-xs font-mono bg-blue-950 text-blue-400 px-2.5 py-1 rounded border border-blue-800">
                    Case #2026-05
                  </span>
                </div>

                <div className="space-y-4 font-mono text-xs">
                  <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700">
                    <div className="text-slate-400 text-[10px] mb-1">AI HYPOTHESIS ENGINE #1 (Confidence: 88%)</div>
                    <div className="text-sm font-bold text-emerald-400 mb-1">Insider-Assisted Breach Confirmed</div>
                    <div className="text-slate-300 text-[11px] leading-relaxed">
                      RFID badge #992-Alpha correlated with White Sedan (DL-3C-8891).
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/80">
                      <div className="text-slate-400 text-[10px]">EVIDENCE ITEMS</div>
                      <div className="text-lg font-bold text-white mt-0.5">14 Verified</div>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/80">
                      <div className="text-slate-400 text-[10px]">AUDIT HASH</div>
                      <div className="text-[11px] font-mono text-blue-400 mt-0.5 truncate">SHA-256 OK</div>
                    </div>
                  </div>

                  <div className="pt-2 text-[11px] text-slate-400 italic bg-blue-950/40 p-2.5 rounded border border-blue-900/50">
                    ℹ️ "AI Only Assists, Decision is Human's. Justice Prevails."
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Trust & Stats Strip */}
      <section className="py-12 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 text-center">
              <div className="text-3xl font-black text-slate-950 mb-1">500+</div>
              <div className="text-xs uppercase tracking-wider text-slate-600 font-semibold">Cases Solved</div>
            </div>
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 text-center">
              <div className="text-3xl font-black text-blue-600 mb-1">10,000+</div>
              <div className="text-xs uppercase tracking-wider text-slate-600 font-semibold">Evidence Processed</div>
            </div>
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 text-center">
              <div className="text-3xl font-black text-emerald-600 mb-1">92%</div>
              <div className="text-xs uppercase tracking-wider text-slate-600 font-semibold">AI Detection Accuracy</div>
            </div>
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 text-center">
              <div className="text-3xl font-black text-slate-950 mb-1">AES-256</div>
              <div className="text-xs uppercase tracking-wider text-slate-600 font-semibold">Secure Vault</div>
            </div>
          </div>
        </div>
      </section>

      {/* How Sakshya Works */}
      <section id="how-it-works" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs uppercase tracking-widest text-blue-600 font-bold mb-3">Workflow</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight mb-4">
              How Sakshya Empowers Investigators
            </h3>
            <p className="text-slate-600 text-base">
              A rigorous 3-step investigative lifecycle designed for uncompromising accuracy and accountability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 font-black text-xl flex items-center justify-center mb-6">
                01
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">Input & Secure Vault</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                Ingest CCTV, audio, photographs, PDFs, witness statements, CDR logs, and location data into a tamper-proof SHA-256 hashed vault.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 font-black text-xl flex items-center justify-center mb-6">
                02
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">AI Intelligence & Graph</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                Advanced OCR, speech-to-text, YOLO entity detection, and Neo4j-style graph correlation uncover hidden connections across files.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 font-black text-xl flex items-center justify-center mb-6">
                03
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">Outcome & Human Review</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                AI generates ranked, explainable hypotheses with confidence scores. The human investigator reviews, annotates, and logs the final verdict.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Supported Evidence Types Grid */}
      <section id="evidence-vault" className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs uppercase tracking-widest text-blue-600 font-bold mb-3">Multi-Modal Ingestion</h2>
            <h3 className="text-3xl font-extrabold text-slate-950 tracking-tight mb-4">
              Supports Every Form of Investigative Evidence
            </h3>
            <p className="text-slate-600 text-base">
              Unified processing across 12 specialized evidence formats.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { title: 'CCTV / Video Feeds', icon: Video },
              { title: 'Photos & Images', icon: Sparkles },
              { title: 'Audio Recordings', icon: Mic },
              { title: 'PDFs & Documents', icon: FileText },
              { title: 'Witness Statements', icon: Users },
              { title: 'FIR & Case Reports', icon: FileText },
              { title: 'Call Records (CDR)', icon: Activity },
              { title: 'Vehicle Information', icon: Shield },
              { title: 'Suspect & Victim Info', icon: Users },
              { title: 'GPS & Cell Locations', icon: MapPin },
              { title: 'Dates & Times', icon: Activity },
              { title: 'Investigator Notes', icon: FileText },
            ].map((item, idx) => {
              const IconComponent = item.icon;
              return (
                <div key={idx} className="p-5 bg-slate-50 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/20 transition-all flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-semibold text-slate-800">{item.title}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section id="features" className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs uppercase tracking-widest text-blue-600 font-bold mb-3">Enterprise Security</h2>
            <h3 className="text-3xl font-extrabold text-slate-950 tracking-tight mb-4">
              Built for High-Stakes Law Enforcement
            </h3>
            <p className="text-slate-600 text-base">
              Engineered with tamper-proof security and human accountability at its core.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
                <Cpu className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">AI Hypothesis Engine</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                Confidence-scored hypotheses linking disparate witness accounts and physical evidence automatically.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
                <Activity className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">Evidence Graph</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                Neo4j-style interactive force-directed network graph visualizing relationships between entities.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
                <Lock className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">Tamper-Proof Audit Trail</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                AES-256 secure vault and chronological logging ensuring uncompromised chain of custody.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
                <Users className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">Human-in-the-Loop Review</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                Inspectors retain ultimate control. AI assists with correlation; investigators decide verdicts.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
                <Search className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">Cross-Evidence Linking</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                Tabular matrix mapping every clue and relationship with calculated confidence ratings.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">Official Report Compiler</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                Instant generation of formal investigative briefs ready for judicial submission and export.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-white pt-16 pb-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-blue-900/40 border border-blue-700/50 rounded-2xl p-6 mb-12 text-center max-w-3xl mx-auto">
            <p className="text-blue-200 font-mono text-sm tracking-wide font-medium">
              "AI Only Assists, Decision is Human's. Justice Prevails."
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="space-y-4 md:col-span-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-bold tracking-tight">Sakshya</span>
              </div>
              <p className="text-slate-400 text-sm max-w-sm">
                AI-Powered Investigation & Decision Support Platform for law enforcement and security professionals.
              </p>
            </div>

            <div>
              <h5 className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-4">Platform</h5>
              <ul className="space-y-2 text-sm text-slate-300">
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How it works</a></li>
                <li><a href="#features" className="hover:text-white transition-colors">AI Hypotheses</a></li>
                <li><a href="#evidence-vault" className="hover:text-white transition-colors">Evidence Vault</a></li>
                <li><a href="#features" className="hover:text-white transition-colors">Audit Trail</a></li>
              </ul>
            </div>

            <div>
              <h5 className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-4">Security</h5>
              <ul className="space-y-2 text-sm text-slate-300">
                <li><span className="text-emerald-400 font-mono text-xs">● AES-256 Active</span></li>
                <li><span className="text-slate-400 text-xs">ISO-27001 Certified</span></li>
                <li><span className="text-slate-400 text-xs">Chain of Custody Verifiable</span></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 text-center text-xs text-slate-500 font-mono">
            © 2026 Sakshya Investigation Systems Inc. All rights reserved. साक्ष्य.
          </div>
        </div>
      </footer>
    </div>
  );
};
