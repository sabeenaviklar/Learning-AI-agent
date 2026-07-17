import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, ArrowRight, RefreshCw, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';

export default function FeedbackLoop() {
  const [isSimulated, setIsSimulated] = useState(false);

  return (
    <div style={styles.outerContainer}>
      {/* Simulation Toggle Bar */}
      <div style={styles.simulationBar}>
        <div style={styles.simulationText}>
          <span style={styles.pulseBadge}>Simulation Trigger</span>
          <p style={styles.simLabel}>See what happens when a student scores <strong>42%</strong> on the 'Functions' quiz</p>
        </div>
        <button 
          style={isSimulated ? styles.simBtnReset : styles.simBtnActive}
          onClick={() => setIsSimulated(!isSimulated)}
        >
          <RefreshCw size={16} style={{ transform: isSimulated ? 'rotate(180deg)' : 'none', transition: 'transform 0.4s' }} />
          {isSimulated ? "Reset Simulation" : "Simulate Score (42%)"}
        </button>
      </div>

      <div style={styles.columnsGrid}>
        {/* Left Column: Traditional Platform */}
        <div style={styles.columnCard(false)}>
          <div style={styles.colHeader}>
            <span style={styles.colBadge(false)}>Traditional Rigid LMS</span>
            <h4 style={styles.colTitle}>The Dead End</h4>
          </div>

          <div style={styles.flowList}>
            {/* Step 1 */}
            <div style={styles.flowItem}>
              <div style={styles.scoreCircle('#EF4444')}>
                <span style={styles.scoreText}>42%</span>
              </div>
              <div>
                <span style={styles.flowTitle()}>Quiz Score: 42%</span>
                <p style={styles.flowDesc}>Quiz failed. Standard system blocks next module.</p>
              </div>
            </div>

            <div style={styles.flowArrow}><ArrowRight size={16} /></div>

            {/* Step 2 */}
            <div style={{
              ...styles.flowItem,
              opacity: isSimulated ? 1 : 0.4,
              transition: 'opacity 0.4s ease',
            }}>
              <div style={styles.actionIcon('#EF4444')}>
                <AlertCircle size={16} color="#EF4444" />
              </div>
              <div>
                <span style={styles.flowTitle()}>Rigid Retake Enforced</span>
                <p style={styles.flowDesc}>Instructs user to re-watch the same 2-hour lecture video.</p>
              </div>
            </div>

            <div style={styles.flowArrow}><ArrowRight size={16} /></div>

            {/* Step 3 */}
            <div style={{
              ...styles.flowItem,
              opacity: isSimulated ? 1 : 0.4,
              backgroundColor: isSimulated ? 'rgba(239, 68, 68, 0.03)' : '#FFFFFF',
              border: isSimulated ? '1px dashed #EF4444' : '1px solid rgba(228, 228, 231, 0.6)',
              transition: 'all 0.4s ease',
            }}>
              <div style={styles.actionIcon('#EF4444')}>
                <span>🛑</span>
              </div>
              <div>
                <span style={styles.flowTitle(isSimulated)}>Student Frustration</span>
                <p style={styles.flowDesc}>Repetitive material causes friction. 82% of students drop off here.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: LearningOS */}
        <div style={styles.columnCard(true)}>
          <div style={styles.colHeader}>
            <span style={styles.colBadge(true)}>LearningOS Engine</span>
            <h4 style={styles.colTitle}>The Adaptive Loop</h4>
          </div>

          <div style={styles.flowList}>
            {/* Step 1 */}
            <div style={styles.flowItem}>
              <div style={styles.scoreCircle('#3B82F6')}>
                <span style={styles.scoreText}>42%</span>
              </div>
              <div>
                <span style={styles.flowTitle()}>Quiz Score: 42%</span>
                <p style={styles.flowDesc}>System analyzes errors to locate exact knowledge gaps.</p>
              </div>
            </div>

            <div style={styles.flowArrow}><ArrowRight size={16} /></div>

            {/* Step 2 */}
            <div style={{
              ...styles.flowItem,
              opacity: isSimulated ? 1 : 0.4,
              backgroundColor: isSimulated ? 'rgba(59, 130, 246, 0.03)' : '#FFFFFF',
              border: isSimulated ? '1px solid rgba(59, 130, 246, 0.4)' : '1px solid rgba(228, 228, 231, 0.6)',
              transition: 'all 0.4s ease',
            }}>
              <div style={styles.actionIcon('#3B82F6')}>
                <Sparkles size={16} color="#3B82F6" />
              </div>
              <div>
                <div style={styles.titleRow}>
                  <span style={styles.flowTitle()}>Roadmap Auto-Adjusts</span>
                  {isSimulated && <span style={styles.pillActive}>Triggered</span>}
                </div>
                <p style={styles.flowDesc}>
                  {isSimulated 
                    ? "Detected struggle with 'Local Scope'. Injected a 10m interactive playground." 
                    : "Identifies struggle area and schedules targeted intervention."}
                </p>
                <AnimatePresence>
                  {isSimulated && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      style={styles.adaptiveActionBlock}
                    >
                      <ChevronRight size={12} color="#3B82F6" />
                      <span>Next Milestone shifted 1 day out.</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div style={styles.flowArrow}><ArrowRight size={16} /></div>

            {/* Step 3 */}
            <div style={{
              ...styles.flowItem,
              opacity: isSimulated ? 1 : 0.4,
              backgroundColor: isSimulated ? 'rgba(34, 197, 94, 0.04)' : '#FFFFFF',
              border: isSimulated ? '1px solid rgba(34, 197, 94, 0.4)' : '1px solid rgba(228, 228, 231, 0.6)',
              transition: 'all 0.4s ease',
            }}>
              <div style={styles.actionIcon('#22C55E')}>
                <CheckCircle2 size={16} color="#22C55E" />
              </div>
              <div>
                <span style={styles.flowTitle(isSimulated, '#22C55E')}>Goal Accomplished</span>
                <p style={styles.flowDesc}>
                  {isSimulated 
                    ? "User passes the adjusted review quiz at 90% and resumes the core path." 
                    : "Student fills the skill gaps without losing momentum."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  outerContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '2.5rem',
  },
  simulationBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    padding: '1.25rem 2rem',
    border: '1px solid var(--border-color)',
    boxShadow: 'var(--shadow-sm)',
    flexWrap: 'wrap' as const,
    gap: '1rem',
  },
  simulationText: {
    textAlign: 'left' as const,
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    flexWrap: 'wrap' as const,
  },
  pulseBadge: {
    fontSize: '0.75rem',
    fontWeight: 700,
    backgroundColor: 'rgba(59, 130, 246, 0.08)',
    color: '#3B82F6',
    padding: '4px 10px',
    borderRadius: '9999px',
    border: '1px solid rgba(59, 130, 246, 0.15)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.02em',
  },
  simLabel: {
    fontSize: '0.95rem',
    color: '#52525B',
    margin: 0,
  },
  simBtnActive: {
    backgroundColor: '#3B82F6',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '9999px',
    padding: '0.75rem 1.5rem',
    fontSize: '0.9rem',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.18)',
    transition: 'all 0.2s',
  },
  simBtnReset: {
    backgroundColor: '#18181B',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '9999px',
    padding: '0.75rem 1.5rem',
    fontSize: '0.9rem',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    boxShadow: '0 4px 12px rgba(24, 24, 27, 0.18)',
    transition: 'all 0.2s',
  },
  columnsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '2.5rem',
  },
  columnCard: (isSpecial: boolean) => ({
    backgroundColor: '#FFFFFF',
    borderRadius: '24px',
    padding: '2.5rem',
    border: isSpecial ? '2px solid #3B82F6' : '1px solid rgba(228, 228, 231, 0.6)',
    boxShadow: isSpecial ? 'var(--shadow-premium), var(--shadow-glow)' : 'var(--shadow-premium)',
    textAlign: 'left' as const,
    position: 'relative' as const,
  }),
  colHeader: {
    marginBottom: '2rem',
    borderBottom: '1px solid #F4F4F5',
    paddingBottom: '1.25rem',
  },
  colBadge: (isSpecial: boolean) => ({
    fontSize: '0.75rem',
    fontWeight: 700,
    backgroundColor: isSpecial ? 'rgba(59, 130, 246, 0.08)' : 'rgba(239, 68, 68, 0.08)',
    color: isSpecial ? '#3B82F6' : '#EF4444',
    padding: '4px 10px',
    borderRadius: '9999px',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.02em',
  }),
  colTitle: {
    fontSize: '1.35rem',
    fontWeight: 700,
    color: '#18181B',
    marginTop: '0.5rem',
  },
  flowList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
  },
  flowItem: {
    display: 'flex',
    gap: '1rem',
    padding: '1.25rem',
    borderRadius: '16px',
    border: '1px solid rgba(228, 228, 231, 0.6)',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
  },
  scoreCircle: (color: string) => ({
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: color,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#FFFFFF',
    fontWeight: 700,
    fontSize: '0.9rem',
    flexShrink: 0,
  }),
  scoreText: {
    fontSize: '0.85rem',
  },
  actionIcon: (color: string) => ({
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: `${color}0D`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    fontSize: '1rem',
  }),
  flowTitle: (isActive?: boolean, color = '#18181B') => ({
    fontSize: '0.95rem',
    fontWeight: 700,
    color: isActive ? color : '#18181B',
    display: 'block',
  }),
  flowDesc: {
    fontSize: '0.85rem',
    color: '#71717A',
    lineHeight: 1.4,
    marginTop: '2px',
  },
  titleRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  pillActive: {
    fontSize: '0.65rem',
    backgroundColor: '#3B82F6',
    color: '#FFF',
    padding: '2px 6px',
    borderRadius: '4px',
    fontWeight: 600,
  },
  adaptiveActionBlock: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.75rem',
    color: '#3B82F6',
    fontWeight: 600,
    backgroundColor: 'rgba(59, 130, 246, 0.08)',
    padding: '4px 8px',
    borderRadius: '6px',
    marginTop: '6px',
  },
  flowArrow: {
    display: 'flex',
    justifyContent: 'center',
    color: '#A1A1AA',
    transform: 'rotate(90deg)',
    margin: '-0.25rem 0',
  },
};
