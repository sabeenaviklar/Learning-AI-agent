import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, ArrowRight, Brain, Target, TrendingUp, 
  Bell, RefreshCw, CheckCircle, Zap, Shield, BarChart3
} from 'lucide-react';

const FEATURES = [
  {
    icon: Target,
    color: '#6366F1',
    glow: 'rgba(99,102,241,0.25)',
    title: 'Goal Intent Parser',
    desc: 'Drop your goal in plain English. The AI agent deconstructs it into domain, skills, current level, and a realistic timeline—automatically.'
  },
  {
    icon: Brain,
    color: '#8B5CF6',
    glow: 'rgba(139,92,246,0.25)',
    title: 'Dynamic Planning Engine',
    desc: 'Week-by-week milestones that aren\'t rigid. The plan adapts when you fall behind or accelerate—rebalancing tasks in real-time.'
  },
  {
    icon: BarChart3,
    color: '#10B981',
    glow: 'rgba(16,185,129,0.25)',
    title: 'Honest Progress Tracking',
    desc: 'Completion percentages, learning streaks, time-spent vs. planned—all surfaced transparently on your live dashboard.'
  },
  {
    icon: Bell,
    color: '#F59E0B',
    glow: 'rgba(245,158,11,0.25)',
    title: 'Smart Nudge System',
    desc: 'Contextual, goal-aware interventions when you\'re inactive or struggling—not generic reminders, but specific action plans.'
  },
  {
    icon: RefreshCw,
    color: '#F43F5E',
    glow: 'rgba(244,63,94,0.25)',
    title: 'Active Feedback Loop',
    desc: 'Low quiz score? The roadmap rebalances: remedial tasks inserted, milestones pushed, difficulty reduced—visibly.'
  },
  {
    icon: Shield,
    color: '#06B6D4',
    glow: 'rgba(6,182,212,0.25)',
    title: 'Explainable AI',
    desc: 'Live telemetry on every AI decision—model used, tokens consumed, reasoning behind each nudge or plan adjustment.'
  },
];

const DEMO_STEPS = [
  { sender: 'user', text: 'I want to pass the AWS Solutions Architect exam in 3 months.' },
  { sender: 'ai', text: '🧠 Parsing goal intent...\n\nDomain: Cloud Computing\nSkill Vector: Intermediate\nSuccess Probability: 87%\n\nGenerating milestone roadmap...' },
  { sender: 'user', text: 'I missed this week\'s tasks. Life got busy.' },
  { sender: 'ai', text: '⚡ Detected 3-day inactivity gap.\n\nIntelligent Nudge activated:\n"Your VPC foundations need reinforcement before moving to IAM policies. Let\'s run a 15-min review now."\n\nRoadmap recalculated — tasks shifted +2 days.' }
] as const;

const STATS = [
  { value: '94%', label: 'Learner Retention' },
  { value: '3.2×', label: 'Faster Goal Achievement' },
  { value: '10K+', label: 'Active Learning Paths' },
];

export default function Landing() {
  const [demoStep, setDemoStep] = useState(0);
  const [demoMessages, setDemoMessages] = useState<typeof DEMO_STEPS>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (demoStep < DEMO_STEPS.length) {
      const timer = setTimeout(() => {
        setDemoMessages(prev => [...prev, DEMO_STEPS[demoStep]]);
        setDemoStep(prev => prev + 1);
      }, demoStep % 2 === 0 ? 1200 : 2200);
      return () => clearTimeout(timer);
    }
  }, [demoStep]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      setMousePos({
        x: ((e.clientX - rect.left) / rect.width - 0.5) * 20,
        y: ((e.clientY - rect.top) / rect.height - 0.5) * 10,
      });
    };
    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div style={S.page}>
      {/* Mesh background */}
      <div style={S.meshBg} />

      {/* ===== HERO ===== */}
      <section ref={heroRef} style={S.hero}>
        <div style={S.heroInner}>
          {/* Badge */}
          <div style={S.badge}>
            <Sparkles size={11} color="#818CF8" />
            <span>AI-Powered Personal Learning Agent</span>
          </div>

          {/* Headline */}
          <h1 style={S.heroTitle}>
            Stop consuming content.
            <br />
            <span style={S.gradient}>Start achieving outcomes.</span>
          </h1>

          {/* Sub */}
          <p style={S.heroSub}>
            LearningOS is a reasoning engine—not a recommendation algorithm. It understands your goal, 
            builds your plan, monitors your state, and intervenes intelligently to ensure you succeed.
          </p>

          {/* Stats row */}
          <div style={S.statsRow}>
            {STATS.map((s, i) => (
              <div key={i} style={S.statItem}>
                <span style={S.statValue}>{s.value}</span>
                <span style={S.statLabel}>{s.label}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div style={S.ctaRow}>
            <Link to="/signup" style={S.btnPrimary}>
              Start Your Learning Journey
              <ArrowRight size={16} />
            </Link>
            <a href="#how-it-works" style={S.btnSecondary}>
              See How It Works
            </a>
          </div>
        </div>

        {/* Floating visual */}
        <div style={{ ...S.heroVisual, transform: `perspective(800px) rotateY(${mousePos.x * 0.3}deg) rotateX(${-mousePos.y * 0.2}deg)` }}>
          <div style={S.floatingCard}>
            <div style={S.floatingCardHeader}>
              <div style={S.floatDots}>
                <span style={{ ...S.dot, background: '#F43F5E' }} />
                <span style={{ ...S.dot, background: '#F59E0B' }} />
                <span style={{ ...S.dot, background: '#10B981' }} />
              </div>
              <span style={S.floatTitle}>learningos_agent.py</span>
            </div>
            <div style={S.floatBody}>
              <div style={S.floatLine}>
                <span style={S.floatKey}>goal_domain:</span>
                <span style={{ color: '#10B981' }}> "Cloud Computing"</span>
              </div>
              <div style={S.floatLine}>
                <span style={S.floatKey}>success_prob:</span>
                <span style={{ color: '#818CF8' }}> 87%</span>
              </div>
              <div style={S.floatLine}>
                <span style={S.floatKey}>risk_level:</span>
                <span style={{ color: '#F59E0B' }}> LOW</span>
              </div>
              <div style={S.floatLine}>
                <span style={S.floatKey}>streak:</span>
                <span style={{ color: '#F43F5E' }}> 🔥 10 days</span>
              </div>
              <div style={S.floatDivider} />
              <div style={S.floatLine}>
                <span style={{ color: '#64748B' }}>▶ Week 2 Milestone Active</span>
              </div>
              <div style={S.progressTrack}>
                <div style={{ ...S.progressFill, width: '62%' }} />
              </div>
              <span style={{ color: '#64748B', fontSize: '0.68rem' }}>62% complete · 4 tasks remaining</span>
            </div>
          </div>
          {/* Orbiting badge */}
          <div style={S.orbitBadge}>
            <CheckCircle size={14} color="#10B981" />
            <span>Task Completed!</span>
          </div>
        </div>
      </section>

      {/* ===== DEMO TERMINAL ===== */}
      <section id="how-it-works" style={S.demoSection}>
        <div style={S.sectionLabel}>
          <Zap size={11} color="#818CF8" />
          <span>Live Demonstration</span>
        </div>
        <h2 style={S.sectionTitle}>Watch the Agent Reason</h2>
        <p style={S.sectionSub}>Real conversations. Real adaptations. Not scripted demos—watch the orchestrator plan and re-plan.</p>

        <div style={S.terminal}>
          <div style={S.terminalHeader}>
            <div style={S.floatDots}>
              <span style={{ ...S.dot, background: '#F43F5E' }} />
              <span style={{ ...S.dot, background: '#F59E0B' }} />
              <span style={{ ...S.dot, background: '#10B981' }} />
            </div>
            <span style={S.termTitle}>learningos_sandbox — bash</span>
          </div>
          <div style={S.termBody}>
            {demoMessages.map((m, idx) => (
              <div key={idx} style={S.termMsgRow}>
                <span style={m.sender === 'ai' ? S.aiLabel : S.userLabel}>
                  {m.sender === 'ai' ? '🤖 Agent:' : '👤 Student:'}
                </span>
                <p style={{ ...S.termMsgText, color: m.sender === 'ai' ? '#F1F5F9' : '#94A3B8', whiteSpace: 'pre-line' }}>{m.text}</p>
              </div>
            ))}
            {demoStep < DEMO_STEPS.length && (
              <div style={S.termMsgRow}>
                <span style={demoStep % 2 === 0 ? S.userLabel : S.aiLabel}>
                  {demoStep % 2 === 0 ? '👤 Student:' : '🤖 Agent:'}
                </span>
                <span className="typing-cursor" style={{ color: '#64748B', fontSize: '0.85rem' }}>Thinking</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section id="features" style={S.featuresSection}>
        <div style={S.sectionLabel}>
          <Brain size={11} color="#818CF8" />
          <span>Core Capabilities</span>
        </div>
        <h2 style={S.sectionTitle}>Built for Outcomes, Not Consumption</h2>
        <p style={S.sectionSub}>Six autonomous subsystems working together to ensure you don't just learn—you achieve.</p>

        <div style={S.featuresGrid}>
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} style={S.featureCard}>
                <div style={{ ...S.featureIcon, background: `${f.glow}`, boxShadow: `0 0 20px ${f.glow}` }}>
                  <Icon size={20} color={f.color} />
                </div>
                <h3 style={S.featureTitle}>{f.title}</h3>
                <p style={S.featureDesc}>{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section style={S.ctaBanner}>
        <div style={S.ctaBannerInner}>
          <div style={S.ctaGlow} />
          <div style={S.sectionLabel}>
            <Sparkles size={11} color="#818CF8" />
            <span>Start Today</span>
          </div>
          <h2 style={S.ctaTitle}>Your goal deserves more than a course catalogue.</h2>
          <p style={S.ctaSub}>
            Join learners who are using AI to build real skills, not just watch videos.
          </p>
          <Link to="/signup" style={S.btnPrimary}>
            Launch Your Learning Agent
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}

const S = {
  page: {
    backgroundColor: '#0A0A0F',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    position: 'relative' as const,
    overflowX: 'hidden' as const,
  },
  meshBg: {
    position: 'fixed' as const,
    inset: 0,
    background: `
      radial-gradient(ellipse at 15% 50%, rgba(99,102,241,0.12) 0%, transparent 55%),
      radial-gradient(ellipse at 85% 20%, rgba(139,92,246,0.08) 0%, transparent 55%),
      radial-gradient(ellipse at 50% 90%, rgba(16,185,129,0.07) 0%, transparent 55%)
    `,
    pointerEvents: 'none' as const,
    zIndex: 0,
  },
  hero: {
    width: '100%',
    maxWidth: '1200px',
    padding: '6rem 2rem 4rem',
    display: 'flex',
    gap: '4rem',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative' as const,
    zIndex: 1,
  },
  heroInner: {
    flex: '0 0 auto',
    maxWidth: '560px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1.5rem',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    background: 'rgba(99,102,241,0.1)',
    border: '1px solid rgba(99,102,241,0.25)',
    borderRadius: '9999px',
    padding: '5px 14px',
    fontSize: '0.72rem',
    color: '#818CF8',
    fontWeight: 700,
    letterSpacing: '0.02em',
    alignSelf: 'flex-start' as const,
  },
  heroTitle: {
    fontSize: '3.4rem',
    fontWeight: 900,
    lineHeight: 1.08,
    letterSpacing: '-0.035em',
    color: '#F1F5F9',
  },
  gradient: {
    background: 'linear-gradient(135deg, #818CF8 0%, #6366F1 40%, #10B981 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  heroSub: {
    fontSize: '1.05rem',
    color: '#94A3B8',
    lineHeight: 1.7,
  },
  statsRow: {
    display: 'flex',
    gap: '2rem',
    paddingTop: '0.5rem',
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '2px',
  },
  statValue: {
    fontSize: '1.6rem',
    fontWeight: 800,
    color: '#F1F5F9',
    fontFamily: 'Outfit, sans-serif',
  },
  statLabel: {
    fontSize: '0.72rem',
    color: '#64748B',
    fontWeight: 600,
  },
  ctaRow: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap' as const,
  },
  btnPrimary: {
    background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
    color: '#FFF',
    border: 'none',
    borderRadius: '9999px',
    padding: '0.8rem 1.8rem',
    fontSize: '0.9rem',
    fontWeight: 700,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    textDecoration: 'none',
    boxShadow: '0 0 24px rgba(99,102,241,0.35)',
    transition: 'all 0.2s',
    fontFamily: 'Outfit, sans-serif',
  },
  btnSecondary: {
    background: 'rgba(255,255,255,0.05)',
    color: '#94A3B8',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '9999px',
    padding: '0.8rem 1.8rem',
    fontSize: '0.9rem',
    fontWeight: 600,
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    transition: 'all 0.2s',
  },
  heroVisual: {
    flex: '0 0 auto',
    width: '320px',
    position: 'relative' as const,
    transition: 'transform 0.1s linear',
  },
  floatingCard: {
    background: '#13131E',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 30px 60px rgba(0,0,0,0.6), 0 0 40px rgba(99,102,241,0.1)',
  },
  floatingCardHeader: {
    background: '#0F0F18',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    padding: '10px 14px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  floatDots: { display: 'flex', gap: '5px' },
  dot: { width: '9px', height: '9px', borderRadius: '50%', display: 'block' },
  floatTitle: { color: '#475569', fontSize: '0.72rem', fontFamily: 'JetBrains Mono, monospace' },
  floatBody: {
    padding: '1.25rem',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: '0.78rem',
  },
  floatLine: { display: 'flex', gap: '6px' },
  floatKey: { color: '#64748B' },
  floatDivider: { height: '1px', background: 'rgba(255,255,255,0.05)', margin: '4px 0' },
  progressTrack: {
    width: '100%', height: '5px',
    background: 'rgba(255,255,255,0.06)', borderRadius: '9999px', overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #6366F1, #818CF8)',
    borderRadius: '9999px',
  },
  orbitBadge: {
    position: 'absolute' as const,
    top: '-16px',
    right: '-16px',
    background: 'rgba(16,185,129,0.12)',
    border: '1px solid rgba(16,185,129,0.25)',
    borderRadius: '9999px',
    padding: '6px 12px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.72rem',
    color: '#10B981',
    fontWeight: 700,
    animation: 'float 3s ease-in-out infinite',
  },
  // Demo section
  demoSection: {
    width: '100%',
    maxWidth: '800px',
    padding: '4rem 2rem',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '1.25rem',
    position: 'relative' as const,
    zIndex: 1,
  },
  sectionLabel: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    background: 'rgba(99,102,241,0.1)',
    border: '1px solid rgba(99,102,241,0.25)',
    borderRadius: '9999px',
    padding: '4px 12px',
    fontSize: '0.7rem',
    color: '#818CF8',
    fontWeight: 700,
  },
  sectionTitle: {
    fontSize: '2.2rem',
    fontWeight: 800,
    color: '#F1F5F9',
    textAlign: 'center' as const,
    letterSpacing: '-0.025em',
  },
  sectionSub: {
    fontSize: '0.95rem',
    color: '#64748B',
    textAlign: 'center' as const,
    maxWidth: '560px',
    lineHeight: 1.6,
  },
  terminal: {
    width: '100%',
    background: '#0D0D16',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
    marginTop: '1rem',
  },
  terminalHeader: {
    background: '#0A0A0F',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    padding: '10px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  termTitle: { color: '#475569', fontSize: '0.72rem', fontFamily: 'JetBrains Mono, monospace' },
  termBody: {
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
    minHeight: '200px',
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: '0.82rem',
  },
  termMsgRow: { display: 'flex', gap: '12px', lineHeight: 1.55 },
  aiLabel: { color: '#818CF8', fontWeight: 700, flexShrink: 0, fontSize: '0.78rem' },
  userLabel: { color: '#10B981', fontWeight: 700, flexShrink: 0, fontSize: '0.78rem' },
  termMsgText: { fontSize: '0.82rem' },
  // Features
  featuresSection: {
    width: '100%',
    maxWidth: '1100px',
    padding: '4rem 2rem',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '1.5rem',
    position: 'relative' as const,
    zIndex: 1,
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1.5rem',
    width: '100%',
    marginTop: '1rem',
  },
  featureCard: {
    background: '#13131E',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '16px',
    padding: '1.75rem',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.75rem',
    transition: 'all 0.2s',
  },
  featureIcon: {
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureTitle: {
    fontSize: '1rem',
    fontWeight: 700,
    color: '#F1F5F9',
  },
  featureDesc: {
    fontSize: '0.85rem',
    color: '#64748B',
    lineHeight: 1.65,
  },
  // CTA Banner
  ctaBanner: {
    width: '100%',
    maxWidth: '860px',
    padding: '2rem 2rem 5rem',
    position: 'relative' as const,
    zIndex: 1,
  },
  ctaBannerInner: {
    background: 'linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(139,92,246,0.08) 100%)',
    border: '1px solid rgba(99,102,241,0.2)',
    borderRadius: '24px',
    padding: '3.5rem',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '1.5rem',
    textAlign: 'center' as const,
    position: 'relative' as const,
    overflow: 'hidden',
  },
  ctaGlow: {
    position: 'absolute' as const,
    top: '-50px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '300px',
    height: '200px',
    background: 'radial-gradient(ellipse, rgba(99,102,241,0.25) 0%, transparent 70%)',
    pointerEvents: 'none' as const,
  },
  ctaTitle: {
    fontSize: '1.9rem',
    fontWeight: 800,
    color: '#F1F5F9',
    letterSpacing: '-0.025em',
    maxWidth: '520px',
  },
  ctaSub: {
    fontSize: '0.95rem',
    color: '#64748B',
    maxWidth: '440px',
    lineHeight: 1.6,
  },
};
