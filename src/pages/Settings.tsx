import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, Key, Trash2, Shield, User, Clock, 
  BookOpen, Sliders, CheckCircle2, AlertTriangle, Compass 
} from 'lucide-react';

export default function Settings() {
  const { state, setGroqApiKey, resetAllState, setProfile } = useApp();
  const [apiKey, setApiKey] = useState(state.groqApiKey || '');
  const [savedSuccess, setSavedSuccess] = useState(false);
  
  // Profile edit fields
  const [name, setName] = useState(state.user?.name || '');
  const [occupation, setOccupation] = useState(state.user?.occupation || '');
  const [college, setCollege] = useState(state.user?.college || '');

  const handleSaveKeys = (e: React.FormEvent) => {
    e.preventDefault();
    setGroqApiKey(apiKey);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
    }, 2000);
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (state.user) {
      setProfile({
        ...state.user,
        name,
        occupation,
        college
      });
      alert('Profile updated successfully!');
    }
  };

  const handleWipe = () => {
    if (confirm('Are you sure you want to delete all learning data and restart your onboarding? This will clear all milestones and quiz scores.')) {
      resetAllState();
      window.location.href = '/';
    }
  };

  return (
    <div style={styles.settingsGrid}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.badge}>
          <Sliders size={12} color="#E28743" />
          <span>System Configurations</span>
        </div>
        <h2 style={styles.title}>Settings & Credentials</h2>
        <p style={styles.subtext}>
          Update API credentials, edit learning metadata, and manage local storage databases.
        </p>
      </div>

      <div style={styles.cardContainer}>
        {/* API Credentials Card */}
        <div style={styles.panelCard}>
          <h3 style={styles.panelTitle}>
            <Key size={18} color="#3B82F6" />
            <span>AI Model Keys</span>
          </h3>
          <p style={styles.panelSub}>
            LearningOS uses Groq LLMs to analyze conceptual assessments and generate study tracks. Input your key below to activate live evaluation.
          </p>

          <form onSubmit={handleSaveKeys} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>VITE_GROQ_API_KEY</label>
              <input
                type="password"
                placeholder="gsk_xxxxxxxxxxxxxxxxxxxxxxxxx"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                style={styles.input}
              />
            </div>
            
            <div style={styles.saveRow}>
              <button type="submit" style={styles.primaryBtn}>
                Save Configuration
              </button>
              {savedSuccess && (
                <div style={styles.successMsg}>
                  <CheckCircle2 size={16} color="#10B981" />
                  <span>Key updated in memory</span>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Profile Settings Card */}
        {state.user && (
          <div style={styles.panelCard}>
            <h3 style={styles.panelTitle}>
              <User size={18} color="#10B981" />
              <span>Learner Account Details</span>
            </h3>
            <p style={styles.panelSub}>Edit basic details synced during onboarding.</p>

            <form onSubmit={handleUpdateProfile} style={styles.formGrid}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Occupation</label>
                <input
                  type="text"
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.inputGroupFull}>
                <label style={styles.label}>College / Institution</label>
                <input
                  type="text"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  style={styles.input}
                  required
                />
              </div>

              <button type="submit" style={styles.secondaryBtn}>
                Update Profile Info
              </button>
            </form>
          </div>
        )}

        {/* Danger Zone */}
        <div style={styles.dangerCard}>
          <h3 style={styles.dangerTitle}>
            <Trash2 size={18} color="#FF6B6B" />
            <span>Danger Zone</span>
          </h3>
          <p style={styles.panelSub}>
            Wipe all stored data including skill assessment profiles, generated roadmap milestones, study streaks, and quiz logs.
          </p>

          <button onClick={handleWipe} style={styles.dangerBtn}>
            Reset LearningOS Database
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  settingsGrid: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1.5rem',
    maxWidth: '680px',
    margin: '0 auto',
  },
  header: { display: 'flex', flexDirection: 'column' as const, gap: '8px' },
  badge: {
    alignSelf: 'flex-start' as const,
    display: 'inline-flex', alignItems: 'center', gap: '6px',
    background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)',
    borderRadius: '9999px', padding: '4px 12px',
    fontSize: '0.7rem', color: '#F59E0B', fontWeight: 700,
  },
  title: { fontSize: '1.75rem', fontWeight: 800, color: '#F1F5F9', letterSpacing: '-0.02em' },
  subtext: { fontSize: '0.88rem', color: '#64748B' },
  cardContainer: { display: 'flex', flexDirection: 'column' as const, gap: '1.25rem' },
  panelCard: {
    background: '#13131E', border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '16px', padding: '1.75rem',
    display: 'flex', flexDirection: 'column' as const, gap: '1rem',
  },
  panelTitle: {
    display: 'flex', alignItems: 'center', gap: '8px',
    fontSize: '1rem', fontWeight: 800, color: '#F1F5F9',
  },
  panelSub: { fontSize: '0.83rem', color: '#64748B', lineHeight: 1.55 },
  form: { display: 'flex', flexDirection: 'column' as const, gap: '1rem', marginTop: '4px' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '4px' },
  inputGroup: { display: 'flex', flexDirection: 'column' as const, gap: '5px' },
  inputGroupFull: {
    gridColumn: '1 / span 2', display: 'flex', flexDirection: 'column' as const, gap: '5px',
  },
  label: { fontSize: '0.78rem', fontWeight: 700, color: '#64748B' },
  input: {
    width: '100%', padding: '0.65rem 1rem',
    background: '#1A1A28', border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '10px', fontSize: '0.88rem', fontFamily: 'inherit', color: '#F1F5F9',
    outline: 'none', transition: 'border-color 0.15s',
  },
  saveRow: { display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '4px' },
  successMsg: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#10B981', fontWeight: 700 },
  primaryBtn: {
    background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
    color: '#fff', border: 'none', borderRadius: '10px',
    padding: '10px 20px', fontSize: '0.85rem', fontWeight: 700,
    cursor: 'pointer', fontFamily: 'inherit',
  },
  secondaryBtn: {
    gridColumn: '1 / span 2' as const,
    background: 'rgba(255,255,255,0.04)',
    color: '#94A3B8', border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '10px', padding: '10px 20px',
    fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
  },
  dangerCard: {
    background: 'rgba(244,63,94,0.05)', border: '1px solid rgba(244,63,94,0.2)',
    borderRadius: '16px', padding: '1.75rem',
    display: 'flex', flexDirection: 'column' as const, gap: '1rem',
  },
  dangerTitle: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem', fontWeight: 800, color: '#F43F5E' },
  dangerBtn: {
    background: '#F43F5E', color: '#fff', border: 'none',
    borderRadius: '10px', padding: '10px 20px',
    fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer',
    alignSelf: 'flex-start' as const, fontFamily: 'inherit',
  },
};



  title: {
    fontSize: '1.75rem',
    fontWeight: 800,
    color: '#18181B',
    letterSpacing: '-0.02em',
  },
  subtext: {
    fontSize: '0.9rem',
    color: '#71717A',
  },
  cardContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1.5rem',
  },
  panelCard: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E4E4E7',
    borderRadius: '20px',
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
  },
  panelTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '1.1rem',
    fontWeight: 800,
    color: '#18181B',
  },
  panelSub: {
    fontSize: '0.85rem',
    color: '#71717A',
    lineHeight: 1.45,
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
    marginTop: '8px',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
    marginTop: '8px',
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
    fontSize: '0.8rem',
    fontWeight: 700,
    color: '#52525B',
  },
  input: {
    width: '100%',
    padding: '0.7rem 1rem',
    border: '1px solid #E4E4E7',
    borderRadius: '12px',
    fontSize: '0.9rem',
    fontFamily: 'inherit',
    outline: 'none',
    transition: 'border-color 0.15s',
    '&:focus': {
      borderColor: '#3B82F6',
    },
  },
  saveRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginTop: '8px',
  },
  successMsg: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.8rem',
    color: '#10B981',
    fontWeight: 700,
  },
  primaryBtn: {
    backgroundColor: '#18181B',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '12px',
    padding: '10px 20px',
    fontSize: '0.85rem',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
  secondaryBtn: {
    gridColumn: '1 / span 2',
    backgroundColor: '#FFFFFF',
    color: '#18181B',
    border: '1px solid #E4E4E7',
    borderRadius: '12px',
    padding: '10px 20px',
    fontSize: '0.85rem',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.15s',
    '&:hover': {
      borderColor: '#18181B',
    },
  },
  dangerCard: {
    backgroundColor: '#FFF5F5',
    border: '1px solid #FEE2E2',
    borderRadius: '20px',
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
  },
  dangerTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '1.1rem',
    fontWeight: 800,
    color: '#FF6B6B',
  },
  dangerBtn: {
    backgroundColor: '#FF6B6B',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '12px',
    padding: '10px 20px',
    fontSize: '0.85rem',
    fontWeight: 700,
    cursor: 'pointer',
    alignSelf: 'flex-start',
    boxShadow: '0 4px 12px rgba(255, 107, 107, 0.15)',
    transition: 'all 0.15s',
    '&:hover': {
      backgroundColor: '#E53E3E',
    },
  },
};
