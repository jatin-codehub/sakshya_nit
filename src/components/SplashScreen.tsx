import React, { useEffect, useState } from 'react';
import { Shield, Cpu } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 400);
          return 100;
        }
        return prev + 2.5; // ~4 seconds total (40 intervals of 100ms)
      });
    }, 100);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div 
      onClick={onComplete}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white cursor-pointer select-none transition-opacity duration-700"
    >
      <div className="absolute top-6 right-6 text-xs font-mono text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
        Click anywhere to skip
      </div>

      <div className="flex flex-col items-center max-w-md px-6 text-center animate-fade-in">
        {/* Logo Shield with Circuit Icon */}
        <div className="relative mb-6 group">
          <div className="absolute -inset-2 bg-blue-500/10 rounded-full blur-xl animate-pulse"></div>
          <div className="relative w-24 h-24 rounded-2xl bg-slate-900 border-2 border-blue-600 flex items-center justify-center shadow-2xl shadow-blue-600/20">
            <Shield className="w-12 h-12 text-blue-500 absolute" />
            <Cpu className="w-6 h-6 text-white z-10 animate-pulse" />
            <div className="absolute inset-0 border border-blue-400/30 rounded-2xl"></div>
          </div>
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-2 font-sans">
          Sakshya
        </h1>
        <p className="text-xs uppercase tracking-widest text-blue-600 font-semibold mb-3">
          साक्ष्य · Evidence
        </p>
        
        <p className="text-slate-600 text-sm md:text-base font-medium max-w-sm mb-10">
          AI-Powered Investigation & Decision Support Platform
        </p>

        {/* Loading Progress Bar */}
        <div className="w-64 h-1.5 bg-slate-100 rounded-full overflow-hidden shadow-inner mb-3">
          <div 
            className="h-full bg-blue-600 transition-all duration-100 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          Secure Vault Initializing ({Math.round(progress)}%)
        </div>
      </div>

      <div className="absolute bottom-6 text-center text-xs text-slate-400 font-mono">
        AI Only Assists, Decision is Human's. Justice Prevails.
      </div>
    </div>
  );
};
