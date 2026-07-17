import { useState } from 'react';
import { Smile, Sparkles, Send, Check } from 'lucide-react';

interface ReflectionAgentProps {
  onReflect: (data: { mood: string; confusion: string }) => void;
}

export default function ReflectionAgent({ onReflect }: ReflectionAgentProps) {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [confusionText, setConfusionText] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const moods = [
    { emoji: "😀", label: "Easy", val: "easy" },
    { emoji: "😐", label: "Moderate", val: "moderate" },
    { emoji: "😞", label: "Difficult", val: "hard" }
  ];

  const handleSubmit = () => {
    if (!selectedMood) return;
    setSubmitted(true);
    onReflect({
      mood: selectedMood,
      confusion: confusionText
    });
    setTimeout(() => {
      setSubmitted(false);
      setSelectedMood(null);
      setConfusionText('');
    }, 4000);
  };

  return (
    <div style={styles.container} className="card">
      <div style={styles.header}>
        <div style={styles.titleWrapper}>
          <div style={styles.avatar}>
            <Smile size={16} color="#FACC15" />
          </div>
          <div>
            <h4 style={styles.heading}>Cognitive Reflection</h4>
            <p style={styles.sub}>Performance Reflection</p>
          </div>
        </div>
      </div>

      {!submitted ? (
        <div style={styles.body}>
          <label style={styles.label}>How difficult was today's session?</label>
          <div style={styles.moodRow}>
            {moods.map((m, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedMood(m.val)}
                style={{
                  ...styles.moodBtn,
                  borderColor: selectedMood === m.val ? '#3B82F6' : '#E4E4E7',
                  backgroundColor: selectedMood === m.val ? '#EFF6FF' : '#FFFFFF',
                  transform: selectedMood === m.val ? 'scale(1.05)' : 'scale(1)',
                }}
              >
                <span style={styles.emoji}>{m.emoji}</span>
                <span style={styles.moodLabel}>{m.label}</span>
              </button>
            ))}
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>What confused you the most? (Optional)</label>
            <textarea
              placeholder="e.g. Variable scope closures, passing parameters..."
              value={confusionText}
              onChange={(e) => setConfusionText(e.target.value)}
              style={styles.textarea}
              rows={2}
            />
          </div>

          <button
            disabled={!selectedMood}
            onClick={handleSubmit}
            style={selectedMood ? styles.submitBtnActive : styles.submitBtnDisabled}
          >
            <Send size={14} /> Submit Daily Reflection
          </button>
        </div>
      ) : (
        <div style={styles.successState}>
          <div style={styles.successIcon}>
            <Check size={20} color="#15803D" />
          </div>
          <h5 style={styles.successHeading}>Reflection Processed</h5>
          <p style={styles.successDesc}>
            Groq Planner Agent updated: Next session duration has been calibrated based on your feedback.
          </p>
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
    backgroundColor: 'rgba(250, 204, 21, 0.08)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid rgba(250, 204, 21, 0.15)',
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
  body: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1.25rem',
  },
  label: {
    fontSize: '0.8rem',
    fontWeight: 700,
    color: '#71717A',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.02em',
  },
  moodRow: {
    display: 'flex',
    gap: '0.75rem',
  },
  moodBtn: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '4px',
    padding: '0.75rem',
    borderRadius: '12px',
    border: '1px solid #E4E4E7',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    outline: 'none',
  },
  emoji: {
    fontSize: '1.5rem',
  },
  moodLabel: {
    fontSize: '0.75rem',
    fontWeight: 600,
    color: '#52525B',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.4rem',
  },
  textarea: {
    width: '100%',
    padding: '0.75rem',
    borderRadius: '12px',
    border: '1px solid #E4E4E7',
    fontSize: '0.875rem',
    outline: 'none',
    backgroundColor: '#FAFAF7',
    resize: 'none' as const,
    fontFamily: 'var(--font-sans)',
  },
  submitBtnActive: {
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
    justifyContent: 'center',
    gap: '6px',
    boxShadow: '0 4px 10px rgba(59, 130, 246, 0.15)',
    transition: 'all 0.2s',
  },
  submitBtnDisabled: {
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
    justifyContent: 'center',
    gap: '6px',
  },
  successState: {
    padding: '2rem 1rem',
    textAlign: 'center' as const,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.75rem',
  },
  successIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: 'rgba(34, 197, 94, 0.08)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid rgba(34, 197, 94, 0.15)',
  },
  successHeading: {
    fontSize: '1rem',
    fontWeight: 700,
    color: '#18181B',
  },
  successDesc: {
    fontSize: '0.8rem',
    color: '#71717A',
    lineHeight: 1.4,
    maxWidth: '280px',
  },
};
