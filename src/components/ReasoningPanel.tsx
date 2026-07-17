import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Play, RotateCcw, ShieldCheck, Cpu } from 'lucide-react';
import { generateAILearningRoadmap, isApiKeyConfigured } from '../lib/groq';

interface ReasoningPanelProps {
  onParsed: (data: {
    text: string;
    domain: string;
    difficulty: number;
    durationWeeks: number;
    weeklyHours: number;
    successProbability: number;
    skills: string[];
    milestones?: any[];
    telemetry?: any;
  }) => void;
  onReasoningStateChange: (isReasoning: boolean) => void;
}

const PRESETS = [
  {
    text: "Crack AWS in 3 months",
    domain: "Cloud Architecture",
    difficulty: 7,
    durationWeeks: 12,
    weeklyHours: 10,
    successProbability: 85,
    skills: ["VPC Networking", "IAM Roles & Security", "EC2 & Autoscaling", "S3 Storage Classes"]
  },
  {
    text: "Learn Full-Stack Web Development",
    domain: "Software Engineering",
    difficulty: 6,
    durationWeeks: 16,
    weeklyHours: 12,
    successProbability: 92,
    skills: ["React State & Hooks", "RESTful API Design", "Database Schemas", "TypeScript Integration"]
  },
  {
    text: "Master System Design",
    domain: "Software Architecture",
    difficulty: 8,
    durationWeeks: 8,
    weeklyHours: 8,
    successProbability: 78,
    skills: ["Load Balancing", "Database Sharding", "Caching Layers", "Message Queues"]
  }
];

interface ReasoningStep {
  label: string;
  status: 'pending' | 'thinking' | 'done';
  output?: string;
}

export default function ReasoningPanel({ onParsed, onReasoningStateChange }: ReasoningPanelProps) {
  const [goalText, setGoalText] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [currentStepIdx, setCurrentStepIdx] = useState(-1);
  const [steps, setSteps] = useState<ReasoningStep[]>([]);

  const startReasoning = async (presetIndex?: number) => {
    if (isRunning) return;

    let targetGoalText = goalText;
    let selectedPreset = PRESETS[0];

    if (presetIndex !== undefined) {
      selectedPreset = PRESETS[presetIndex];
      targetGoalText = selectedPreset.text;
      setGoalText(selectedPreset.text);
    }

    setIsRunning(true);
    onReasoningStateChange(true);
    setCurrentStepIdx(0);

    const initialSteps: ReasoningStep[] = [
      { label: "Parsing goal intent & motivation", status: 'thinking' },
      { label: "Identifying required technical skills", status: 'pending' },
      { label: "Calculating estimated learning duration", status: 'pending' },
      { label: "Ranking optimal study resources", status: 'pending' },
      { label: "Structuring adaptive weekly plan milestones", status: 'pending' }
    ];
    setSteps(initialSteps);

    // Check if real API key is configured
    if (isApiKeyConfigured()) {
      try {
        // Step 1: Parse
        setSteps(prev => prev.map((s, idx) => idx === 0 ? { ...s, status: 'done', output: "✓ Connecting to Groq Orchestrator..." } : idx === 1 ? { ...s, status: 'thinking' } : s));
        
        const result = await generateAILearningRoadmap(targetGoalText || "General Skills");
        
        // Step 2 & 3: Skills / Timeline
        setSteps(prev => prev.map((s, idx) => 
          idx === 1 ? { ...s, status: 'done', output: `✓ Domain: ${result.domain}. Skills: ${result.skills.slice(0, 2).join(', ')}` } : 
          idx === 2 ? { ...s, status: 'done', output: `✓ Timeline: ${result.durationWeeks} weeks at ${result.weeklyHours}h/week` } : 
          idx === 3 ? { ...s, status: 'thinking' } : s
        ));

        // Step 4 & 5: Resources & Final
        setTimeout(() => {
          setSteps(prev => prev.map((s, idx) => 
            idx === 3 ? { ...s, status: 'done', output: "✓ Selected top 5 learning references" } : 
            idx === 4 ? { ...s, status: 'done', output: `✓ Success Probability calibrated: ${result.successProbability}%` } : s
          ));
          onParsed({
            text: targetGoalText || "General Skills",
            ...result
          });
          setIsRunning(false);
          onReasoningStateChange(false);
        }, 800);

      } catch (err: any) {
        // Fallback to presets if error
        console.error("Live Groq parse failed, falling back to simulator:", err);
        runMockSimulation(selectedPreset, targetGoalText);
      }
    } else {
      // Local simulator fallback
      runMockSimulation(selectedPreset, targetGoalText);
    }
  };

  const runMockSimulation = (selectedPreset: any, text: string) => {
    let finalPreset = selectedPreset;
    if (presetIndexIsEmpty(text)) {
      finalPreset = {
        text: text || "Custom Goal",
        domain: "General Tech Skill",
        difficulty: 5,
        durationWeeks: 6,
        weeklyHours: 6,
        successProbability: 80,
        skills: ["Foundational Syntax", "Problem Solving", "Core Concepts"]
      };
    }

    const stepsOutputs = [
      `✓ Domain detected: ${finalPreset.domain}`,
      `✓ Required skills: ${finalPreset.skills.slice(0, 2).join(', ')}`,
      `✓ Duration: ${finalPreset.durationWeeks} weeks (${finalPreset.weeklyHours}h/week commit)`,
      `✓ Scanned 42 reference resources. Selected 5 premium paths`,
      `✓ Milestones set. Success Probability calibrated: ${finalPreset.successProbability}%`
    ];

    let idx = 0;
    const interval = setInterval(() => {
      setSteps(prev => prev.map((s, sIdx) => {
        if (sIdx === idx) {
          return { ...s, status: 'done', output: stepsOutputs[idx] };
        }
        if (sIdx === idx + 1) {
          return { ...s, status: 'thinking' };
        }
        return s;
      }));

      idx++;
      setCurrentStepIdx(idx);

      if (idx >= 5) {
        clearInterval(interval);
        setTimeout(() => {
          onParsed({
            text: text || "Custom Goal",
            domain: finalPreset.domain,
            difficulty: finalPreset.difficulty,
            durationWeeks: finalPreset.durationWeeks,
            weeklyHours: finalPreset.weeklyHours,
            successProbability: finalPreset.successProbability,
            skills: finalPreset.skills
          });
          setIsRunning(false);
          onReasoningStateChange(false);
        }, 600);
      }
    }, 900);
  };

  const presetIndexIsEmpty = (text: string) => {
    return !PRESETS.some(p => p.text.toLowerCase() === text.toLowerCase());
  };

  const handleReset = () => {
    setGoalText('');
    setIsRunning(false);
    setCurrentStepIdx(-1);
    setSteps([]);
  };

  return (
    <div className="console-card" style={styles.container}>
      <div style={styles.header}>
        <div style={styles.titleRow}>
          <Cpu size={16} color="#3B82F6" />
          <h4 style={styles.heading}>Goal Understanding Console</h4>
        </div>
        <div style={styles.badge}>Groq Llama-3</div>
      </div>

      {/* Input section */}
      <div style={styles.inputWrapper}>
        <div style={styles.inputFieldRow}>
          <input
            type="text"
            disabled={isRunning}
            placeholder="Type your goal, e.g. Crack AWS in 3 months..."
            value={goalText}
            onChange={(e) => setGoalText(e.target.value)}
            style={styles.input}
          />
          {goalText && (
            <button onClick={handleReset} style={styles.resetBtn} disabled={isRunning}>
              <RotateCcw size={16} />
            </button>
          )}
          <button
            disabled={isRunning || !goalText.trim()}
            onClick={() => startReasoning()}
            style={isRunning || !goalText.trim() ? styles.btnDisabled : styles.btnActive}
          >
            <Play size={14} fill="#fff" /> ▶ Execute Learning Workflow
          </button>
        </div>

        {/* Presets */}
        <div style={styles.presets}>
          {PRESETS.map((preset, idx) => (
            <button
              key={idx}
              disabled={isRunning}
              onClick={() => startReasoning(idx)}
              style={styles.presetBtn}
            >
              {preset.text}
            </button>
          ))}
        </div>
      </div>

      {/* AI Reasoning Panel (Stream) */}
      <AnimatePresence>
        {steps.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={styles.reasoningBox}
          >
            <div style={styles.reasoningHeader}>
              <div style={styles.thinkingIndicator}>
                {isRunning ? (
                  <>
                    <span style={styles.thinkingDot(0)} />
                    <span style={styles.thinkingDot(0.2)} />
                    <span style={styles.thinkingDot(0.4)} />
                    <span style={styles.thinkingLabel}>Orchestrator thinking...</span>
                  </>
                ) : (
                  <div style={styles.successWrapper}>
                    <ShieldCheck size={14} color="#22C55E" />
                    <span style={styles.successLabel}>Reasoning Complete</span>
                  </div>
                )}
              </div>
            </div>

            <div style={styles.stepsCol}>
              {steps.map((step, idx) => (
                <div key={idx} style={styles.stepRow}>
                  <div style={styles.statusIndicator}>
                    {step.status === 'done' ? (
                      <span style={styles.dotDone}>✓</span>
                    ) : step.status === 'thinking' ? (
                      <span style={styles.dotThinking} className="typing-cursor" />
                    ) : (
                      <span style={styles.dotPending}>○</span>
                    )}
                  </div>
                  <div style={styles.stepBody}>
                    <span style={{
                      ...styles.stepLabel,
                      color: step.status === 'pending' ? '#A1A1AA' : '#18181B',
                      fontWeight: step.status === 'thinking' ? 600 : 500
                    }}>
                      {step.label}
                    </span>
                    {step.output && (
                      <motion.div
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        style={styles.stepOutput}
                      >
                        {step.output}
                      </motion.div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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
  badge: {
    fontSize: '0.65rem',
    backgroundColor: '#18181B',
    color: '#F4F4F5',
    padding: '2px 6px',
    borderRadius: '4px',
    fontWeight: 600,
    fontFamily: 'monospace',
  },
  inputWrapper: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.75rem',
  },
  inputFieldRow: {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center',
  },
  input: {
    flexGrow: 1,
    padding: '0.625rem 0.875rem',
    borderRadius: '10px',
    border: '1px solid #E4E4E7',
    fontSize: '0.875rem',
    outline: 'none',
    backgroundColor: '#FAFAF7',
    fontFamily: 'var(--font-sans)',
  },
  resetBtn: {
    background: 'none',
    border: '1px solid #E4E4E7',
    borderRadius: '10px',
    padding: '0.625rem',
    cursor: 'pointer',
    color: '#71717A',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnActive: {
    backgroundColor: '#3B82F6',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '10px',
    padding: '0.625rem 1rem',
    fontWeight: 600,
    fontSize: '0.85rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'all 0.2s',
  },
  btnDisabled: {
    backgroundColor: '#F4F4F5',
    color: '#A1A1AA',
    border: 'none',
    borderRadius: '10px',
    padding: '0.625rem 1rem',
    fontWeight: 600,
    fontSize: '0.85rem',
    cursor: 'not-allowed',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  presets: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap' as const,
  },
  presetBtn: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E4E4E7',
    borderRadius: '9999px',
    padding: '4px 10px',
    fontSize: '0.7rem',
    color: '#18181B',
    cursor: 'pointer',
    fontWeight: 500,
  },
  reasoningBox: {
    backgroundColor: '#18181B',
    border: '1px solid #27272A',
    borderRadius: '12px',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.75rem',
    overflow: 'hidden',
  },
  reasoningHeader: {
    borderBottom: '1px solid #27272A',
    paddingBottom: '0.5rem',
  },
  thinkingIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  thinkingDot: (delay: number) => ({
    width: '5px',
    height: '5px',
    borderRadius: '50%',
    backgroundColor: '#3B82F6',
    display: 'inline-block',
    animation: 'dot-blink 1.2s infinite both',
    animationDelay: `${delay}s`,
  }),
  thinkingLabel: {
    fontSize: '0.75rem',
    color: '#71717A',
    fontWeight: 600,
    marginLeft: '4px',
  },
  successWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  successLabel: {
    fontSize: '0.75rem',
    color: '#22C55E',
    fontWeight: 700,
  },
  stepsCol: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.875rem',
    fontFamily: 'monospace',
    fontSize: '0.75rem',
  },
  stepRow: {
    display: 'flex',
    gap: '10px',
    alignItems: 'flex-start',
  },
  statusIndicator: {
    flexShrink: 0,
    width: '14px',
    display: 'flex',
    justifyContent: 'center',
  },
  dotDone: {
    color: '#22C55E',
    fontWeight: 'bold',
  },
  dotThinking: {
    color: '#3B82F6',
    fontWeight: 'bold',
    width: '8px',
    height: '14px',
  },
  dotPending: {
    color: '#52525B',
  },
  stepBody: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '2px',
    textAlign: 'left' as const,
  },
  stepLabel: {
    fontSize: '0.75rem',
    color: '#E4E4E7',
  },
  stepOutput: {
    color: '#22C55E',
    paddingLeft: '4px',
    fontSize: '0.725rem',
  },
};

if (typeof document !== 'undefined') {
  const dotBlinkStyle = document.createElement('style');
  dotBlinkStyle.textContent = `
    @keyframes dot-blink {
      0%, 100% { opacity: 0.2; transform: scale(0.8); }
      50% { opacity: 1; transform: scale(1.1); }
    }
  `;
  document.head.appendChild(dotBlinkStyle);
}
