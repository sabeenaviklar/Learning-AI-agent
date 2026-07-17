import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Lock, ChevronDown, ChevronUp, Play, BookOpen, Clock } from 'lucide-react';

interface Milestone {
  week: string;
  title: string;
  desc: string;
  status: 'completed' | 'active' | 'locked';
  topics: string[];
  duration: string;
}

const milestonesData: Milestone[] = [
  {
    week: "Week 1",
    title: "Python Basics",
    desc: "Syntax, data types, logic conditions, and lists.",
    status: 'completed',
    topics: ["Variables & Basic Operators", "Control Flow (If/Else)", "Lists and List Operations", "For & While Loops"],
    duration: "6 hours",
  },
  {
    week: "Week 2",
    title: "Writing Functions",
    desc: "Reusability, scope, arguments, and nested functions.",
    status: 'active',
    topics: ["Function Definition & Parameters", "Global vs Local Scope", "Default & Keyword Arguments", "Introduction to Closures"],
    duration: "8 hours",
  },
  {
    week: "Week 3",
    title: "Mini Project",
    desc: "Putting concepts together by building a text adventure engine.",
    status: 'locked',
    topics: ["Project Setup & Plan", "User Input Parsing", "State Management Logic", "Writing Robust Test Scenarios"],
    duration: "10 hours",
  },
  {
    week: "Week 4",
    title: "Portfolio Ready",
    desc: "Deploying your code, writing READMEs, and Git setups.",
    status: 'locked',
    topics: ["Writing Clean Pythonic Code", "Structuring a Python Project", "GitHub Uploading", "Documenting with Markdown"],
    duration: "5 hours",
  },
];

export default function Roadmap() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(1); // default expand Week 2

  const toggleExpand = (index: number) => {
    if (expandedIndex === index) {
      setExpandedIndex(null);
    } else {
      setExpandedIndex(index);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.timelineLine}>
        {/* Fill colored track representing the progress made */}
        <div style={styles.timelineLineFill} />
      </div>

      <div style={styles.milestonesList}>
        {milestonesData.map((milestone, idx) => {
          const isCompleted = milestone.status === 'completed';
          const isActive = milestone.status === 'active';
          const isLocked = milestone.status === 'locked';
          const isExpanded = expandedIndex === idx;

          return (
            <div key={idx} style={styles.milestoneRow}>
              {/* Timeline Indicator Badge */}
              <div style={styles.nodeColumn}>
                {isCompleted && (
                  <div style={styles.completedNode}>
                    <Check size={16} color="#FFF" />
                  </div>
                )}
                {isActive && (
                  <div className="glowing-node" style={styles.activeNode}>
                    <div style={styles.activeNodeCenter} />
                  </div>
                )}
                {isLocked && (
                  <div style={styles.lockedNode}>
                    <Lock size={14} color="#A1A1AA" />
                  </div>
                )}
              </div>

              {/* Card content */}
              <div 
                style={{
                  ...styles.cardWrapper,
                  border: isActive 
                    ? '1.5px solid #3B82F6' 
                    : '1px solid rgba(228, 228, 231, 0.6)',
                  boxShadow: isActive ? 'var(--shadow-glow), var(--shadow-md)' : 'var(--shadow-sm)',
                }}
              >
                <div style={styles.cardHeader} onClick={() => toggleExpand(idx)}>
                  <div style={styles.cardInfo}>
                    <span style={styles.weekBadge(milestone.status)}>{milestone.week}</span>
                    <h4 style={styles.titleText}>{milestone.title}</h4>
                    <p style={styles.descText}>{milestone.desc}</p>
                  </div>
                  <button style={styles.expandBtn}>
                    {isExpanded ? <ChevronUp size={18} color="#71717A" /> : <ChevronDown size={18} color="#71717A" />}
                  </button>
                </div>

                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      style={styles.expandedContent}
                    >
                      <div style={styles.expandedMeta}>
                        <span style={styles.metaLabel}><BookOpen size={13} /> {milestone.topics.length} topics</span>
                        <span style={styles.metaLabel}><Clock size={13} /> {milestone.duration}</span>
                      </div>
                      <ul style={styles.topicsList}>
                        {milestone.topics.map((topic, tIdx) => (
                          <li key={tIdx} style={styles.topicItem}>
                            <span style={styles.topicBullet(milestone.status)} />
                            <span>{topic}</span>
                          </li>
                        ))}
                      </ul>
                      {isActive && (
                        <div style={styles.actionRow}>
                          <button style={styles.startBtn}>
                            <Play size={13} fill="#fff" /> Start Current Lesson
                          </button>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  container: {
    position: 'relative' as const,
    paddingLeft: '2.5rem',
    width: '100%',
    maxWidth: '580px',
    margin: '0 auto',
  },
  timelineLine: {
    position: 'absolute' as const,
    left: '12px',
    top: '1.5rem',
    bottom: '1.5rem',
    width: '3px',
    backgroundColor: '#E4E4E7',
    borderRadius: '1.5px',
    zIndex: 1,
  },
  timelineLineFill: {
    height: '45%', // Matches completed and current week position
    width: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: '1.5px',
  },
  milestonesList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '2rem',
    position: 'relative' as const,
    zIndex: 2,
  },
  milestoneRow: {
    display: 'flex',
    gap: '1.5rem',
    alignItems: 'flex-start',
  },
  nodeColumn: {
    width: '28px',
    height: '28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  completedNode: {
    width: '26px',
    height: '26px',
    borderRadius: '50%',
    backgroundColor: '#22C55E',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeNode: {
    width: '26px',
    height: '26px',
    borderRadius: '50%',
    backgroundColor: '#FFFFFF',
    border: '3.5px solid #3B82F6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  activeNodeCenter: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#3B82F6',
  },
  lockedNode: {
    width: '26px',
    height: '26px',
    borderRadius: '50%',
    backgroundColor: '#FFFFFF',
    border: '2px solid #E4E4E7',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardWrapper: {
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: '18px',
    padding: '1.25rem',
    textAlign: 'left' as const,
    transition: 'all 0.3s ease',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    cursor: 'pointer',
  },
  cardInfo: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.4rem',
    paddingRight: '1rem',
  },
  weekBadge: (status: string) => {
    let bg = '#F4F4F5';
    let color = '#71717A';
    if (status === 'completed') {
      bg = 'rgba(34, 197, 94, 0.08)';
      color = '#22C55E';
    } else if (status === 'active') {
      bg = 'rgba(59, 130, 246, 0.08)';
      color = '#3B82F6';
    }
    return {
      alignSelf: 'flex-start' as const,
      fontSize: '0.7rem',
      fontWeight: 700,
      textTransform: 'uppercase' as const,
      padding: '2px 8px',
      borderRadius: '9999px',
      backgroundColor: bg,
      color: color,
    };
  },
  titleText: {
    fontSize: '1rem',
    fontWeight: 700,
    color: '#18181B',
  },
  descText: {
    fontSize: '0.85rem',
    color: '#71717A',
    lineHeight: 1.4,
  },
  expandBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    transition: 'background-color 0.2s',
  },
  expandedContent: {
    borderTop: '1px solid #F4F4F5',
    marginTop: '0.875rem',
    paddingTop: '0.875rem',
    overflow: 'hidden',
  },
  expandedMeta: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '0.75rem',
  },
  metaLabel: {
    fontSize: '0.75rem',
    color: '#71717A',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    fontWeight: 500,
  },
  topicsList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.5rem',
  },
  topicItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.8rem',
    color: '#18181B',
  },
  topicBullet: (status: string) => {
    let bg = '#D4D4D8';
    if (status === 'completed') bg = '#22C55E';
    else if (status === 'active') bg = '#3B82F6';
    return {
      width: '6px',
      height: '6px',
      borderRadius: '50%',
      backgroundColor: bg,
      flexShrink: 0,
    };
  },
  actionRow: {
    marginTop: '1rem',
    display: 'flex',
    justifyContent: 'flex-start',
  },
  startBtn: {
    backgroundColor: '#3B82F6',
    color: '#FFF',
    border: 'none',
    borderRadius: '8px',
    padding: '6px 12px',
    fontSize: '0.75rem',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)',
  },
};
