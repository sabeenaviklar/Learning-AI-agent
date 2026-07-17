import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, BookOpen, Clock, AlertTriangle, 
  ShieldCheck, Flame, Compass
} from 'lucide-react';
import { useApp, type AssessmentResult } from '../context/AppContext';
import { evaluateSkillAssessment, generateAILearningRoadmap, isApiKeyConfigured } from '../lib/groq';

const LOG_MESSAGES = [
  { text: 'Starting LLM evaluation container...', duration: 800 },
  { text: 'Analyzing response structures for Question 1...', duration: 1000 },
  { text: 'Evaluating algorithmic efficiency for Question 2...', duration: 1000 },
  { text: 'Parsing conceptual understanding of systems for Question 3...', duration: 1000 },
  { text: 'Comparing candidate skill set against global benchmarks...', duration: 800 },
  { text: 'Assembling Learning DNA profile...', duration: 900 },
  { text: 'Compiling personalized week-by-week curriculum...', duration: 1100 },
  { text: 'Synthesizing adaptive difficulty configurations...', duration: 800 },
  { text: 'Done! Visualizing final results.', duration: 500 }
];

export default function AIAnalysis() {
  const navigate = useNavigate();
  const { state, completeOnboarding } = useApp();
  const [logs, setLogs] = useState<string[]>([]);
  const [currentLogIdx, setCurrentLogIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [analyzing, setAnalyzing] = useState(true);
  const [apiWarning, setApiWarning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Result state
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);
  const [roadmapResult, setRoadmapResult] = useState<any | null>(null);

  // Trigger evaluation
  useEffect(() => {
    let active = true;
    const runAnalysis = async () => {
      const storedAnswers = sessionStorage.getItem('assessment_answers');
      if (!storedAnswers || !state.user) {
        setError('No assessment answers or profile data found. Please restart.');
        setAnalyzing(false);
        return;
      }

      const answersObj = JSON.parse(storedAnswers);
      const concatenatedAnswers = `
        [Question 1: Lists] ${answersObj[1]}
        [Question 2: Evens Sum] ${answersObj[2]}
        [Question 3: OOP] ${answersObj[3]}
      `;

      try {
        let assessment: AssessmentResult;
        let roadmap: any;

        if (isApiKeyConfigured()) {
          // Call real Groq APIs
          const evalRes = await evaluateSkillAssessment(
            state.user.name,
            state.user.style,
            state.user.careerGoal,
            concatenatedAnswers
          );

          assessment = {
            assessedLevel: evalRes.assessedLevel,
            strengths: evalRes.strengths,
            weaknesses: evalRes.weaknesses,
            learningStyle: evalRes.learningStyle,
            estimatedWeeks: evalRes.estimatedWeeks,
            successProbability: evalRes.successProbability,
            roadmapRecommendation: evalRes.roadmapRecommendation,
            learningDNA: `DNA-${evalRes.assessedLevel.substring(0,3).toUpperCase()}-${state.user.style.toUpperCase()}-${Math.floor(Math.random() * 900 + 100)}`
          };

          const roadmapRes = await generateAILearningRoadmap(
            `Personalized ${assessment.roadmapRecommendation} roadmap for ${state.user.name} at ${assessment.assessedLevel} level, optimized for a ${state.user.style} style.`
          );

          roadmap = {
            domain: roadmapRes.domain,
            difficulty: roadmapRes.difficulty,
            durationWeeks: roadmapRes.durationWeeks,
            weeklyHours: roadmapRes.weeklyHours,
            successProbability: roadmapRes.successProbability,
            skills: roadmapRes.skills,
            milestones: roadmapRes.milestones
          };
        } else {
          // Mock data fallbacks for quick demo
          setApiWarning(true);
          await new Promise(r => setTimeout(r, 1500)); // Simulate latency
          
          const level = state.user.currentExperience || 'Intermediate';
          assessment = {
            assessedLevel: level,
            strengths: [
              level === 'Beginner' ? 'Excellent determination' : 'Familiar with arrays & syntax',
              'Clear explanation structure'
            ],
            weaknesses: [
              'Needs deep practice with algorithmic efficiency',
              'Slightly unclear scope management'
            ],
            learningStyle: state.user.style || 'Projects',
            estimatedWeeks: state.user.deadline === '1 Month' ? 4 : state.user.deadline === '3 Months' ? 12 : 24,
            successProbability: level === 'Advanced' ? 94 : level === 'Intermediate' ? 86 : 74,
            roadmapRecommendation: state.user.careerGoal || 'AI Engineer',
            learningDNA: `DNA-${level.substring(0,3).toUpperCase()}-${(state.user.style || 'Mixed').toUpperCase()}-${Math.floor(Math.random() * 900 + 100)}`
          };

          roadmap = {
            domain: state.user.careerGoal || 'AI Engineering',
            difficulty: level === 'Advanced' ? 8 : level === 'Intermediate' ? 5 : 3,
            durationWeeks: assessment.estimatedWeeks,
            weeklyHours: state.user.studyHours || 4,
            successProbability: assessment.successProbability,
            skills: ['Core Syntax', 'Algorithms', 'Integration Practice', 'Real-world Capstone'],
            milestones: [
              {
                week: 1,
                title: 'Phase 1: Foundations & Architecture Setup',
                tasks: ['Set up development sandbox and workspace tools', 'Implement basic structures and variable binders', 'Verify knowledge via first code challenge']
              },
              {
                week: 2,
                title: 'Phase 2: Core Algorithm Integrations',
                tasks: ['Develop modular class blueprints with encapsulation', 'Perform efficiency analysis and space complexity audits', 'Integrate third-party API models']
              },
              {
                week: 3,
                title: 'Phase 3: Production Builds & Capstone',
                tasks: ['Deploy project schemas with persistent data storage', 'Trigger error exception handlers and recovery scripts', 'Perform full assessment final project review']
              }
            ]
          };
        }

        if (active) {
          setAssessmentResult(assessment);
          setRoadmapResult(roadmap);
        }
      } catch (err: any) {
        console.error(err);
        if (active) {
          setError(err.message || 'An error occurred during evaluation.');
          setAnalyzing(false);
        }
      }
    };

    runAnalysis();
    return () => { active = false; };
  }, []);

  // Simulate progress bar and logs sequence
  useEffect(() => {
    if (error) return;

    if (currentLogIdx < LOG_MESSAGES.length) {
      const currentLog = LOG_MESSAGES[currentLogIdx];
      const timer = setTimeout(() => {
        setLogs(prev => [...prev, currentLog.text]);
        setCurrentLogIdx(prev => prev + 1);
        setProgress(Math.round(((currentLogIdx + 1) / LOG_MESSAGES.length) * 100));
      }, currentLog.duration);
      return () => clearTimeout(timer);
    } else {
      // Finished analysis logs
      if (assessmentResult && roadmapResult) {
        setAnalyzing(false);
      }
    }
  }, [currentLogIdx, assessmentResult, roadmapResult, error]);

  const handleLaunch = () => {
    if (state.user && assessmentResult && roadmapResult) {
      completeOnboarding(state.user, assessmentResult, roadmapResult);
      navigate('/dashboard');
    }
  };

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.errorCard}>
          <AlertTriangle size={48} color="#FF6B6B" />
          <h3 style={styles.errorTitle}>Analysis Interrupted</h3>
          <p style={styles.errorText}>{error}</p>
          <button onClick={() => navigate('/onboarding')} style={styles.retryBtn}>
            Restart Onboarding
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <AnimatePresence mode="wait">
        {analyzing ? (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={styles.loadingPane}
          >
            <div style={styles.consoleCard}>
              <div style={styles.consoleHeader}>
                <div style={styles.dotRow}>
                  <span style={styles.dot('#FF5F56')} />
                  <span style={styles.dot('#FFBD2E')} />
                  <span style={styles.dot('#27C93F')} />
                </div>
                <span style={styles.consoleTitle}>learningos_orchestrator.sh</span>
              </div>
              
              <div style={styles.consoleBody}>
                {logs.map((log, index) => (
                  <div key={index} style={styles.logLine}>
                    <span style={styles.promptSign}>$</span> {log}
                    {index === logs.length - 1 && currentLogIdx < LOG_MESSAGES.length && (
                      <span className="typing-cursor" />
                    )}
                  </div>
                ))}
              </div>

              <div style={styles.progressRow}>
                <div style={styles.progressBg}>
                  <div style={styles.progressFill(progress)} />
                </div>
                <span style={styles.progressNum}>{progress}%</span>
              </div>
            </div>
            <p style={styles.loadingSub}>Compiling answers against LLM assessment parameters...</p>
          </motion.div>
        ) : (
          <motion.div
            key="profile"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            style={styles.profilePane}
          >
            {apiWarning && (
              <div style={styles.warningBanner}>
                <AlertTriangle size={18} />
                <span>
                  <strong>Note:</strong> Groq API key is not configured. Displaying pre-compiled educational DNA fallbacks for demo purposes. Configure key in <strong>Settings</strong>.
                </span>
              </div>
            )}

            <div style={styles.profileCard}>
              <div style={styles.profileHeader}>
                <div>
                  <div style={styles.badge}>
                    <Sparkles size={12} color="#FFFFFF" fill="#FFFFFF" />
                    <span>Learning DNA Synthesized</span>
                  </div>
                  <h2 style={styles.profileName}>{state.user?.name}'s Assessment DNA</h2>
                  <span style={styles.dnaString}>SYS-ID: {assessmentResult?.learningDNA}</span>
                </div>
                
                <div style={styles.levelCard}>
                  <span style={styles.levelLabel}>ASSESSED LEVEL</span>
                  <span style={styles.levelVal}>{assessmentResult?.assessedLevel}</span>
                </div>
              </div>

              <div style={styles.profileGrid}>
                {/* Stats Columns */}
                <div style={styles.statsColumn}>
                  <div style={styles.statBox}>
                    <BookOpen size={20} color="#3B82F6" />
                    <div>
                      <span style={styles.statLabel}>Learning Style</span>
                      <span style={styles.statVal}>{assessmentResult?.learningStyle}</span>
                    </div>
                  </div>

                  <div style={styles.statBox}>
                    <Clock size={20} color="#10B981" />
                    <div>
                      <span style={styles.statLabel}>Estimated Duration</span>
                      <span style={styles.statVal}>{assessmentResult?.estimatedWeeks} Weeks</span>
                    </div>
                  </div>

                  <div style={styles.statBox}>
                    <Flame size={20} color="#FF6B6B" />
                    <div>
                      <span style={styles.statLabel}>Success Probability</span>
                      <span style={styles.statVal}>{assessmentResult?.successProbability}%</span>
                    </div>
                  </div>

                  <div style={styles.statBox}>
                    <Compass size={20} color="#8B5CF6" />
                    <div>
                      <span style={styles.statLabel}>Roadmap Track</span>
                      <span style={styles.statVal}>{assessmentResult?.roadmapRecommendation}</span>
                    </div>
                  </div>
                </div>

                {/* Feedback Panel */}
                <div style={styles.feedbackPanel}>
                  <div style={styles.feedbackBlock}>
                    <h4 style={styles.feedbackTitle('#10B981')}>✓ Key Strengths</h4>
                    <ul style={styles.list}>
                      {assessmentResult?.strengths.map((s, i) => (
                        <li key={i} style={styles.listItem}>{s}</li>
                      ))}
                    </ul>
                  </div>

                  <div style={styles.feedbackBlock}>
                    <h4 style={styles.feedbackTitle('#FF6B6B')}>⚠ Identified Gaps</h4>
                    <ul style={styles.list}>
                      {assessmentResult?.weaknesses.map((w, i) => (
                        <li key={i} style={styles.listItem}>{w}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div style={styles.actionRow}>
                <div style={styles.securityCheck}>
                  <ShieldCheck size={16} color="#10B981" />
                  <span>Verified by LearningOS Reasoner</span>
                </div>
                <button onClick={handleLaunch} style={styles.launchBtn}>
                  Deploy Personalized Dashboard
                  <Compass size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '85vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem 1.5rem',
    maxWidth: '850px',
    margin: '0 auto',
  },
  loadingPane: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '1.5rem',
  },
  consoleCard: {
    width: '100%',
    backgroundColor: '#1E1E1E',
    borderRadius: '16px',
    border: '1px solid #333333',
    overflow: 'hidden',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  },
  consoleHeader: {
    backgroundColor: '#2D2D2D',
    padding: '10px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid #3A3A3A',
  },
  dotRow: {
    display: 'flex',
    gap: '6px',
  },
  dot: (color: string) => ({
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    backgroundColor: color,
  }),
  consoleTitle: {
    color: '#A6A6A6',
    fontSize: '0.75rem',
    fontFamily: 'monospace',
  },
  consoleBody: {
    padding: '1.5rem',
    height: '240px',
    overflowY: 'auto' as const,
    fontFamily: 'monospace',
    fontSize: '0.85rem',
    color: '#E0E0E0',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '6px',
  },
  logLine: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  promptSign: {
    color: '#10B981',
  },
  progressRow: {
    padding: '1rem 1.5rem',
    backgroundColor: '#181818',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    borderTop: '1px solid #2D2D2D',
  },
  progressBg: {
    flex: 1,
    height: '4px',
    backgroundColor: '#333333',
    borderRadius: '9999px',
    overflow: 'hidden',
  },
  progressFill: (percent: number) => ({
    width: `${percent}%`,
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: '9999px',
    transition: 'width 0.3s ease',
  }),
  progressNum: {
    color: '#3B82F6',
    fontSize: '0.8rem',
    fontWeight: 700,
    fontFamily: 'monospace',
  },
  loadingSub: {
    fontSize: '0.85rem',
    color: '#71717A',
  },
  errorCard: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E4E4E7',
    borderRadius: '24px',
    padding: '3rem',
    textAlign: 'center' as const,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '1.25rem',
  },
  errorTitle: {
    fontSize: '1.25rem',
    fontWeight: 800,
    color: '#18181B',
  },
  errorText: {
    fontSize: '0.9rem',
    color: '#71717A',
  },
  retryBtn: {
    backgroundColor: '#3B82F6',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '12px',
    padding: '0.75rem 1.5rem',
    fontWeight: 700,
    cursor: 'pointer',
  },
  profilePane: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1.5rem',
  },
  warningBanner: {
    display: 'flex',
    gap: '12px',
    backgroundColor: 'rgba(24ACC15, 0.08)',
    border: '1px solid rgba(250, 204, 21, 0.3)',
    borderRadius: '16px',
    padding: '1rem',
    fontSize: '0.825rem',
    color: '#854D0E',
    lineHeight: 1.4,
    alignItems: 'flex-start',
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E4E4E7',
    borderRadius: '24px',
    padding: '3rem',
    boxShadow: '0 25px 50px -12px rgba(24, 24, 27, 0.04)',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '2.5rem',
  },
  profileHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottom: '1px solid #E4E4E7',
    paddingBottom: '1.5rem',
    '@media (max-width: 600px)': {
      flexDirection: 'column' as const,
      gap: '1.5rem',
    },
  },
  badge: {
    alignSelf: 'flex-start',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: '#3B82F6',
    padding: '4px 12px',
    borderRadius: '9999px',
    fontSize: '0.7rem',
    color: '#FFFFFF',
    fontWeight: 700,
    marginBottom: '8px',
  },
  profileName: {
    fontSize: '1.75rem',
    fontWeight: 800,
    color: '#18181B',
    letterSpacing: '-0.02em',
  },
  dnaString: {
    fontFamily: 'monospace',
    fontSize: '0.75rem',
    color: '#A1A1AA',
    fontWeight: 600,
  },
  levelCard: {
    backgroundColor: 'rgba(16, 185, 129, 0.06)',
    border: '1px solid rgba(16, 185, 129, 0.15)',
    borderRadius: '16px',
    padding: '12px 20px',
    textAlign: 'right' as const,
    '@media (max-width: 600px)': {
      textAlign: 'left' as const,
      width: '100%',
    },
  },
  levelLabel: {
    display: 'block',
    fontSize: '0.65rem',
    fontWeight: 800,
    color: '#10B981',
    letterSpacing: '0.05em',
  },
  levelVal: {
    fontSize: '1.5rem',
    fontWeight: 900,
    color: '#10B981',
  },
  profileGrid: {
    display: 'grid',
    gridTemplateColumns: '260px 1fr',
    gap: '2.5rem',
    '@media (max-width: 600px)': {
      gridTemplateColumns: '1fr',
    },
  },
  statsColumn: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1.25rem',
  },
  statBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    backgroundColor: '#FAFAF9',
    borderRadius: '16px',
    padding: '1rem 1.25rem',
    border: '1px solid #E4E4E7',
  },
  statLabel: {
    display: 'block',
    fontSize: '0.7rem',
    fontWeight: 700,
    color: '#71717A',
  },
  statVal: {
    fontSize: '0.95rem',
    fontWeight: 800,
    color: '#18181B',
  },
  feedbackPanel: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1.5rem',
  },
  feedbackBlock: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },
  feedbackTitle: (color: string) => ({
    fontSize: '0.9rem',
    fontWeight: 800,
    color: color,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.02em',
  }),
  list: {
    listStyleType: 'none',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '6px',
  },
  listItem: {
    fontSize: '0.9rem',
    color: '#52525B',
    lineHeight: 1.4,
    paddingLeft: '12px',
    position: 'relative' as const,
    '&::before': {
      content: '"•"',
      position: 'absolute' as const,
      left: 0,
      color: '#A1A1AA',
    },
  },
  actionRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '1px solid #E4E4E7',
    paddingTop: '1.5rem',
    marginTop: '1rem',
    '@media (max-width: 600px)': {
      flexDirection: 'column' as const,
      gap: '1.25rem',
      alignItems: 'flex-start',
    },
  },
  securityCheck: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.8rem',
    color: '#71717A',
    fontWeight: 600,
  },
  launchBtn: {
    backgroundColor: '#18181B',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '12px',
    padding: '0.85rem 1.75rem',
    fontSize: '0.95rem',
    fontWeight: 800,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    boxShadow: '0 10px 20px -8px rgba(24, 24, 27, 0.3)',
    transition: 'all 0.2s',
  },
};
