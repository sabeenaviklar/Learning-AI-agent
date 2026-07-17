import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Search, CheckCircle, ExternalLink } from 'lucide-react';

interface ResourceAgentProps {
  activeData: any | null;
}

export default function ResourceAgent({ activeData }: ResourceAgentProps) {
  const [searching, setSearching] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  const [resources, setResources] = useState<string[]>([]);

  useEffect(() => {
    if (activeData) {
      setSearching(true);
      setProgress(0);
      setResources([]);
      setStatusText('Connecting to Groq Resource Ranker...');

      // Animate search progress
      const interval = setInterval(() => {
        setProgress(prev => {
          const next = prev + 8;
          if (next >= 100) {
            clearInterval(interval);
            setSearching(false);
            setResources(activeData.skills || ["Getting Started Guide", "Best Practices Hub"]);
            return 100;
          }
          // Dynamic status messages
          if (next < 30) setStatusText('Crawling API documentations & guides...');
          else if (next < 60) setStatusText('Filtering out redundant 42 course links...');
          else if (next < 85) setStatusText('Ranking by clarity and reading times...');
          else setStatusText('Finalizing top 5 resource paths...');
          return next;
        });
      }, 250);

      return () => clearInterval(interval);
    } else {
      setSearching(false);
      setProgress(0);
      setStatusText('');
      setResources([]);
    }
  }, [activeData]);

  return (
    <div style={styles.container} className="card">
      <div style={styles.header}>
        <div style={styles.titleWrapper}>
          <div style={styles.avatar}>
            <BookOpen size={16} color="#FF6B6B" />
          </div>
          <div>
            <h4 style={styles.heading}>Knowledge Indexer</h4>
            <p style={styles.sub}>AI Resource Crawler</p>
          </div>
        </div>
      </div>

      {activeData ? (
        <div style={styles.body}>
          {searching ? (
            <div style={styles.searchWrapper}>
              <div style={styles.statusRow}>
                <Search size={16} className="spinning-search" color="#3B82F6" />
                <span style={styles.statusText}>{statusText}</span>
              </div>
              <div style={styles.progressBg}>
                <motion.div 
                  style={styles.progressFill}
                  animate={{ width: `${progress}%` }}
                />
              </div>
              <span style={styles.pct}>{progress}% Scanned</span>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={styles.resultsWrapper}
            >
              <div style={styles.resultHeader}>
                <CheckCircle size={16} color="#22C55E" />
                <span style={styles.resultTitle}>5 Selected Materials (Fitted for Beginners):</span>
              </div>
              <div style={styles.linksList}>
                {resources.map((res, idx) => (
                  <div key={idx} style={styles.linkRow}>
                    <div style={styles.bulletNum}>{idx + 1}</div>
                    <div style={styles.linkContent}>
                      <span style={styles.linkName}>{res} Tutorial Reference</span>
                      <a href="#view" style={styles.linkAnchor}>
                        Official Docs <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      ) : (
        <div style={styles.emptyState}>
          <Search size={24} color="#A1A1AA" />
          <p style={styles.emptyText}>Waiting for Goal Architect parse...</p>
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
    backgroundColor: 'rgba(255, 107, 107, 0.08)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid rgba(255, 107, 107, 0.15)',
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
    gap: '1rem',
  },
  searchWrapper: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.75rem',
  },
  statusRow: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  },
  statusText: {
    fontSize: '0.85rem',
    color: '#52525B',
    fontWeight: 600,
  },
  progressBg: {
    width: '100%',
    height: '8px',
    backgroundColor: '#F4F4F5',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FF6B6B',
    borderRadius: '4px',
  },
  pct: {
    fontSize: '0.75rem',
    color: '#71717A',
    fontWeight: 600,
  },
  resultsWrapper: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
  },
  resultHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.9rem',
    fontWeight: 700,
    color: '#18181B',
  },
  resultTitle: {
    fontSize: '0.85rem',
    color: '#18181B',
  },
  linksList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.75rem',
  },
  linkRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem 1rem',
    backgroundColor: '#FAFAF7',
    borderRadius: '12px',
    border: '1px solid #E4E4E7',
  },
  bulletNum: {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 107, 107, 0.08)',
    color: '#FF6B6B',
    fontSize: '0.75rem',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  linkContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexGrow: 1,
  },
  linkName: {
    fontSize: '0.8rem',
    fontWeight: 600,
    color: '#18181B',
  },
  linkAnchor: {
    fontSize: '0.75rem',
    fontWeight: 700,
    color: '#3B82F6',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '3px',
  },
  emptyState: {
    padding: '2.5rem',
    textAlign: 'center' as const,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    backgroundColor: '#FAFAF7',
    borderRadius: '16px',
    border: '1px dashed #E4E4E7',
  },
  emptyText: {
    fontSize: '0.8rem',
    color: '#A1A1AA',
    fontWeight: 500,
  },
};

if (typeof document !== 'undefined') {
  const spinStyle = document.createElement('style');
  spinStyle.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    .spinning-search {
      animation: spin 1.5s linear infinite;
    }
  `;
  document.head.appendChild(spinStyle);
}
