import { useState, useEffect } from 'react';
import { Sparkles, Terminal, Play, RotateCcw } from 'lucide-react';

interface IntentAgentProps {
  onParsed: (data: {
    domain: string;
    goal: string;
    difficulty: number;
    durationWeeks: number;
    weeklyHours: number;
    successProbability: number;
    skills: string[];
  }) => void;
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

export default function IntentAgent({ onParsed }: IntentAgentProps) {
  const [goalText, setGoalText] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [lines, setLines] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(0);

  const startParsing = (presetIndex?: number) => {
    if (isRunning) return;

    let selectedPreset = PRESETS[0];
    if (presetIndex !== undefined) {
      selectedPreset = PRESETS[presetIndex];
      setGoalText(selectedPreset.text);
    } else {
      // Find matching preset or default
      const matched = PRESETS.find(p => p.text.toLowerCase().includes(goalText.toLowerCase()));
      if (matched) {
        selectedPreset = matched;
      } else {
        selectedPreset = {
          text: goalText || "Custom Goal",
          domain: "General Tech Skill",
          difficulty: 5,
          durationWeeks: 6,
          weeklyHours: 6,
          successProbability: 80,
          skills: ["Foundational Syntax", "Problem Solving", "Core Concepts"]
        };
      }
    }

    setIsRunning(true);
    setLines([]);
    setCurrentStep(0);

    const logs = [
      `[SYSTEM] Initializing Intent Agent v2.4 (Groq Llama-3)...`,
      `[AGENT] Parsing raw goal text: "${selectedPreset.text}"`,
      `[AGENT] Running entity extraction...`,
      `[AGENT] ➔ Domain Detected: ${selectedPreset.domain}`,
      `[AGENT] ➔ Difficulty Index: ${selectedPreset.difficulty}/10`,
      `[AGENT] ➔ Timeline Estimated: ${selectedPreset.durationWeeks} Weeks`,
      `[AGENT] ➔ Target Study Hours: ${selectedPreset.weeklyHours}h/week`,
      `[AGENT] ➔ Success Probability: ${selectedPreset.successProbability}%`,
      `[AGENT] Skill Gap Analysis: Found ${selectedPreset.skills.length} core competencies to study.`,
      `[SYSTEM] Intent Agent finished. Triggering Planning Agent...`
    ];

    let currentLogIndex = 0;
    const interval = setInterval(() => {
      if (currentLogIndex < logs.length) {
        const nextLine = logs[currentLogIndex];
        if (nextLine) {
          setLines(prev => [...prev, nextLine]);
        }
        currentLogIndex++;
      }
      if (currentLogIndex >= logs.length) {
        clearInterval(interval);
        setTimeout(() => {
          if (onParsed) {
            onParsed(selectedPreset);
          }
          setIsRunning(false);
        }, 800);
      }
    }, 450);
  };

  const handleReset = () => {
    setGoalText('');
    setLines([]);
    setIsRunning(false);
  };

  return (
    <div style={styles.container} className="card">
      <div style={styles.header}>
        <div style={styles.titleWrapper}>
          <div style={styles.avatar}>
            <Sparkles size={16} color="#3B82F6" />
          </div>
          <div>
            <h4 style={styles.heading}>Agent 1: Intent Agent</h4>
            <p style={styles.sub}>Goal Intake & Parser Console</p>
          </div>
        </div>
      </div>

      {/* Input Group */}
      <div style={styles.inputGroup}>
        <label style={styles.label}>What do you want to learn?</label>
        <div style={styles.inputRow}>
          <input
            type="text"
            disabled={isRunning}
            placeholder="e.g. Learn Python Web Development, crack AWS..."
            value={goalText}
            onChange={(e) => setGoalText(e.target.value)}
            style={styles.input}
          />
          {goalText || lines.length > 0 ? (
            <button onClick={handleReset} style={styles.resetBtn} disabled={isRunning}>
              <RotateCcw size={16} />
            </button>
          ) : null}
          <button 
            disabled={isRunning || !goalText.trim()} 
            onClick={() => startParsing()} 
            style={isRunning || !goalText.trim() ? styles.btnDisabled : styles.btnActive}
          >
            <Play size={14} fill="#fff" /> Parse Goal
          </button>
        </div>
      </div>

      {/* Presets */}
      <div style={styles.presetsWrapper}>
        <span style={styles.presetsLabel}>Or choose a preset:</span>
        <div style={styles.presets}>
          {PRESETS.map((preset, idx) => (
            <button
              key={idx}
              disabled={isRunning}
              onClick={() => startParsing(idx)}
              style={styles.presetBtn}
            >
              {preset.text}
            </button>
          ))}
        </div>
      </div>

      {/* Terminal Display */}
      {lines.length > 0 && (
        <div className="terminal-card" style={styles.terminal}>
          <div className="terminal-header">
            <div className="terminal-dots">
              <span className="terminal-dot terminal-dot-red" />
              <span className="terminal-dot terminal-dot-yellow" />
              <span className="terminal-dot terminal-dot-green" />
            </div>
            <span className="terminal-title">Agent Log Output</span>
            <Terminal size={14} color="#71717A" />
          </div>
          <div className="terminal-body" style={styles.terminalBody}>
            {lines.map((line, idx) => {
              if (!line) return null;
              const isSuccess = line.includes('✓') || line.includes('Finished') || line.includes('➔');
              const isSystem = line.includes('[SYSTEM]');
              return (
                <div key={idx} className="terminal-line">
                  <span className="terminal-prompt">&gt;</span>
                  <span 
                    style={{
                      color: isSystem ? '#FACC15' : isSuccess ? '#22C55E' : '#E4E4E7',
                      fontWeight: isSuccess ? 600 : 400,
                    }}
                  >
                    {line}
                  </span>
                </div>
              );
            })}
            {isRunning && (
              <div className="terminal-line">
                <span className="terminal-prompt">&gt;</span>
                <span className="typing-cursor" style={{ color: '#3B82F6' }}>Thinking...</span>
              </div>
            )}
          </div>
        </div>
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
    gap: '1.25rem',
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
    backgroundColor: 'rgba(59, 130, 246, 0.08)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid rgba(59, 130, 246, 0.15)',
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
  inputGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.5rem',
  },
  label: {
    fontSize: '0.8rem',
    fontWeight: 700,
    color: '#71717A',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.02em',
  },
  inputRow: {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center',
  },
  input: {
    flexGrow: 1,
    padding: '0.75rem 1rem',
    borderRadius: '12px',
    border: '1px solid #E4E4E7',
    fontSize: '0.9rem',
    outline: 'none',
    backgroundColor: '#FAFAF7',
    fontFamily: 'var(--font-sans)',
  },
  btnActive: {
    backgroundColor: '#3B82F6',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '12px',
    padding: '0.75rem 1.25rem',
    fontWeight: 600,
    fontSize: '0.9rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    boxShadow: '0 4px 10px rgba(59, 130, 246, 0.15)',
    transition: 'all 0.2s',
  },
  btnDisabled: {
    backgroundColor: '#F4F4F5',
    color: '#A1A1AA',
    border: 'none',
    borderRadius: '12px',
    padding: '0.75rem 1.25rem',
    fontWeight: 600,
    fontSize: '0.9rem',
    cursor: 'not-allowed',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  resetBtn: {
    background: 'none',
    border: '1px solid #E4E4E7',
    borderRadius: '12px',
    padding: '0.75rem',
    cursor: 'pointer',
    color: '#71717A',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  presetsWrapper: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.4rem',
  },
  presetsLabel: {
    fontSize: '0.75rem',
    color: '#71717A',
    fontWeight: 600,
  },
  presets: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '0.5rem',
  },
  presetBtn: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E4E4E7',
    borderRadius: '9999px',
    padding: '4px 12px',
    fontSize: '0.75rem',
    color: '#18181B',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontWeight: 500,
    boxShadow: 'var(--shadow-sm)',
  },
  terminal: {
    marginTop: '0.5rem',
  },
  terminalBody: {
    maxHeight: '180px',
  },
};
