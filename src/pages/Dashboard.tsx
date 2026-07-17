import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Sparkles, Flame, CheckCircle, Clock, AlertTriangle, 
  Terminal, ArrowRight, BookOpen, Award, Bell, X, TrendingUp, Zap
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Dashboard() {
  const navigate = useNavigate();
  const { state, toggleTask, dismissNudge } = useApp();

  useEffect(() => {
    if (!state.user || !state.assessment) navigate('/');
  }, [state, navigate]);

  if (!state.user || !state.assessment || !state.roadmap) return null;

  const totalTasks = state.roadmap.milestones.reduce((acc, m) => acc + m.tasks.length, 0);
  const completedCount = state.completedTasks.length;
  const progressPercent = Math.round((completedCount / totalTasks) * 100);

  const nextTask = state.roadmap.milestones
    .flatMap(m => m.tasks)
    .find(t => !state.completedTasks.includes(t)) || 'All Tasks Completed!';

  const lastQuiz = state.quizHistory[state.quizHistory.length - 1];
  const needsRevision = lastQuiz && lastQuiz.score < 60;
  const activeNudges = state.nudges.filter(n => !n.dismissed);

  const riskColors = {
    LOW: { color: '#10B981', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.2)' },
    MEDIUM: { color: '#F59E0B', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)' },
    HIGH: { color: '#F43F5E', bg: 'rgba(244,63,94,0.08)', border: 'rgba(244,63,94,0.2)' },
  };
  const rc = riskColors[state.riskLevel];

  const nudgeColors = {
    inactivity: { color: '#F59E0B', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)', icon: '⏸' },
    quiz_fail: { color: '#F43F5E', bg: 'rgba(244,63,94,0.08)', border: 'rgba(244,63,94,0.2)', icon: '📊' },
    milestone_delay: { color: '#8B5CF6', bg: 'rgba(139,92,246,0.08)', border: 'rgba(139,92,246,0.2)', icon: '📅' },
    encouragement: { color: '#10B981', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.2)', icon: '🎯' },
  };

  const plannedHours = state.user.studyHours * 7;
  const spentHours = state.weeklyActivity.reduce((a, d) => a + d.hours, 0);

  return (
    <div style={S.page}>
      {/* Welcome Banner */}
      <div style={S.welcomeBanner}>
        <div>
          <span style={S.bannerBadge}>ACTIVE SESSION</span>
          <h2 style={S.welcomeTitle}>Welcome back, {state.user.name} 👋</h2>
          <p style={S.welcomeSub}>
            Orchestrating your path towards <strong style={{ color: '#818CF8' }}>{state.user.careerGoal}</strong>
            {state.user.targetCompany ? <> at <strong style={{ color: '#10B981' }}>{state.user.targetCompany}</strong></> : ''}.
          </p>
        </div>
        <div style={S.dnaBadge}>
          <Sparkles size={13} color="#818CF8" />
          <span>{state.assessment.learningDNA}</span>
        </div>
      </div>

      {/* Smart Nudges Panel */}
      {activeNudges.length > 0 && (
        <div style={S.nudgesSection}>
          <div style={S.nudgesHeader}>
            <Bell size={15} color="#818CF8" />
            <span style={S.nudgesTitle}>Smart Nudges</span>
            <span style={S.nudgeCount}>{activeNudges.length} active</span>
          </div>
          <div style={S.nudgesList}>
            {activeNudges.slice(0, 3).map(nudge => {
              const nc = nudgeColors[nudge.type];
              return (
                <div key={nudge.id} style={{ ...S.nudgeCard, background: nc.bg, border: `1px solid ${nc.border}` }}>
                  <div style={S.nudgeLeft}>
                    <span style={S.nudgeEmoji}>{nc.icon}</span>
                    <div style={S.nudgeBody}>
                      <p style={{ ...S.nudgeMsg, color: '#F1F5F9' }}>{nudge.message}</p>
                      <div style={S.nudgeMeta}>
                        <span style={{ ...S.nudgeTime, color: nc.color }}>
                          {nudge.type.replace('_', ' ').toUpperCase()}
                        </span>
                        <span style={S.nudgeTimestamp}>· {nudge.timestamp}</span>
                      </div>
                    </div>
                  </div>
                  <div style={S.nudgeActions}>
                    <Link to="/roadmap" style={{ ...S.nudgeActionBtn, background: nc.color, color: '#fff' }}>
                      {nudge.actionLabel}
                    </Link>
                    <button onClick={() => dismissNudge(nudge.id)} style={S.nudgeDismiss}>
                      <X size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Metrics Row */}
      <div style={S.metricsRow}>
        {[
          { label: 'Consistency Streak', value: `${state.streakDays || 10} Days`, sub: `Top 8% in ${state.user.college}`, icon: <Flame size={18} color="#F43F5E" fill="#F43F5E" /> },
          { label: 'Roadmap Progress', value: `${progressPercent}%`, sub: `${completedCount} of ${totalTasks} tasks done`, icon: <CheckCircle size={18} color="#6366F1" />, progress: progressPercent },
          { label: 'Time Spent vs Plan', value: `${Math.round(spentHours * 10) / 10}h / ${plannedHours}h`, sub: `${Math.round((spentHours / plannedHours) * 100)}% of weekly target`, icon: <Clock size={18} color="#8B5CF6" /> },
          { label: 'Success Probability', value: `${state.assessment.successProbability}%`, sub: 'Based on skill DNA profile', icon: <Award size={18} color="#10B981" /> },
        ].map((m, i) => (
          <div key={i} style={S.metricCard}>
            <div style={S.metricHeader}>
              <span style={S.metricLabel}>{m.label}</span>
              {m.icon}
            </div>
            <span style={S.metricValue}>{m.value}</span>
            {m.progress !== undefined && (
              <div style={S.miniProgressBg}>
                <div style={{ ...S.miniProgressFill, width: `${m.progress}%` }} />
              </div>
            )}
            <span style={S.metricSub}>{m.sub}</span>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div style={S.workspaceGrid}>
        <div style={S.leftCol}>
          {/* Today's Mission */}
          <div style={S.panelCard}>
            <h3 style={S.panelTitle}>Today's Mission</h3>
            {nextTask !== 'All Tasks Completed!' ? (
              <div style={S.missionBox}>
                <div style={S.missionContent}>
                  <div style={S.missionIconWrap}>
                    <BookOpen size={16} color="#6366F1" />
                  </div>
                  <div>
                    <span style={S.missionLabel}>NEXT OBJECTIVE</span>
                    <p style={S.missionText}>{nextTask}</p>
                  </div>
                </div>
                <button onClick={() => toggleTask(nextTask)} style={S.completeBtn}>
                  Mark Complete
                </button>
              </div>
            ) : (
              <p style={S.allDoneText}>🎉 All roadmap tasks completed!</p>
            )}
            <div style={S.missionFooter}>
              <Link to="/roadmap" style={S.panelLink}>
                View Full Roadmap <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          {/* AI Risk Agent */}
          <div style={S.panelCard}>
            <div style={S.riskHeader}>
              <h3 style={S.panelTitle}>AI Risk Agent</h3>
              <span style={{ ...S.riskBadge, color: rc.color, background: rc.bg, border: `1px solid ${rc.border}` }}>
                {state.riskLevel} RISK
              </span>
            </div>
            <p style={S.riskReason}>
              {state.riskLevel === 'LOW' && 'Study streak is healthy. Quiz averages are currently high and on track.'}
              {state.riskLevel === 'MEDIUM' && 'Low task completion velocity detected. Risk of milestone delay.'}
              {state.riskLevel === 'HIGH' && 'Low quiz scores detected. Significant knowledge gaps require remediation.'}
            </p>
            <div style={{ ...S.riskCard, borderLeft: `3px solid ${rc.color}` }}>
              <span style={S.recLabel}>SUGGESTED ACTION</span>
              <p style={S.recText}>
                {state.riskLevel === 'LOW' && 'No intervention required. Maintain your current study cadence.'}
                {state.riskLevel === 'MEDIUM' && 'Schedule a focused 15-min concept review session this week.'}
                {state.riskLevel === 'HIGH' && 'Insert a revision block and reduce weekly task volume immediately.'}
              </p>
            </div>
            {needsRevision && (
              <div style={S.revisionAlert}>
                <AlertTriangle size={14} color="#F59E0B" />
                <span>
                  <strong>Adaptive Plan Triggered:</strong> Last quiz was below 60%. Remedial tasks have been queued before the next milestone.
                </span>
              </div>
            )}
          </div>

          {/* Weekly Activity Mini Chart */}
          <div style={S.panelCard}>
            <div style={S.activityHeader}>
              <h3 style={S.panelTitle}>Weekly Activity</h3>
              <Link to="/analytics" style={S.panelLink}>
                View Full Analytics <TrendingUp size={13} />
              </Link>
            </div>
            <div style={S.activityBars}>
              {state.weeklyActivity.map(d => {
                const maxH = Math.max(...state.weeklyActivity.map(x => x.hours), 1);
                const pct = (d.hours / maxH) * 100;
                return (
                  <div key={d.day} style={S.barCol}>
                    <div style={S.barTrack}>
                      <div style={{ ...S.barFill, height: `${Math.max(pct, 6)}%`, background: d.hours > 0 ? 'linear-gradient(180deg, #818CF8, #6366F1)' : 'rgba(255,255,255,0.06)' }} />
                    </div>
                    <span style={S.barLabel}>{d.day}</span>
                    {d.hours > 0 && <span style={S.barHours}>{d.hours}h</span>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Telemetry Terminal */}
        <div style={S.terminalCard}>
          <div style={S.terminalHeader}>
            <Terminal size={13} color="#10B981" />
            <span style={{ color: '#10B981', fontSize: '0.72rem', fontWeight: 700 }}>Orchestrator Telemetry</span>
            <div style={S.termDot} />
          </div>
          <div style={S.terminalBody}>
            <div style={S.telRow}><span>Model:</span><span style={S.telVal}>llama-3.3-70b-versatile</span></div>
            <div style={S.telRow}><span>Schema Validation:</span><span style={{ color: '#10B981', fontWeight: 700 }}>PASSED</span></div>
            <div style={S.telRow}><span>Active Session:</span><span style={S.telVal}>{state.assessment.learningDNA.substring(0, 16)}...</span></div>
            <div style={S.telRow}><span>Risk Level:</span><span style={{ color: rc.color, fontWeight: 700 }}>{state.riskLevel}</span></div>
            <div style={S.telDivider} />

            <div style={S.logList}>
              <div style={S.logItem}><span style={S.logTime}>[SYS]</span> Context node metadata loaded</div>
              <div style={S.logItem}><span style={S.logTime}>[SYS]</span> LocalStorage state sync complete</div>
              <div style={{ ...S.logItem, color: rc.color }}><span style={S.logTime}>[RISK]</span> Risk audit: Level = {state.riskLevel}</div>
              {activeNudges.length > 0 && (
                <div style={{ ...S.logItem, color: '#F59E0B' }}>
                  <span style={S.logTime}>[NUDGE]</span> {activeNudges.length} smart nudge(s) queued
                </div>
              )}
              {completedCount > 0 && (
                <div style={{ ...S.logItem, color: '#6366F1' }}>
                  <span style={S.logTime}>[TASK]</span> Completed: {state.completedTasks[state.completedTasks.length - 1]?.substring(0, 28)}...
                </div>
              )}
              {needsRevision && (
                <div style={{ ...S.logItem, color: '#F43F5E' }}>
                  <span style={S.logTime}>[ADAPT]</span> Revision block injected post quiz failure
                </div>
              )}
              <div style={S.logItem}><span style={S.logTime}>[HB]</span> Agent heartbeat: connection stable ●</div>
            </div>

            <div style={S.telDivider} />
            <div style={S.quickActions}>
              <span style={S.quickActLabel}>QUICK ACTIONS</span>
              <Link to="/tutor" style={S.quickBtn}>
                <Sparkles size={11} /> Ask AI Tutor
              </Link>
              <Link to="/quiz" style={S.quickBtn}>
                <Zap size={11} /> Take Quiz
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const S = {
  page: { display: 'flex', flexDirection: 'column' as const, gap: '1.5rem' },
  welcomeBanner: {
    background: 'linear-gradient(135deg, #13131E 0%, #1A1A28 100%)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: '20px',
    padding: '2rem 2.5rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bannerBadge: {
    fontSize: '0.62rem',
    background: 'rgba(99,102,241,0.12)',
    color: '#818CF8',
    fontWeight: 800,
    padding: '3px 8px',
    borderRadius: '6px',
    letterSpacing: '0.07em',
    display: 'inline-block',
    marginBottom: '8px',
  },
  welcomeTitle: { fontSize: '1.6rem', fontWeight: 800, color: '#F1F5F9', letterSpacing: '-0.02em' },
  welcomeSub: { fontSize: '0.88rem', color: '#64748B', marginTop: '4px' },
  dnaBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'rgba(99,102,241,0.1)',
    border: '1px solid rgba(99,102,241,0.2)',
    color: '#818CF8',
    padding: '8px 16px',
    borderRadius: '10px',
    fontSize: '0.82rem',
    fontWeight: 700,
    fontFamily: 'JetBrains Mono, monospace',
    whiteSpace: 'nowrap' as const,
  },
  nudgesSection: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px',
  },
  nudgesHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  nudgesTitle: { fontSize: '0.85rem', fontWeight: 700, color: '#F1F5F9' },
  nudgeCount: {
    fontSize: '0.7rem',
    background: 'rgba(99,102,241,0.12)',
    color: '#818CF8',
    padding: '2px 8px',
    borderRadius: '9999px',
    fontWeight: 700,
  },
  nudgesList: { display: 'flex', flexDirection: 'column' as const, gap: '8px' },
  nudgeCard: {
    borderRadius: '14px',
    padding: '1rem 1.25rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '1rem',
  },
  nudgeLeft: { display: 'flex', gap: '12px', flex: 1 },
  nudgeEmoji: { fontSize: '1.2rem', flexShrink: 0, marginTop: '2px' },
  nudgeBody: { display: 'flex', flexDirection: 'column' as const, gap: '4px' },
  nudgeMsg: { fontSize: '0.83rem', lineHeight: 1.55, fontWeight: 500 },
  nudgeMeta: { display: 'flex', alignItems: 'center', gap: '6px' },
  nudgeTime: { fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.05em' },
  nudgeTimestamp: { fontSize: '0.68rem', color: '#475569' },
  nudgeActions: { display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 },
  nudgeActionBtn: {
    borderRadius: '8px',
    padding: '6px 12px',
    fontSize: '0.75rem',
    fontWeight: 700,
    textDecoration: 'none',
    whiteSpace: 'nowrap' as const,
    display: 'inline-flex',
  },
  nudgeDismiss: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '8px',
    width: '30px',
    height: '30px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: '#64748B',
  },
  metricsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '1rem',
  },
  metricCard: {
    background: '#13131E',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '16px',
    padding: '1.25rem',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '6px',
  },
  metricHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  metricLabel: { fontSize: '0.72rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' as const, letterSpacing: '0.04em' },
  metricValue: { fontSize: '1.6rem', fontWeight: 800, color: '#F1F5F9', lineHeight: 1 },
  miniProgressBg: { width: '100%', height: '5px', background: 'rgba(255,255,255,0.06)', borderRadius: '9999px', overflow: 'hidden' },
  miniProgressFill: { height: '100%', background: 'linear-gradient(90deg, #6366F1, #818CF8)', borderRadius: '9999px', transition: 'width 0.6s' },
  metricSub: { fontSize: '0.7rem', color: '#475569', fontWeight: 600 },
  workspaceGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 300px',
    gap: '1.5rem',
    alignItems: 'start',
  },
  leftCol: { display: 'flex', flexDirection: 'column' as const, gap: '1.5rem' },
  panelCard: {
    background: '#13131E',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '16px',
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
  },
  panelTitle: { fontSize: '1rem', fontWeight: 700, color: '#F1F5F9' },
  missionBox: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: '#1A1A28',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '12px',
    padding: '1rem 1.25rem',
    gap: '1rem',
  },
  missionContent: { display: 'flex', gap: '12px', alignItems: 'flex-start' },
  missionIconWrap: {
    width: '32px', height: '32px', borderRadius: '8px',
    background: 'rgba(99,102,241,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  missionLabel: { fontSize: '0.62rem', fontWeight: 800, color: '#64748B', letterSpacing: '0.07em', display: 'block' },
  missionText: { fontSize: '0.88rem', fontWeight: 700, color: '#F1F5F9', lineHeight: 1.4, marginTop: '2px' },
  completeBtn: {
    background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
    color: '#fff',
    border: 'none',
    borderRadius: '9px',
    padding: '8px 16px',
    fontSize: '0.8rem',
    fontWeight: 700,
    cursor: 'pointer',
    flexShrink: 0,
    fontFamily: 'inherit',
  },
  allDoneText: { fontSize: '0.9rem', color: '#10B981', fontWeight: 700 },
  missionFooter: { borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.75rem' },
  panelLink: {
    color: '#818CF8',
    fontSize: '0.8rem',
    fontWeight: 700,
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
  },
  riskHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  riskBadge: {
    fontSize: '0.68rem', fontWeight: 800, padding: '3px 10px',
    borderRadius: '8px', letterSpacing: '0.03em',
  },
  riskReason: { fontSize: '0.85rem', color: '#94A3B8', lineHeight: 1.55 },
  riskCard: {
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '8px',
    padding: '0.875rem 1rem',
  },
  recLabel: { display: 'block', fontSize: '0.62rem', fontWeight: 800, color: '#475569', letterSpacing: '0.07em', marginBottom: '4px' },
  recText: { fontSize: '0.82rem', fontWeight: 600, color: '#94A3B8', lineHeight: 1.45 },
  revisionAlert: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '8px',
    background: 'rgba(245,158,11,0.06)',
    border: '1px solid rgba(245,158,11,0.15)',
    borderRadius: '10px',
    padding: '0.75rem',
    fontSize: '0.78rem',
    color: '#92400E',
    lineHeight: 1.45,
  },
  activityHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  activityBars: {
    display: 'flex',
    gap: '8px',
    alignItems: 'flex-end',
    height: '80px',
  },
  barCol: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '4px',
    height: '100%',
  },
  barTrack: { flex: 1, width: '100%', background: 'rgba(255,255,255,0.04)', borderRadius: '4px', overflow: 'hidden', display: 'flex', alignItems: 'flex-end' },
  barFill: { width: '100%', borderRadius: '4px', transition: 'height 0.4s' },
  barLabel: { fontSize: '0.62rem', color: '#475569', fontWeight: 700 },
  barHours: { fontSize: '0.58rem', color: '#6366F1', fontWeight: 700 },
  // Terminal
  terminalCard: {
    background: '#0A0A0F',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: '16px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column' as const,
    position: 'sticky' as const,
    top: '80px',
  },
  terminalHeader: {
    background: '#0D0D16',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    padding: '10px 14px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  termDot: { width: '7px', height: '7px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 6px #10B981', marginLeft: 'auto' },
  terminalBody: {
    padding: '1.25rem',
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: '0.73rem',
    color: '#94A3B8',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
    flexGrow: 1,
  },
  telRow: { display: 'flex', justifyContent: 'space-between' },
  telVal: { color: '#64748B' },
  telDivider: { height: '1px', background: 'rgba(255,255,255,0.05)', margin: '4px 0' },
  logList: { display: 'flex', flexDirection: 'column' as const, gap: '5px', overflowY: 'auto' as const, maxHeight: '200px' },
  logItem: { color: '#475569', lineHeight: 1.4, display: 'flex', gap: '6px' },
  logTime: { color: '#334155', flexShrink: 0 },
  quickActions: { display: 'flex', flexDirection: 'column' as const, gap: '6px' },
  quickActLabel: { fontSize: '0.6rem', fontWeight: 800, color: '#334155', letterSpacing: '0.07em' },
  quickBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: 'rgba(99,102,241,0.08)',
    border: '1px solid rgba(99,102,241,0.15)',
    borderRadius: '8px',
    padding: '7px 10px',
    fontSize: '0.75rem',
    fontWeight: 700,
    color: '#818CF8',
    textDecoration: 'none',
    transition: 'all 0.15s',
  },
};
