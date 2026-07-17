import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, AlertTriangle, ArrowRight, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';

const STATIC_QUESTIONS = [
  {
    id: 1,
    q: "What is the time complexity to retrieve an item from a Python List by index (e.g. items[5])?",
    options: ["A) O(N)", "B) O(1)", "C) O(log N)", "D) O(N log N)"],
    ansIdx: 1,
    topic: 'Python Lists'
  },
  {
    id: 2,
    q: "Which of the following creates a new shallow copy of a list named `data`?",
    options: ["A) data.copy()", "B) list(data)", "C) data[:]", "D) All of the above"],
    ansIdx: 3,
    topic: 'Python Lists'
  },
  {
    id: 3,
    q: "What will print from this code snippet?\n\nnums = [1, 2, 3]\nnums.append([4])\nprint(len(nums))",
    options: ["A) 4", "B) 5", "C) TypeError", "D) 3"],
    ansIdx: 0,
    topic: 'Python Lists'
  }
];

export default function Quiz() {
  const { state, addQuizResult } = useApp();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [quizFinished, setQuizFinished] = useState(false);
  const [scorePercent, setScorePercent] = useState(0);
  const [showAdaptive, setShowAdaptive] = useState(false);

  const questions = STATIC_QUESTIONS;
  const currentQ = questions[currentIdx];
  const isCorrect = selectedOpt === currentQ.ansIdx;

  const handleSelect = (oIdx: number) => {
    if (showFeedback) return;
    setSelectedOpt(oIdx);
    setAnswers(prev => ({ ...prev, [currentQ.id]: oIdx }));
    setShowFeedback(true);
  };

  const handleNext = () => {
    setShowFeedback(false);
    setSelectedOpt(null);
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(p => p + 1);
    } else {
      let correct = 0;
      questions.forEach(q => { if (answers[q.id] === q.ansIdx) correct++; });
      const pct = Math.round((correct / questions.length) * 100);
      setScorePercent(pct);
      setQuizFinished(true);
      addQuizResult(currentQ.topic, pct, 100, pct < 50);
      if (pct < 50) setShowAdaptive(true);
    }
  };

  const reset = () => {
    setCurrentIdx(0);
    setSelectedOpt(null);
    setShowFeedback(false);
    setAnswers({});
    setQuizFinished(false);
    setShowAdaptive(false);
  };

  const optionBg = (oIdx: number) => {
    if (!showFeedback) return selectedOpt === oIdx ? 'rgba(99,102,241,0.1)' : 'rgba(255,255,255,0.02)';
    if (oIdx === currentQ.ansIdx) return 'rgba(16,185,129,0.1)';
    if (oIdx === selectedOpt) return 'rgba(244,63,94,0.08)';
    return 'rgba(255,255,255,0.02)';
  };
  const optionBorder = (oIdx: number) => {
    if (!showFeedback) return selectedOpt === oIdx ? 'rgba(99,102,241,0.5)' : 'rgba(255,255,255,0.07)';
    if (oIdx === currentQ.ansIdx) return 'rgba(16,185,129,0.5)';
    if (oIdx === selectedOpt) return 'rgba(244,63,94,0.4)';
    return 'rgba(255,255,255,0.05)';
  };
  const optionColor = (oIdx: number) => {
    if (!showFeedback) return selectedOpt === oIdx ? '#818CF8' : '#94A3B8';
    if (oIdx === currentQ.ansIdx) return '#10B981';
    if (oIdx === selectedOpt) return '#F43F5E';
    return '#64748B';
  };

  return (
    <div style={S.wrapper}>
      <AnimatePresence mode="wait">
        {!quizFinished ? (
          <motion.div key="quiz" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} style={S.card}>
            {/* Header */}
            <div style={S.cardHeader}>
              <div style={S.badge}>
                <Sparkles size={11} color="#818CF8" />
                <span>Adaptive Quiz Check-in</span>
              </div>
              <h3 style={S.title}>Concept Check: {currentQ.topic}</h3>
              <p style={S.subtext}>
                Goal context: <strong style={{ color: '#818CF8' }}>{state.user?.careerGoal || 'Software Engineering'}</strong>. 
                Answers update your risk profile.
              </p>
            </div>

            {/* Progress */}
            <div style={S.progressRow}>
              <span style={S.progressText}>Q{currentIdx + 1} of {questions.length}</span>
              <div style={S.progressTrack}>
                <div style={{ ...S.progressFill, width: `${((currentIdx + 1) / questions.length) * 100}%` }} />
              </div>
            </div>

            {/* Question */}
            <div style={S.questionBlock}>
              <p style={S.qText}>{currentQ.q}</p>
              <div style={S.optionsGrid}>
                {currentQ.options.map((opt, oIdx) => (
                  <button key={oIdx} onClick={() => handleSelect(oIdx)}
                    style={{
                      ...S.optBtn,
                      background: optionBg(oIdx),
                      border: `1px solid ${optionBorder(oIdx)}`,
                      color: optionColor(oIdx),
                    }}>
                    <span style={S.optLetter}>{String.fromCharCode(65 + oIdx)}</span>
                    <span>{opt.substring(3)}</span>
                    {showFeedback && oIdx === currentQ.ansIdx && <CheckCircle2 size={15} color="#10B981" style={{ marginLeft: 'auto' }} />}
                    {showFeedback && oIdx === selectedOpt && oIdx !== currentQ.ansIdx && <XCircle size={15} color="#F43F5E" style={{ marginLeft: 'auto' }} />}
                  </button>
                ))}
              </div>
            </div>

            {/* Feedback Banner */}
            {showFeedback && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                style={{ ...S.feedbackBanner, background: isCorrect ? 'rgba(16,185,129,0.08)' : 'rgba(244,63,94,0.08)', border: `1px solid ${isCorrect ? 'rgba(16,185,129,0.2)' : 'rgba(244,63,94,0.2)'}` }}>
                <span style={{ fontSize: '1.1rem' }}>{isCorrect ? '✅' : '❌'}</span>
                <div>
                  <p style={{ ...S.feedbackTitle, color: isCorrect ? '#10B981' : '#F43F5E' }}>
                    {isCorrect ? 'Correct!' : 'Incorrect'}
                  </p>
                  <p style={S.feedbackSub}>
                    {isCorrect ? 'Great understanding. Moving to next concept.' : `Correct answer: ${currentQ.options[currentQ.ansIdx]}`}
                  </p>
                </div>
              </motion.div>
            )}

            <button onClick={handleNext} disabled={selectedOpt === null} style={{ ...S.nextBtn, background: selectedOpt === null ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg, #6366F1, #8B5CF6)', color: selectedOpt === null ? '#334155' : '#fff', cursor: selectedOpt === null ? 'not-allowed' : 'pointer' }}>
              {currentIdx === questions.length - 1 ? 'Finish & Analyse' : 'Next Question'}
              <ArrowRight size={15} />
            </button>
          </motion.div>
        ) : showAdaptive ? (
          <motion.div key="adaptive" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={S.adaptiveCard}>
            <div style={S.resultCenter}>
              <AlertTriangle size={48} color="#F59E0B" />
              <h3 style={{ ...S.resultTitle, color: '#F59E0B' }}>AI Detected Knowledge Gap</h3>
              <span style={{ fontSize: '2.5rem', fontWeight: 900, color: '#F43F5E' }}>{scorePercent}%</span>
              <p style={S.resultSub}>
                Quiz results indicate difficulty in {currentQ.topic}. The orchestrator is recalculating your learning path now.
              </p>
            </div>

            <div style={S.adaptiveSteps}>
              <h4 style={S.adaptiveStepsTitle}>⚡ Roadmap Adjustments Applied</h4>
              {[
                { action: 'Detected', detail: `Weak area: ${currentQ.topic}`, color: '#F43F5E' },
                { action: 'Inserted', detail: 'Revision Session (targeted remedial block)', color: '#6366F1' },
                { action: 'Shifted', detail: 'Next milestone delayed +2 days', color: '#8B5CF6' },
                { action: 'Reduced', detail: 'Next week difficulty by 1 level', color: '#F59E0B' },
                { action: 'New Success Likelihood', detail: '87%', color: '#10B981' },
              ].map((step, i) => (
                <div key={i} style={S.adaptiveRow}>
                  <span style={S.adaptiveAction}>{step.action}</span>
                  <span style={{ ...S.adaptiveDetail, color: step.color }}>{step.detail}</span>
                </div>
              ))}
            </div>

            <div style={S.actionRow}>
              <button onClick={reset} style={S.secondaryBtn}>
                <RefreshCw size={14} /> Retake Quiz
              </button>
              <button onClick={() => setShowAdaptive(false)} style={S.primaryBtn}>
                Dismiss & Sync Roadmap <ArrowRight size={14} />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={S.card}>
            <div style={S.resultCenter}>
              <CheckCircle2 size={52} color="#10B981" />
              <h3 style={S.resultTitle}>Challenge Passed! 🎉</h3>
              <span style={{ fontSize: '2.8rem', fontWeight: 900, color: '#10B981' }}>{scorePercent}%</span>
              <p style={S.resultSub}>
                Excellent performance. Your risk profile remains LOW and downstream milestones are confirmed on schedule.
              </p>
            </div>
            <button onClick={reset} style={S.primaryBtn}>
              <RefreshCw size={14} /> Retake Quiz
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const S = {
  wrapper: {
    minHeight: '80vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem 1rem',
    maxWidth: '680px',
    margin: '0 auto',
    width: '100%',
  },
  card: {
    background: '#13131E',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: '20px',
    padding: '2.25rem',
    width: '100%',
    boxShadow: '0 20px 50px rgba(0,0,0,0.4)',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1.5rem',
  },
  adaptiveCard: {
    background: '#13131E',
    border: '1px solid rgba(245,158,11,0.2)',
    borderRadius: '20px',
    padding: '2.25rem',
    width: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1.75rem',
  },
  cardHeader: { display: 'flex', flexDirection: 'column' as const, gap: '6px' },
  badge: {
    alignSelf: 'flex-start' as const,
    display: 'inline-flex', alignItems: 'center', gap: '6px',
    background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)',
    borderRadius: '9999px', padding: '4px 12px',
    fontSize: '0.7rem', color: '#818CF8', fontWeight: 700,
  },
  title: { fontSize: '1.4rem', fontWeight: 800, color: '#F1F5F9' },
  subtext: { fontSize: '0.82rem', color: '#64748B', lineHeight: 1.5 },
  progressRow: { display: 'flex', alignItems: 'center', gap: '12px' },
  progressText: { fontSize: '0.72rem', color: '#64748B', fontWeight: 700, flexShrink: 0 },
  progressTrack: { flex: 1, height: '5px', background: 'rgba(255,255,255,0.06)', borderRadius: '9999px', overflow: 'hidden' },
  progressFill: { height: '100%', background: 'linear-gradient(90deg, #6366F1, #818CF8)', borderRadius: '9999px', transition: 'width 0.3s' },
  questionBlock: { display: 'flex', flexDirection: 'column' as const, gap: '1rem' },
  qText: { fontSize: '0.95rem', fontWeight: 700, color: '#F1F5F9', lineHeight: 1.5, whiteSpace: 'pre-line' as const },
  optionsGrid: { display: 'flex', flexDirection: 'column' as const, gap: '8px' },
  optBtn: {
    display: 'flex', alignItems: 'center', gap: '10px',
    textAlign: 'left' as const, padding: '12px 14px',
    borderRadius: '10px', cursor: 'pointer',
    fontSize: '0.85rem', fontWeight: 600,
    fontFamily: 'inherit', transition: 'all 0.15s',
    width: '100%',
  },
  optLetter: {
    width: '22px', height: '22px', borderRadius: '6px',
    background: 'rgba(255,255,255,0.06)', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    fontSize: '0.72rem', fontWeight: 800, flexShrink: 0,
  },
  feedbackBanner: {
    display: 'flex', alignItems: 'flex-start', gap: '10px',
    borderRadius: '12px', padding: '0.875rem 1rem',
  },
  feedbackTitle: { fontSize: '0.88rem', fontWeight: 800, marginBottom: '2px' },
  feedbackSub: { fontSize: '0.78rem', color: '#64748B', lineHeight: 1.45 },
  nextBtn: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
    border: 'none', borderRadius: '12px', padding: '13px',
    fontSize: '0.9rem', fontWeight: 700, fontFamily: 'inherit', transition: 'all 0.2s',
  },
  resultCenter: {
    display: 'flex', flexDirection: 'column' as const,
    alignItems: 'center', gap: '10px', textAlign: 'center' as const,
  },
  resultTitle: { fontSize: '1.5rem', fontWeight: 800, color: '#F1F5F9' },
  resultSub: { fontSize: '0.88rem', color: '#64748B', maxWidth: '400px', lineHeight: 1.55 },
  adaptiveSteps: {
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '14px', padding: '1.25rem',
    display: 'flex', flexDirection: 'column' as const, gap: '10px',
  },
  adaptiveStepsTitle: { fontSize: '0.85rem', fontWeight: 700, color: '#F1F5F9', marginBottom: '4px' },
  adaptiveRow: { display: 'flex', justifyContent: 'space-between', fontSize: '0.83rem', padding: '4px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' },
  adaptiveAction: { color: '#64748B', fontWeight: 600 },
  adaptiveDetail: { fontWeight: 800 },
  actionRow: { display: 'flex', gap: '10px', justifyContent: 'flex-end' },
  primaryBtn: {
    display: 'flex', alignItems: 'center', gap: '6px',
    background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
    color: '#fff', border: 'none', borderRadius: '10px',
    padding: '10px 20px', fontSize: '0.85rem', fontWeight: 700,
    cursor: 'pointer', fontFamily: 'inherit',
  },
  secondaryBtn: {
    display: 'flex', alignItems: 'center', gap: '6px',
    background: 'rgba(255,255,255,0.04)',
    color: '#94A3B8', border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '10px', padding: '10px 20px',
    fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
  },
};
