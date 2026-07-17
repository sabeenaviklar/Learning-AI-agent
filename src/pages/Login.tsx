import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sparkles, Mail, Lock, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Login() {
  const navigate = useNavigate();
  const { state } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Check if user is already onboarded
      if (state.user && state.assessment) {
        navigate('/dashboard');
      } else {
        navigate('/onboarding');
      }
    }, 1200);
  };

  const handleOAuthLogin = (provider: string) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (state.user && state.assessment) {
        navigate('/dashboard');
      } else {
        navigate('/onboarding');
      }
    }, 1000);
  };

  return (
    <div style={styles.loginContainer}>
      <div style={styles.cardWrapper}>
        {/* Left Side: Product Branding Illustration */}
        <div style={styles.visualPane}>
          <div style={styles.visualOverlay} />
          <div style={styles.visualContent}>
            <div style={styles.badge}>
              <Sparkles size={12} color="#FFFFFF" fill="#FFFFFF" />
              <span>LearningOS Platform v2.1</span>
            </div>
            <h2 style={styles.visualTitle}>Engineered for Autonomous Intelligence</h2>
            <p style={styles.visualSub}>
              Step into a workspace that adapts to your learning speeds, analyzes knowledge gaps using LLMs, and maps precise routes to your career goals.
            </p>
            
            {/* Visual Node Graph Mockup */}
            <div style={styles.graphMockup}>
              <div style={styles.graphNode('active')}>Onboarding Node</div>
              <div style={styles.graphLine} />
              <div style={styles.graphNode('pending')}>AI Skill Assessment</div>
              <div style={styles.graphLine} />
              <div style={styles.graphNode('pending')}>Dynamic Roadmap</div>
            </div>
          </div>
        </div>

        {/* Right Side: Sleek Input Form */}
        <div style={styles.formPane}>
          <div style={styles.formHeader}>
            <h3 style={styles.formTitle}>Welcome back</h3>
            <p style={styles.formSub}>Enter your details to access your learning dashboard.</p>
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email Address</label>
              <div style={styles.inputWrapper}>
                <Mail size={18} style={styles.inputIcon} />
                <input 
                  type="email" 
                  placeholder="alex@college.edu" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={styles.input}
                  required 
                />
              </div>
            </div>

            <div style={styles.inputGroup}>
              <div style={styles.labelRow}>
                <label style={styles.label}>Password</label>
                <a href="#forgot" style={styles.forgotLink}>Forgot?</a>
              </div>
              <div style={styles.inputWrapper}>
                <Lock size={18} style={styles.inputIcon} />
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={styles.input}
                  required 
                />
              </div>
            </div>

            <button type="submit" disabled={loading} style={styles.submitBtn}>
              {loading ? 'Authenticating Core...' : 'Sign In to LearningOS'}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          <div style={styles.divider}>
            <span style={styles.dividerLine} />
            <span style={styles.dividerText}>or continue with</span>
            <span style={styles.dividerLine} />
          </div>

          <div style={styles.oauthRow}>
            <button type="button" onClick={() => handleOAuthLogin('google')} style={styles.oauthBtn}>
              <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#EA4335' }}>G</span>
              <span>Google</span>
            </button>
            <button type="button" onClick={() => handleOAuthLogin('github')} style={styles.oauthBtn}>
              <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#18181B' }}>Git</span>
              <span>GitHub</span>
            </button>
          </div>

          <p style={styles.signupPrompt}>
            New to LearningOS?{' '}
            <Link to="/signup" style={styles.signupLink}>
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  loginContainer: {
    minHeight: '85vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem 1.5rem',
  },
  cardWrapper: {
    display: 'flex',
    backgroundColor: '#FFFFFF',
    border: '1px solid #E4E4E7',
    borderRadius: '24px',
    width: '100%',
    maxWidth: '1000px',
    overflow: 'hidden',
    boxShadow: '0 20px 40px -15px rgba(24, 24, 27, 0.08)',
  },
  visualPane: {
    flex: 1,
    background: 'linear-gradient(135deg, #1E3A8A 0%, #3B82F6 50%, #10B981 100%)',
    padding: '3rem',
    position: 'relative' as const,
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
    color: '#FFFFFF',
    '@media (max-width: 768px)': {
      display: 'none',
    },
  },
  visualOverlay: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(24, 24, 27, 0.1)',
    zIndex: 1,
  },
  visualContent: {
    position: 'relative' as const,
    zIndex: 2,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1.5rem',
  },
  badge: {
    alignSelf: 'flex-start',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    border: '1px solid rgba(255, 255, 255, 0.25)',
    padding: '4px 12px',
    borderRadius: '9999px',
    fontSize: '0.75rem',
    fontWeight: 700,
  },
  visualTitle: {
    fontSize: '2rem',
    fontWeight: 800,
    lineHeight: 1.2,
    color: '#FFFFFF',
  },
  visualSub: {
    fontSize: '0.95rem',
    lineHeight: 1.6,
    color: 'rgba(255, 255, 255, 0.85)',
  },
  graphMockup: {
    marginTop: '2rem',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
    maxWidth: '260px',
  },
  graphNode: (state: 'active' | 'pending') => ({
    backgroundColor: state === 'active' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.05)',
    border: state === 'active' ? '1px solid #FFFFFF' : '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: '12px',
    padding: '10px 16px',
    fontSize: '0.85rem',
    fontWeight: 600,
    textAlign: 'center' as const,
    boxShadow: state === 'active' ? '0 4px 12px rgba(255, 255, 255, 0.1)' : 'none',
  }),
  graphLine: {
    width: '2px',
    height: '16px',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    margin: '0 auto',
  },
  formPane: {
    width: '480px',
    padding: '3.5rem 3rem',
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
    '@media (max-width: 768px)': {
      width: '100%',
    },
  },
  formHeader: {
    marginBottom: '2rem',
  },
  formTitle: {
    fontSize: '1.75rem',
    fontWeight: 800,
    color: '#18181B',
    marginBottom: '0.5rem',
  },
  formSub: {
    fontSize: '0.9rem',
    color: '#71717A',
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1.25rem',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '6px',
  },
  labelRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: '0.85rem',
    fontWeight: 600,
    color: '#52525B',
  },
  forgotLink: {
    fontSize: '0.8rem',
    color: '#3B82F6',
    fontWeight: 600,
    textDecoration: 'none',
  },
  inputWrapper: {
    position: 'relative' as const,
    display: 'flex',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute' as const,
    left: '12px',
    color: '#A1A1AA',
  },
  input: {
    width: '100%',
    padding: '0.75rem 1rem 0.75rem 2.5rem',
    border: '1px solid #E4E4E7',
    borderRadius: '12px',
    fontSize: '0.95rem',
    fontFamily: 'inherit',
    outline: 'none',
    transition: 'all 0.2s',
    '&:focus': {
      borderColor: '#3B82F6',
      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
    },
  },
  submitBtn: {
    marginTop: '0.5rem',
    backgroundColor: '#3B82F6',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '12px',
    padding: '0.85rem',
    fontSize: '0.95rem',
    fontWeight: 700,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)',
    transition: 'all 0.2s',
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    margin: '1.5rem 0',
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    backgroundColor: '#E4E4E7',
  },
  dividerText: {
    fontSize: '0.75rem',
    color: '#A1A1AA',
    fontWeight: 600,
    textTransform: 'uppercase' as const,
  },
  oauthRow: {
    display: 'flex',
    gap: '1rem',
  },
  oauthBtn: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #E4E4E7',
    borderRadius: '12px',
    padding: '0.75rem',
    fontSize: '0.9rem',
    fontWeight: 600,
    cursor: 'pointer',
    color: '#18181B',
    transition: 'all 0.2s',
  },
  signupPrompt: {
    marginTop: '2rem',
    fontSize: '0.85rem',
    textAlign: 'center' as const,
    color: '#71717A',
  },
  signupLink: {
    color: '#3B82F6',
    fontWeight: 700,
    textDecoration: 'none',
  },
};
