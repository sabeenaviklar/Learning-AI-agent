import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Terminal } from 'lucide-react';

const QUESTIONS = [
  {
    id: 1,
    category: 'Data Structures',
    title: 'Question 1: Explain Python Lists',
    text: 'What is a Python List? How does it differ from a Tuple, and when should you use one over the other?',
    placeholder: 'Type your explanation here. Example: A list is mutable whereas a tuple is immutable...'
  },
  {
    id: 2,
    category: 'Algorithms & Coding',
    title: 'Question 2: Write a Search Function',
    text: 'Write a short function (in Python, JavaScript, or pseudo-code) that takes a list/array of numbers and returns the sum of all even numbers.',
    placeholder: 'def sum_evens(nums):\n    # Write code here...'
  },
  {
    id: 3,
    category: 'Systems & Architecture',
    title: 'Question 3: Explain Object-Oriented Programming',
    text: 'Explain Object-Oriented Programming (OOP). What are its primary pillars (like encapsulation and inheritance) and what problems does it solve?',
    placeholder: 'OOP is a paradigm based on "objects" which can contain data and code. Encapsulation helps by...'
  }
];

export default function Assessment() {
  const navigate = useNavigate();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({
    1: '',
    2: '',
    3: ''
  });

  const handleAnswerChange = (val: string) => {
    setAnswers(prev => ({ ...prev, [QUESTIONS[currentIdx].id]: val }));
  };

  const handleNext = () => {
    if (currentIdx < QUESTIONS.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      // Save answers in session storage to be processed in AIAnalysis page
      sessionStorage.setItem('assessment_answers', JSON.stringify(answers));
      navigate('/ai-analysis');
    }
  };

  const handleBack = () => {
    if (currentIdx > 0) {
      setCurrentIdx(prev => prev - 1);
    } else {
      navigate('/onboarding');
    }
  };

  const currentQuestion = QUESTIONS[currentIdx];
  const progressPercent = ((currentIdx + 1) / QUESTIONS.length) * 100;

  return (
    <div style={styles.assessmentWrapper}>
      <div style={styles.headerArea}>
        <div style={styles.badge}>
          <Terminal size={12} color="#10B981" />
          <span>Llama-3 Agent Core Assessment</span>
        </div>
        <h2 style={styles.title}>AI Knowledge Assessment</h2>
        <p style={styles.subtext}>
          Instead of multiple-choice guessing, describe your understanding. Our LLM parses your vocabulary, logic, and code structure.
        </p>
      </div>

      <div style={styles.progressContainer}>
        <div style={styles.progressBarBg}>
          <div style={styles.progressBarFill(progressPercent)} />
        </div>
        <div style={styles.progressText}>
          <span>Question {currentIdx + 1} of {QUESTIONS.length}</span>
          <span>{Math.round(progressPercent)}% Done</span>
        </div>
      </div>

      <div style={styles.card}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            style={styles.questionPanel}
          >
            <div style={styles.questionMeta}>
              <span style={styles.categoryBadge}>{currentQuestion.category}</span>
              <h3 style={styles.questionTitle}>{currentQuestion.title}</h3>
            </div>
            
            <p style={styles.questionText}>{currentQuestion.text}</p>
            
            <div style={styles.editorArea}>
              <textarea
                value={answers[currentQuestion.id]}
                onChange={(e) => handleAnswerChange(e.target.value)}
                placeholder={currentQuestion.placeholder}
                style={styles.textarea}
              />
            </div>
          </motion.div>
        </AnimatePresence>

        <div style={styles.navRow}>
          <button onClick={handleBack} style={styles.btnSecondary}>
            <ArrowLeft size={16} />
            Back
          </button>
          
          <button 
            onClick={handleNext} 
            disabled={!answers[currentQuestion.id].trim()}
            style={styles.btnPrimary(!answers[currentQuestion.id].trim())}
          >
            {currentIdx === QUESTIONS.length - 1 ? 'Analyze Skill DNA' : 'Next Question'}
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  assessmentWrapper: {
    minHeight: '85vh',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem 1.5rem',
    gap: '2rem',
    maxWidth: '750px',
    margin: '0 auto',
  },
  headerArea: {
    textAlign: 'center' as const,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '8px',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    border: '1px solid rgba(16, 185, 129, 0.15)',
    padding: '4px 12px',
    borderRadius: '9999px',
    fontSize: '0.75rem',
    color: '#10B981',
    fontWeight: 700,
  },
  title: {
    fontSize: '2rem',
    fontWeight: 800,
    color: '#18181B',
    letterSpacing: '-0.02em',
  },
  subtext: {
    fontSize: '0.95rem',
    color: '#52525B',
    maxWidth: '550px',
    lineHeight: 1.5,
  },
  progressContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
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
    transition: 'width 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
  }),
  progressText: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.8rem',
    color: '#71717A',
    fontWeight: 600,
  },
  card: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E4E4E7',
    borderRadius: '24px',
    padding: '2.5rem',
    width: '100%',
    boxShadow: '0 15px 30px -10px rgba(24, 24, 27, 0.04)',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '2rem',
  },
  questionPanel: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1.25rem',
  },
  questionMeta: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '6px',
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(59, 130, 246, 0.06)',
    color: '#3B82F6',
    fontSize: '0.7rem',
    fontWeight: 700,
    padding: '2px 8px',
    borderRadius: '6px',
    textTransform: 'uppercase' as const,
  },
  questionTitle: {
    fontSize: '1.25rem',
    fontWeight: 800,
    color: '#18181B',
  },
  questionText: {
    fontSize: '0.95rem',
    color: '#52525B',
    lineHeight: 1.5,
  },
  editorArea: {
    borderRadius: '12px',
    overflow: 'hidden',
    border: '1px solid #E4E4E7',
  },
  textarea: {
    width: '100%',
    height: '180px',
    padding: '1.25rem',
    fontFamily: 'monospace',
    fontSize: '0.9rem',
    color: '#18181B',
    backgroundColor: '#FAFAF9',
    border: 'none',
    outline: 'none',
    resize: 'none' as const,
    lineHeight: 1.5,
    '&::placeholder': {
      color: '#A1A1AA',
    },
  },
  navRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '1rem',
  },
  btnPrimary: (disabled: boolean) => ({
    backgroundColor: disabled ? '#A1A1AA' : '#18181B',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '12px',
    padding: '0.75rem 1.5rem',
    fontSize: '0.9rem',
    fontWeight: 700,
    cursor: disabled ? 'not-allowed' : 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'all 0.2s',
  }),
  btnSecondary: {
    backgroundColor: '#FFFFFF',
    color: '#52525B',
    border: '1px solid #E4E4E7',
    borderRadius: '12px',
    padding: '0.75rem 1.5rem',
    fontSize: '0.9rem',
    fontWeight: 700,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'all 0.2s',
  },
};
