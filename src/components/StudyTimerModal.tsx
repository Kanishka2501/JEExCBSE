import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Clock,
  Sparkles,
  Flame,
  Volume2,
} from 'lucide-react';
import { ChapterItem, Subject, StudySession } from '../types';
import { getISTDateString } from '../utils/istDate';

interface StudyTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  chapters: ChapterItem[];
  defaultSubject?: Subject;
  defaultChapterId?: string;
  onCompleteSession: (session: StudySession) => void;
}

export const StudyTimerModal: React.FC<StudyTimerModalProps> = ({
  isOpen,
  onClose,
  chapters,
  defaultSubject = 'Mathematics',
  defaultChapterId,
  onCompleteSession,
}) => {
  if (!isOpen) return null;

  const [mode, setMode] = useState<'50-10' | '90-15' | '25-5' | 'custom'>('50-10');
  const [selectedSubject, setSelectedSubject] = useState<Subject>(defaultSubject);
  const [selectedChapterId, setSelectedChapterId] = useState<string>(
    defaultChapterId || (chapters.find((c) => c.subject === defaultSubject)?.id || '')
  );

  const [studyMinutes, setStudyMinutes] = useState(50);
  const [breakMinutes, setBreakMinutes] = useState(10);
  const [secondsRemaining, setSecondsRemaining] = useState(50 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessionNotes, setSessionNotes] = useState('');
  const [elapsedFocusSeconds, setElapsedFocusSeconds] = useState(0);

  const timerRef = useRef<any>(null);

  // Sync chapters when subject changes
  const availableChapters = chapters.filter((c) => {
    if (selectedSubject === 'CBSE Maths') {
      return c.isCbseOverlap || c.subject === 'Mathematics';
    }
    return c.subject === selectedSubject;
  });

  const handleSelectMode = (newMode: '50-10' | '90-15' | '25-5' | 'custom') => {
    setMode(newMode);
    setIsActive(false);
    setIsBreak(false);

    let focusM = 50;
    let breakM = 10;
    if (newMode === '90-15') {
      focusM = 90;
      breakM = 15;
    } else if (newMode === '25-5') {
      focusM = 25;
      breakM = 5;
    }
    setStudyMinutes(focusM);
    setBreakMinutes(breakM);
    setSecondsRemaining(focusM * 60);
    setElapsedFocusSeconds(0);
  };

  useEffect(() => {
    if (defaultChapterId) {
      setSelectedChapterId(defaultChapterId);
      const ch = chapters.find((c) => c.id === defaultChapterId);
      if (ch) setSelectedSubject(ch.subject);
    }
  }, [defaultChapterId, chapters]);

  // Main countdown effect
  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            // Timer expired
            if (!isBreak) {
              // Focus period completed! Switch to break
              setIsBreak(true);
              return breakMinutes * 60;
            } else {
              // Break period completed!
              setIsActive(false);
              setIsBreak(false);
              return studyMinutes * 60;
            }
          }
          return prev - 1;
        });

        if (!isBreak) {
          setElapsedFocusSeconds((e) => e + 1);
        }
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, isBreak, breakMinutes, studyMinutes]);

  const handleTogglePlay = () => {
    setIsActive(!isActive);
  };

  const handleReset = () => {
    setIsActive(false);
    setIsBreak(false);
    setSecondsRemaining(studyMinutes * 60);
    setElapsedFocusSeconds(0);
  };

  const handleFinishAndSave = () => {
    const netMinutes = Math.max(1, Math.round(elapsedFocusSeconds / 60));
    const ch = chapters.find((c) => c.id === selectedChapterId);

    const session: StudySession = {
      id: `session_${Date.now()}`,
      date: getISTDateString(),
      subject: selectedSubject,
      chapterId: selectedChapterId,
      chapterName: ch ? ch.name : selectedSubject,
      durationMinutes: netMinutes,
      netFocusedMinutes: netMinutes,
      mode: 'focus',
      timestamp: Date.now(),
      notes: sessionNotes.trim() || undefined,
    };

    onCompleteSession(session);
    onClose();
  };

  // Format MM:SS
  const mins = Math.floor(secondsRemaining / 60);
  const secs = secondsRemaining % 60;
  const timeString = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  const totalCycleSeconds = (isBreak ? breakMinutes : studyMinutes) * 60;
  const progressPercent = Math.min(100, Math.round(((totalCycleSeconds - secondsRemaining) / totalCycleSeconds) * 100));

  const motivationalQuotes = [
    'January 2027 does not wait. Every hour counts.',
    'Focus on accuracy and clear derivation steps.',
    'Eliminate friction. Stay locked in for the full block.',
    'A rank is built one solved problem at a time.',
    'Do not break the streak of deep deliberate focus.',
  ];
  const activeQuote = motivationalQuotes[(mins + secs) % motivationalQuotes.length];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-2xl bg-[#090D22] border border-indigo-900/70 shadow-2xl text-slate-100 overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-indigo-950 flex items-center justify-between bg-[#0C112C]">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-gradient-to-tr from-violet-600 to-cyan-500 text-white">
              <Flame className="w-4 h-4 fill-white" />
            </span>
            <div>
              <h2 className="text-sm font-black uppercase tracking-wider text-white">
                Deep Focus Lock-In Timer
              </h2>
              <p className="text-[11px] text-slate-400">Authentic Net Study Hours</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector */}
        <div className="p-4 border-b border-indigo-950/60 bg-[#080B1A] flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => handleSelectMode('50-10')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                mode === '50-10'
                  ? 'bg-violet-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              50 / 10 Focus
            </button>
            <button
              type="button"
              onClick={() => handleSelectMode('90-15')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                mode === '90-15'
                  ? 'bg-violet-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              90 / 15 Exam
            </button>
            <button
              type="button"
              onClick={() => handleSelectMode('25-5')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                mode === '25-5'
                  ? 'bg-violet-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              25 / 5 Sprint
            </button>
          </div>

          <span
            className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              isBreak ? 'bg-emerald-500/20 text-emerald-300' : 'bg-cyan-500/20 text-cyan-300'
            }`}
          >
            {isBreak ? '☕ BREAK INTERVAL' : '🔥 FOCUS INTERVAL'}
          </span>
        </div>

        {/* Body & Timer Wheel */}
        <div className="p-6 sm:p-8 flex flex-col items-center text-center space-y-6">
          {/* Target Subject & Chapter Pickers */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
            <select
              value={selectedSubject}
              onChange={(e) => {
                const s = e.target.value as Subject;
                setSelectedSubject(s);
                const first = chapters.find((c) => c.subject === s);
                if (first) setSelectedChapterId(first.id);
              }}
              className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs font-bold text-white focus:outline-none focus:border-violet-500 cursor-pointer"
            >
              <option value="Mathematics">Mathematics</option>
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="CBSE Maths">CBSE Class 12 Maths</option>
            </select>

            <select
              value={selectedChapterId}
              onChange={(e) => setSelectedChapterId(e.target.value)}
              className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs font-bold text-white focus:outline-none focus:border-violet-500 cursor-pointer truncate"
            >
              {availableChapters.map((ch) => (
                <option key={ch.id} value={ch.id}>
                  {ch.name}
                </option>
              ))}
            </select>
          </div>

          {/* Big Digital Display with Circular Glow */}
          <div className="relative w-64 h-64 rounded-full flex flex-col items-center justify-center bg-gradient-to-b from-[#0F1538] to-[#070A18] border-4 border-indigo-900/60 shadow-2xl">
            {/* SVG Progress Ring */}
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle
                cx="128"
                cy="128"
                r="120"
                stroke="currentColor"
                strokeWidth="6"
                className="text-slate-800/40"
                fill="transparent"
              />
              <circle
                cx="128"
                cy="128"
                r="120"
                stroke="currentColor"
                strokeWidth="6"
                strokeDasharray={2 * Math.PI * 120}
                strokeDashoffset={2 * Math.PI * 120 * (1 - progressPercent / 100)}
                className={`transition-all duration-500 ${
                  isBreak ? 'text-emerald-400' : 'text-cyan-400'
                }`}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>

            <div className="relative z-10 space-y-1">
              <p className="text-5xl font-black tracking-tight text-white font-mono">
                {timeString}
              </p>
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                {isBreak ? 'Resting Mind' : 'Active Lock-In'}
              </p>
            </div>
          </div>

          {/* Motivational Quote */}
          <p className="text-xs text-slate-400 italic max-w-sm">
            &ldquo;{activeQuote}&rdquo;
          </p>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 w-full justify-center">
            <button
              type="button"
              onClick={handleTogglePlay}
              className={`flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-black text-sm tracking-wide shadow-xl cursor-pointer transition-all ${
                isActive
                  ? 'bg-amber-600 hover:bg-amber-500 text-white'
                  : 'bg-gradient-to-r from-violet-600 to-cyan-500 hover:opacity-90 text-white'
              }`}
            >
              {isActive ? (
                <>
                  <Pause className="w-4 h-4 fill-white" />
                  <span>PAUSE</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>START FOCUS</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="p-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer transition-colors"
              title="Reset Timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Elapsed & Finish Now */}
          {elapsedFocusSeconds > 60 && (
            <div className="w-full pt-4 border-t border-indigo-950/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <span className="text-cyan-300 font-semibold">
                Focused: {Math.round(elapsedFocusSeconds / 60)} minutes logged
              </span>

              <button
                type="button"
                onClick={handleFinishAndSave}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 cursor-pointer shadow-lg transition-colors"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Save Net Hours to Profile</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
