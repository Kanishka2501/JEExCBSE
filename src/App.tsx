import React, { useState, useEffect, useCallback, useRef } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { CloudCheck } from 'lucide-react';
import { Header } from './components/Header';
import { DayView } from './components/DayView';
import { AnswerSheet } from './components/AnswerSheet';
import { FiveDSystem } from './components/FiveDSystem';
import { PhaseSplit } from './components/PhaseSplit';
import { StudyRhythm } from './components/StudyRhythm';
import { StudyMaterial } from './components/StudyMaterial';
import { BoardTrack } from './components/BoardTrack';
import { MockLog } from './components/MockLog';
import { ErrorLog } from './components/ErrorLog';
import { FlashcardStack } from './components/FlashcardStack';
import { Footer } from './components/Footer';

import {
  ALL_DAYS,
  TOTAL_DAYS,
  clamp,
  dayNum,
} from './data/curriculum';
import {
  loadFromStorage,
  saveToStorage,
  AppStateData,
} from './utils/storage';
import { MockEntry, ErrorEntry, CardEntry, BoardEntry } from './types';
import {
  auth,
  loginWithGoogle,
  logoutUser,
  testConnection,
} from './firebase';
import {
  DEFAULT_TRACKER_ID,
  subscribeToProgress,
  saveProgress,
  subscribeToMocks,
  saveMock,
  deleteMock,
  subscribeToErrors,
  saveError,
  updateErrorFixed,
  deleteError,
  subscribeToCards,
  saveCard,
  deleteCard,
  subscribeToBoard,
  saveBoard,
  deleteBoard,
} from './utils/cloudSync';

export default function App() {
  // Test connection on boot per Firebase guidelines
  useEffect(() => {
    testConnection();
  }, []);

  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>(() => {
    return loadFromStorage<'light' | 'dark' | 'auto'>('sys90.theme', 'auto');
  });

  useEffect(() => {
    if (theme === 'auto') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }
    saveToStorage('sys90.theme', theme);
  }, [theme]);

  // Auth & Cloud Sync
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(true);
  const [syncNotice, setSyncNotice] = useState<string | null>(null);

  // Active sync target: either user's UID (if signed in) or global 'main' shared tracker
  const activeSyncId = currentUser ? currentUser.uid : DEFAULT_TRACKER_ID;
  const isUserTarget = !!currentUser;

  // Tracking flags to seed cloud only once if cloud was freshly initialized
  const hasInitializedProgress = useRef(false);
  const hasInitializedMocks = useRef(false);
  const hasInitializedErrors = useRef(false);
  const hasInitializedCards = useRef(false);
  const hasInitializedBoard = useRef(false);

  // Current day and selected day
  const today = new Date();
  const actualTodayNum = dayNum(today);
  const initialSelectedDay = clamp(actualTodayNum, 1, TOTAL_DAYS);

  const [selectedDayNum, setSelectedDayNum] = useState<number>(() => initialSelectedDay);

  // Core application persistent state
  const [done, setDone] = useState<Record<string, boolean>>(() =>
    loadFromStorage<Record<string, boolean>>('sys90.done', {})
  );

  const [mocks, setMocks] = useState<MockEntry[]>(() =>
    loadFromStorage<MockEntry[]>('sys90.mocks', [])
  );

  const [errors, setErrors] = useState<ErrorEntry[]>(() =>
    loadFromStorage<ErrorEntry[]>('sys90.errors', [])
  );

  const [cards, setCards] = useState<CardEntry[]>(() =>
    loadFromStorage<CardEntry[]>('sys90.cards', [])
  );

  const [boardEntries, setBoardEntries] = useState<BoardEntry[]>(() =>
    loadFromStorage<BoardEntry[]>('sys90.board', [])
  );

  // Auth Listener
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribeAuth();
  }, []);

  // Universal Real-Time Cloud Sync: connects and synchronizes across all browsers
  useEffect(() => {
    setIsSyncing(true);

    // 1. Progress sync
    const unsubProgress = subscribeToProgress(activeSyncId, isUserTarget, (cloudDone) => {
      if (!hasInitializedProgress.current) {
        hasInitializedProgress.current = true;
        const localDone = loadFromStorage<Record<string, boolean>>('sys90.done', {});
        // If cloud was empty but user had local ticks before sync, seed cloud once
        if (Object.keys(cloudDone).length === 0 && Object.keys(localDone).length > 0) {
          saveProgress(activeSyncId, isUserTarget, localDone);
          setDone(localDone);
          setIsSyncing(false);
          return;
        }
      }
      setDone(cloudDone);
      saveToStorage('sys90.done', cloudDone);
      setIsSyncing(false);
    });

    // 2. Mocks sync
    const unsubMocks = subscribeToMocks(activeSyncId, isUserTarget, (cloudMocks) => {
      if (!hasInitializedMocks.current) {
        hasInitializedMocks.current = true;
        const localMocks = loadFromStorage<MockEntry[]>('sys90.mocks', []);
        if (cloudMocks.length === 0 && localMocks.length > 0) {
          localMocks.forEach((m) => saveMock(activeSyncId, isUserTarget, m));
          setMocks(localMocks);
          return;
        }
      }
      setMocks(cloudMocks);
      saveToStorage('sys90.mocks', cloudMocks);
    });

    // 3. Errors sync
    const unsubErrors = subscribeToErrors(activeSyncId, isUserTarget, (cloudErrors) => {
      if (!hasInitializedErrors.current) {
        hasInitializedErrors.current = true;
        const localErrors = loadFromStorage<ErrorEntry[]>('sys90.errors', []);
        if (cloudErrors.length === 0 && localErrors.length > 0) {
          localErrors.forEach((e) => saveError(activeSyncId, isUserTarget, e));
          setErrors(localErrors);
          return;
        }
      }
      setErrors(cloudErrors);
      saveToStorage('sys90.errors', cloudErrors);
    });

    // 4. Cards sync
    const unsubCards = subscribeToCards(activeSyncId, isUserTarget, (cloudCards) => {
      if (!hasInitializedCards.current) {
        hasInitializedCards.current = true;
        const localCards = loadFromStorage<CardEntry[]>('sys90.cards', []);
        if (cloudCards.length === 0 && localCards.length > 0) {
          localCards.forEach((c) => saveCard(activeSyncId, isUserTarget, c));
          setCards(localCards);
          return;
        }
      }
      setCards(cloudCards);
      saveToStorage('sys90.cards', cloudCards);
    });

    // 5. Board sync
    const unsubBoard = subscribeToBoard(activeSyncId, isUserTarget, (cloudBoard) => {
      if (!hasInitializedBoard.current) {
        hasInitializedBoard.current = true;
        const localBoard = loadFromStorage<BoardEntry[]>('sys90.board', []);
        if (cloudBoard.length === 0 && localBoard.length > 0) {
          localBoard.forEach((b) => saveBoard(activeSyncId, isUserTarget, b));
          setBoardEntries(localBoard);
          return;
        }
      }
      setBoardEntries(cloudBoard);
      saveToStorage('sys90.board', cloudBoard);
    });

    return () => {
      unsubProgress();
      unsubMocks();
      unsubErrors();
      unsubCards();
      unsubBoard();
    };
  }, [activeSyncId, isUserTarget]);

  // Task tick handler (checked and unchecked cleanly synced)
  const handleToggleTask = useCallback(
    (day: number, taskId: string) => {
      setDone((prev) => {
        const next = { ...prev };
        const key = `${day}:${taskId}`;
        if (next[key]) {
          delete next[key];
        } else {
          next[key] = true;
        }
        saveToStorage('sys90.done', next);
        saveProgress(activeSyncId, isUserTarget, next);
        return next;
      });
    },
    [activeSyncId, isUserTarget]
  );

  const handleClearAllTicks = useCallback(() => {
    setDone({});
    saveToStorage('sys90.done', {});
    saveProgress(activeSyncId, isUserTarget, {});
  }, [activeSyncId, isUserTarget]);

  const handleAddMock = useCallback(
    (mock: MockEntry) => {
      setMocks((prev) => {
        const next = [...prev, mock];
        saveToStorage('sys90.mocks', next);
        return next;
      });
      saveMock(activeSyncId, isUserTarget, mock);
    },
    [activeSyncId, isUserTarget]
  );

  const handleRemoveMock = useCallback(
    (mockToRemove: MockEntry) => {
      setMocks((prev) => {
        const next = prev.filter(
          (m) =>
            m !== mockToRemove &&
            !(m.ts && mockToRemove.ts && m.ts === mockToRemove.ts)
        );
        saveToStorage('sys90.mocks', next);
        return next;
      });
      deleteMock(activeSyncId, isUserTarget, mockToRemove);
    },
    [activeSyncId, isUserTarget]
  );

  const handleAddError = useCallback(
    (err: ErrorEntry) => {
      setErrors((prev) => {
        const next = [...prev, err];
        saveToStorage('sys90.errors', next);
        return next;
      });
      saveError(activeSyncId, isUserTarget, err);
    },
    [activeSyncId, isUserTarget]
  );

  const handleToggleErrorFixed = useCallback(
    (errToToggle: ErrorEntry) => {
      const updatedFixed = !errToToggle.fixed;
      setErrors((prev) => {
        const next = prev.map((e) =>
          e === errToToggle || (e.ts && errToToggle.ts && e.ts === errToToggle.ts)
            ? { ...e, fixed: updatedFixed }
            : e
        );
        saveToStorage('sys90.errors', next);
        return next;
      });
      updateErrorFixed(activeSyncId, isUserTarget, {
        ...errToToggle,
        fixed: updatedFixed,
      });
    },
    [activeSyncId, isUserTarget]
  );

  const handleRemoveError = useCallback(
    (errToRemove: ErrorEntry) => {
      setErrors((prev) => {
        const next = prev.filter(
          (e) =>
            e !== errToRemove &&
            !(e.ts && errToRemove.ts && e.ts === errToRemove.ts)
        );
        saveToStorage('sys90.errors', next);
        return next;
      });
      deleteError(activeSyncId, isUserTarget, errToRemove);
    },
    [activeSyncId, isUserTarget]
  );

  const handleAddCard = useCallback(
    (card: CardEntry) => {
      setCards((prev) => {
        const next = [...prev, card];
        saveToStorage('sys90.cards', next);
        return next;
      });
      saveCard(activeSyncId, isUserTarget, card);
    },
    [activeSyncId, isUserTarget]
  );

  const handleRemoveCard = useCallback(
    (cardToRemove: CardEntry) => {
      setCards((prev) => {
        const next = prev.filter(
          (c) =>
            c !== cardToRemove &&
            !(c.ts && cardToRemove.ts && c.ts === cardToRemove.ts)
        );
        saveToStorage('sys90.cards', next);
        return next;
      });
      deleteCard(activeSyncId, isUserTarget, cardToRemove);
    },
    [activeSyncId, isUserTarget]
  );

  const handleAddBoardEntry = useCallback(
    (entry: BoardEntry) => {
      setBoardEntries((prev) => {
        const next = [...prev, entry];
        saveToStorage('sys90.board', next);
        return next;
      });
      saveBoard(activeSyncId, isUserTarget, entry);
    },
    [activeSyncId, isUserTarget]
  );

  const handleRemoveBoardEntry = useCallback(
    (entryToRemove: BoardEntry) => {
      setBoardEntries((prev) => {
        const next = prev.filter(
          (b) =>
            b !== entryToRemove &&
            !(b.ts && entryToRemove.ts && b.ts === entryToRemove.ts)
        );
        saveToStorage('sys90.board', next);
        return next;
      });
      deleteBoard(activeSyncId, isUserTarget, entryToRemove);
    },
    [activeSyncId, isUserTarget]
  );

  const handleImportBackup = useCallback(
    (data: AppStateData) => {
      setDone(data.done);
      setMocks(data.mocks);
      setErrors(data.errors);
      setCards(data.cards);
      setBoardEntries(data.board);

      saveToStorage('sys90.done', data.done);
      saveToStorage('sys90.mocks', data.mocks);
      saveToStorage('sys90.errors', data.errors);
      saveToStorage('sys90.cards', data.cards);
      saveToStorage('sys90.board', data.board);

      // Save to cloud
      saveProgress(activeSyncId, isUserTarget, data.done);
      data.mocks.forEach((m) => saveMock(activeSyncId, isUserTarget, m));
      data.errors.forEach((e) => saveError(activeSyncId, isUserTarget, e));
      data.cards.forEach((c) => saveCard(activeSyncId, isUserTarget, c));
      data.board.forEach((b) => saveBoard(activeSyncId, isUserTarget, b));
    },
    [activeSyncId, isUserTarget]
  );

  const handleSignIn = async () => {
    const res = await loginWithGoogle();
    if (res.error) {
      setSyncNotice(res.error);
      setTimeout(() => setSyncNotice(null), 5000);
    }
  };

  const handleSignOut = async () => {
    await logoutUser();
  };

  // Keyboard navigation for days
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (
        activeTag === 'input' ||
        activeTag === 'textarea' ||
        activeTag === 'select'
      ) {
        return;
      }
      if (e.key === 'ArrowLeft') {
        setSelectedDayNum((prev) => clamp(prev - 1, 1, TOTAL_DAYS));
      } else if (e.key === 'ArrowRight') {
        setSelectedDayNum((prev) => clamp(prev + 1, 1, TOTAL_DAYS));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const selectedDayData = ALL_DAYS[selectedDayNum] || ALL_DAYS[1]!;

  return (
    <div className="min-h-screen text-[var(--ink)] flex flex-col font-sans-instrument antialiased">
      <Header
        appState={{ done, mocks, errors, cards, board: boardEntries }}
        onImportBackup={handleImportBackup}
        theme={theme}
        onThemeChange={setTheme}
        currentUser={currentUser}
        isSyncing={isSyncing}
        onSignIn={handleSignIn}
        onSignOut={handleSignOut}
      />

      {/* Universal Cloud Sync Status Banner */}
      <div className="bg-emerald-500/10 border-b border-emerald-500/20 py-2 px-4 text-center text-xs text-[var(--ink)] flex flex-wrap items-center justify-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
        <CloudCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
        <span>
          <strong>Cross-Browser Cloud Sync Active:</strong> Progress is automatically saved in the cloud. Open this URL on your phone or any other browser to see and update the exact same progress in real time!
        </span>
      </div>

      {syncNotice && (
        <div className="bg-amber-500/15 border-b border-amber-500/25 py-2 px-4 text-center text-xs text-[var(--ink)] flex items-center justify-center gap-2">
          <span>{syncNotice}</span>
        </div>
      )}

      <main className="flex-1">
        {/* Main Workspace: Day View + Answer Sheet */}
        <div className="max-w-[1180px] mx-auto px-[22px] py-6 md:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_430px] gap-10 lg:gap-16 items-start">
            <DayView
              day={selectedDayData}
              todayNum={actualTodayNum}
              selectedDayNum={selectedDayNum}
              done={done}
              onToggleTask={handleToggleTask}
              onSelectDay={setSelectedDayNum}
            />

            <AnswerSheet
              days={ALL_DAYS}
              todayNum={actualTodayNum}
              selectedDayNum={selectedDayNum}
              done={done}
              onSelectDay={setSelectedDayNum}
            />
          </div>
        </div>

        {/* 5D System Overview */}
        <FiveDSystem />

        {/* 129 Days Phase Breakdown */}
        <PhaseSplit />

        {/* Normal Study Day Schedule */}
        <StudyRhythm />

        {/* Fixed Study Materials Reference */}
        <StudyMaterial />

        {/* Board Maths Track */}
        <BoardTrack
          boardEntries={boardEntries}
          onAddBoardEntry={handleAddBoardEntry}
          onRemoveBoardEntry={handleRemoveBoardEntry}
        />

        {/* JEE Mock Log */}
        <MockLog
          mocks={mocks}
          onAddMock={handleAddMock}
          onRemoveMock={handleRemoveMock}
        />

        {/* Error Log */}
        <ErrorLog
          errors={errors}
          onAddError={handleAddError}
          onToggleErrorFixed={handleToggleErrorFixed}
          onRemoveError={handleRemoveError}
        />

        {/* Flashcard Stack */}
        <FlashcardStack
          cards={cards}
          onAddCard={handleAddCard}
          onRemoveCard={handleRemoveCard}
        />
      </main>

      <Footer onClearAllTicks={handleClearAllTicks} />
    </div>
  );
}
