import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, CheckCircle, Circle, ArrowRight, Calendar, 
  ChevronDown, ChevronUp, BookOpen, Clock, ShieldAlert, Award
} from 'lucide-react';

export default function Roadmap() {
  const { state, toggleTask } = useApp();
  const [expandedWeeks, setExpandedWeeks] = useState<Record<number, boolean>>({
    1: true,
    2: true,
    3: true
  });

  if (!state.roadmap || !state.user) {
    return (
      <div style={styles.emptyContainer}>
        <ShieldAlert size={48} color="#FF6B6B" />
        <h3>No Roadmap Loaded</h3>
        <p>Please complete the onboarding assessment first to generate your AI study plan.</p>
      </div>
    );
  }

  const toggleWeek = (w: number) => {
    setExpandedWeeks(prev => ({ ...prev, [w]: !prev[w] }));
  };

  // Calculate task statistics
  const totalTasks = state.roadmap.milestones.reduce((acc, m) => acc + m.tasks.length, 0);
  const completedCount = state.completedTasks.length;
  const progressPercent = Math.round((completedCount / totalTasks) * 100);

  return (
    <div style={styles.roadmapGrid}>
      {/* Left side: Timeline list */}
      <div style={styles.timelineCol}>
        <div style={styles.header}>
          <div style={styles.badge}>
            <Calendar size={12} color="#3B82F6" />
            <span>Interactive Syllabus</span>
          </div>
          <h2 style={styles.title}>Personal Study Timeline</h2>
          <p style={styles.subtext}>
            Your dynamic curriculum path is structured week-by-week. Click tasks as you finish them to update your Risk profile.
          </p>
        </div>

        <div style={styles.timelineList}>
          {state.roadmap.milestones.map((m) => {
            const isExpanded = !!expandedWeeks[m.week];
            const weekTasks = m.tasks;
            const completedInWeek = weekTasks.filter(t => state.completedTasks.includes(t)).length;
            const weekProgress = Math.round((completedInWeek / weekTasks.length) * 100);

            return (
              <div key={m.week} style={styles.weekCard}>
                <div onClick={() => toggleWeek(m.week)} style={styles.weekHeader}>
                  <div style={styles.weekMeta}>
                    <div style={styles.weekIndicator(weekProgress === 100)}>
                      Week {m.week}
                    </div>
                    <div>
                      <h4 style={styles.weekTitle}>{m.title}</h4>
                      <span style={styles.weekSub}>
                        {completedInWeek} of {weekTasks.length} objectives met ({weekProgress}%)
                      </span>
                    </div>
                  </div>
                  <button style={styles.collapseBtn}>
                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                </div>

                {isExpanded && (
                  <div style={styles.tasksList}>
                    {weekTasks.map((task, idx) => {
                      const isCompleted = state.completedTasks.includes(task);
                      return (
                        <div 
                          key={idx} 
                          onClick={() => toggleTask(task)}
                          style={styles.taskItem(isCompleted)}
                        >
                          <div style={styles.checkboxWrapper}>
                            {isCompleted ? (
                              <CheckCircle size={18} color="#10B981" fill="#10B981" />
                            ) : (
                              <Circle size={18} color="#A1A1AA" />
                            )}
                          </div>
                          <span style={styles.taskText(isCompleted)}>
                            {task}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Right side: Summary Details card */}
      <div style={styles.detailsCol}>
        <div style={styles.summaryCard}>
          <h3 style={styles.summaryTitle}>Roadmap Specs</h3>
          <p style={styles.summarySub}>Details compiled from your initial AI Skill DNA profile.</p>

          <div style={styles.specDivider} />

          <div style={styles.specRow}>
            <span style={styles.specLabel}>Career Goal:</span>
            <span style={styles.specVal}>{state.user.careerGoal}</span>
          </div>

          <div style={styles.specRow}>
            <span style={styles.specLabel}>Domain:</span>
            <span style={styles.specVal}>{state.roadmap.domain}</span>
          </div>

          <div style={styles.specRow}>
            <span style={styles.specLabel}>Difficulty Index:</span>
            <span style={styles.specVal}>{state.roadmap.difficulty} / 10</span>
          </div>

          <div style={styles.specRow}>
            <span style={styles.specLabel}>Study commitment:</span>
            <span style={styles.specVal}>{state.roadmap.weeklyHours}h / wk</span>
          </div>

          <div style={styles.specRow}>
            <span style={styles.specLabel}>Timeline weeks:</span>
            <span style={styles.specVal}>{state.roadmap.durationWeeks} Weeks</span>
          </div>

          <div style={styles.specDivider} />

          <div style={styles.progressSummary}>
            <div style={styles.progressLabelRow}>
              <span>Goal Progress</span>
              <span>{progressPercent}%</span>
            </div>
            <div style={styles.progressBarBg}>
              <div style={styles.progressBarFill(progressPercent)} />
            </div>
            <span style={styles.progressHelp}>
              {completedCount} task nodes checked off the timeline.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  roadmapGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 300px',
    gap: '2rem',
    '@media (max-width: 900px)': {
      gridTemplateColumns: '1fr',
    },
  },
  emptyContainer: {
    textAlign: 'center' as const,
    padding: '3rem',
    backgroundColor: '#FFFFFF',
    border: '1px solid #E4E4E7',
    borderRadius: '24px',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '1rem',
  },
  timelineCol: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '2rem',
  },
  header: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },
  badge: {
    alignSelf: 'flex-start',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: 'rgba(59, 130, 246, 0.08)',
    border: '1px solid rgba(59, 130, 246, 0.15)',
    padding: '4px 10px',
    borderRadius: '9999px',
    fontSize: '0.7rem',
    color: '#3B82F6',
    fontWeight: 700,
  },
  title: {
    fontSize: '1.75rem',
    fontWeight: 800,
    color: '#18181B',
    letterSpacing: '-0.02em',
  },
  subtext: {
    fontSize: '0.9rem',
    color: '#71717A',
  },
  timelineList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1.25rem',
  },
  weekCard: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E4E4E7',
    borderRadius: '20px',
    overflow: 'hidden',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02)',
  },
  weekHeader: {
    padding: '1.5rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
    backgroundColor: '#FFFFFF',
    transition: 'background-color 0.2s',
    '&:hover': {
      backgroundColor: '#FAFAF9',
    },
  },
  weekMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  weekIndicator: (completed: boolean) => ({
    backgroundColor: completed ? '#E6F4EA' : 'rgba(59, 130, 246, 0.08)',
    color: completed ? '#137333' : '#3B82F6',
    fontWeight: 800,
    fontSize: '0.75rem',
    padding: '4px 12px',
    borderRadius: '8px',
    textTransform: 'uppercase' as const,
  }),
  weekTitle: {
    fontSize: '0.95rem',
    fontWeight: 800,
    color: '#18181B',
  },
  weekSub: {
    fontSize: '0.75rem',
    color: '#71717A',
    fontWeight: 650,
  },
  collapseBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#71717A',
  },
  tasksList: {
    borderTop: '1px solid #E4E4E7',
    padding: '1rem 1.5rem',
    backgroundColor: '#FAFAF9',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px',
  },
  taskItem: (completed: boolean) => ({
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '12px',
    borderRadius: '10px',
    backgroundColor: completed ? '#F3F4F6' : '#FFFFFF',
    border: completed ? '1px dashed #E4E4E7' : '1px solid #E4E4E7',
    cursor: 'pointer',
    transition: 'all 0.15s',
    '&:hover': {
      borderColor: '#3B82F6',
      backgroundColor: completed ? '#F3F4F6' : 'rgba(59, 130, 246, 0.01)',
    },
  }),
  checkboxWrapper: {
    marginTop: '2px',
    flexShrink: 0,
  },
  taskText: (completed: boolean) => ({
    fontSize: '0.85rem',
    fontWeight: completed ? 500 : 700,
    color: completed ? '#71717A' : '#18181B',
    textDecoration: completed ? 'line-through' : 'none',
    lineHeight: 1.45,
  }),
  detailsCol: {
    display: 'flex',
    flexDirection: 'column' as const,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E4E4E7',
    borderRadius: '20px',
    padding: '2.0rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02)',
    position: 'sticky' as const,
    top: '7.5rem',
  },
  summaryTitle: {
    fontSize: '1.1rem',
    fontWeight: 800,
    color: '#18181B',
  },
  summarySub: {
    fontSize: '0.75rem',
    color: '#71717A',
    marginBottom: '1rem',
  },
  specDivider: {
    height: '1px',
    backgroundColor: '#E4E4E7',
    margin: '1.25rem 0',
  },
  specRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.8rem',
    margin: '8px 0',
    alignItems: 'center',
  },
  specLabel: {
    color: '#71717A',
    fontWeight: 650,
  },
  specVal: {
    color: '#18181B',
    fontWeight: 800,
    textAlign: 'right' as const,
  },
  progressSummary: {
    marginTop: '1.25rem',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },
  progressLabelRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.8rem',
    fontWeight: 750,
    color: '#18181B',
  },
  progressBarBg: {
    width: '100%',
    height: '6px',
    backgroundColor: '#E4E4E7',
    borderRadius: '9999px',
    overflow: 'hidden',
  },
  progressBarFill: (percent: number) => ({
    width: `${percent}%`,
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: '9999px',
  }),
  progressHelp: {
    fontSize: '0.7rem',
    color: '#A1A1AA',
    fontWeight: 600,
  },
};
