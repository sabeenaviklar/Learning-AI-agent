import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Send, HelpCircle, FileText, Code, CheckSquare, 
  BookOpen, Plus, MessageSquare, History, Mic, Paperclip, AlertTriangle 
} from 'lucide-react';
import { queryAITutor, isApiKeyConfigured } from '../lib/groq';
import { useApp } from '../context/AppContext';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  isTyping?: boolean;
  type?: 'text' | 'quiz' | 'flashcard';
  flashcardContent?: { term: string; definition: string }[];
  quizContent?: { q: string; options: string[]; ansIdx: number }[];
}

export default function Tutor() {
  const { state } = useApp();
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: '1', 
      sender: 'ai', 
      text: `Hello! I'm your LearningOS Tutor Agent. Currently synced with your target goal: "${state.user?.careerGoal || 'AI Engineer'}". Choose an action below or type a custom query.`,
      type: 'text' 
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingText, setTypedText] = useState('');
  const [currentType, setCurrentType] = useState<'text' | 'quiz' | 'flashcard'>('text');
  const [currentData, setCurrentData] = useState<any>(null);
  const [apiWarning, setApiWarning] = useState(!isApiKeyConfigured());

  // Interactive modes states
  const [activeMode, setActiveMode] = useState<'Chat' | 'Interview' | 'Project'>('Chat');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, typingText]);

  const handleAction = async (actionName: string, customQuery?: string) => {
    if (isTyping) return;

    const userQuery = customQuery || `${actionName} query`;
    const userMsgId = String(Date.now());
    setMessages(prev => [...prev, { id: userMsgId, sender: 'user', text: userQuery, type: 'text' }]);
    setInputVal('');

    setIsTyping(true);
    setTypedText('');

    if (isApiKeyConfigured()) {
      try {
        const goal = state.roadmap?.domain || 'Software Engineering';
        const result = await queryAITutor(actionName, goal);
        
        let idx = 0;
        setCurrentType(result.type);
        setCurrentData(result.type === 'quiz' ? result.quizContent : result.type === 'flashcard' ? result.flashcardContent : null);

        const interval = setInterval(() => {
          setTypedText(prev => prev + result.text.charAt(idx));
          idx++;
          if (idx >= result.text.length) {
            clearInterval(interval);
            setMessages(prev => [
              ...prev, 
              { 
                id: String(Date.now() + 1), 
                sender: 'ai', 
                text: result.text, 
                type: result.type,
                flashcardContent: result.flashcardContent,
                quizContent: result.quizContent
              }
            ]);
            setIsTyping(false);
            setTypedText('');
          }
        }, 15);
      } catch (err: any) {
        console.error(err);
        setMessages(prev => [
          ...prev, 
          { id: String(Date.now() + 1), sender: 'ai', text: `Orchestrator error: ${err.message || 'Failed to query Groq.'}`, type: 'text' }
        ]);
        setIsTyping(false);
      }
    } else {
      // Mock fallbacks if api key is missing
      await new Promise(r => setTimeout(r, 1000));
      let fallbackText = "Based on your active goal, here is a detailed breakdown...";
      let type: 'text' | 'quiz' | 'flashcard' = 'text';
      let flashcards = undefined;
      let quiz = undefined;

      if (actionName === 'Explain') {
        fallbackText = "Decorators 🎁 in Python wrap a function to extend its behavior without editing the source code directly. This is useful for logs, access validations, or performance timing: \n\n```python\ndef my_decorator(func):\n    def wrapper():\n        print('Before call')\n        func()\n        print('After call')\n    return wrapper\n```";
      } else if (actionName === 'Flashcards') {
        fallbackText = "Here are 3 fundamental flashcards to sync with your learning style:";
        type = 'flashcard';
        flashcards = [
          { term: 'Encapsulation', definition: 'Restricting direct access to object states and placing fields under methods.' },
          { term: 'Inheritance', definition: 'Creating hierarchical sub-classes that inherit methods from parent blueprints.' },
          { term: 'Polymorphism', definition: 'Overriding parent methods inside a child class to provide customized runtime mechanics.' }
        ];
      } else if (actionName === 'Quiz Me') {
        fallbackText = "Check your understanding of variable scoping rules with this conceptual question:";
        type = 'quiz';
        quiz = [
          {
            q: "What is printed when executing the following snippet?\n\nx = 5\ndef run():\n    global x\n    x = 20\nrun()\nprint(x)",
            options: ["A) 5", "B) 20", "C) UnboundLocalError", "D) None"],
            ansIdx: 1
          }
        ];
      } else if (actionName === 'Summarize') {
        fallbackText = "⚡ Core Summary of Week 1:\n- Workspace configurations complete.\n- Python basic structures mastered.\n- First telemetry validations successfully configured.";
      } else if (actionName === 'Create Project') {
        fallbackText = "🛠️ Project: Command Line Expense Tracker\nWrite a local utility that lets users input expenses via lists, calculates weekly totals, and logs categories. Focus on function declarations and list comprehensions.";
      } else {
        fallbackText = `I hear you! You are asking: "${userQuery}". Let me search the LearningOS knowledge base. For a customized response, configure your Groq API Key in the Settings view.`;
      }

      let idx = 0;
      setCurrentType(type);
      setCurrentData(type === 'quiz' ? quiz : type === 'flashcard' ? flashcards : null);

      const interval = setInterval(() => {
        setTypedText(prev => prev + fallbackText.charAt(idx));
        idx++;
        if (idx >= fallbackText.length) {
          clearInterval(interval);
          setMessages(prev => [
            ...prev, 
            { 
              id: String(Date.now() + 1), 
              sender: 'ai', 
              text: fallbackText, 
              type,
              flashcardContent: flashcards,
              quizContent: quiz
            }
          ]);
          setIsTyping(false);
          setTypedText('');
        }
      }, 10);
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    handleAction('Explain', inputVal);
  };

  return (
    <div style={styles.tutorContainer}>
      {/* Sidebar: Conversation and modes */}
      <div style={styles.sidebar}>
        <button onClick={() => setMessages([messages[0]])} style={styles.newChatBtn}>
          <Plus size={16} />
          <span>New Session</span>
        </button>

        <div style={styles.sidebarSection}>
          <span style={styles.sectionLabel}>Tutor Modes</span>
          <div style={styles.modeList}>
            <button 
              onClick={() => setActiveMode('Chat')}
              style={styles.modeBtn(activeMode === 'Chat')}
            >
              <MessageSquare size={16} />
              <span>General Chat</span>
            </button>
            <button 
              onClick={() => setActiveMode('Interview')}
              style={styles.modeBtn(activeMode === 'Interview')}
            >
              <HelpCircle size={16} />
              <span>Interview Prep</span>
            </button>
            <button 
              onClick={() => setActiveMode('Project')}
              style={styles.modeBtn(activeMode === 'Project')}
            >
              <Code size={16} />
              <span>Project Builder</span>
            </button>
          </div>
        </div>

        <div style={styles.sidebarSection}>
          <span style={styles.sectionLabel}>Recent Logs</span>
          <div style={styles.historyList}>
            <div style={styles.historyItem}>
              <History size={12} />
              <span>Explaining Python Scope</span>
            </div>
            <div style={styles.historyItem}>
              <History size={12} />
              <span>OOP Pillars recap</span>
            </div>
            <div style={styles.historyItem}>
              <History size={12} />
              <span>AWS VPC Architecture</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main chat window */}
      <div style={styles.chatPane}>
        {apiWarning && (
          <div style={styles.warningBanner}>
            <AlertTriangle size={16} />
            <span>Mock Mode active. Tutor response handles static fallbacks. Enter an API key in Settings for live conversations.</span>
          </div>
        )}

        {/* Message Logs list */}
        <div style={styles.messageList}>
          {messages.map((m) => (
            <div key={m.id} style={styles.messageRow(m.sender)}>
              <div style={styles.avatar(m.sender)}>
                {m.sender === 'ai' ? 'AI' : 'ME'}
              </div>
              <div style={styles.messageBubble(m.sender)}>
                <p style={styles.messageText}>{m.text}</p>
                
                {/* Custom flashcard rendering */}
                {m.type === 'flashcard' && m.flashcardContent && (
                  <div style={styles.flashcardGrid}>
                    {m.flashcardContent.map((card, i) => (
                      <div key={i} style={styles.flashcard}>
                        <span style={styles.cardTerm}>{card.term}</span>
                        <p style={styles.cardDef}>{card.definition}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Custom quiz rendering */}
                {m.type === 'quiz' && m.quizContent && (
                  <div style={styles.quizPanel}>
                    {m.quizContent.map((q, i) => (
                      <div key={i} style={styles.quizBlock}>
                        <p style={styles.quizQ}>{q.q}</p>
                        <div style={styles.optionsGrid}>
                          {q.options.map((opt, oIdx) => (
                            <button 
                              key={oIdx}
                              onClick={() => {
                                alert(oIdx === q.ansIdx ? "✓ Correct! Score updated." : "❌ Incorrect. Need review.");
                              }}
                              style={styles.optBtn}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Typing log */}
          {isTyping && (
            <div style={styles.messageRow('ai')}>
              <div style={styles.avatar('ai')}>AI</div>
              <div style={styles.messageBubble('ai')}>
                <p style={styles.messageText}>
                  {typingText}
                  <span className="typing-cursor" />
                </p>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Action chips row */}
        <div style={styles.actionsRow}>
          <button onClick={() => handleAction('Explain')} style={styles.actionChip}>
            <BookOpen size={14} />
            <span>Explain Concept</span>
          </button>
          <button onClick={() => handleAction('Summarize')} style={styles.actionChip}>
            <FileText size={14} />
            <span>Summarize Syllabus</span>
          </button>
          <button onClick={() => handleAction('Flashcards')} style={styles.actionChip}>
            <CheckSquare size={14} />
            <span>Generate Flashcards</span>
          </button>
          <button onClick={() => handleAction('Quiz Me')} style={styles.actionChip}>
            <HelpCircle size={14} />
            <span>Quiz Me</span>
          </button>
          <button onClick={() => handleAction('Create Project')} style={styles.actionChip}>
            <Code size={14} />
            <span>Create Project</span>
          </button>
        </div>

        {/* Chat input box */}
        <form onSubmit={handleCustomSubmit} style={styles.inputArea}>
          <div style={styles.inputControls}>
            <button type="button" style={styles.controlBtn}>
              <Paperclip size={18} />
            </button>
            <button type="button" style={styles.controlBtn}>
              <Mic size={18} />
            </button>
          </div>
          <input 
            type="text" 
            placeholder={activeMode === 'Interview' ? "Start interview prep... Type ready" : "Ask something..."}
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            style={styles.chatInput}
          />
          <button type="submit" style={styles.sendBtn}>
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  tutorContainer: {
    display: 'flex',
    backgroundColor: '#FFFFFF',
    border: '1px solid #E4E4E7',
    borderRadius: '24px',
    height: '75vh',
    overflow: 'hidden',
  },
  sidebar: {
    width: '240px',
    backgroundColor: '#FAFAF9',
    borderRight: '1px solid #E4E4E7',
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '2rem',
    '@media (max-width: 768px)': {
      display: 'none',
    },
  },
  newChatBtn: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E4E4E7',
    borderRadius: '12px',
    padding: '10px 16px',
    fontSize: '0.85rem',
    fontWeight: 700,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
  },
  sidebarSection: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px',
  },
  sectionLabel: {
    fontSize: '0.7rem',
    fontWeight: 800,
    color: '#A1A1AA',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
  },
  modeList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '6px',
  },
  modeBtn: (active: boolean) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 12px',
    borderRadius: '10px',
    border: 'none',
    backgroundColor: active ? '#18181B' : 'transparent',
    color: active ? '#FFFFFF' : '#52525B',
    fontWeight: 650,
    fontSize: '0.85rem',
    cursor: 'pointer',
    textAlign: 'left' as const,
    transition: 'all 0.15s',
  }),
  historyList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },
  historyItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.8rem',
    color: '#71717A',
    fontWeight: 600,
    cursor: 'pointer',
    padding: '4px 8px',
    borderRadius: '6px',
    '&:hover': {
      backgroundColor: '#E4E4E7',
    },
  },
  chatPane: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    position: 'relative' as const,
    height: '100%',
  },
  warningBanner: {
    display: 'flex',
    gap: '8px',
    backgroundColor: 'rgba(250, 204, 21, 0.08)',
    borderBottom: '1px solid rgba(250, 204, 21, 0.15)',
    padding: '10px 1.5rem',
    fontSize: '0.75rem',
    color: '#854D0E',
    alignItems: 'center',
  },
  messageList: {
    flex: 1,
    padding: '2rem',
    overflowY: 'auto' as const,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1.5rem',
  },
  messageRow: (sender: 'user' | 'ai') => ({
    display: 'flex',
    gap: '12px',
    maxWidth: '85%',
    alignSelf: sender === 'user' ? 'flex-end' : 'flex-start',
    flexDirection: sender === 'user' ? 'row-reverse' as const : 'row' as const,
  }),
  avatar: (sender: 'user' | 'ai') => ({
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    backgroundColor: sender === 'ai' ? '#3B82F6' : '#18181B',
    color: '#FFFFFF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.75rem',
    fontWeight: 800,
    flexShrink: 0,
  }),
  messageBubble: (sender: 'user' | 'ai') => ({
    backgroundColor: sender === 'user' ? '#18181B' : '#FAFAF9',
    color: sender === 'user' ? '#FFFFFF' : '#18181B',
    border: sender === 'user' ? 'none' : '1px solid #E4E4E7',
    borderRadius: sender === 'user' ? '18px 4px 18px 18px' : '4px 18px 18px 18px',
    padding: '1rem 1.25rem',
  }),
  messageText: {
    fontSize: '0.9rem',
    lineHeight: 1.5,
    whiteSpace: 'pre-line' as const,
    color: 'inherit',
  },
  flashcardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '10px',
    marginTop: '12px',
  },
  flashcard: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E4E4E7',
    borderRadius: '12px',
    padding: '12px 16px',
  },
  cardTerm: {
    fontSize: '0.85rem',
    fontWeight: 800,
    color: '#3B82F6',
    display: 'block',
    marginBottom: '4px',
  },
  cardDef: {
    fontSize: '0.75rem',
    color: '#52525B',
    lineHeight: 1.35,
  },
  quizPanel: {
    marginTop: '12px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #E4E4E7',
    borderRadius: '12px',
    padding: '1.25rem',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  },
  quizBlock: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },
  quizQ: {
    fontSize: '0.85rem',
    fontWeight: 700,
    color: '#18181B',
    whiteSpace: 'pre-line' as const,
  },
  optionsGrid: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '6px',
  },
  optBtn: {
    textAlign: 'left' as const,
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid #E4E4E7',
    backgroundColor: '#FAFAF9',
    cursor: 'pointer',
    fontSize: '0.8rem',
    fontWeight: 650,
    transition: 'all 0.15s',
    '&:hover': {
      borderColor: '#3B82F6',
      backgroundColor: 'rgba(59, 130, 246, 0.02)',
    },
  },
  actionsRow: {
    padding: '8px 1.5rem',
    display: 'flex',
    gap: '8px',
    overflowX: 'auto' as const,
    borderTop: '1px solid #E4E4E7',
    backgroundColor: '#FAFAF9',
  },
  actionChip: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #E4E4E7',
    borderRadius: '9999px',
    fontSize: '0.75rem',
    fontWeight: 700,
    color: '#52525B',
    cursor: 'pointer',
    whiteSpace: 'nowrap' as const,
    transition: 'all 0.15s',
    '&:hover': {
      borderColor: '#3B82F6',
      color: '#3B82F6',
    },
  },
  inputArea: {
    borderTop: '1px solid #E4E4E7',
    padding: '1.25rem 1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    backgroundColor: '#FFFFFF',
  },
  inputControls: {
    display: 'flex',
    gap: '4px',
  },
  controlBtn: {
    background: 'none',
    border: 'none',
    color: '#A1A1AA',
    cursor: 'pointer',
    padding: '4px',
  },
  chatInput: {
    flex: 1,
    border: '1px solid #E4E4E7',
    borderRadius: '12px',
    padding: '0.7rem 1rem',
    fontSize: '0.9rem',
    outline: 'none',
    fontFamily: 'inherit',
    transition: 'border-color 0.15s',
    '&:focus': {
      borderColor: '#3B82F6',
    },
  },
  sendBtn: {
    backgroundColor: '#18181B',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '12px',
    width: '38px',
    height: '38px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.15s',
    '&:hover': {
      backgroundColor: '#3B82F6',
    },
  },
};
