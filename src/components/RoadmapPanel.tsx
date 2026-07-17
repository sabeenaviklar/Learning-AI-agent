import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, GitCommit, Play, Sparkles, CheckCircle2 } from 'lucide-react';

interface RoadmapPanelProps {
  activeData: any | null;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  quizScore: number;
}

export default function RoadmapPanel({ activeData, riskLevel, quizScore }: RoadmapPanelProps) {
  const [isRescheduled, setIsRescheduled] = useState(false);
  const [showSuggestion, setShowSuggestion] = useState(false);

  // Show suggestion if risk becomes high or quiz score drops below 60
  useEffect(() => {
    if (riskLevel === 'HIGH' || quizScore < 60) {
      setShowSuggestion(true);
    } else {
      setShowSuggestion(false);
    }
  }, [riskLevel, quizScore]);

  // Reset rescheduling if activeData changes (user inputs new goal)
  useEffect(() => {
    setIsRescheduled(false);
  }, [activeData]);

  const handleAccept = () => {
    setIsRescheduled(true);
    setShowSuggestion(false);
  };

  const handleDecline = () => {
    setShowSuggestion(false);
  };

  const defaultRoadmap = [
    {
      week: 1,
      title: "Core Foundations & Setup",
      tasks: ["Initial workspace configurations", "Syntax checkout exercise", "Milestone 1 Core Quiz"]
    },
    {
      week: 2,
      title: "Active Core Module: Logic & Flow",
      tasks: ["Functions declaring scopes", "LEGB variable validation", "Week 2 Checkpoint Quiz"]
    },
    {
      week: 3,
      title: "Complex Systems & Data Handling",
      tasks: ["Resource loading parameters", "External API integrations", "Review base cases"]
    }
  ];

  const getUpdatedRoadmap = () => {
    if (!activeData) return defaultRoadmap;

    const skills = activeData.skills || ["Topic A", "Topic B", "Topic C"];

    // Default or Groq-provided roadmap
    const base = activeData.milestones ? JSON.parse(JSON.stringify(activeData.milestones)) : [
      {
        week: 1,
        title: `Introduction to ${activeData.domain || "Tech Topic"}`,
        tasks: [`Foundational concepts of ${skills[0] || "Basics"}`, `Variables and assignments`, "Basic practice task"]
      },
      {
        week: 2,
        title: `Core Study: ${skills[1] || "Logic"} & Functions`,
        tasks: [`Deep dive into ${skills[1] || "Logic"}`, `Scoping laws & declarations`, "Weekly milestone checkpoint"]
      },
      {
        week: 3,
        title: `Advanced Application: ${skills[2] || "Integration"}`,
        tasks: [`Implementing ${skills[2] || "Integration"} protocols`, `Building small prototype models`, "Final project blueprint"]
      }
    ];

    // If rescheduled, shift Week 2 tasks to Week 3 and inject a review session in Week 2!
    if (isRescheduled && base.length >= 3) {
      const originalWeek2Tasks = base[1].tasks;
      base[1] = {
        week: 2,
        title: "⚠️ AI Adjusted: Remedial Review & Calibration",
        tasks: [
          "✨ Injected: Scope & Closures 10-minute crash course",
          "✨ Injected: 5 Practice scenarios on variable bindings",
          `Postponed: ${originalWeek2Tasks[0] || 'Core study'} (shifted to Week 3)`
        ]
      };
      base[2] = {
        week: 3,
        title: `Dynamic Module: Advanced Scopes & ${base[2].title || 'Integration'}`,
        tasks: [
          `Completed: ${originalWeek2Tasks[0] || 'Core study'} review`,
          ...(base[2].tasks || [])
        ]
      };
    }

    return base;
  };

  const roadmapItems = getUpdatedRoadmap();

  return (
    <div className="console-card" style={styles.container}>
      <div style={styles.header}>
        <div style={styles.titleRow}>
          <Calendar size={16} color="#3B82F6" />
          <h4 style={styles.heading}>Adaptive Curriculum Roadmap</h4>
        </div>
        {isRescheduled && (
          <div style={styles.badgeSuccess}>✓ AI Optimized</div>
        )}
      </div>

      {/* AI Suggestion Card */}
      <AnimatePresence>
        {showSuggestion && !isRescheduled && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={styles.suggestionCard}
          >
            <div style={styles.suggestionHeader}>
              <Sparkles size={14} color="#B45309" />
              <span style={styles.suggestionTitle}>Orchestrator Suggestion (Confidence: 93%)</span>
            </div>
            <p style={styles.suggestionText}>
              High risk indicators detected. Shift core functions tasks and inject a custom **Scope & Closures Remedial Module**?
            </p>
            
            {/* Why? Explainability Panel */}
            <div style={styles.explainBox}>
              <strong style={styles.explainTitle}>Why? AI Explanation:</strong>
              <ul style={styles.explainList}>
                <li>• Quiz score below target (42%)</li>
                <li>• Functions scope concepts are prerequisite-heavy</li>
                <li>• Current weekly commitment is low (3h/week)</li>
              </ul>
            </div>

            <div style={styles.actionBtnRow}>
              <button onClick={handleDecline} style={styles.declineBtn}>Decline</button>
              <button onClick={handleAccept} style={styles.acceptBtn}>Accept Optimization</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Roadmap Timeline */}
      <div style={styles.timelineWrapper}>
        {roadmapItems.map((item, idx) => (
          <div key={idx} style={styles.weekCard}>
            <div style={styles.weekHeader}>
              <div style={styles.weekTitleRow}>
                <GitCommit size={14} color={isRescheduled && item.week === 2 ? "#FF6B6B" : "#3B82F6"} />
                <span style={{
                  ...styles.weekLabel,
                  color: isRescheduled && item.week === 2 ? "#FF6B6B" : "#18181B",
                }}>
                  Week {item.week}: {item.title}
                </span>
              </div>
              <span style={styles.durationBadge}>Est: 5 hrs</span>
            </div>

            <div style={styles.taskList}>
              {item.tasks.map((task, tIdx: number) => {
                const isInjected = task.includes('Injected:');
                const isPostponed = task.includes('Postponed:');
                return (
                  <motion.div 
                    layout
                    key={tIdx} 
                    style={{
                      ...styles.taskRow,
                      backgroundColor: isInjected ? 'rgba(34, 197, 94, 0.04)' : '#FFFFFF',
                      borderColor: isInjected ? 'rgba(34, 197, 94, 0.15)' : '#E4E4E7'
                    }}
                  >
                    <div style={styles.checkboxWrapper}>
                      {isInjected ? (
                        <Sparkles size={12} color="#22C55E" />
                      ) : (
                        <div style={styles.checkboxCircle} />
                      )}
                    </div>
                    <span style={{
                      ...styles.taskText,
                      color: isPostponed ? '#A1A1AA' : '#18181B',
                      textDecoration: isPostponed ? 'line-through' : 'none',
                      fontWeight: isInjected ? 600 : 500
                    }}>
                      {task}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Skills Knowledge Graph */}
      <div style={styles.graphCard}>
        <strong style={styles.graphCardTitle}>Skills Knowledge Graph:</strong>
        <div style={styles.graphNodes}>
          <div style={styles.graphNodeGroup}>
            <span style={styles.nodeLabelText}>{activeData ? activeData.domain : 'Python OS'}</span>
            <div style={styles.nodeBranchLine} />
          </div>
          <div style={styles.graphSubBranches}>
            <div style={styles.graphSubNode(true)}>
              ✓ {activeData?.skills?.[0] || 'Foundations'}
            </div>
            <div style={styles.graphSubNodeActive(isRescheduled)}>
              {isRescheduled 
                ? `✓ ${activeData?.skills?.[1] ? activeData.skills[1] + ' Check' : 'Scope Check'}` 
                : `→ ${activeData?.skills?.[1] || 'Functions'}`}
            </div>
            <div style={styles.graphSubNode(false)}>
              {activeData?.skills?.[2] || 'Variables'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '1.25rem',
    textAlign: 'left' as const,
    gap: '1rem',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #F4F4F5',
    paddingBottom: '0.75rem',
  },
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  heading: {
    fontSize: '0.95rem',
    fontWeight: 800,
    color: '#18181B',
  },
  badgeSuccess: {
    fontSize: '0.65rem',
    backgroundColor: '#D1FAE5',
    color: '#15803D',
    padding: '2px 8px',
    borderRadius: '4px',
    fontWeight: 700,
  },
  suggestionCard: {
    backgroundColor: '#FEF3C7',
    border: '1px solid #FCD34D',
    borderRadius: '12px',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.5rem',
  },
  suggestionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  suggestionTitle: {
    fontSize: '0.75rem',
    fontWeight: 700,
    color: '#B45309',
    textTransform: 'uppercase' as const,
  },
  suggestionText: {
    fontSize: '0.8rem',
    color: '#78350F',
    lineHeight: 1.4,
  },
  actionBtnRow: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '0.5rem',
    marginTop: '0.25rem',
  },
  declineBtn: {
    backgroundColor: 'transparent',
    border: '1px solid #F59E0B',
    color: '#B45309',
    borderRadius: '6px',
    padding: '4px 10px',
    fontSize: '0.75rem',
    fontWeight: 600,
    cursor: 'pointer',
  },
  acceptBtn: {
    backgroundColor: '#D97706',
    border: 'none',
    color: '#FFFFFF',
    borderRadius: '6px',
    padding: '4px 10px',
    fontSize: '0.75rem',
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: '0 2px 4px rgba(217, 119, 6, 0.2)',
  },
  timelineWrapper: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
  },
  weekCard: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.625rem',
  },
  weekHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FAFAF7',
    padding: '6px 10px',
    borderRadius: '8px',
  },
  weekTitleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  weekLabel: {
    fontSize: '0.8rem',
    fontWeight: 700,
  },
  durationBadge: {
    fontSize: '0.65rem',
    backgroundColor: '#E4E4E7',
    color: '#3F3F46',
    padding: '2px 6px',
    borderRadius: '4px',
    fontWeight: 600,
  },
  taskList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.5rem',
    paddingLeft: '1.25rem',
  },
  taskRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '0.5rem 0.75rem',
    borderRadius: '8px',
    border: '1px solid #E4E4E7',
    backgroundColor: '#FFFFFF',
    transition: 'all 0.2s',
  },
  checkboxWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  checkboxCircle: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    border: '1px solid #71717A',
  },
  taskText: {
    fontSize: '0.8rem',
  },
  explainBox: {
    backgroundColor: 'rgba(180, 83, 9, 0.05)',
    border: '1px dashed rgba(180, 83, 9, 0.2)',
    borderRadius: '8px',
    padding: '8px 12px',
    marginTop: '4px',
  },
  explainTitle: {
    fontSize: '0.75rem',
    color: '#B45309',
    fontWeight: 700,
    display: 'block',
    marginBottom: '2px',
  },
  explainList: {
    listStyleType: 'none',
    margin: 0,
    padding: 0,
    fontSize: '0.725rem',
    color: '#B45309',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '2px',
  },
  graphCard: {
    backgroundColor: '#FAFAF7',
    border: '1px solid #E4E4E7',
    borderRadius: '12px',
    padding: '0.875rem',
    marginTop: '1.25rem',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.75rem',
  },
  graphCardTitle: {
    fontSize: '0.75rem',
    fontWeight: 700,
    color: '#71717A',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.02em',
  },
  graphNodes: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  graphNodeGroup: {
    display: 'flex',
    alignItems: 'center',
  },
  nodeLabelText: {
    fontSize: '0.8rem',
    fontWeight: 700,
    backgroundColor: '#18181B',
    color: '#FFFFFF',
    padding: '4px 10px',
    borderRadius: '6px',
  },
  nodeBranchLine: {
    width: '20px',
    height: '2px',
    backgroundColor: '#E4E4E7',
  },
  graphSubBranches: {
    display: 'flex',
    gap: '0.5rem',
  },
  graphSubNode: (isDone: boolean) => ({
    fontSize: '0.75rem',
    fontWeight: 600,
    backgroundColor: isDone ? '#F0FDF4' : '#FFFFFF',
    color: isDone ? '#15803D' : '#71717A',
    border: `1.5px solid ${isDone ? '#22C55E' : '#E4E4E7'}`,
    padding: '3px 8px',
    borderRadius: '6px',
  }),
  graphSubNodeActive: (isDone: boolean) => ({
    fontSize: '0.75rem',
    fontWeight: 700,
    backgroundColor: isDone ? '#F0FDF4' : '#EFF6FF',
    color: isDone ? '#15803D' : '#3B82F6',
    border: `1.5px solid ${isDone ? '#22C55E' : '#3B82F6'}`,
    padding: '3px 8px',
    borderRadius: '6px',
    animation: isDone ? 'none' : 'pulse-glow 2s infinite',
  }),
};
