import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, BookOpen, Target, Calendar, DollarSign, Briefcase, 
  MapPin, Clock, Award, Check, Sparkles, ArrowRight, Shield 
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const LANGUAGES = ['English', 'Spanish', 'Mandarin', 'German', 'Hindi', 'French'];
const STYLES = [
  { id: 'Video', title: 'Video-First', desc: 'Screencasts, interactive lectures, video explanations' },
  { id: 'Reading', title: 'Reading-First', desc: 'Official docs, articles, text guides, textbook formats' },
  { id: 'Projects', title: 'Project-First', desc: 'Interactive coding playgrounds, sandbox repos, building clones' },
  { id: 'Mixed', title: 'Mixed Balance', desc: 'An even distribution of videos, theory, and implementation' }
];

export default function Onboarding() {
  const navigate = useNavigate();
  const { setProfile } = useApp();
  const [step, setStep] = useState(1);

  // Step 1: Profile
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [occupation, setOccupation] = useState('');
  const [college, setCollege] = useState('');
  const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC');

  // Step 2: Preferences
  const [style, setStyle] = useState('Mixed');
  const [studyHours, setStudyHours] = useState(3);
  const [studyTimeOfDay, setStudyTimeOfDay] = useState('Afternoon'); // Morning, Afternoon, Night
  const [budget, setBudget] = useState('Free'); // Free, Paid
  const [language, setLanguage] = useState('English');

  // Step 3: Career Goal
  const [careerGoal, setCareerGoal] = useState('AI Engineer');
  const [targetCompany, setTargetCompany] = useState('');
  const [salary, setSalary] = useState('');
  const [deadline, setDeadline] = useState('3 Months');
  const [currentExperience, setCurrentExperience] = useState('Beginner');

  const nextStep = () => {
    if (step < 3) {
      setStep(prev => prev + 1);
    } else {
      // Save profile details to AppContext
      setProfile({
        name,
        age,
        occupation,
        college,
        timezone,
        language,
        budget,
        studyHours,
        style,
        careerGoal,
        targetCompany: targetCompany || 'Any Innovative Team',
        salary: salary || '$120,000',
        deadline,
        currentExperience
      });
      navigate('/assessment');
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
    }
  };

  return (
    <div style={styles.onboardWrapper}>
      <div style={styles.stepsTracker}>
        <div style={styles.stepIndicator(step >= 1)}>
          <span style={styles.stepNum(step >= 1)}>1</span>
          <span style={styles.stepText}>Personal Profile</span>
        </div>
        <div style={styles.stepLine(step >= 2)} />
        <div style={styles.stepIndicator(step >= 2)}>
          <span style={styles.stepNum(step >= 2)}>2</span>
          <span style={styles.stepText}>Learning Preferences</span>
        </div>
        <div style={styles.stepLine(step >= 3)} />
        <div style={styles.stepIndicator(step >= 3)}>
          <span style={styles.stepNum(step >= 3)}>3</span>
          <span style={styles.stepText}>Career Alignment</span>
        </div>
      </div>

      <div style={styles.card}>
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              style={styles.stepContainer}
            >
              <div style={styles.cardHeader}>
                <div style={styles.badge}>
                  <Sparkles size={12} color="#3B82F6" />
                  <span>Step 1 of 3</span>
                </div>
                <h2 style={styles.cardTitle}>Build Your Profile</h2>
                <p style={styles.cardSub}>Help the system customize references based on your university or workspace context.</p>
              </div>

              <div style={styles.formGrid}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Full Name</label>
                  <div style={styles.inputWrapper}>
                    <User size={16} style={styles.inputIcon} />
                    <input 
                      type="text" 
                      placeholder="Alex Mercer" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      style={styles.input}
                      required 
                    />
                  </div>
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Age</label>
                  <div style={styles.inputWrapper}>
                    <Calendar size={16} style={styles.inputIcon} />
                    <input 
                      type="number" 
                      placeholder="21" 
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      style={styles.input}
                      required 
                    />
                  </div>
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Current Occupation</label>
                  <div style={styles.inputWrapper}>
                    <Briefcase size={16} style={styles.inputIcon} />
                    <input 
                      type="text" 
                      placeholder="Student, Analyst, Writer" 
                      value={occupation}
                      onChange={(e) => setOccupation(e.target.value)}
                      style={styles.input}
                      required 
                    />
                  </div>
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>College / Company</label>
                  <div style={styles.inputWrapper}>
                    <BookOpen size={16} style={styles.inputIcon} />
                    <input 
                      type="text" 
                      placeholder="Stanford University" 
                      value={college}
                      onChange={(e) => setCollege(e.target.value)}
                      style={styles.input}
                      required 
                    />
                  </div>
                </div>

                <div style={styles.inputGroupFull}>
                  <label style={styles.label}>Timezone</label>
                  <div style={styles.inputWrapper}>
                    <MapPin size={16} style={styles.inputIcon} />
                    <input 
                      type="text" 
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                      style={styles.input}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              style={styles.stepContainer}
            >
              <div style={styles.cardHeader}>
                <div style={styles.badge}>
                  <Sparkles size={12} color="#3B82F6" />
                  <span>Step 2 of 3</span>
                </div>
                <h2 style={styles.cardTitle}>Learning DNA Preferences</h2>
                <p style={styles.cardSub}>How do you study best? The AI tutor adapts its resource layout to match.</p>
              </div>

              <div style={styles.formGrid}>
                <div style={styles.inputGroupFull}>
                  <label style={styles.label}>Preferred Learning Style</label>
                  <div style={styles.styleGrid}>
                    {STYLES.map(s => (
                      <div 
                        key={s.id} 
                        onClick={() => setStyle(s.id)}
                        style={styles.styleCard(style === s.id)}
                      >
                        <div style={styles.styleHeader}>
                          <span style={styles.styleTitle}>{s.title}</span>
                          {style === s.id && <Check size={14} color="#3B82F6" />}
                        </div>
                        <p style={styles.styleDesc}>{s.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Study Hours Per Day ({studyHours} hrs)</label>
                  <input 
                    type="range" 
                    min="1" 
                    max="8" 
                    value={studyHours}
                    onChange={(e) => setStudyHours(Number(e.target.value))}
                    style={styles.rangeInput}
                  />
                  <div style={styles.rangeLabels}>
                    <span>1h (Casual)</span>
                    <span>4h (Focused)</span>
                    <span>8h (Intense)</span>
                  </div>
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Preferred Study Time</label>
                  <div style={styles.toggleRow}>
                    {['Morning', 'Afternoon', 'Night'].map(t => (
                      <button
                        type="button"
                        key={t}
                        onClick={() => setStudyTimeOfDay(t)}
                        style={styles.toggleBtn(studyTimeOfDay === t)}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Resource Budget</label>
                  <div style={styles.toggleRow}>
                    {['Free', 'Paid'].map(b => (
                      <button
                        type="button"
                        key={b}
                        onClick={() => setBudget(b)}
                        style={styles.toggleBtn(budget === b)}
                      >
                        {b} Courses
                      </button>
                    ))}
                  </div>
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Preferred Language</label>
                  <select 
                    value={language} 
                    onChange={(e) => setLanguage(e.target.value)}
                    style={styles.select}
                  >
                    {LANGUAGES.map(lang => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              style={styles.stepContainer}
            >
              <div style={styles.cardHeader}>
                <div style={styles.badge}>
                  <Sparkles size={12} color="#3B82F6" />
                  <span>Step 3 of 3</span>
                </div>
                <h2 style={styles.cardTitle}>Career Alignment</h2>
                <p style={styles.cardSub}>Set your target outcomes to establish roadmap timelines and success indexes.</p>
              </div>

              <div style={styles.formGrid}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Target Occupation / Role</label>
                  <div style={styles.inputWrapper}>
                    <Target size={16} style={styles.inputIcon} />
                    <input 
                      type="text" 
                      placeholder="e.g., AI Engineer, React Architect" 
                      value={careerGoal}
                      onChange={(e) => setCareerGoal(e.target.value)}
                      style={styles.input}
                      required 
                    />
                  </div>
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Target Company</label>
                  <div style={styles.inputWrapper}>
                    <Briefcase size={16} style={styles.inputIcon} />
                    <input 
                      type="text" 
                      placeholder="e.g., Google, Stripe, OpenAI" 
                      value={targetCompany}
                      onChange={(e) => setTargetCompany(e.target.value)}
                      style={styles.input}
                    />
                  </div>
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Expected Target Salary</label>
                  <div style={styles.inputWrapper}>
                    <DollarSign size={16} style={styles.inputIcon} />
                    <input 
                      type="text" 
                      placeholder="e.g., $140,000 / yr" 
                      value={salary}
                      onChange={(e) => setSalary(e.target.value)}
                      style={styles.input}
                    />
                  </div>
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Completion Deadline</label>
                  <select 
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    style={styles.select}
                  >
                    <option value="1 Month">1 Month (Accelerated)</option>
                    <option value="3 Months">3 Months (Standard)</option>
                    <option value="6 Months">6 Months (Comprehensive)</option>
                    <option value="1 Year">1 Year (Deep-dive)</option>
                  </select>
                </div>

                <div style={styles.inputGroupFull}>
                  <label style={styles.label}>Current Domain Experience</label>
                  <div style={styles.experienceGrid}>
                    {['Beginner', 'Intermediate', 'Advanced'].map(exp => (
                      <div 
                        key={exp}
                        onClick={() => setCurrentExperience(exp)}
                        style={styles.expCard(currentExperience === exp)}
                      >
                        <div style={styles.styleHeader}>
                          <span style={styles.styleTitle}>{exp}</span>
                          {currentExperience === exp && <Check size={14} color="#3B82F6" />}
                        </div>
                        <p style={styles.styleDesc}>
                          {exp === 'Beginner' && 'Little to no coding background in this goal domain.'}
                          {exp === 'Intermediate' && 'Built smaller projects, comfortable with core syntax.'}
                          {exp === 'Advanced' && 'Working professionally in adjacent domains, understand algorithms.'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Buttons Row */}
        <div style={styles.btnRow}>
          {step > 1 ? (
            <button onClick={prevStep} style={styles.btnSecondary}>
              Back
            </button>
          ) : (
            <div style={{ flex: 1 }} />
          )}

          <button onClick={nextStep} style={styles.btnPrimary}>
            {step === 3 ? 'Deploy Skill Assessment' : 'Continue'}
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  onboardWrapper: {
    minHeight: '85vh',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem 1.5rem',
    gap: '2.5rem',
  },
  stepsTracker: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.25rem',
    maxWidth: '650px',
    width: '100%',
    justifyContent: 'space-between',
    '@media (max-width: 600px)': {
      flexDirection: 'column' as const,
      gap: '8px',
      alignItems: 'flex-start',
    },
  },
  stepIndicator: (active: boolean) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    opacity: active ? 1 : 0.4,
    transition: 'opacity 0.3s',
  }),
  stepNum: (active: boolean) => ({
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    backgroundColor: active ? '#3B82F6' : '#E4E4E7',
    color: active ? '#FFFFFF' : '#71717A',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.8rem',
    fontWeight: 700,
  }),
  stepText: {
    fontSize: '0.85rem',
    fontWeight: 700,
    color: '#18181B',
  },
  stepLine: (active: boolean) => ({
    flex: 1,
    height: '2px',
    backgroundColor: active ? '#3B82F6' : '#E4E4E7',
    transition: 'background-color 0.3s',
    minWidth: '40px',
    '@media (max-width: 600px)': {
      display: 'none',
    },
  }),
  card: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E4E4E7',
    borderRadius: '24px',
    padding: '3rem',
    maxWidth: '650px',
    width: '100%',
    boxShadow: '0 20px 45px -12px rgba(24, 24, 27, 0.04)',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '2.5rem',
  },
  stepContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1.75rem',
  },
  cardHeader: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },
  badge: {
    alignSelf: 'flex-start',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: 'rgba(59, 130, 246, 0.08)',
    border: '1px solid rgba(59, 130, 246, 0.15)',
    padding: '4px 10px',
    borderRadius: '9999px',
    fontSize: '0.7rem',
    color: '#3B82F6',
    fontWeight: 700,
  },
  cardTitle: {
    fontSize: '1.75rem',
    fontWeight: 800,
    color: '#18181B',
    letterSpacing: '-0.02em',
  },
  cardSub: {
    fontSize: '0.9rem',
    color: '#71717A',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1.25rem',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '6px',
  },
  inputGroupFull: {
    gridColumn: '1 / span 2',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '6px',
  },
  label: {
    fontSize: '0.85rem',
    fontWeight: 700,
    color: '#52525B',
  },
  inputWrapper: {
    position: 'relative' as const,
    display: 'flex',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute' as const,
    left: '12px',
    color: '#71717A',
  },
  input: {
    width: '100%',
    padding: '0.7rem 1rem 0.7rem 2.25rem',
    border: '1px solid #E4E4E7',
    borderRadius: '12px',
    fontSize: '0.9rem',
    fontFamily: 'inherit',
    outline: 'none',
    transition: 'all 0.2s',
    '&:focus': {
      borderColor: '#3B82F6',
      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.08)',
    },
  },
  select: {
    width: '100%',
    padding: '0.7rem 1rem',
    border: '1px solid #E4E4E7',
    borderRadius: '12px',
    fontSize: '0.9rem',
    fontFamily: 'inherit',
    backgroundColor: '#FFFFFF',
    outline: 'none',
    cursor: 'pointer',
  },
  styleGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
    marginTop: '6px',
    '@media (max-width: 500px)': {
      gridTemplateColumns: '1fr',
    },
  },
  styleCard: (active: boolean) => ({
    border: active ? '2px solid #3B82F6' : '1px solid #E4E4E7',
    borderRadius: '16px',
    padding: '1.25rem',
    cursor: 'pointer',
    backgroundColor: active ? 'rgba(59, 130, 246, 0.02)' : '#FFFFFF',
    transition: 'all 0.2s',
  }),
  styleHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '4px',
  },
  styleTitle: {
    fontSize: '0.9rem',
    fontWeight: 700,
    color: '#18181B',
  },
  styleDesc: {
    fontSize: '0.75rem',
    color: '#71717A',
    lineHeight: 1.4,
  },
  rangeInput: {
    width: '100%',
    marginTop: '10px',
  },
  rangeLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.7rem',
    color: '#A1A1AA',
    fontWeight: 600,
  },
  toggleRow: {
    display: 'flex',
    border: '1px solid #E4E4E7',
    borderRadius: '12px',
    overflow: 'hidden',
  },
  toggleBtn: (active: boolean) => ({
    flex: 1,
    padding: '0.7rem',
    border: 'none',
    backgroundColor: active ? '#18181B' : '#FFFFFF',
    color: active ? '#FFFFFF' : '#52525B',
    fontWeight: 600,
    fontSize: '0.85rem',
    cursor: 'pointer',
    transition: 'all 0.15s',
  }),
  experienceGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '10px',
    marginTop: '6px',
    '@media (max-width: 500px)': {
      gridTemplateColumns: '1fr',
    },
  },
  expCard: (active: boolean) => ({
    border: active ? '2px solid #3B82F6' : '1px solid #E4E4E7',
    borderRadius: '16px',
    padding: '1rem',
    cursor: 'pointer',
    backgroundColor: active ? 'rgba(59, 130, 246, 0.02)' : '#FFFFFF',
    transition: 'all 0.2s',
  }),
  btnRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '1rem',
  },
  btnPrimary: {
    backgroundColor: '#18181B',
    color: '#FFFFFF',
    border: 'none',
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
  btnSecondary: {
    backgroundColor: '#FFFFFF',
    color: '#52525B',
    border: '1px solid #E4E4E7',
    borderRadius: '12px',
    padding: '0.75rem 1.5rem',
    fontSize: '0.9rem',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
};
