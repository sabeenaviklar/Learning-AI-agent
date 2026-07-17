import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { GitBranch, Compass, Calendar, BookOpen, Layers, CheckCircle } from 'lucide-react';

interface PlanningAgentProps {
  activeData: any | null;
}

export default function PlanningAgent({ activeData }: PlanningAgentProps) {
  const [activeStep, setActiveStep] = useState(-1);

  const steps = [
    { label: "Parse Goal Intent", icon: <Compass size={18} /> },
    { label: "Extract Core Skills", icon: <Layers size={18} /> },
    { label: "Calibrate Duration", icon: <Calendar size={18} /> },
    { label: "Index Resources", icon: <BookOpen size={18} /> },
    { label: "Assemble Roadmap", icon: <CheckCircle size={18} /> },
  ];

  useEffect(() => {
    if (activeData) {
      setActiveStep(0);
      const timers = [
        setTimeout(() => setActiveStep(1), 800),
        setTimeout(() => setActiveStep(2), 1600),
        setTimeout(() => setActiveStep(3), 2400),
        setTimeout(() => setActiveStep(4), 3200),
      ];

      return () => timers.forEach(clearTimeout);
    } else {
      setActiveStep(-1);
    }
  }, [activeData]);

  return (
    <div style={styles.container} className="card">
      <div style={styles.header}>
        <div style={styles.titleWrapper}>
          <div style={styles.avatar}>
            <GitBranch size={16} color="#22C55E" />
          </div>
          <div>
            <h4 style={styles.heading}>Curriculum Planning</h4>
            <p style={styles.sub}>Adaptive Roadmap Generator</p>
          </div>
        </div>
      </div>

      <div style={styles.graphContainer}>
        {steps.map((step, idx) => {
          const isActive = idx === activeStep;
          const isCompleted = idx < activeStep;
          const isPending = idx > activeStep;

          return (
            <div key={idx} style={styles.nodeWrapper}>
              {/* Connector Line */}
              {idx > 0 && (
                <div style={styles.connectorContainer}>
                  <div 
                    style={{
                      ...styles.connectorLine,
                      backgroundColor: isCompleted || isActive ? '#22C55E' : '#E4E4E7',
                      backgroundImage: isActive 
                        ? 'linear-gradient(90deg, #22C55E 0%, #3B82F6 100%)' 
                        : 'none',
                    }} 
                  />
                </div>
              )}

              {/* Node Card */}
              <motion.div
                animate={isActive ? { scale: 1.05 } : { scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                className={isActive ? "glowing-node" : ""}
                style={{
                  ...styles.nodeCard,
                  borderColor: isActive 
                    ? '#22C55E' 
                    : isCompleted 
                    ? '#D1FAE5' 
                    : '#E4E4E7',
                  backgroundColor: isActive 
                    ? '#F0FDF4' 
                    : isCompleted 
                    ? '#F0FDF4' 
                    : '#FFFFFF',
                  opacity: isPending ? 0.5 : 1,
                }}
              >
                <div 
                  style={{
                    ...styles.iconWrapper,
                    backgroundColor: isActive 
                      ? '#22C55E' 
                      : isCompleted 
                      ? '#D1FAE5' 
                      : '#F4F4F5',
                    color: isActive 
                      ? '#FFFFFF' 
                      : isCompleted 
                      ? '#15803D' 
                      : '#71717A',
                  }}
                >
                  {step.icon}
                </div>
                <div style={styles.labelWrapper}>
                  <span style={styles.nodeStepNum}>Step {idx + 1}</span>
                  <span style={styles.nodeLabel}>{step.label}</span>
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>

      {activeData && activeStep === 4 && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={styles.doneBanner}
        >
          <span style={styles.doneText}>✓ Course roadmap structured successfully based on Groq analysis metrics.</span>
        </motion.div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '1.75rem',
    textAlign: 'left' as const,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1.5rem',
  },
  header: {
    borderBottom: '1px solid #F4F4F5',
    paddingBottom: '1rem',
  },
  titleWrapper: {
    display: 'flex',
    gap: '0.75rem',
    alignItems: 'center',
  },
  avatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: 'rgba(34, 197, 94, 0.08)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid rgba(34, 197, 94, 0.15)',
  },
  heading: {
    fontSize: '1rem',
    fontWeight: 700,
    color: '#18181B',
  },
  sub: {
    fontSize: '0.75rem',
    color: '#71717A',
  },
  graphContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1.25rem',
    position: 'relative' as const,
  },
  nodeWrapper: {
    display: 'flex',
    flexDirection: 'column' as const,
    position: 'relative' as const,
  },
  connectorContainer: {
    position: 'absolute' as const,
    left: '20px',
    top: '-1.25rem',
    height: '1.25rem',
    width: '3px',
    display: 'flex',
    alignItems: 'center',
  },
  connectorLine: {
    width: '100%',
    height: '100%',
    transition: 'all 0.4s ease',
  },
  nodeCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '0.875rem 1.25rem',
    borderRadius: '16px',
    border: '1.5px solid #E4E4E7',
    transition: 'all 0.3s ease',
  },
  iconWrapper: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'all 0.3s ease',
  },
  labelWrapper: {
    display: 'flex',
    flexDirection: 'column' as const,
  },
  nodeStepNum: {
    fontSize: '0.65rem',
    fontWeight: 700,
    color: '#71717A',
    textTransform: 'uppercase' as const,
  },
  nodeLabel: {
    fontSize: '0.9rem',
    fontWeight: 700,
    color: '#18181B',
  },
  doneBanner: {
    backgroundColor: 'rgba(34, 197, 94, 0.08)',
    border: '1px solid rgba(34, 197, 94, 0.15)',
    borderRadius: '12px',
    padding: '0.75rem 1rem',
    textAlign: 'center' as const,
  },
  doneText: {
    fontSize: '0.8rem',
    color: '#15803D',
    fontWeight: 600,
  },
};
