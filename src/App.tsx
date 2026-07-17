import React, { useState } from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Link, 
  useLocation, 
  Navigate,
  Outlet
} from 'react-router-dom';
import { 
  Sparkles, LayoutGrid, Calendar, MessageSquare, 
  HelpCircle, BarChart, Sliders, Menu, X, Terminal,
  Zap
} from 'lucide-react';
import { AppProvider, useApp } from './context/AppContext';

// Import Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Onboarding from './pages/Onboarding';
import Assessment from './pages/Assessment';
import AIAnalysis from './pages/AIAnalysis';
import Dashboard from './pages/Dashboard';
import Roadmap from './pages/Roadmap';
import Tutor from './pages/Tutor';
import Quiz from './pages/Quiz';
import AnalyticsView from './pages/AnalyticsView';
import Settings from './pages/Settings';

function WorkspaceLayout() {
  const { state } = useApp();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!state.user || !state.assessment) {
    return <Navigate to="/" replace />;
  }

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutGrid },
    { to: '/roadmap', label: 'Roadmap', icon: Calendar },
    { to: '/tutor', label: 'AI Tutor', icon: MessageSquare },
    { to: '/quiz', label: 'Adaptive Quiz', icon: HelpCircle },
    { to: '/analytics', label: 'Analytics', icon: BarChart },
    { to: '/settings', label: 'Settings', icon: Sliders },
  ];

  return (
    <div style={styles.workspaceWrapper}>
      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div onClick={() => setMobileMenuOpen(false)} style={styles.mobileOverlay} />
      )}

      {/* Dark Sidebar Navigation */}
      <aside style={styles.sidebar(mobileMenuOpen)}>
        {/* Logo */}
        <div style={styles.sidebarHeader}>
          <div style={styles.logoGroup}>
            <div style={styles.logoIcon}>
              <Sparkles size={14} color="#FFFFFF" fill="#FFFFFF" />
            </div>
            <span style={styles.logoText}>LearningOS</span>
          </div>
          <button onClick={() => setMobileMenuOpen(false)} style={styles.closeMenuBtn}>
            <X size={18} color="#64748B" />
          </button>
        </div>

        {/* Status Pill */}
        <div style={styles.statusPill}>
          <span style={styles.statusDot} />
          <span style={styles.statusText}>Orchestrator Online</span>
        </div>

        {/* Nav */}
        <nav style={styles.nav}>
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.to;
            return (
              <Link 
                key={link.to} 
                to={link.to} 
                onClick={() => setMobileMenuOpen(false)}
                style={styles.navLink(isActive)}
              >
                <div style={styles.navIconWrapper(isActive)}>
                  <Icon size={16} color={isActive ? '#818CF8' : '#64748B'} />
                </div>
                <span style={styles.navLinkLabel(isActive)}>{link.label}</span>
                {isActive && <div style={styles.activeBar} />}
              </Link>
            );
          })}
        </nav>

        {/* User Profile Card */}
        <div style={styles.profileCard}>
          <div style={styles.avatar}>
            {state.user.name.substring(0, 2).toUpperCase()}
          </div>
          <div style={styles.profileMeta}>
            <span style={styles.profileName}>{state.user.name}</span>
            <span style={styles.profileRole}>{state.user.careerGoal}</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={styles.mainContent}>
        {/* Top Header Bar */}
        <header style={styles.workspaceHeader}>
          <button onClick={() => setMobileMenuOpen(true)} style={styles.hamburgerBtn}>
            <Menu size={20} color="#94A3B8" />
          </button>
          
          <div style={styles.headerRight}>
            <div style={styles.headerStatus}>
              <Terminal size={13} color="#10B981" />
              <span style={styles.statusLabel}>
                {state.riskLevel === 'HIGH' ? '⚠ Risk Alert Active' :
                 state.riskLevel === 'MEDIUM' ? '◆ Monitoring' : '● All Systems Go'}
              </span>
            </div>
            <div style={styles.streakBadge}>
              <Zap size={13} color="#F59E0B" fill="#F59E0B" />
              <span style={styles.streakText}>10 day streak</span>
            </div>
          </div>
        </header>

        {/* Main workspace */}
        <main style={styles.workspaceBody}>
          <div className="container" style={{ padding: 0 }}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

function GlobalLayout() {
  const location = useLocation();
  const isWorkspaceRoute = ['/dashboard', '/roadmap', '/tutor', '/quiz', '/analytics', '/settings'].includes(location.pathname);

  if (isWorkspaceRoute) return <Outlet />;

  return (
    <div style={styles.globalWrapper}>
      <header style={styles.landingHeader}>
        <div className="container" style={styles.navContainer}>
          <Link to="/" style={styles.logoGroupLink}>
            <div style={styles.logoIcon}>
              <Sparkles size={13} color="#FFFFFF" fill="#FFFFFF" />
            </div>
            <span style={styles.logoText}>LearningOS</span>
          </Link>
          <div style={styles.landingNavBtn}>
            <Link to="/login" style={styles.navLinkLogin}>Sign In</Link>
            <Link to="/signup" className="btn btn-primary" style={{ fontSize: '0.85rem', padding: '0.45rem 1.1rem' }}>
              Get Started
            </Link>
          </div>
        </div>
      </header>
      <div style={styles.landingBody}>
        <Outlet />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route element={<GlobalLayout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/assessment" element={<Assessment />} />
            <Route path="/ai-analysis" element={<AIAnalysis />} />
          </Route>
          <Route element={<WorkspaceLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/roadmap" element={<Roadmap />} />
            <Route path="/tutor" element={<Tutor />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/analytics" element={<AnalyticsView />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

const styles = {
  workspaceWrapper: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#0A0A0F',
  },
  mobileOverlay: {
    position: 'fixed' as const,
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    backdropFilter: 'blur(4px)',
    zIndex: 99,
  },
  sidebar: (_mobileOpen: boolean) => ({
    width: '240px',
    background: 'linear-gradient(180deg, #0F0F18 0%, #0A0A0F 100%)',
    borderRight: '1px solid rgba(255,255,255,0.06)',
    display: 'flex',
    flexDirection: 'column' as const,
    padding: '1.5rem 1.25rem',
    position: 'fixed' as const,
    top: 0,
    bottom: 0,
    left: 0,
    zIndex: 100,
    gap: '1rem',
    // Always visible (desktop-first app)
    transform: 'translateX(0)',
  }),
  sidebarHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  logoGroupLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    textDecoration: 'none',
  },
  logoIcon: {
    width: '30px',
    height: '30px',
    borderRadius: '9px',
    background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 16px rgba(99, 102, 241, 0.4)',
  },
  logoText: {
    fontFamily: 'Outfit, sans-serif',
    fontWeight: 800,
    fontSize: '1.05rem',
    color: '#F1F5F9',
    letterSpacing: '-0.02em',
  },
  closeMenuBtn: {
    display: 'flex',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
  },
  statusPill: {
    display: 'flex',
    alignItems: 'center',
    gap: '7px',
    background: 'rgba(16, 185, 129, 0.08)',
    border: '1px solid rgba(16, 185, 129, 0.2)',
    borderRadius: '9999px',
    padding: '5px 12px',
  },
  statusDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: '#10B981',
    boxShadow: '0 0 6px #10B981',
  },
  statusText: {
    fontSize: '0.68rem',
    fontWeight: 700,
    color: '#10B981',
    letterSpacing: '0.03em',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '3px',
    flexGrow: 1,
    marginTop: '0.5rem',
  },
  navLink: (isActive: boolean) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '9px 10px',
    borderRadius: '10px',
    textDecoration: 'none',
    backgroundColor: isActive ? 'rgba(99, 102, 241, 0.12)' : 'transparent',
    border: isActive ? '1px solid rgba(99, 102, 241, 0.2)' : '1px solid transparent',
    position: 'relative' as const,
    transition: 'all 0.18s',
  }),
  navIconWrapper: (isActive: boolean) => ({
    width: '28px',
    height: '28px',
    borderRadius: '7px',
    backgroundColor: isActive ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255,255,255,0.04)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  }),
  navLinkLabel: (isActive: boolean) => ({
    fontSize: '0.85rem',
    fontWeight: isActive ? 700 : 500,
    color: isActive ? '#818CF8' : '#64748B',
    transition: 'color 0.15s',
  }),
  activeBar: {
    position: 'absolute' as const,
    right: '10px',
    width: '5px',
    height: '5px',
    borderRadius: '50%',
    backgroundColor: '#6366F1',
    boxShadow: '0 0 8px rgba(99, 102, 241, 0.6)',
  },
  profileCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    borderTop: '1px solid rgba(255,255,255,0.06)',
    paddingTop: '1.25rem',
    marginTop: 'auto',
  },
  avatar: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
    color: '#FFFFFF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.78rem',
    fontWeight: 800,
    flexShrink: 0,
    boxShadow: '0 0 12px rgba(99, 102, 241, 0.35)',
  },
  profileMeta: {
    display: 'flex',
    flexDirection: 'column' as const,
    overflow: 'hidden',
    gap: '2px',
  },
  profileName: {
    fontSize: '0.82rem',
    fontWeight: 700,
    color: '#F1F5F9',
    whiteSpace: 'nowrap' as const,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  profileRole: {
    fontSize: '0.7rem',
    color: '#64748B',
    whiteSpace: 'nowrap' as const,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  mainContent: {
    flex: 1,
    paddingLeft: '240px',
    display: 'flex',
    flexDirection: 'column' as const,
    minHeight: '100vh',
  },
  workspaceHeader: {
    height: '60px',
    background: 'rgba(10, 10, 15, 0.85)',
    backdropFilter: 'blur(16px)',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 2rem',
    position: 'sticky' as const,
    top: 0,
    zIndex: 90,
  },
  hamburgerBtn: {
    display: 'none',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginLeft: 'auto',
  },
  headerStatus: {
    display: 'flex',
    alignItems: 'center',
    gap: '7px',
  },
  statusLabel: {
    fontSize: '0.73rem',
    color: '#10B981',
    fontWeight: 700,
    fontFamily: 'JetBrains Mono, monospace',
  },
  streakBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    background: 'rgba(245, 158, 11, 0.1)',
    border: '1px solid rgba(245, 158, 11, 0.2)',
    borderRadius: '9999px',
    padding: '4px 10px',
  },
  streakText: {
    fontSize: '0.7rem',
    fontWeight: 700,
    color: '#F59E0B',
  },
  workspaceBody: {
    padding: '2rem',
    flexGrow: 1,
    overflowY: 'auto' as const,
  },
  globalWrapper: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column' as const,
    backgroundColor: '#0A0A0F',
  },
  landingHeader: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    height: '64px',
    background: 'rgba(10, 10, 15, 0.85)',
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    display: 'flex',
    alignItems: 'center',
    zIndex: 1000,
  },
  navContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  landingNavBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.25rem',
  },
  navLinkLogin: {
    textDecoration: 'none',
    color: '#94A3B8',
    fontWeight: 600,
    fontSize: '0.9rem',
    transition: 'color 0.2s',
  },
  landingBody: {
    paddingTop: '64px',
    flexGrow: 1,
  },
};
