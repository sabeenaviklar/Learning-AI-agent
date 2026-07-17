import React, { createContext, useContext, useState, useEffect } from 'react';

export interface UserProfile {
  name: string;
  age: string;
  occupation: string;
  college: string;
  timezone: string;
  language: string;
  budget: string;
  studyHours: number;
  style: string;
  careerGoal: string;
  targetCompany: string;
  salary: string;
  deadline: string;
  currentExperience: string;
}

export interface AssessmentResult {
  assessedLevel: string;
  strengths: string[];
  weaknesses: string[];
  learningStyle: string;
  estimatedWeeks: number;
  successProbability: number;
  roadmapRecommendation: string;
  learningDNA: string;
}

export interface RoadmapMilestone {
  week: number;
  title: string;
  tasks: string[];
}

export interface SmartNudge {
  id: string;
  type: 'inactivity' | 'quiz_fail' | 'milestone_delay' | 'encouragement';
  message: string;
  actionLabel: string;
  timestamp: string;
  dismissed: boolean;
  goalContext: string;
}

export interface AppState {
  user: UserProfile | null;
  assessment: AssessmentResult | null;
  roadmap: {
    domain: string;
    difficulty: number;
    durationWeeks: number;
    weeklyHours: number;
    successProbability: number;
    skills: string[];
    milestones: RoadmapMilestone[];
  } | null;
  completedTasks: string[];
  quizHistory: { id: string; date: string; topic: string; score: number; total: number; adaptiveReview?: boolean }[];
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  weeklyActivity: { day: string; hours: number }[];
  groqApiKey: string;
  nudges: SmartNudge[];
  lastActiveDate: string;
  streakDays: number;
  totalStudyHours: number;
}

interface AppContextType {
  state: AppState;
  setProfile: (profile: UserProfile) => void;
  setAssessment: (result: AssessmentResult) => void;
  setRoadmap: (roadmap: AppState['roadmap']) => void;
  toggleTask: (taskTitle: string) => void;
  addQuizResult: (topic: string, score: number, total: number, isAdaptiveReview?: boolean) => void;
  setGroqApiKey: (key: string) => void;
  resetAllState: () => void;
  completeOnboarding: (profile: UserProfile, assessment: AssessmentResult, roadmap: AppState['roadmap']) => void;
  dismissNudge: (id: string) => void;
  addStudyTime: (hours: number) => void;
}

const DEFAULT_STATE: AppState = {
  user: null,
  assessment: null,
  roadmap: null,
  completedTasks: [],
  quizHistory: [
    { id: '1', date: 'Yesterday', topic: 'Python Functions Scope', score: 85, total: 100 }
  ],
  riskLevel: 'LOW',
  weeklyActivity: [
    { day: 'Mon', hours: 2 },
    { day: 'Tue', hours: 1.5 },
    { day: 'Wed', hours: 3 },
    { day: 'Thu', hours: 2.5 },
    { day: 'Fri', hours: 0 },
    { day: 'Sat', hours: 0 },
    { day: 'Sun', hours: 0 },
  ],
  groqApiKey: '',
  nudges: [],
  lastActiveDate: new Date().toISOString().split('T')[0],
  streakDays: 10,
  totalStudyHours: 24,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

// Generate a contextual smart nudge
function generateNudge(
  type: SmartNudge['type'],
  goal: string,
  extra?: string
): SmartNudge {
  const messages: Record<SmartNudge['type'], { message: string; actionLabel: string }> = {
    inactivity: {
      message: `We noticed you've been away for 3+ days. To keep your ${goal} preparation on track, let's review the sections you found challenging. A 15-minute session is better than none.`,
      actionLabel: 'Resume Learning'
    },
    quiz_fail: {
      message: `Your recent quiz score indicates a knowledge gap in ${extra || 'core concepts'}. The agent has inserted a targeted revision block and reduced next milestone difficulty. Let's reinforce before moving forward.`,
      actionLabel: 'Start Revision Session'
    },
    milestone_delay: {
      message: `You're currently 2 days behind on your ${goal} milestone schedule. The roadmap has been automatically recalibrated. No stress—let's pick up today with one focused task.`,
      actionLabel: 'View Adjusted Plan'
    },
    encouragement: {
      message: `Outstanding consistency on your ${goal} journey! Your 10-day streak places you in the top 8% of learners. Keep this momentum—you're ahead of the projected schedule.`,
      actionLabel: 'View Progress'
    }
  };

  const m = messages[type];
  return {
    id: String(Date.now()),
    type,
    message: m.message,
    actionLabel: m.actionLabel,
    timestamp: new Date().toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
    dismissed: false,
    goalContext: goal,
  };
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('learningos_state_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (!parsed.groqApiKey) {
          parsed.groqApiKey = import.meta.env.VITE_GROQ_API_KEY || '';
        }
        // Ensure new fields exist
        if (!parsed.nudges) parsed.nudges = [];
        if (!parsed.lastActiveDate) parsed.lastActiveDate = new Date().toISOString().split('T')[0];
        if (!parsed.streakDays) parsed.streakDays = 0;
        if (!parsed.totalStudyHours) parsed.totalStudyHours = 0;
        return parsed;
      } catch (e) {
        console.error('Failed to parse saved state', e);
      }
    }
    return {
      ...DEFAULT_STATE,
      groqApiKey: import.meta.env.VITE_GROQ_API_KEY || '',
    };
  });

  useEffect(() => {
    localStorage.setItem('learningos_state_v2', JSON.stringify(state));
  }, [state]);

  // Check for inactivity nudge on load
  useEffect(() => {
    if (!state.user || !state.roadmap) return;
    const today = new Date().toISOString().split('T')[0];
    const lastActive = new Date(state.lastActiveDate);
    const daysDiff = Math.floor((new Date(today).getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));

    if (daysDiff >= 3) {
      const hasInactivityNudge = state.nudges.some(n => n.type === 'inactivity' && !n.dismissed);
      if (!hasInactivityNudge) {
        const newNudge = generateNudge('inactivity', state.user!.careerGoal);
        setState(prev => ({
          ...prev,
          nudges: [newNudge, ...prev.nudges.filter(n => n.type !== 'inactivity')],
          riskLevel: 'MEDIUM'
        }));
      }
    }
  }, [state.user]);

  const setProfile = (user: UserProfile) => {
    setState(prev => ({ ...prev, user }));
  };

  const setAssessment = (assessment: AssessmentResult) => {
    setState(prev => ({ ...prev, assessment }));
  };

  const setRoadmap = (roadmap: AppState['roadmap']) => {
    setState(prev => ({ ...prev, roadmap }));
  };

  const toggleTask = (taskTitle: string) => {
    setState(prev => {
      const alreadyCompleted = prev.completedTasks.includes(taskTitle);
      const completedTasks = alreadyCompleted
        ? prev.completedTasks.filter(t => t !== taskTitle)
        : [...prev.completedTasks, taskTitle];

      const totalTasks = prev.roadmap?.milestones.reduce((acc, m) => acc + m.tasks.length, 0) || 1;
      const progressPercent = (completedTasks.length / totalTasks) * 100;

      let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
      if (progressPercent < 20 && completedTasks.length < 2) riskLevel = 'MEDIUM';
      if (prev.quizHistory.length > 0) {
        const lastQuiz = prev.quizHistory[prev.quizHistory.length - 1];
        if (lastQuiz.score < 50) riskLevel = 'HIGH';
        else if (lastQuiz.score < 75) riskLevel = 'MEDIUM';
      }

      // Add encouragement nudge when task completed
      let nudges = prev.nudges;
      if (!alreadyCompleted && completedTasks.length % 3 === 0 && prev.user) {
        const encNudge = generateNudge('encouragement', prev.user.careerGoal);
        nudges = [encNudge, ...nudges];
      }

      return {
        ...prev,
        completedTasks,
        riskLevel,
        nudges,
        lastActiveDate: new Date().toISOString().split('T')[0],
      };
    });
  };

  const addQuizResult = (topic: string, score: number, total: number, isAdaptiveReview = false) => {
    setState(prev => {
      const newQuiz = {
        id: String(Date.now()),
        date: 'Today',
        topic,
        score,
        total,
        adaptiveReview: isAdaptiveReview
      };
      const quizHistory = [...prev.quizHistory, newQuiz];

      let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
      if (score < 50) riskLevel = 'HIGH';
      else if (score < 75) riskLevel = 'MEDIUM';

      const todayDay = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date().getDay()];
      const weeklyActivity = prev.weeklyActivity.map(act =>
        act.day === todayDay ? { ...act, hours: act.hours + 0.5 } : act
      );

      // Generate quiz fail nudge if score is low
      let nudges = prev.nudges;
      if (score < 60 && prev.user) {
        const failNudge = generateNudge('quiz_fail', prev.user.careerGoal, topic);
        nudges = [failNudge, ...nudges.filter(n => n.type !== 'quiz_fail')];
      }

      return {
        ...prev,
        quizHistory,
        riskLevel,
        weeklyActivity,
        nudges,
        lastActiveDate: new Date().toISOString().split('T')[0],
      };
    });
  };

  const dismissNudge = (id: string) => {
    setState(prev => ({
      ...prev,
      nudges: prev.nudges.map(n => n.id === id ? { ...n, dismissed: true } : n)
    }));
  };

  const addStudyTime = (hours: number) => {
    const todayDay = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date().getDay()];
    setState(prev => ({
      ...prev,
      totalStudyHours: prev.totalStudyHours + hours,
      weeklyActivity: prev.weeklyActivity.map(act =>
        act.day === todayDay ? { ...act, hours: act.hours + hours } : act
      ),
      lastActiveDate: new Date().toISOString().split('T')[0],
    }));
  };

  const setGroqApiKey = (groqApiKey: string) => {
    setState(prev => ({ ...prev, groqApiKey }));
  };

  const resetAllState = () => {
    localStorage.removeItem('learningos_state_v2');
    setState({
      ...DEFAULT_STATE,
      groqApiKey: import.meta.env.VITE_GROQ_API_KEY || '',
    });
  };

  const completeOnboarding = (
    user: UserProfile,
    assessment: AssessmentResult,
    roadmap: AppState['roadmap']
  ) => {
    setState(prev => ({
      ...prev,
      user,
      assessment,
      roadmap,
      completedTasks: [],
      riskLevel: 'LOW',
      nudges: [],
    }));
  };

  return (
    <AppContext.Provider value={{
      state,
      setProfile,
      setAssessment,
      setRoadmap,
      toggleTask,
      addQuizResult,
      setGroqApiKey,
      resetAllState,
      completeOnboarding,
      dismissNudge,
      addStudyTime,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
