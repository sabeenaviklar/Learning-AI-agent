import { useEffect, useState } from 'react';
import { Clock, Heart, Sliders, AlertTriangle, Calendar, CheckSquare } from 'lucide-react';

interface MissionControlProps {
  difficultyLevel: string | null;
  activeData: any | null;
  onRiskChange: (level: 'LOW' | 'MEDIUM' | 'HIGH', score: number, hours: number) => void;
}

export default function MissionControl({ difficultyLevel, activeData, onRiskChange }: MissionControlProps) {
  const [hours, setHours] = useState(10);
  const [score, setScore] = useState(85);
  const [riskLevel, setRiskLevel] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('LOW');

  // Calibrate Task duration from reflection
  const baseDuration = 45;
  const duration = difficultyLevel === 'hard' ? 60 : difficultyLevel === 'easy' ? 30 : baseDuration;

  // Sync risk changes when sliders are moved
  useEffect(() => {
    let nextLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
    if (hours < 4 || score < 60) {
      nextLevel = 'HIGH';
    } else if (hours < 8 || score < 80) {
      nextLevel = 'MEDIUM';
    }
    setRiskLevel(nextLevel);
    onRiskChange(nextLevel, score, hours);
  }, [hours, score]);

  return (
    <div style={styles.sidebarCol}>
      {/* Today's Objective */}
      <div className="console-card" style={styles.card}>
        <div style={styles.cardHeader}>
          <CheckSquare size={14} color="#3B82F6" />
          <span style={styles.cardTitle}>Mission Control - Active Session</span>
        </div>
        <div style={styles.objectiveBox}>
          <span style={styles.objName}>Complete Python Functions</span>
          <div style={styles.durationRow}>
            <Clock size={12} color="#71717A" />
            <span style={styles.durationText}>{duration} mins</span>
            {difficultyLevel === 'hard' && (
              <span style={styles.adjBadgeHard}>+15m Reflection</span>
            )}
            {difficultyLevel === 'easy' && (
              <span style={styles.adjBadgeEasy}>-15m Reflection</span>
            )}
          </div>
        </div>
      </div>

      {/* AI Memory Panel */}
      <div className="console-card" style={styles.card}>
        <div style={styles.cardHeader}>
          <Sliders size={14} color="#3B82F6" />
          <span style={styles.cardTitle}>AI Shared Memory</span>
        </div>
        <div style={styles.memoryGrid}>
          <div style={styles.memoryItem}>
            <span style={styles.memKey}>Name</span>
            <span style={styles.memVal}>Aditi</span>
          </div>
          <div style={styles.memoryItem}>
            <span style={styles.memKey}>Preferred Time</span>
            <span style={styles.memVal}>Morning</span>
          </div>
          <div style={styles.memoryItem}>
            <span style={styles.memKey}>Weak Areas</span>
            <span style={styles.memVal}>Networking, OOP</span>
          </div>
          <div style={styles.memoryItem}>
            <span style={styles.memKey}>Strong Areas</span>
            <span style={styles.memVal}>Git, Linux</span>
          </div>
          <div style={styles.memoryItem}>
            <span style={styles.memKey}>Content Style</span>
            <span style={styles.memVal}>Projects</span>
          </div>
        </div>
      </div>

      {/* Learning Health & Risk */}
      <div className="console-card" style={styles.card}>
        <div style={styles.cardHeader}>
          <Heart size={14} color="#FF6B6B" />
          <span style={styles.cardTitle}>Learning Health</span>
        </div>

        <div style={styles.healthStats}>
          <div style={styles.gaugeRow}>
            <div style={styles.gaugeLabelWrapper}>
              <span style={styles.gaugeLabel}>Health Index</span>
              <span style={styles.gaugeVal}>87%</span>
            </div>
            <div style={styles.healthBarBg}>
              <div style={styles.healthBarFill} />
            </div>
          </div>

          <div style={styles.riskBadgeRow}>
            <span style={styles.riskLabel}>Goal Confidence:</span>
            <span style={styles.riskPill(riskLevel)}>{riskLevel} RISK</span>
          </div>
        </div>
      </div>

      {/* Memory Timeline */}
      <div className="console-card" style={styles.card}>
        <div style={styles.cardHeader}>
          <Calendar size={14} color="#FACC15" />
          <span style={styles.cardTitle}>Memory Timeline</span>
        </div>
        <div style={styles.timelineList}>
          <div style={styles.timelineItem}>
            <span style={styles.tlDay}>Yesterday</span>
            <span style={styles.tlText}>VPC quiz completed (+20% clarity)</span>
          </div>
          <div style={styles.timelineItemActive}>
            <span style={styles.tlDayActive}>Today</span>
            <span style={styles.tlTextActive}>Inserted 15m scope revision</span>
          </div>
          <div style={styles.timelineItem}>
            <span style={styles.tlDay}>Tomorrow</span>
            <span style={styles.tlText}>Practice quiz difficulty locked</span>
          </div>
        </div>
      </div>

      {/* Sliders Console */}
      <div className="console-card" style={styles.card}>
        <div style={styles.cardHeader}>
          <Sliders size={14} color="#71717A" />
          <span style={styles.cardTitle}>Risk Analytics & Testing</span>
        </div>
        
        <div style={styles.slidersCol}>
          <div style={styles.sliderRow}>
            <div style={styles.sliderLabelRow}>
              <span style={styles.sliderName}>Weekly Hours</span>
              <strong style={styles.sliderVal}>{hours}h</strong>
            </div>
            <input 
              type="range"
              min="2"
              max="15"
              value={hours}
              onChange={(e) => setHours(Number(e.target.value))}
              style={styles.slider}
            />
          </div>

          <div style={styles.sliderRow}>
            <div style={styles.sliderLabelRow}>
              <span style={styles.sliderName}>Mock Quiz Score</span>
              <strong style={styles.sliderVal}>{score}%</strong>
            </div>
            <input 
              type="range"
              min="30"
              max="100"
              value={score}
              onChange={(e) => setScore(Number(e.target.value))}
              style={styles.slider}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  sidebarCol: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
    height: '100%',
  },
  card: {
    padding: '1rem',
    gap: '0.75rem',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    borderBottom: '1px solid #F4F4F5',
    paddingBottom: '0.5rem',
  },
  cardTitle: {
    fontSize: '0.75rem',
    fontWeight: 700,
    color: '#71717A',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
  },
  objectiveBox: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '4px',
    textAlign: 'left' as const,
  },
  objName: {
    fontSize: '0.9rem',
    fontWeight: 800,
    color: '#18181B',
  },
  durationRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  durationText: {
    fontSize: '0.8rem',
    fontWeight: 700,
    color: '#71717A',
  },
  adjBadgeHard: {
    fontSize: '0.65rem',
    backgroundColor: '#FEF2F2',
    color: '#EF4444',
    padding: '1px 6px',
    borderRadius: '4px',
    fontWeight: 700,
    marginLeft: '4px',
  },
  adjBadgeEasy: {
    fontSize: '0.65rem',
    backgroundColor: '#F0FDF4',
    color: '#22C55E',
    padding: '1px 6px',
    borderRadius: '4px',
    fontWeight: 700,
    marginLeft: '4px',
  },
  healthStats: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.75rem',
  },
  gaugeRow: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '4px',
  },
  gaugeLabelWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.75rem',
  },
  gaugeLabel: {
    color: '#71717A',
    fontWeight: 600,
  },
  gaugeVal: {
    fontWeight: 700,
    color: '#18181B',
  },
  healthBarBg: {
    width: '100%',
    height: '6px',
    backgroundColor: '#F4F4F5',
    borderRadius: '3px',
    overflow: 'hidden',
  },
  healthBarFill: {
    width: '87%',
    height: '100%',
    backgroundColor: '#FF6B6B',
    borderRadius: '3px',
  },
  riskBadgeRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  riskLabel: {
    fontSize: '0.75rem',
    color: '#71717A',
    fontWeight: 600,
  },
  riskPill: (level: string) => {
    let bg = 'rgba(34, 197, 94, 0.08)';
    let color = '#22C55E';
    if (level === 'HIGH') { bg = 'rgba(255, 107, 107, 0.08)'; color = '#FF6B6B'; }
    if (level === 'MEDIUM') { bg = 'rgba(250, 204, 21, 0.08)'; color = '#B45309'; }

    return {
      fontSize: '0.7rem',
      fontWeight: 800,
      backgroundColor: bg,
      color: color,
      padding: '2px 8px',
      borderRadius: '4px',
    };
  },
  timelineList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.5rem',
    textAlign: 'left' as const,
  },
  timelineItem: {
    display: 'flex',
    flexDirection: 'column' as const,
    paddingLeft: '10px',
    borderLeft: '2px solid #E4E4E7',
  },
  timelineItemActive: {
    display: 'flex',
    flexDirection: 'column' as const,
    paddingLeft: '10px',
    borderLeft: '2px solid #3B82F6',
  },
  tlDay: {
    fontSize: '0.65rem',
    color: '#71717A',
    fontWeight: 700,
    textTransform: 'uppercase' as const,
  },
  tlDayActive: {
    fontSize: '0.65rem',
    color: '#3B82F6',
    fontWeight: 700,
    textTransform: 'uppercase' as const,
  },
  tlText: {
    fontSize: '0.75rem',
    color: '#52525B',
  },
  tlTextActive: {
    fontSize: '0.75rem',
    color: '#18181B',
    fontWeight: 600,
  },
  slidersCol: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.75rem',
  },
  sliderRow: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '4px',
  },
  sliderLabelRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  sliderName: {
    fontSize: '0.75rem',
    color: '#71717A',
    fontWeight: 600,
  },
  sliderVal: {
    fontSize: '0.8rem',
    color: '#18181B',
  },
  slider: {
    width: '100%',
    height: '4px',
    backgroundColor: '#E4E4E7',
    borderRadius: '2px',
    outline: 'none',
    cursor: 'pointer',
  },
  memoryGrid: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '6px',
    textAlign: 'left' as const,
  },
  memoryItem: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.75rem',
    borderBottom: '1px dashed #F4F4F5',
    paddingBottom: '2px',
  },
  memKey: {
    color: '#71717A',
    fontWeight: 600,
  },
  memVal: {
    color: '#18181B',
    fontWeight: 700,
  },
};
