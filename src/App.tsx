import React, { useState, useEffect, useCallback } from 'react';
import { SplashScreen } from './components/SplashScreen';
import { LandingPage } from './components/LandingPage';
import { AuthScreen } from './components/AuthScreen';
import { DashboardScreen } from './components/DashboardScreen';
import { CaseWorkspace } from './components/CaseWorkspace';
import { CaseItem, UserProfile } from './types';
import { DEFAULT_USER } from './mockData';

type AppScreen = 'splash' | 'landing' | 'auth' | 'dashboard' | 'workspace';

// Session persistence helpers — prevents losing state on Vite HMR page reloads
function loadSession<T>(key: string, fallback: T): T {
  try {
    const stored = sessionStorage.getItem(key);
    if (stored) return JSON.parse(stored);
  } catch {}
  return fallback;
}

function saveSession(key: string, value: any) {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export default function App() {
  // Restore session state after page reloads (caused by Vite HMR or other triggers)
  const [currentScreen, setCurrentScreen] = useState<AppScreen>(() =>
    loadSession<AppScreen>('sakshya_screen', 'splash')
  );
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [currentUser, setCurrentUser] = useState<UserProfile>(() =>
    loadSession<UserProfile>('sakshya_user', DEFAULT_USER)
  );
  const [selectedCase, setSelectedCase] = useState<CaseItem>(() =>
    loadSession<CaseItem>('sakshya_case', {
      id: 'default-case',
      userId: DEFAULT_USER.id,
      caseNumber: 'CASE-2026-000001',
      title: 'New Investigation Case',
      description: 'No initial briefing provided.',
      priority: 'High',
      status: 'Active',
      evidenceCount: 0,
      leadInvestigator: DEFAULT_USER.name,
      createdAt: new Date().toISOString().substring(0, 16),
      storageGb: 0
    })
  );
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<string>(() =>
    loadSession<string>('sakshya_tab', 'vault')
  );

  // Persist state changes to sessionStorage
  useEffect(() => { saveSession('sakshya_screen', currentScreen); }, [currentScreen]);
  useEffect(() => { saveSession('sakshya_user', currentUser); }, [currentUser]);
  useEffect(() => { saveSession('sakshya_case', selectedCase); }, [selectedCase]);
  useEffect(() => { saveSession('sakshya_tab', activeWorkspaceTab); }, [activeWorkspaceTab]);

  const handleSplashComplete = () => {
    setCurrentScreen('landing');
  };

  const handleOpenAuth = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setCurrentScreen('auth');
  };

  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    setCurrentScreen('dashboard');
  };

  const handleOpenCase = (caseItem: CaseItem, defaultTab = 'vault') => {
    setSelectedCase(caseItem);
    setActiveWorkspaceTab(defaultTab);
    setCurrentScreen('workspace');
  };

  const handleLogout = () => {
    // Clear session on explicit logout
    sessionStorage.removeItem('sakshya_screen');
    sessionStorage.removeItem('sakshya_user');
    sessionStorage.removeItem('sakshya_case');
    sessionStorage.removeItem('sakshya_tab');
    setCurrentScreen('landing');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-600 selection:text-white">
      {currentScreen === 'splash' && (
        <SplashScreen onComplete={handleSplashComplete} />
      )}

      {currentScreen === 'landing' && (
        <LandingPage 
          onOpenAuth={handleOpenAuth} 
          onExploreDemo={() => setCurrentScreen('dashboard')} 
        />
      )}

      {currentScreen === 'auth' && (
        <AuthScreen 
          initialMode={authMode}
          onLoginSuccess={handleLoginSuccess}
          onBackToHome={() => setCurrentScreen('landing')}
        />
      )}

      {currentScreen === 'dashboard' && (
        <DashboardScreen 
          user={currentUser}
          onLogout={handleLogout}
          onOpenCase={handleOpenCase}
        />
      )}

      {currentScreen === 'workspace' && (
        <div className="flex h-screen overflow-hidden bg-slate-100">
          <div className="flex-1 flex flex-col min-w-0">
            <CaseWorkspace 
              caseItem={selectedCase}
              user={currentUser}
              onBackToDashboard={() => setCurrentScreen('dashboard')}
              activeTabDefault={activeWorkspaceTab}
            />
          </div>
        </div>
      )}
    </div>
  );
}
