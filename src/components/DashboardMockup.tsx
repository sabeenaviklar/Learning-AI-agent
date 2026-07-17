import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, Flame, Sparkles, Award, 
  TrendingUp, Check, Play, BookOpen, Clock, AlertTriangle 
} from 'lucide-react';

interface DashboardMockupProps {
  difficultyLevel?: string | null;
  activeData?: any | null;
}

export default function DashboardMockup({ difficultyLevel, activeData }: DashboardMockupProps) {
  // Streaks, overall progress states
  const [streak, setStreak] = useState(9);
  const [overallProgress, setOverallProgress] = useState(70);
  const [showNotification, setShowNotification] = useState(false);
  const [typedText, setTypedText] = useState('');
  const fullRecommendation = "Based on yesterday's Functions quiz, let's spend 15 minutes reviewing Scope & Closures. I've added a focused session.";

  // Interactive Risk Agent States
  const [weeklyHours, setWeeklyHours] = useState(10);
  const [mockScore, setMockScore] = useState(85);
  const [riskLevel, setRiskLevel] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('LOW');
  const [riskReason, setRiskReason] = useState('Consistency streak safe, excellent quiz averages.');
  const [riskAction, setRiskAction] = useState('Maintain current velocity.');

  // Recalculated task duration from Reflection Agent
  const taskDuration = difficultyLevel === 'hard' ? 60 : difficultyLevel === 'easy' ? 30 : 45;

  useEffect(() => {
    // 1. Streak count simulation
    const streakTimeout = setTimeout(() => {
      setStreak(10);
      setShowNotification(true);
    }, 2000);

    // 2. Progress count simulation
    const progressTimeout = setTimeout(() => {
      setOverallProgress(78);
    }, 1200);

    // 3. Typing recommendation animation
    let index = 0;
    const typingInterval = setInterval(() => {
      setTypedText((prev) => prev + fullRecommendation.charAt(index));
      index++;
      if (index >= fullRecommendation.length) {
        clearInterval(typingInterval);
      }
    }, 45);

    // 4. Hide notification toast
    const hideNotification = setTimeout(() => {
      setShowNotification(false);
    }, 8000);

    return () => {
      clearTimeout(streakTimeout);
      clearTimeout(progressTimeout);
      clearInterval(typingInterval);
      clearTimeout(hideNotification);
    };
  }, []);

  // Update Risk Agent calculations live based on sliders
  useEffect(() => {
    if (weeklyHours < 4 || mockScore < 60) {
      setRiskLevel('HIGH');
      setRiskReason('Inadequate study hours combined with failing quiz scores.');
      setRiskAction('Action Required: Reduce weekly task workload by 40% and inject Scope revisions.');
    } else if (weeklyHours < 8 || mockScore < 80) {
      setRiskLevel('MEDIUM');
      setRiskReason('Borderline study hours or mid-range quiz comprehension.');
      setRiskAction('Recommendation: Schedule a 15-minute concept checkout session this Friday.');
    } else {
      setRiskLevel('LOW');
      setRiskReason('Excellent study consistency, score averages safe.');
      setRiskAction('No actions required. Keep up the high velocity!');
    }
  }, [weeklyHours, mockScore]);

  return (
    <div style={styles.dashboardContainer}>
      {/* Top Header */}
      <div style={styles.header}>
        <div>
          <h4 style={styles.welcomeText}>Alex's Study Workspace 🎓</h4>
          <span style={styles.subtext}>Active Goal: {activeData ? activeData.text : "Crack AWS Architecture"}</span>
        </div>
        <div style={styles.headerIcons}>
          <div style={styles.notificationWrapper}>
            <Bell size={20} style={styles.iconMuted} />
            <span style={styles.notificationDot}></span>
          </div>
          <img 
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80" 
            alt="Alex" 
            style={styles.avatar} 
          />
        </div>
      </div>

      {/* Grid Layout for Active Agents */}
      <div style={styles.statsGrid}>
        
        {/* Agent 8: Planner Agent - Mission Control */}
        <div style={styles.statCard}>
          <div style={styles.statHeader}>
            <span style={styles.statTitle}>Agent 8: Planner Agent</span>
            <Clock size={16} color="#3B82F6" />
          </div>
          <div style={styles.missionWrapper}>
            <span style={styles.missionLabel}>Today's Mission:</span>
            <div style={styles.missionText}>Complete Python Functions</div>
            <div style={styles.durationBadge}>
              <Clock size={12} />
              <span>{taskDuration} mins</span>
              {difficultyLevel === 'hard' && (
                <span style={styles.recalPill}>+15m Adjusted</span>
              )}
              {difficultyLevel === 'easy' && (
                <span style={styles.recalPillGreen}>-15m Adjusted</span>
              )}
            </div>
          </div>
        </div>

        {/* Agent 3: Progress Agent */}
        <div style={styles.statCard}>
          <div style={styles.statHeader}>
            <span style={styles.statTitle}>Agent 3: Progress Agent</span>
            <TrendingUp size={16} color="#22C55E" />
          </div>
          <div style={styles.progressSection}>
            <div style={styles.progressRow}>
              <span style={styles.statValue}>{overallProgress}%</span>
              <span style={styles.streakLabel}>Streak: {streak} Days</span>
            </div>
            <div style={styles.aiObservationsCard}>
              <strong style={styles.obsTitle}>AI Observation:</strong>
              <p style={styles.obsDesc}>
                Study velocity is 20% higher than baseline. Estimated completion timeline recalculated:
                <br />
                <span style={styles.timelineShift}>Aug 22 ➔ Aug 15</span>
              </p>
            </div>
          </div>
        </div>

        {/* Agent 5: Risk Agent */}
        <div style={styles.statCardWide}>
          <div style={styles.statHeader}>
            <span style={styles.statTitle}>Agent 5: Risk Agent</span>
            <AlertTriangle size={16} color={riskLevel === 'HIGH' ? '#FF6B6B' : riskLevel === 'MEDIUM' ? '#FACC15' : '#22C55E'} />
          </div>
          
          <div style={styles.riskContent}>
            {/* Risk Indicator */}
            <div style={styles.riskHeader}>
              <span style={styles.riskTitleText}>Risk of Missing Goal:</span>
              <span style={styles.riskBadge(riskLevel)}>{riskLevel} RISK</span>
            </div>

            <p style={styles.riskReason}>{riskReason}</p>
            <p style={styles.riskAction}>{riskAction}</p>

            {/* Live Sliders for Sandbox */}
            <div style={styles.slidersWrapper}>
              <strong style={styles.sandboxHeader}>Interactive Testing Console:</strong>
              <div style={styles.sliderRow}>
                <label style={styles.sliderLabel}>Weekly Commit: <strong>{weeklyHours}h</strong></label>
                <input 
                  type="range" 
                  min="2" 
                  max="15" 
                  value={weeklyHours} 
                  onChange={(e) => setWeeklyHours(Number(e.target.value))}
                  style={styles.sliderInput} 
                />
              </div>
              <div style={styles.sliderRow}>
                <label style={styles.sliderLabel}>Mock Quiz Score: <strong>{mockScore}%</strong></label>
                <input 
                  type="range" 
                  min="30" 
                  max="100" 
                  value={mockScore} 
                  onChange={(e) => setMockScore(Number(e.target.value))}
                  style={styles.sliderInput} 
                />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* AI recommendation bar */}
      <div style={styles.aiRecommendationCard}>
        <div style={styles.aiHeader}>
          <Sparkles size={16} color="#3B82F6" />
          <span style={styles.aiTitle}>AI Recommendation (Typing...)</span>
        </div>
        <p style={styles.aiText} className="typing-cursor">
          {typedText}
        </p>
        <div style={styles.aiActions}>
          <button style={styles.aiBtn}>
            <Play size={12} fill="#fff" /> Start Custom 15m review session
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            style={styles.notificationToast}
          >
            <div style={styles.toastIconBg}>
              <Flame size={18} color="#FF6B6B" />
            </div>
            <div style={styles.toastBody}>
              <span style={styles.toastTitle}>Streak Milestone Unlocked!</span>
              <p style={styles.toastDesc}>You've reached 10 days! Consistency badge added.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const styles = {
  dashboardContainer: {
    backgroundColor: '#FAFAF7',
    borderRadius: '24px',
    border: '1px solid #E4E4E7',
    boxShadow: 'var(--shadow-premium)',
    padding: '1.75rem',
    width: '100%',
    textAlign: 'left' as const,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1.5rem',
    position: 'relative' as const,
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #E4E4E7',
    paddingBottom: '1rem',
  },
  welcomeText: {
    fontSize: '1.2rem',
    fontWeight: 700,
    color: '#18181B',
  },
  subtext: {
    fontSize: '0.85rem',
    color: '#71717A',
    fontWeight: 500,
  },
  headerIcons: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  notificationWrapper: {
    position: 'relative' as const,
    cursor: 'pointer',
    padding: '4px',
  },
  notificationDot: {
    position: 'absolute' as const,
    top: '4px',
    right: '4px',
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#FF6B6B',
  },
  iconMuted: {
    color: '#71717A',
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    objectFit: 'cover' as const,
    border: '2px solid #3B82F6',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1.5rem',
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    padding: '1.25rem',
    borderRadius: '20px',
    border: '1px solid rgba(228, 228, 231, 0.6)',
    boxShadow: 'var(--shadow-sm)',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.75rem',
  },
  statCardWide: {
    backgroundColor: '#FFFFFF',
    padding: '1.25rem',
    borderRadius: '20px',
    border: '1px solid rgba(228, 228, 231, 0.6)',
    boxShadow: 'var(--shadow-sm)',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.75rem',
    gridColumn: 'span 1',
  },
  statHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #F4F4F5',
    paddingBottom: '0.5rem',
  },
  statTitle: {
    fontSize: '0.75rem',
    fontWeight: 700,
    color: '#71717A',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
  },
  statValue: {
    fontSize: '1.75rem',
    fontWeight: 800,
    color: '#18181B',
  },
  missionWrapper: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.5rem',
    marginTop: '0.25rem',
  },
  missionLabel: {
    fontSize: '0.75rem',
    color: '#71717A',
    fontWeight: 600,
  },
  missionText: {
    fontSize: '1.05rem',
    fontWeight: 800,
    color: '#18181B',
  },
  durationBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '0.8rem',
    backgroundColor: 'rgba(59, 130, 246, 0.08)',
    color: '#3B82F6',
    fontWeight: 700,
    padding: '4px 10px',
    borderRadius: '9999px',
    alignSelf: 'flex-start',
  },
  recalPill: {
    fontSize: '0.7rem',
    backgroundColor: '#FF6B6B',
    color: '#FFFFFF',
    padding: '1px 6px',
    borderRadius: '4px',
    marginLeft: '6px',
    fontWeight: 600,
  },
  recalPillGreen: {
    fontSize: '0.7rem',
    backgroundColor: '#22C55E',
    color: '#FFFFFF',
    padding: '1px 6px',
    borderRadius: '4px',
    marginLeft: '6px',
    fontWeight: 600,
  },
  progressSection: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.5rem',
  },
  progressRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  streakLabel: {
    fontSize: '0.8rem',
    fontWeight: 700,
    color: '#FF6B6B',
  },
  aiObservationsCard: {
    backgroundColor: 'rgba(34, 197, 94, 0.04)',
    border: '1px solid rgba(34, 197, 94, 0.1)',
    borderRadius: '10px',
    padding: '8px 12px',
    marginTop: '2px',
  },
  obsTitle: {
    fontSize: '0.75rem',
    color: '#15803D',
    fontWeight: 700,
    display: 'block',
  },
  obsDesc: {
    fontSize: '0.75rem',
    color: '#52525B',
    lineHeight: 1.4,
    marginTop: '2px',
  },
  timelineShift: {
    fontWeight: 700,
    color: '#15803D',
    fontSize: '0.8rem',
  },
  riskContent: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.4rem',
  },
  riskHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '0.2rem',
  },
  riskTitleText: {
    fontSize: '0.8rem',
    fontWeight: 700,
    color: '#18181B',
  },
  riskBadge: (level: string) => {
    let bg = 'rgba(34, 197, 94, 0.08)';
    let color = '#22C55E';
    if (level === 'HIGH') {
      bg = 'rgba(255, 107, 107, 0.08)';
      color = '#FF6B6B';
    } else if (level === 'MEDIUM') {
      bg = 'rgba(250, 204, 21, 0.08)';
      color = '#B45309';
    }
    return {
      fontSize: '0.7rem',
      fontWeight: 700,
      backgroundColor: bg,
      color: color,
      padding: '2px 8px',
      borderRadius: '4px',
    };
  },
  riskReason: {
    fontSize: '0.75rem',
    color: '#71717A',
    lineHeight: 1.3,
  },
  riskAction: {
    fontSize: '0.75rem',
    fontWeight: 700,
    color: '#18181B',
    lineHeight: 1.3,
    marginTop: '2px',
  },
  slidersWrapper: {
    marginTop: '0.5rem',
    borderTop: '1px solid #F4F4F5',
    paddingTop: '0.5rem',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.4rem',
  },
  sandboxHeader: {
    fontSize: '0.7rem',
    fontWeight: 700,
    color: '#71717A',
    textTransform: 'uppercase' as const,
  },
  sliderRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '1rem',
  },
  sliderLabel: {
    fontSize: '0.75rem',
    color: '#52525B',
    flexShrink: 0,
    width: '120px',
  },
  sliderInput: {
    flexGrow: 1,
    height: '4px',
    borderRadius: '2px',
    outline: 'none',
    cursor: 'pointer',
  },
  aiRecommendationCard: {
    backgroundColor: 'rgba(59, 130, 246, 0.04)',
    border: '1px solid rgba(59, 130, 246, 0.1)',
    borderRadius: '16px',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.5rem',
    textAlign: 'left' as const,
  },
  aiHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  aiTitle: {
    fontSize: '0.8rem',
    fontWeight: 700,
    color: '#3B82F6',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.02em',
  },
  aiText: {
    fontSize: '0.8rem',
    color: '#18181B',
    lineHeight: 1.5,
    minHeight: '44px',
  },
  aiActions: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  aiBtn: {
    backgroundColor: '#3B82F6',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '8px',
    padding: '6px 12px',
    fontSize: '0.75rem',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    boxShadow: '0 2px 4px rgba(59, 130, 246, 0.15)',
  },
  notificationToast: {
    position: 'absolute' as const,
    bottom: '1rem',
    right: '1rem',
    backgroundColor: '#FFFFFF',
    border: '1px solid #FF6B6B',
    borderRadius: '16px',
    padding: '0.875rem 1.25rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.875rem',
    boxShadow: '0 10px 25px -5px rgba(255, 107, 107, 0.15)',
    zIndex: 200,
    width: '320px',
  },
  toastIconBg: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 107, 107, 0.08)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toastBody: {
    display: 'flex',
    flexDirection: 'column' as const,
    textAlign: 'left' as const,
  },
  toastTitle: {
    fontSize: '0.8rem',
    fontWeight: 700,
    color: '#18181B',
  },
  toastDesc: {
    fontSize: '0.7rem',
    color: '#71717A',
  },
};
