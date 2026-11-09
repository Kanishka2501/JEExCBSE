import React, { useState, useEffect, useCallback, useRef } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, loginWithGoogle, logoutUser, testConnection } from './firebase';
import {
  ChapterItem,
  CBSEChapterItem,
  DailyMissionTask,
  DailyReviewData,
  ExamSettings,
  JEEXAppState,
  MockTestEntry,
  StudySession,
  TestErrorItem,
} from './types';
import { DEFAULT_APP_STATE, loadFromStorage, saveToStorage } from './utils/storage';
import {
  DEFAULT_TRACKER_ID,
  subscribeToJEEXState,
  saveJEEXState,
} from './utils/cloudSync';
import { getISTDateString } from './utils/istDate';
import { generateDailyMissions } from './utils/plannerEngine';

// Components
import { Navigation, ActiveTab } from './components/Navigation';
import { DashboardView } from './components/DashboardView';
import { SyllabusView } from './components/SyllabusView';
import { DailyPlannerView } from './components/DailyPlannerView';
import { TestsAndPYQView } from './components/TestsAndPYQView';
import { CBSEMathsView } from './components/CBSEMathsView';
import { AnalyticsView } from './components/AnalyticsView';
import { SettingsView } from './components/SettingsView';
import { ChapterWorkflowModal } from './components/ChapterWorkflowModal';
import { StudyTimerModal } from './components/StudyTimerModal';
import { DailyReviewModal } from './components/DailyReviewModal';
import { BacklogModal } from './components/BacklogModal';

const STORAGE_KEY = 'jeex_app_state_v2';

export default function App() {
  // Test Firebase connection on mount
  useEffect(() => {
    testConnection();
  }, []);

  // Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isCloudSynced, setIsCloudSynced] = useState<boolean>(true);
  const activeSyncId = currentUser ? currentUser.uid : DEFAULT_TRACKER_ID;
  const isUserTarget = !!currentUser;

  // Navigation State
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  // Core App State
  const [state, setState] = useState<JEEXAppState>(() => {
    const local = loadFromStorage<JEEXAppState>(STORAGE_KEY, DEFAULT_APP_STATE);
    const today = getISTDateString();
    // Ensure today has initial daily missions if empty
    if (!local.dailyTasks[today] || local.dailyTasks[today].length === 0) {
      local.dailyTasks[today] = generateDailyMissions(
        local.chapters,
        local.cbseChapters,
        today
      );
    }
    return local;
  });

  // Modal States
  const [selectedChapterForWorkflow, setSelectedChapterForWorkflow] = useState<ChapterItem | null>(null);
  const [isTimerModalOpen, setIsTimerModalOpen] = useState(false);
  const [timerSubject, setTimerSubject] = useState<any>('Mathematics');
  const [timerChapterId, setTimerChapterId] = useState<string | undefined>(undefined);
  const [isDailyReviewOpen, setIsDailyReviewOpen] = useState(false);
  const [isBacklogModalOpen, setIsBacklogModalOpen] = useState(false);

  const hasSeededCloud = useRef(false);

  // Auth listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setCurrentUser(u));
    return () => unsub();
  }, []);

  // Universal Real-time Firestore Cloud Sync
  useEffect(() => {
    setIsCloudSynced(false);
    const unsub = subscribeToJEEXState(activeSyncId, isUserTarget, (cloudState) => {
      setIsCloudSynced(true);
      if (cloudState && Object.keys(cloudState).length > 0) {
        setState((prev) => {
          const merged: JEEXAppState = {
            ...prev,
            ...cloudState,
            settings: { ...prev.settings, ...(cloudState.settings || {}) },
            chapters: cloudState.chapters || prev.chapters,
            cbseChapters: cloudState.cbseChapters || prev.cbseChapters,
            sessions: cloudState.sessions || prev.sessions,
            dailyTasks: cloudState.dailyTasks || prev.dailyTasks,
            dailyReviews: cloudState.dailyReviews || prev.dailyReviews,
            mocks: cloudState.mocks || prev.mocks,
            errors: cloudState.errors || prev.errors,
            backlogTasks: cloudState.backlogTasks || prev.backlogTasks,
          };
          saveToStorage(STORAGE_KEY, merged);
          return merged;
        });
      } else if (!hasSeededCloud.current) {
        // Seed initial state to cloud if empty
        hasSeededCloud.current = true;
        saveJEEXState(activeSyncId, isUserTarget, state);
      }
    });

    return () => unsub();
  }, [activeSyncId, isUserTarget]);

  // Central state update function that updates local and persists to cloud
  const updateStateAndSync = useCallback(
    (updater: (prev: JEEXAppState) => JEEXAppState) => {
      setState((prev) => {
        const next = updater(prev);
        saveToStorage(STORAGE_KEY, next);
        saveJEEXState(activeSyncId, isUserTarget, next);
        return next;
      });
    },
    [activeSyncId, isUserTarget]
  );

  // Handlers
  const todayStr = getISTDateString();
  const todayTasks = state.dailyTasks[todayStr] || [];

  const handleToggleTask = useCallback(
    (taskId: string, targetDate = todayStr) => {
      updateStateAndSync((prev) => {
        const dateTasks = prev.dailyTasks[targetDate] || [];
        const updatedTasks = dateTasks.map((t) =>
          t.id === taskId
            ? {
                ...t,
                completed: !t.completed,
                completedAt: !t.completed ? new Date().toISOString() : undefined,
              }
            : t
        );
        return {
          ...prev,
          dailyTasks: {
            ...prev.dailyTasks,
            [targetDate]: updatedTasks,
          },
        };
      });
    },
    [todayStr, updateStateAndSync]
  );

  const handleAddTask = useCallback(
    (targetDate: string, task: DailyMissionTask) => {
      updateStateAndSync((prev) => {
        const dateTasks = prev.dailyTasks[targetDate] || [];
        return {
          ...prev,
          dailyTasks: {
            ...prev.dailyTasks,
            [targetDate]: [...dateTasks, task],
          },
        };
      });
    },
    [updateStateAndSync]
  );

  const handleStartSession = useCallback(
    (subject?: string, chapterId?: string) => {
      if (subject) setTimerSubject(subject as any);
      if (chapterId) {
        setTimerChapterId(chapterId);
      } else if (subject) {
        const ch = state.chapters.find((c) => c.subject === subject);
        if (ch) setTimerChapterId(ch.id);
      }
      setIsTimerModalOpen(true);
    },
    [state.chapters]
  );

  const handleCompleteSession = useCallback(
    (session: StudySession) => {
      updateStateAndSync((prev) => {
        // 1. Append session
        const nextSessions = [...prev.sessions, session];

        // 2. Increment chapter actualHours
        const nextChapters = prev.chapters.map((ch) => {
          if (ch.id === session.chapterId) {
            const addedHours = (session.netFocusedMinutes || session.durationMinutes) / 60;
            return {
              ...ch,
              actualHours: Number((ch.actualHours + addedHours).toFixed(1)),
            };
          }
          return ch;
        });

        return {
          ...prev,
          sessions: nextSessions,
          chapters: nextChapters,
        };
      });
    },
    [updateStateAndSync]
  );

  const handleUpdateChapter = useCallback(
    (updatedChapter: ChapterItem) => {
      updateStateAndSync((prev) => ({
        ...prev,
        chapters: prev.chapters.map((c) => (c.id === updatedChapter.id ? updatedChapter : c)),
      }));
      setSelectedChapterForWorkflow(updatedChapter);
    },
    [updateStateAndSync]
  );

  const handleUpdateCBSEChapter = useCallback(
    (updatedCBSE: CBSEChapterItem) => {
      updateStateAndSync((prev) => ({
        ...prev,
        cbseChapters: prev.cbseChapters.map((c) => (c.id === updatedCBSE.id ? updatedCBSE : c)),
      }));
    },
    [updateStateAndSync]
  );

  const handleAddErrorItem = useCallback(
    (errorData: {
      chapterId: string;
      chapterName: string;
      subject: any;
      questionDetails: string;
      category: any;
      correctAnswerSolution: string;
      myMistake: string;
    }) => {
      const newErr: TestErrorItem = {
        id: `err_${Date.now()}`,
        ...errorData,
        reAttemptSolved: false,
        timestamp: Date.now(),
      };

      updateStateAndSync((prev) => ({
        ...prev,
        errors: [newErr, ...prev.errors],
      }));
    },
    [updateStateAndSync]
  );

  const handleToggleErrorSolved = useCallback(
    (errorId: string) => {
      updateStateAndSync((prev) => ({
        ...prev,
        errors: prev.errors.map((e) =>
          e.id === errorId ? { ...e, reAttemptSolved: !e.reAttemptSolved } : e
        ),
      }));
    },
    [updateStateAndSync]
  );

  const handleRemoveError = useCallback(
    (errorId: string) => {
      updateStateAndSync((prev) => ({
        ...prev,
        errors: prev.errors.filter((e) => e.id !== errorId),
      }));
    },
    [updateStateAndSync]
  );

  const handleAddMock = useCallback(
    (mock: MockTestEntry) => {
      updateStateAndSync((prev) => ({
        ...prev,
        mocks: [mock, ...prev.mocks],
      }));
    },
    [updateStateAndSync]
  );

  const handleRemoveMock = useCallback(
    (mockId: string) => {
      updateStateAndSync((prev) => ({
        ...prev,
        mocks: prev.mocks.filter((m) => m.id !== mockId),
      }));
    },
    [updateStateAndSync]
  );

  const handleSaveReview = useCallback(
    (review: DailyReviewData) => {
      updateStateAndSync((prev) => ({
        ...prev,
        dailyReviews: {
          ...prev.dailyReviews,
          [review.date]: review,
        },
      }));
    },
    [updateStateAndSync]
  );

  const handleApplyRedistribution = useCallback(
    (
      updatedTasksByDate: Record<string, DailyMissionTask[]>,
      remainingBacklog: DailyMissionTask[]
    ) => {
      updateStateAndSync((prev) => ({
        ...prev,
        dailyTasks: updatedTasksByDate,
        backlogTasks: remainingBacklog,
      }));
    },
    [updateStateAndSync]
  );

  const handleRemoveBacklogTask = useCallback(
    (taskId: string) => {
      updateStateAndSync((prev) => ({
        ...prev,
        backlogTasks: prev.backlogTasks.filter((t) => t.id !== taskId),
      }));
    },
    [updateStateAndSync]
  );

  const handleUpdateSettings = useCallback(
    (newSettings: ExamSettings) => {
      updateStateAndSync((prev) => ({
        ...prev,
        settings: newSettings,
      }));
    },
    [updateStateAndSync]
  );

  const handleImportBackup = useCallback(
    (imported: JEEXAppState) => {
      updateStateAndSync(() => imported);
    },
    [updateStateAndSync]
  );

  const handleResetCycle = useCallback(() => {
    updateStateAndSync(() => {
      const fresh = { ...DEFAULT_APP_STATE };
      const today = getISTDateString();
      fresh.dailyTasks[today] = generateDailyMissions(fresh.chapters, fresh.cbseChapters, today);
      return fresh;
    });
  }, [updateStateAndSync]);

  return (
    <div className="min-h-screen bg-[#080B1A] text-slate-100 flex flex-col font-sans selection:bg-violet-600/30 selection:text-cyan-200">
      {/* Top Header & Navigation */}
      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onStartSession={() => handleStartSession()}
        prepStartDate={state.settings.prepStartDate}
        isCloudSynced={isCloudSynced}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {activeTab === 'dashboard' && (
          <DashboardView
            settings={state.settings}
            chapters={state.chapters}
            todayTasks={todayTasks}
            sessions={state.sessions}
            backlogTasks={state.backlogTasks}
            onToggleTask={(id) => handleToggleTask(id)}
            onStartSession={handleStartSession}
            onOpenReview={() => setIsDailyReviewOpen(true)}
            onOpenBacklogManager={() => setIsBacklogModalOpen(true)}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'syllabus' && (
          <SyllabusView
            chapters={state.chapters}
            onSelectChapter={setSelectedChapterForWorkflow}
            onStartFocusSession={handleStartSession}
          />
        )}

        {activeTab === 'planner' && (
          <DailyPlannerView
            settings={state.settings}
            chapters={state.chapters}
            tasksByDate={state.dailyTasks}
            sessions={state.sessions}
            backlogTasks={state.backlogTasks}
            onToggleTask={(date, id) => handleToggleTask(id, date)}
            onAddTask={handleAddTask}
            onStartFocusSession={handleStartSession}
            onOpenBacklogManager={() => setIsBacklogModalOpen(true)}
            onOpenDailyReview={() => setIsDailyReviewOpen(true)}
          />
        )}

        {activeTab === 'timer' && (
          <div className="max-w-2xl mx-auto px-4 py-8">
            <div className="p-8 rounded-2xl bg-[#090D22] border border-indigo-900/60 shadow-2xl text-center space-y-4">
              <h2 className="text-xl font-black text-white">Full Focus Session Centre</h2>
              <p className="text-xs text-slate-400">
                Launch the lock-in timer with strict 50/10 or 90/15 exam intervals. Only genuine study hours count.
              </p>
              <button
                type="button"
                onClick={() => setIsTimerModalOpen(true)}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:opacity-90 cursor-pointer"
              >
                Launch Focus Lock-In
              </button>
            </div>
          </div>
        )}

        {activeTab === 'tests' && (
          <TestsAndPYQView
            mocks={state.mocks}
            errors={state.errors}
            onAddMock={handleAddMock}
            onRemoveMock={handleRemoveMock}
            onAddError={(err) => handleAddErrorItem(err)}
            onToggleErrorSolved={handleToggleErrorSolved}
            onRemoveError={handleRemoveError}
          />
        )}

        {activeTab === 'cbse' && (
          <CBSEMathsView
            cbseChapters={state.cbseChapters}
            onUpdateCBSEChapter={handleUpdateCBSEChapter}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsView
            settings={state.settings}
            chapters={state.chapters}
            sessions={state.sessions}
            mocks={state.mocks}
            errors={state.errors}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView
            settings={state.settings}
            fullState={state}
            onUpdateSettings={handleUpdateSettings}
            onImportBackup={handleImportBackup}
            onResetCycle={handleResetCycle}
            isCloudSynced={isCloudSynced}
          />
        )}
      </main>

      {/* Floating or Modal Windows */}
      {selectedChapterForWorkflow && (
        <ChapterWorkflowModal
          chapter={selectedChapterForWorkflow}
          isOpen={!!selectedChapterForWorkflow}
          onClose={() => setSelectedChapterForWorkflow(null)}
          onUpdateChapter={handleUpdateChapter}
          onAddErrorItem={handleAddErrorItem}
          onStartFocusSession={(subj, id) => {
            setSelectedChapterForWorkflow(null);
            handleStartSession(subj, id);
          }}
        />
      )}

      {isTimerModalOpen && (
        <StudyTimerModal
          isOpen={isTimerModalOpen}
          onClose={() => setIsTimerModalOpen(false)}
          chapters={state.chapters}
          defaultSubject={timerSubject}
          defaultChapterId={timerChapterId}
          onCompleteSession={handleCompleteSession}
        />
      )}

      {isDailyReviewOpen && (
        <DailyReviewModal
          isOpen={isDailyReviewOpen}
          onClose={() => setIsDailyReviewOpen(false)}
          settings={state.settings}
          sessions={state.sessions}
          onSaveReview={handleSaveReview}
          existingReview={state.dailyReviews[todayStr]}
        />
      )}

      {isBacklogModalOpen && (
        <BacklogModal
          isOpen={isBacklogModalOpen}
          onClose={() => setIsBacklogModalOpen(false)}
          backlogTasks={state.backlogTasks}
          tasksByDate={state.dailyTasks}
          onApplyRedistribution={handleApplyRedistribution}
          onRemoveBacklogTask={handleRemoveBacklogTask}
        />
      )}
    </div>
  );
}
