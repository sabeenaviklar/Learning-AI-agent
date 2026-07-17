import { useState, useEffect, useRef } from 'react';
import { Sparkles, ChevronRight, HelpCircle, FileText, Code, CheckSquare, BookOpen } from 'lucide-react';
import { queryAITutor, isApiKeyConfigured } from '../lib/groq';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  isTyping?: boolean;
  type?: 'text' | 'quiz' | 'flashcard';
  flashcardContent?: { term: string; definition: string }[];
  quizContent?: { q: string; options: string[]; ansIdx: number }[];
}

const ACTION_RESPONSES: Record<string, { text: string; type: 'text' | 'quiz' | 'flashcard'; data?: any }> = {
  "Explain": {
    type: 'text',
    text: "Think of a Decorator 🎁 like putting gift wrapper around a present. The wrapper modifies how the present looks or functions, but doesn't change the actual gift inside. In Python, a decorator is a function that takes another function as input, adds some custom behavior, and returns a new function."
  },
  "Quiz Me": {
    type: 'quiz',
    text: "Here is a quick check-in challenge on Python Functions Scope. Choose the correct index:",
    data: [
      {
        q: "What will print from this code?\n\nx = 10\ndef foo():\n  x = 5\nfoo()\nprint(x)",
        options: ["A) 5", "B) 10", "C) UnboundLocalError", "D) None"],
        ansIdx: 1
      }
    ]
  },
  "Flashcards": {
    type: 'flashcard',
    text: "Generated 3 flashcards for Functions Scope base definitions:",
    data: [
      { term: "Global Scope", definition: "Variables defined at the top-level of a file, accessible by any function." },
      { term: "Local Scope", definition: "Variables declared inside a function block; only readable within that block." },
      { term: "Enclosing Scope", definition: "Visible in nested functions, corresponding to the outer function's locals." }
    ]
  },
  "Summarize": {
    type: 'text',
    text: "⚡ Core Summary of Week 2: Functions & Scope:\n1. Reusability: Write functions to abstract logic.\n2. Scope Hierarchy: LEGB rule (Local -> Enclosing -> Global -> Built-in).\n3. Closures: Inner function retaining variables from enclosing scope even after outer has returned."
  },
  "Create Project": {
    type: 'text',
    text: "🛠️ Quick Mini-Project: Simple CLI Budget Tracker\n1. Define functions: `add_expense(budget, amount)`, `get_balance()`.\n2. Leverage global lists to store expenses.\n3. Wrap main interface in a while loop structure."
  }
};

export default function AICoach() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'ai', text: "Hello! I'm your LearningOS Tutor Agent. Choose an action chip below or ask me to explain syntax models.", type: 'text' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingText, setTypedText] = useState('');
  const [currentType, setCurrentType] = useState<'text' | 'quiz' | 'flashcard'>('text');
  const [currentData, setCurrentData] = useState<any>(null);
  
  // Quiz state
  const [selectedAns, setSelectedAns] = useState<number | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);

  const handleActionClick = async (actionName: string) => {
    if (isTyping) return;

    setSelectedAns(null);

    // 1. User Message
    const userMsgId = String(Date.now());
    setMessages(prev => [...prev, { id: userMsgId, sender: 'user', text: `${actionName} query`, type: 'text' }]);

    // 2. AI Thinking
    setIsTyping(true);
    setTypedText('');

    if (isApiKeyConfigured()) {
      try {
        const result = await queryAITutor(actionName, "Active Goal");
        
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
            setCurrentData(null);
          }
        }, 15);

      } catch (err) {
        console.error("Live tutor query failed, falling back to simulator presets:", err);
        runMockPreset(actionName);
      }
    } else {
      runMockPreset(actionName);
    }
  };

  const runMockPreset = (actionName: string) => {
    const targetResponse = ACTION_RESPONSES[actionName] || { type: 'text', text: "Ready to assist you with that concept!" };
    let idx = 0;
    setCurrentType(targetResponse.type);
    setCurrentData(targetResponse.data || null);

    const interval = setInterval(() => {
      setTypedText(prev => prev + targetResponse.text.charAt(idx));
      idx++;
      if (idx >= targetResponse.text.length) {
        clearInterval(interval);
        setMessages(prev => [
          ...prev, 
          { 
            id: String(Date.now() + 1), 
            sender: 'ai', 
            text: targetResponse.text, 
            type: targetResponse.type,
            flashcardContent: targetResponse.type === 'flashcard' ? targetResponse.data : undefined,
            quizContent: targetResponse.type === 'quiz' ? targetResponse.data : undefined
          }
        ]);
        setIsTyping(false);
        setTypedText('');
        setCurrentData(null);
      }
    }, 15);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingText, isTyping]);

  return (
    <div style={styles.chatContainer}>
      {/* Header bar */}
      <div style={styles.chatHeader}>
        <div style={styles.coachHeaderInfo}>
          <div style={styles.coachAvatar}>
            <Sparkles size={16} color="#3B82F6" />
          </div>
          <div>
            <span style={styles.coachName}>AI Tutor Shell</span>
            <span style={styles.coachStatus}>• Memory Synchronized</span>
          </div>
        </div>
        <div style={styles.badgeGroup}>
          <span style={styles.badgeStyle}>Lvl 4 Reasoning</span>
        </div>
      </div>

      {/* Messages stream */}
      <div style={styles.messagesStream}>
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            style={msg.sender === 'user' ? styles.userRow : styles.aiRow}
          >
            {msg.sender === 'ai' && (
              <div style={styles.aiMessageAvatar}>
                <Sparkles size={12} color="#3B82F6" />
              </div>
            )}
            <div style={msg.sender === 'user' ? styles.userBubble : styles.aiBubble}>
              <p style={styles.msgText}>{msg.text}</p>
              
              {/* Extra Layout for Quizzes */}
              {msg.type === 'quiz' && msg.quizContent && (
                <div style={styles.quizBox}>
                  <strong style={styles.quizQ}>{msg.quizContent[0].q}</strong>
                  <div style={styles.optionsCol}>
                    {msg.quizContent[0].options.map((opt, oIdx) => (
                      <button 
                        key={oIdx} 
                        onClick={() => setSelectedAns(oIdx)}
                        style={selectedAns === oIdx 
                          ? oIdx === msg.quizContent![0].ansIdx ? styles.optBtnCorrect : styles.optBtnWrong
                          : styles.optBtn
                        }
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                  {selectedAns !== null && (
                    <div style={styles.quizExplain}>
                      {selectedAns === msg.quizContent[0].ansIdx 
                        ? "✓ Correct! x remains 10 globally because inner foo() scope creates a local x=5."
                        : "✗ Incorrect. The global print statement resolves to x=10 since foo's x is local."
                      }
                    </div>
                  )}
                </div>
              )}

              {/* Extra Layout for Flashcards */}
              {msg.type === 'flashcard' && msg.flashcardContent && (
                <div style={styles.flashcardsGrid}>
                  {msg.flashcardContent.map((card, cIdx) => (
                    <div key={cIdx} style={styles.flashcard}>
                      <span style={styles.cardTerm}>{card.term}</span>
                      <p style={styles.cardDef}>{card.definition}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Typing message */}
        {isTyping && (
          <div style={styles.aiRow}>
            <div style={styles.aiMessageAvatar}>
              <Sparkles size={12} color="#3B82F6" />
            </div>
            <div style={styles.aiBubble}>
              {typingText ? (
                <div>
                  <p style={styles.msgText} className="typing-cursor">
                    {typingText}
                  </p>
                  
                  {/* Dynamic Quiz placeholder */}
                  {currentType === 'quiz' && currentData && (
                    <div style={styles.quizBox}>
                      <strong style={styles.quizQ}>{currentData[0].q}</strong>
                      <div style={styles.optionsCol}>
                        {currentData[0].options.map((opt: string, oIdx: number) => (
                          <button key={oIdx} style={styles.optBtnDisabled} disabled>{opt}</button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div style={styles.thinkingDots}>
                  <span style={styles.dotPulse(0)} />
                  <span style={styles.dotPulse(0.2)} />
                  <span style={styles.dotPulse(0.4)} />
                </div>
              )}
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Action Chips */}
      <div style={styles.promptsSection}>
        <span style={styles.promptsLabel}>Action Chips:</span>
        <div style={styles.promptsContainer}>
          {Object.keys(ACTION_RESPONSES).map((prompt, idx) => {
            const icon = prompt === "Explain" ? <BookOpen size={12} />
                       : prompt === "Quiz Me" ? <HelpCircle size={12} />
                       : prompt === "Flashcards" ? <FileText size={12} />
                       : prompt === "Summarize" ? <CheckSquare size={12} />
                       : <Code size={12} />;

            return (
              <button
                key={idx}
                disabled={isTyping}
                onClick={() => handleActionClick(prompt)}
                style={isTyping ? styles.promptBtnDisabled : styles.promptBtn}
              >
                {icon}
                {prompt}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const styles = {
  chatContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: '24px',
    border: '1px solid var(--border-color)',
    boxShadow: 'var(--shadow-premium)',
    width: '100%',
    maxWidth: '550px',
    height: '450px',
    display: 'flex',
    flexDirection: 'column' as const,
    overflow: 'hidden',
    textAlign: 'left' as const,
    margin: '0 auto',
  },
  chatHeader: {
    backgroundColor: '#FAFAF7',
    borderBottom: '1px solid var(--border-color)',
    padding: '1rem 1.25rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  coachHeaderInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  coachAvatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: 'rgba(59, 130, 246, 0.08)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid rgba(59, 130, 246, 0.15)',
  },
  coachName: {
    fontSize: '0.875rem',
    fontWeight: 700,
    color: '#18181B',
    display: 'block',
  },
  coachStatus: {
    fontSize: '0.7rem',
    color: '#22C55E',
    fontWeight: 500,
  },
  badgeGroup: {
    display: 'flex',
  },
  badgeStyle: {
    fontSize: '0.7rem',
    fontWeight: 600,
    backgroundColor: '#E4E4E7',
    color: '#3F3F46',
    padding: '2px 8px',
    borderRadius: '6px',
  },
  messagesStream: {
    flexGrow: 1,
    padding: '1.25rem',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
    overflowY: 'auto' as const,
    backgroundColor: '#FFFFFF',
  },
  userRow: {
    display: 'flex',
    justifyContent: 'flex-end',
    width: '100%',
  },
  aiRow: {
    display: 'flex',
    justifyContent: 'flex-start',
    gap: '0.5rem',
    width: '100%',
  },
  aiMessageAvatar: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    backgroundColor: 'rgba(59, 130, 246, 0.08)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '4px',
    flexShrink: 0,
  },
  userBubble: {
    backgroundColor: '#3B82F6',
    color: '#FFFFFF',
    borderRadius: '16px 16px 4px 16px',
    padding: '0.75rem 1rem',
    maxWidth: '80%',
    boxShadow: 'var(--shadow-sm)',
  },
  aiBubble: {
    backgroundColor: '#FAFAF7',
    color: '#18181B',
    borderRadius: '16px 16px 16px 4px',
    padding: '0.75rem 1rem',
    maxWidth: '85%',
    border: '1px solid var(--border-color)',
    boxShadow: 'var(--shadow-sm)',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.5rem',
  },
  msgText: {
    fontSize: '0.85rem',
    margin: 0,
    color: 'inherit',
    lineHeight: 1.5,
  },
  thinkingDots: {
    display: 'flex',
    gap: '4px',
    alignItems: 'center',
    padding: '4px 0',
  },
  dotPulse: (delay: number) => ({
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: '#A1A1AA',
    display: 'inline-block',
    animation: 'dot-blink 1.2s infinite both',
    animationDelay: `${delay}s`,
  }),
  promptsSection: {
    borderTop: '1px solid var(--border-color)',
    padding: '0.875rem 1.25rem',
    backgroundColor: '#FAFAF7',
  },
  promptsLabel: {
    fontSize: '0.75rem',
    fontWeight: 700,
    color: '#71717A',
    textTransform: 'uppercase' as const,
    display: 'block',
    marginBottom: '0.5rem',
  },
  promptsContainer: {
    display: 'flex',
    gap: '0.5rem',
    overflowX: 'auto' as const,
    paddingBottom: '2px',
  },
  promptBtn: {
    backgroundColor: '#FFFFFF',
    color: '#18181B',
    border: '1px solid var(--border-color)',
    borderRadius: '9999px',
    padding: '6px 12px',
    fontSize: '0.75rem',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    flexShrink: 0,
    transition: 'all 0.2s',
    boxShadow: 'var(--shadow-sm)',
    outline: 'none',
  },
  promptBtnDisabled: {
    backgroundColor: '#F4F4F5',
    color: '#A1A1AA',
    border: '1px solid var(--border-color)',
    borderRadius: '9999px',
    padding: '6px 12px',
    fontSize: '0.75rem',
    fontWeight: 600,
    cursor: 'not-allowed',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    flexShrink: 0,
    outline: 'none',
  },
  quizBox: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E4E4E7',
    borderRadius: '12px',
    padding: '0.875rem',
    marginTop: '0.5rem',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.5rem',
  },
  quizQ: {
    fontSize: '0.8rem',
    color: '#18181B',
    whiteSpace: 'pre-wrap' as const,
  },
  optionsCol: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.4rem',
  },
  optBtn: {
    width: '100%',
    padding: '6px 10px',
    borderRadius: '6px',
    border: '1px solid #E4E4E7',
    backgroundColor: '#FAFAF7',
    fontSize: '0.75rem',
    color: '#52525B',
    cursor: 'pointer',
    textAlign: 'left' as const,
    transition: 'all 0.2s',
  },
  optBtnDisabled: {
    width: '100%',
    padding: '6px 10px',
    borderRadius: '6px',
    border: '1px solid #E4E4E7',
    backgroundColor: '#FAFAF7',
    fontSize: '0.75rem',
    color: '#A1A1AA',
    textAlign: 'left' as const,
    cursor: 'not-allowed',
  },
  optBtnCorrect: {
    width: '100%',
    padding: '6px 10px',
    borderRadius: '6px',
    border: '1px solid #22C55E',
    backgroundColor: '#F0FDF4',
    fontSize: '0.75rem',
    color: '#15803D',
    fontWeight: 600,
    textAlign: 'left' as const,
  },
  optBtnWrong: {
    width: '100%',
    padding: '6px 10px',
    borderRadius: '6px',
    border: '1px solid #EF4444',
    backgroundColor: '#FEF2F2',
    fontSize: '0.75rem',
    color: '#B91C1C',
    fontWeight: 600,
    textAlign: 'left' as const,
  },
  quizExplain: {
    fontSize: '0.75rem',
    fontWeight: 600,
    color: '#18181B',
    marginTop: '0.25rem',
  },
  flashcardsGrid: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.5rem',
    width: '100%',
    marginTop: '0.5rem',
  },
  flashcard: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E4E4E7',
    borderRadius: '10px',
    padding: '8px 12px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '2px',
  },
  cardTerm: {
    fontSize: '0.8rem',
    fontWeight: 700,
    color: '#3B82F6',
  },
  cardDef: {
    fontSize: '0.75rem',
    color: '#52525B',
  },
};
