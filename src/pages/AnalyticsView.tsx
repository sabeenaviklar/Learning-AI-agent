import { useApp } from '../context/AppContext';
import { Clock, Award, Activity, ShieldAlert, TrendingUp, CheckCircle } from 'lucide-react';

export default function AnalyticsView() {
  const { state } = useApp();

  if (!state.user || !state.assessment) {
    return (
      <div style={S.empty}>
        <ShieldAlert size={48} color="#F43F5E" />
        <h3 style={{ color: '#F1F5F9' }}>No Analytics Profile Found</h3>
        <p>Complete the onboarding assessment to initialize performance tracking.</p>
      </div>
    );
  }

  const activityData = state.weeklyActivity;
  const maxHours = Math.max(...activityData.map(d => d.hours), 1);
  const svgW = 500, svgH = 180, pad = 30;
  const chartW = svgW - pad * 2;
  const chartH = svgH - pad * 2;
  const colW = chartW / activityData.length;
  const totalSpent = activityData.reduce((a, d) => a + d.hours, 0);
  const avgQuiz = state.quizHistory.length > 0
    ? Math.round(state.quizHistory.reduce((a, q) => a + q.score, 0) / state.quizHistory.length)
    : 85;

  const skillBars = [
    { label: 'Syntax Mastery', pct: 80, color: '#6366F1' },
    { label: 'Algorithmic Design', pct: 65, color: '#8B5CF6' },
    { label: 'Systems Architecture', pct: 45, color: '#F43F5E' },
    { label: 'Integration Practices', pct: 75, color: '#10B981' },
  ];

  return (
    <div style={S.page}>
      {/* Header */}
      <div style={S.header}>
        <div style={S.badge}>
          <Activity size={11} color="#8B5CF6" />
          <span>Performance Analytics</span>
        </div>
        <h2 style={S.title}>Velocity & Consistency</h2>
        <p style={S.sub}>Live data feed mapping study velocity, risk ratios, and skill progression curves.</p>
      </div>

      {/* Metrics */}
      <div style={S.metricsRow}>
        {[
          { label: 'Daily Avg Hours', val: `${Math.round((totalSpent / 7) * 10) / 10}h`, sub: `Optimal for ${state.user.style} style`, icon: <Clock size={16} color="#6366F1" /> },
          { label: 'Study Consistency', val: '94%', sub: 'Excellent weekend commits', icon: <TrendingUp size={16} color="#10B981" /> },
          { label: 'Quiz Average', val: `${avgQuiz}%`, sub: `From ${state.quizHistory.length} evaluations`, icon: <Award size={16} color="#8B5CF6" /> },
          { label: 'Model Accuracy Index', val: '98.4%', sub: 'Low logic discrepancy logs', icon: <CheckCircle size={16} color="#F59E0B" /> },
        ].map((m, i) => (
          <div key={i} style={S.metricCard}>
            <div style={S.metricTop}>
              <span style={S.metricLabel}>{m.label}</span>
              {m.icon}
            </div>
            <span style={S.metricVal}>{m.val}</span>
            <span style={S.metricSub}>{m.sub}</span>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={S.chartsGrid}>
        {/* Bar chart */}
        <div style={S.chartCard}>
          <h3 style={S.chartTitle}>
            <Clock size={15} color="#6366F1" />
            <span>Weekly Study Hours</span>
          </h3>
          <p style={S.chartSub}>Time spent reviewing materials and executing roadmap tasks.</p>
          <div style={S.svgWrapper}>
            <svg viewBox={`0 0 ${svgW} ${svgH}`} width="100%" height="100%">
              <line x1={pad} y1={pad} x2={svgW - pad} y2={pad} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
              <line x1={pad} y1={pad + chartH / 2} x2={svgW - pad} y2={pad + chartH / 2} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
              <line x1={pad} y1={pad + chartH} x2={svgW - pad} y2={pad + chartH} stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
              {activityData.map((d, idx) => {
                const bh = (d.hours / maxHours) * chartH;
                const x = pad + idx * colW + (colW - 22) / 2;
                const y = pad + chartH - bh;
                return (
                  <g key={d.day}>
                    <defs>
                      <linearGradient id={`bar${idx}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#818CF8" />
                        <stop offset="100%" stopColor="#6366F1" />
                      </linearGradient>
                    </defs>
                    <rect x={x} y={y} width="22" height={Math.max(bh, 4)} rx="5"
                      fill={d.hours > 0 ? `url(#bar${idx})` : 'rgba(255,255,255,0.04)'} />
                    <text x={x + 11} y={svgH - 8} textAnchor="middle" fill="#475569" fontSize="9" fontWeight="700">{d.day}</text>
                    {d.hours > 0 && (
                      <text x={x + 11} y={y - 6} textAnchor="middle" fill="#818CF8" fontSize="9" fontWeight="800">{d.hours}h</text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Skill DNA */}
        <div style={S.chartCard}>
          <h3 style={S.chartTitle}>
            <Award size={15} color="#10B981" />
            <span>Skill DNA Breakdown</span>
          </h3>
          <p style={S.chartSub}>Evaluation vectors relative to the {state.user.careerGoal} standard.</p>
          <div style={S.skillList}>
            {skillBars.map((sb, i) => (
              <div key={i} style={S.skillRow}>
                <div style={S.skillLabelRow}>
                  <span style={S.skillLabel}>{sb.label}</span>
                  <span style={{ ...S.skillPct, color: sb.color }}>{sb.pct}%</span>
                </div>
                <div style={S.progressTrack}>
                  <div style={{ ...S.progressFill, width: `${sb.pct}%`, background: sb.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quiz History Log */}
      <div style={S.historyCard}>
        <h3 style={S.chartTitle}>
          <Activity size={15} color="#8B5CF6" />
          <span>Quiz History & Adaptive Feedback Loop</span>
        </h3>
        <p style={S.chartSub}>Every low score triggers a visible plan modification—this is the closed feedback loop in action.</p>
        {state.quizHistory.length === 0 ? (
          <p style={{ color: '#475569', fontSize: '0.85rem' }}>No quiz history yet. Take a quiz to see the feedback loop in action.</p>
        ) : (
          <div style={S.historyList}>
            {state.quizHistory.map((q, i) => {
              const scoreColor = q.score >= 75 ? '#10B981' : q.score >= 50 ? '#F59E0B' : '#F43F5E';
              return (
                <div key={q.id} style={S.historyRow}>
                  <div style={S.historyLeft}>
                    <span style={{ ...S.scoreCircle, borderColor: scoreColor, color: scoreColor }}>{q.score}%</span>
                    <div>
                      <p style={S.historyTopic}>{q.topic}</p>
                      <span style={S.historyDate}>{q.date}</span>
                    </div>
                  </div>
                  <div style={S.historyRight}>
                    {q.adaptiveReview && (
                      <span style={S.adaptivePill}>⚡ Plan Adjusted</span>
                    )}
                    <span style={{ ...S.scoreBadge, color: scoreColor, background: `${scoreColor}15` }}>
                      {q.score >= 75 ? 'PASSED' : q.score >= 50 ? 'REVIEW' : 'REMEDIAL'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

const S = {
  page: { display: 'flex', flexDirection: 'column' as const, gap: '1.5rem' },
  empty: {
    textAlign: 'center' as const, padding: '3rem',
    background: '#13131E', border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '20px', display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: '1rem',
  },
  header: { display: 'flex', flexDirection: 'column' as const, gap: '6px' },
  badge: {
    alignSelf: 'flex-start' as const, display: 'inline-flex', alignItems: 'center', gap: '6px',
    background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)',
    borderRadius: '9999px', padding: '4px 12px', fontSize: '0.7rem', color: '#8B5CF6', fontWeight: 700,
  },
  title: { fontSize: '1.75rem', fontWeight: 800, color: '#F1F5F9', letterSpacing: '-0.02em' },
  sub: { fontSize: '0.88rem', color: '#64748B' },
  metricsRow: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' },
  metricCard: {
    background: '#13131E', border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '16px', padding: '1.25rem',
    display: 'flex', flexDirection: 'column' as const, gap: '6px',
  },
  metricTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  metricLabel: { fontSize: '0.7rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' as const, letterSpacing: '0.04em' },
  metricVal: { fontSize: '1.6rem', fontWeight: 800, color: '#F1F5F9' },
  metricSub: { fontSize: '0.68rem', color: '#475569', fontWeight: 600 },
  chartsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' },
  chartCard: {
    background: '#13131E', border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '16px', padding: '1.5rem',
  },
  chartTitle: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem', fontWeight: 700, color: '#F1F5F9', marginBottom: '4px' },
  chartSub: { fontSize: '0.75rem', color: '#64748B', marginBottom: '1.25rem' },
  svgWrapper: { width: '100%', maxHeight: '200px' },
  skillList: { display: 'flex', flexDirection: 'column' as const, gap: '14px' },
  skillRow: { display: 'flex', flexDirection: 'column' as const, gap: '6px' },
  skillLabelRow: { display: 'flex', justifyContent: 'space-between' },
  skillLabel: { fontSize: '0.8rem', fontWeight: 600, color: '#94A3B8' },
  skillPct: { fontSize: '0.8rem', fontWeight: 800 },
  progressTrack: { width: '100%', height: '5px', background: 'rgba(255,255,255,0.06)', borderRadius: '9999px', overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: '9999px', transition: 'width 0.5s' },
  historyCard: {
    background: '#13131E', border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column' as const, gap: '1rem',
  },
  historyList: { display: 'flex', flexDirection: 'column' as const, gap: '8px' },
  historyRow: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)',
    borderRadius: '10px', padding: '0.875rem 1rem',
  },
  historyLeft: { display: 'flex', alignItems: 'center', gap: '12px' },
  scoreCircle: {
    width: '44px', height: '44px', borderRadius: '10px', border: '2px solid',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '0.78rem', fontWeight: 800, flexShrink: 0,
  },
  historyTopic: { fontSize: '0.85rem', fontWeight: 700, color: '#F1F5F9', lineHeight: 1.3 },
  historyDate: { fontSize: '0.7rem', color: '#475569', fontWeight: 600 },
  historyRight: { display: 'flex', alignItems: 'center', gap: '8px' },
  adaptivePill: {
    fontSize: '0.68rem', fontWeight: 800,
    background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)',
    color: '#818CF8', borderRadius: '9999px', padding: '3px 8px',
  },
  scoreBadge: { fontSize: '0.7rem', fontWeight: 800, padding: '3px 8px', borderRadius: '8px' },
};
