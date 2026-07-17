import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Activity, Zap } from 'lucide-react';

interface TelemetryFeedProps {
  activeData: any | null;
  isReasoning: boolean;
  telemetryData?: any;
  orchestratorConnected: boolean;
  jsonSchemaPassed: 'Passed' | 'Failed' | 'Pending';
}

interface ActivityLog {
  time: string;
  text: string;
  category: 'intent' | 'planner' | 'resource' | 'risk' | 'system';
}

export default function TelemetryFeed({ activeData, isReasoning, telemetryData, orchestratorConnected, jsonSchemaPassed }: TelemetryFeedProps) {
  const [latency, setLatency] = useState(214);
  const [tokens, setTokens] = useState(1642);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [activeTab, setActiveTab] = useState<'activity' | 'schema'>('activity');
  const [selectedAgentSchema, setSelectedAgentSchema] = useState<'intent' | 'planner' | 'risk'>('intent');

  // Fluctuating Groq metrics simulation
  useEffect(() => {
    const interval = setInterval(() => {
      if (isReasoning) {
        setLatency(Math.floor(Math.random() * (260 - 180) + 180));
        setTokens(prev => prev + Math.floor(Math.random() * 200 + 100));
        setConfidence(Math.floor(Math.random() * (96 - 91) + 91));
      } else {
        setLatency(telemetryData ? telemetryData.latencyMs : 214);
        setConfidence(activeData ? activeData.successProbability : 94);
      }
    }, 800);

    return () => clearInterval(interval);
  }, [isReasoning, activeData, telemetryData]);

  // Orchestrator Logs Generator
  useEffect(() => {
    if (activeData) {
      setLogs([]);
      const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      const newLogs: ActivityLog[] = [
        { time: timeNow, text: "Goal intent parsed", category: 'intent' },
        { time: timeNow, text: "Milestones designed by Llama-3-70b", category: 'planner' },
        { time: timeNow, text: "Scanned & ranked 42 resources", category: 'resource' },
        { time: timeNow, text: "Learning risk model calibrated", category: 'risk' },
        { time: timeNow, text: "Daily study block schedules built", category: 'system' }
      ];

      let logIdx = 0;
      const interval = setInterval(() => {
        setLogs(prev => [...prev, newLogs[logIdx]]);
        logIdx++;
        if (logIdx >= newLogs.length) {
          clearInterval(interval);
        }
      }, 1000);

      return () => clearInterval(interval);
    } else {
      setLogs([]);
    }
  }, [activeData]);

  const getIntentSchema = () => {
    return JSON.stringify({
      agent: "intent_parser",
      input: {
        goal_text: activeData ? activeData.text : "Crack AWS in 3 months",
        language: "english"
      },
      output: {
        domain: activeData ? activeData.domain : "Cloud Architecture",
        difficulty: activeData ? activeData.difficulty : 7,
        duration_weeks: activeData ? activeData.durationWeeks : 12,
        weekly_hours: activeData ? activeData.weeklyHours : 10,
        skills: activeData ? activeData.skills : ["Networking", "IAM Security", "EC2"]
      }
    }, null, 2);
  };

  const getPlannerSchema = () => {
    return JSON.stringify({
      agent: "roadmap_planner",
      input: {
        domain: activeData ? activeData.domain : "Cloud Architecture",
        weekly_hours: activeData ? activeData.weeklyHours : 10,
        timeline_weeks: activeData ? activeData.durationWeeks : 12
      },
      output: {
        milestones: [
          { week: 1, topic: "Core Foundations" },
          { week: 2, topic: "Logic & Flow" },
          { week: 3, topic: "Complex Systems" }
        ],
        confidence_score: 0.94
      }
    }, null, 2);
  };

  const getRiskSchema = () => {
    return JSON.stringify({
      agent: "risk_predictor",
      input: {
        completed_tasks: 4,
        missed_sessions: 3,
        quiz_average: activeData ? 58 : 85
      },
      output: {
        risk_probability: activeData ? 0.72 : 0.12,
        classification: activeData ? "HIGH_RISK" : "LOW_RISK",
        remedial_required: activeData ? true : false
      }
    }, null, 2);
  };

  const activeSchemaJson = selectedAgentSchema === 'intent' ? getIntentSchema()
                        : selectedAgentSchema === 'planner' ? getPlannerSchema()
                        : getRiskSchema();

  const currentModel = telemetryData ? telemetryData.model : "llama-3.3-70b-versatile";
  const currentLatency = telemetryData ? `${telemetryData.latencyMs}ms` : (isReasoning ? `${latency}ms` : '214ms');
  const promptTokensVal = telemetryData ? telemetryData.promptTokens : (activeData ? 613 : 0);
  const completionTokensVal = telemetryData ? telemetryData.completionTokens : (activeData ? 742 : 0);
  const totalTokensVal = telemetryData ? telemetryData.totalTokens : (isReasoning ? tokens : (activeData ? 1355 : 0));
  const finishReasonVal = telemetryData ? telemetryData.finishReason : (activeData ? 'stop' : 'waiting');

  return (
    <div style={styles.sidebarCol}>
      {/* Groq Telemetry Metrics */}
      <div className="console-card" style={styles.card}>
        <div style={styles.cardHeader}>
          <Zap size={14} color="#3B82F6" />
          <span style={styles.cardTitle}>Groq Telemetry</span>
        </div>

        <div style={styles.telemetryGrid}>
          <div style={styles.telemetryItem}>
            <span style={styles.telLabel}>Model</span>
            <span style={styles.telValModel}>{currentModel}</span>
          </div>
          <div style={styles.telemetryItem}>
            <span style={styles.telLabel}>Latency</span>
            <span style={styles.telVal}>{currentLatency}</span>
          </div>
          <div style={styles.telemetryItem}>
            <span style={styles.telLabel}>Prompt Toks</span>
            <span style={styles.telVal}>{promptTokensVal}</span>
          </div>
          <div style={styles.telemetryItem}>
            <span style={styles.telLabel}>Compl Toks</span>
            <span style={styles.telVal}>{completionTokensVal}</span>
          </div>
          <div style={styles.telemetryItem}>
            <span style={styles.telLabel}>Total Toks</span>
            <span style={styles.telVal}>{totalTokensVal}</span>
          </div>
          <div style={styles.telemetryItem}>
            <span style={styles.telLabel}>Reason</span>
            <span style={styles.telValModel}>{finishReasonVal}</span>
          </div>
        </div>

        {/* Status Indicators */}
        <div style={styles.statusGrid}>
          <div style={styles.statusItem}>
            <span style={styles.statusLabel}>Orchestrator</span>
            <span style={{
              ...styles.statusValConnected,
              color: orchestratorConnected ? '#22C55E' : '#EF4444'
            }}>
              {orchestratorConnected ? '• Connected' : '• Offline'}
            </span>
          </div>
          <div style={styles.statusItem}>
            <span style={styles.statusLabel}>JSON Schema</span>
            <span style={{
              ...styles.statusValPassed,
              color: jsonSchemaPassed === 'Passed' ? '#22C55E' : jsonSchemaPassed === 'Pending' ? '#3B82F6' : '#EF4444'
            }}>
              {jsonSchemaPassed === 'Passed' ? '✓ Passed' : jsonSchemaPassed === 'Pending' ? '○ Pending' : '✗ Failed'}
            </span>
          </div>
          <div style={styles.statusItem}>
            <span style={styles.statusLabel}>Workflow</span>
            <span style={styles.statusValState}>
              {isReasoning ? '⚙ Running' : activeData ? '✅ Done' : '⏳ Idle'}
            </span>
          </div>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="console-card" style={styles.card}>
        <div style={styles.tabHeader}>
          <button 
            onClick={() => setActiveTab('activity')}
            style={activeTab === 'activity' ? styles.tabBtnActive : styles.tabBtn}
          >
            <Activity size={12} /> Log Feed
          </button>
          <button 
            onClick={() => setActiveTab('schema')}
            style={activeTab === 'schema' ? styles.tabBtnActive : styles.tabBtn}
          >
            <Cpu size={12} /> JSON Inspector
          </button>
        </div>

        <div style={styles.logsContainer}>
          {activeTab === 'activity' ? (
            logs.length > 0 ? (
              <div style={styles.logsList}>
                <AnimatePresence>
                  {logs.map((log, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={styles.logRow}
                    >
                      <span style={styles.logTime}>{log.time}</span>
                      <span style={styles.logText}>
                        <span style={styles.logCategoryBadge(log.category)}>
                          {log.category}
                        </span>
                        {log.text}
                      </span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div style={styles.emptyFeed}>
                <Cpu size={20} color="#71717A" />
                <span style={styles.emptyText}>Waiting for Orchestrator query...</span>
              </div>
            )
          ) : (
            <div style={styles.schemaWrapper}>
              <div style={styles.schemaSelectRow}>
                <button 
                  onClick={() => setSelectedAgentSchema('intent')}
                  style={selectedAgentSchema === 'intent' ? styles.schemaSelectBtnActive : styles.schemaSelectBtn}
                >
                  Intent
                </button>
                <button 
                  onClick={() => setSelectedAgentSchema('planner')}
                  style={selectedAgentSchema === 'planner' ? styles.schemaSelectBtnActive : styles.schemaSelectBtn}
                >
                  Planner
                </button>
                <button 
                  onClick={() => setSelectedAgentSchema('risk')}
                  style={selectedAgentSchema === 'risk' ? styles.schemaSelectBtnActive : styles.schemaSelectBtn}
                >
                  Risk
                </button>
              </div>
              <pre style={styles.jsonBlock}>
                <code>{activeSchemaJson}</code>
              </pre>
            </div>
          )}
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
  telemetryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '0.75rem',
    fontFamily: 'monospace',
  },
  telemetryItem: {
    backgroundColor: '#FAFAF7',
    border: '1px solid #E4E4E7',
    borderRadius: '8px',
    padding: '6px 10px',
    display: 'flex',
    flexDirection: 'column' as const,
  },
  telLabel: {
    fontSize: '0.6rem',
    color: '#71717A',
    textTransform: 'uppercase' as const,
  },
  telVal: {
    fontSize: '0.9rem',
    fontWeight: 700,
    color: '#18181B',
  },
  telValModel: {
    fontSize: '0.725rem',
    fontWeight: 700,
    color: '#18181B',
    marginTop: '2px',
  },
  logsContainer: {
    minHeight: '220px',
    display: 'flex',
    flexDirection: 'column' as const,
  },
  logsList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.625rem',
    overflowY: 'auto' as const,
    maxHeight: '300px',
  },
  logRow: {
    display: 'flex',
    gap: '8px',
    alignItems: 'flex-start',
    fontFamily: 'monospace',
    fontSize: '0.725rem',
    lineHeight: 1.4,
  },
  logTime: {
    color: '#71717A',
    fontWeight: 600,
    flexShrink: 0,
  },
  logText: {
    color: '#18181B',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    flexWrap: 'wrap' as const,
  },
  logCategoryBadge: (category: string) => {
    let color = '#71717A';
    let bg = '#F4F4F5';
    if (category === 'intent') { color = '#3B82F6'; bg = 'rgba(59, 130, 246, 0.08)'; }
    if (category === 'planner') { color = '#22C55E'; bg = 'rgba(34, 197, 94, 0.08)'; }
    if (category === 'resource') { color = '#FF6B6B'; bg = 'rgba(255, 107, 107, 0.08)'; }
    if (category === 'risk') { color = '#B45309'; bg = 'rgba(250, 204, 21, 0.08)'; }

    return {
      fontSize: '0.55rem',
      fontWeight: 700,
      color: color,
      backgroundColor: bg,
      padding: '1px 4px',
      borderRadius: '3px',
      textTransform: 'uppercase' as const,
    };
  },
  emptyFeed: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    color: '#A1A1AA',
    border: '1px dashed #E4E4E7',
    borderRadius: '10px',
    padding: '1rem',
  },
  emptyText: {
    fontSize: '0.7rem',
    textAlign: 'center' as const,
  },
  tabHeader: {
    display: 'flex',
    borderBottom: '1px solid #F4F4F5',
    paddingBottom: '0.5rem',
    gap: '0.5rem',
  },
  tabBtn: {
    background: 'none',
    border: 'none',
    color: '#71717A',
    fontSize: '0.75rem',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 8px',
    borderRadius: '4px',
  },
  tabBtnActive: {
    background: '#FAFAF7',
    border: '1px solid #E4E4E7',
    color: '#3B82F6',
    fontSize: '0.75rem',
    fontWeight: 700,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 8px',
    borderRadius: '4px',
  },
  schemaWrapper: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.5rem',
    flexGrow: 1,
  },
  schemaSelectRow: {
    display: 'flex',
    gap: '4px',
  },
  schemaSelectBtn: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E4E4E7',
    color: '#52525B',
    padding: '2px 8px',
    borderRadius: '4px',
    fontSize: '0.65rem',
    fontWeight: 600,
    cursor: 'pointer',
  },
  schemaSelectBtnActive: {
    backgroundColor: '#18181B',
    border: '1px solid #27272A',
    color: '#FFFFFF',
    padding: '2px 8px',
    borderRadius: '4px',
    fontSize: '0.65rem',
    fontWeight: 700,
    cursor: 'pointer',
  },
  jsonBlock: {
    backgroundColor: '#18181B',
    border: '1px solid #27272A',
    borderRadius: '8px',
    padding: '8px',
    color: '#22C55E',
    fontFamily: 'monospace',
    fontSize: '0.65rem',
    maxHeight: '180px',
    overflowY: 'auto' as const,
    textAlign: 'left' as const,
    whiteSpace: 'pre-wrap' as const,
  },
  statusGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '0.5rem',
    marginTop: '0.75rem',
    borderTop: '1px solid #F4F4F5',
    paddingTop: '0.75rem',
    fontFamily: 'monospace',
  },
  statusItem: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    backgroundColor: '#FAFAF7',
    border: '1px solid #E4E4E7',
    borderRadius: '6px',
    padding: '4px',
  },
  statusLabel: {
    fontSize: '0.55rem',
    color: '#71717A',
    textTransform: 'uppercase' as const,
    textAlign: 'center' as const,
  },
  statusValConnected: {
    fontSize: '0.7rem',
    fontWeight: 700,
    color: '#22C55E',
  },
  statusValPassed: {
    fontSize: '0.7rem',
    fontWeight: 700,
    color: '#3B82F6',
  },
  statusValState: {
    fontSize: '0.7rem',
    fontWeight: 700,
    color: '#18181B',
  },
};
