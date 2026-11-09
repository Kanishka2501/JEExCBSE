import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Clock,
  Target,
  FileText,
  Plus,
  Trash2,
  Award,
} from 'lucide-react';
import { ChapterItem, ChapterStatus, ErrorCategory, PriorityLevel, DifficultyLevel } from '../types';

interface ChapterWorkflowModalProps {
  chapter: ChapterItem;
  isOpen: boolean;
  onClose: () => void;
  onUpdateChapter: (updated: ChapterItem) => void;
  onAddErrorItem: (errorData: {
    chapterId: string;
    chapterName: string;
    subject: any;
    questionDetails: string;
    category: ErrorCategory;
    correctAnswerSolution: string;
    myMistake: string;
  }) => void;
  onStartFocusSession: (subject: string, chapterId: string) => void;
}

export const ChapterWorkflowModal: React.FC<ChapterWorkflowModalProps> = ({
  chapter,
  isOpen,
  onClose,
  onUpdateChapter,
  onAddErrorItem,
  onStartFocusSession,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'stages' | 'pyq' | 'test' | 'errors' | 'notes'>('stages');

  // PYQ inputs
  const [pyqTotal, setPyqTotal] = useState(chapter.pyqStats.totalAvailable || 60);
  const [pyqAttempted, setPyqAttempted] = useState(chapter.pyqStats.attempted || 0);
  const [pyqCorrect, setPyqCorrect] = useState(chapter.pyqStats.correct || 0);
  const [pyqIncorrect, setPyqIncorrect] = useState(chapter.pyqStats.incorrect || 0);
  const [pyqAvgTime, setPyqAvgTime] = useState(chapter.pyqStats.avgTimeSec || 120);

  // Test inputs
  const [testScore, setTestScore] = useState(chapter.testRecord?.score ?? 0);
  const [testTotalMarks, setTestTotalMarks] = useState(chapter.testRecord?.totalMarks ?? 100);
  const [testTimeTaken, setTestTimeTaken] = useState(chapter.testRecord?.timeTakenMinutes ?? 60);

  // Error input form
  const [errQuestion, setErrQuestion] = useState('');
  const [errCategory, setErrCategory] = useState<ErrorCategory>('Conceptual Error');
  const [errSolution, setErrSolution] = useState('');
  const [errMistake, setErrMistake] = useState('');

  // Weak topics & notes
  const [notes, setNotes] = useState(chapter.notes || '');
  const [newWeakTopic, setNewWeakTopic] = useState('');
  const [weakTopics, setWeakTopics] = useState<string[]>(chapter.weakTopics || []);

  const handleSavePYQ = () => {
    const attempted = Number(pyqAttempted);
    const correct = Number(pyqCorrect);
    const incorrect = Number(pyqIncorrect);
    const total = Number(pyqTotal);
    const unattempted = Math.max(0, total - attempted);
    const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;

    const updated: ChapterItem = {
      ...chapter,
      pyqsDone: attempted >= Math.min(30, total) && accuracy >= 60,
      pyqStats: {
        totalAvailable: total,
        attempted,
        correct,
        incorrect,
        unattempted,
        accuracy,
        avgTimeSec: Number(pyqAvgTime),
      },
      status: chapter.status === 'Not Started' || chapter.status === 'Theory in Progress' || chapter.status === 'Revision Pending'
        ? 'PYQs in Progress'
        : attempted >= 30
        ? 'PYQs Completed'
        : chapter.status,
    };
    onUpdateChapter(updated);
  };

  const handleSaveTest = () => {
    const score = Number(testScore);
    const total = Number(testTotalMarks);
    const accuracy = total > 0 ? Math.round((score / total) * 100) : 0;
    const isCompleted = score > 0;

    const updated: ChapterItem = {
      ...chapter,
      testCompleted: isCompleted,
      testRecord: {
        score,
        totalMarks: total,
        date: new Date().toISOString().slice(0, 10),
        accuracy,
        timeTakenMinutes: Number(testTimeTaken),
      },
      status: isCompleted && chapter.pyqsDone ? 'Chapter Test Completed' : chapter.status,
    };
    onUpdateChapter(updated);
  };

  const handleToggleStage = (stageKey: 'theoryDone' | 'practiceDone' | 'revisionDone' | 'pyqsDone' | 'testCompleted') => {
    const updated = { ...chapter, [stageKey]: !chapter[stageKey] };

    // Auto calculate recommended status based on verified stages
    if (updated.theoryDone && updated.practiceDone && updated.revisionDone && updated.pyqsDone && updated.testCompleted) {
      updated.status = 'Mastered';
    } else if (updated.testCompleted) {
      updated.status = 'Chapter Test Completed';
    } else if (updated.pyqsDone) {
      updated.status = 'PYQs Completed';
    } else if (updated.revisionDone) {
      updated.status = 'Revision Completed';
    } else if (updated.practiceDone) {
      updated.status = 'Revision Pending';
    } else if (updated.theoryDone) {
      updated.status = 'Question Practice';
    }
    onUpdateChapter(updated);
  };

  const handleSetStatus = (newStatus: ChapterStatus) => {
    // Prevent accidental marking as Mastered if PYQs and Test not done
    if (newStatus === 'Mastered' && (!chapter.pyqsDone || !chapter.testCompleted)) {
      alert('Chapter cannot be marked MASTERED until both Chapter PYQs (Stage 4) and Timed Test (Stage 5) are completed!');
      return;
    }
    onUpdateChapter({ ...chapter, status: newStatus });
  };

  const handleAddWeakTopic = () => {
    if (!newWeakTopic.trim()) return;
    const next = [...weakTopics, newWeakTopic.trim()];
    setWeakTopics(next);
    setNewWeakTopic('');
    onUpdateChapter({ ...chapter, weakTopics: next });
  };

  const handleRemoveWeakTopic = (index: number) => {
    const next = weakTopics.filter((_, i) => i !== index);
    setWeakTopics(next);
    onUpdateChapter({ ...chapter, weakTopics: next });
  };

  const handleSaveNotes = () => {
    onUpdateChapter({ ...chapter, notes });
  };

  const handleSubmitError = (e: React.FormEvent) => {
    e.preventDefault();
    if (!errQuestion.trim() || !errMistake.trim()) return;

    onAddErrorItem({
      chapterId: chapter.id,
      chapterName: chapter.name,
      subject: chapter.subject,
      questionDetails: errQuestion.trim(),
      category: errCategory,
      correctAnswerSolution: errSolution.trim(),
      myMistake: errMistake.trim(),
    });

    setErrQuestion('');
    setErrSolution('');
    setErrMistake('');
    setActiveTab('stages');
  };

  const statusOptions: ChapterStatus[] = [
    'Not Started',
    'Theory in Progress',
    'Theory Completed',
    'Question Practice',
    'Revision Pending',
    'Revision Completed',
    'PYQs in Progress',
    'PYQs Completed',
    'Chapter Test Completed',
    'Mastered',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl bg-[#090D22] border border-indigo-900/60 shadow-2xl text-slate-100 overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-indigo-950 flex flex-wrap items-start justify-between gap-4 bg-[#0D122E]">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded bg-violet-600/30 text-violet-300 border border-violet-500/40">
                {chapter.subject} • {chapter.category}
              </span>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                chapter.priority === 'Critical'
                  ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                  : chapter.priority === 'High'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
              }`}>
                {chapter.priority} Priority
              </span>
              {chapter.isCbseOverlap && (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  CBSE Overlap
                </span>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white">{chapter.name}</h2>
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                Est: {chapter.estimatedHours}h | Actual: {chapter.actualHours.toFixed(1)}h
              </span>
              <span>•</span>
              <span className="font-semibold text-emerald-400">
                Current Status: {chapter.status}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onStartFocusSession(chapter.subject, chapter.id)}
              className="px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-xs font-bold text-white transition-colors cursor-pointer"
            >
              Start Focus Session
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="px-5 border-b border-indigo-950 flex gap-2 overflow-x-auto bg-[#080B1A]">
          <button
            type="button"
            onClick={() => setActiveTab('stages')}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'stages'
                ? 'border-violet-500 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            6-Stage Workflow
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('pyq')}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'pyq'
                ? 'border-violet-500 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            JEE Main PYQs Record
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('test')}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'test'
                ? 'border-violet-500 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Timed Chapter Test
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('errors')}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'errors'
                ? 'border-violet-500 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Log Question Error
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('notes')}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'notes'
                ? 'border-violet-500 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Weak Areas & Notes
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* TAB 1: 6-STAGE WORKFLOW */}
          {activeTab === 'stages' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-1">
                  Mandatory Chapter Execution Pipeline
                </h3>
                <p className="text-xs text-slate-400">
                  Every chapter must complete these exact 6 stages sequentially. A chapter cannot be marked Mastered merely by watching lectures.
                </p>
              </div>

              <div className="space-y-3">
                {/* Stage 1 */}
                <div className={`p-4 rounded-xl border transition-all ${
                  chapter.theoryDone ? 'bg-violet-950/20 border-violet-600/40' : 'bg-slate-900/60 border-slate-800'
                }`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-black px-2 py-0.5 rounded bg-violet-600/30 text-violet-300">
                          STAGE 1
                        </span>
                        <h4 className="text-sm font-bold text-white">Concept Learning & Lecture Notes</h4>
                      </div>
                      <p className="text-xs text-slate-400">
                        Complete theory lectures, understand foundational mechanisms, write formula & concept notes.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggleStage('theoryDone')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors ${
                        chapter.theoryDone
                          ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{chapter.theoryDone ? 'Completed' : 'Mark Done'}</span>
                    </button>
                  </div>
                </div>

                {/* Stage 2 */}
                <div className={`p-4 rounded-xl border transition-all ${
                  chapter.practiceDone ? 'bg-violet-950/20 border-violet-600/40' : 'bg-slate-900/60 border-slate-800'
                }`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-black px-2 py-0.5 rounded bg-indigo-600/30 text-indigo-300">
                          STAGE 2
                        </span>
                        <h4 className="text-sm font-bold text-white">Question Practice & Module Exercises</h4>
                      </div>
                      <p className="text-xs text-slate-400">
                        Solve Level 1 & 2 module problems, topic-wise questions, conceptual and numerical exercises.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggleStage('practiceDone')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors ${
                        chapter.practiceDone
                          ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{chapter.practiceDone ? 'Completed' : 'Mark Done'}</span>
                    </button>
                  </div>
                </div>

                {/* Stage 3 */}
                <div className={`p-4 rounded-xl border transition-all ${
                  chapter.revisionDone ? 'bg-violet-950/20 border-violet-600/40' : 'bg-slate-900/60 border-slate-800'
                }`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-black px-2 py-0.5 rounded bg-blue-600/30 text-blue-300">
                          STAGE 3
                        </span>
                        <h4 className="text-sm font-bold text-white">Chapter Revision & Formula Recall</h4>
                      </div>
                      <p className="text-xs text-slate-400">
                        Active recall of formulas, revisit tricky derivations, identify weak sub-topics before PYQs.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggleStage('revisionDone')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors ${
                        chapter.revisionDone
                          ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{chapter.revisionDone ? 'Completed' : 'Mark Done'}</span>
                    </button>
                  </div>
                </div>

                {/* Stage 4: MANDATORY PYQS */}
                <div className={`p-4 rounded-xl border transition-all ${
                  chapter.pyqsDone ? 'bg-cyan-950/20 border-cyan-500/40' : 'bg-slate-900/60 border-slate-800'
                }`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-black px-2 py-0.5 rounded bg-cyan-600/30 text-cyan-300">
                          STAGE 4 • MANDATORY
                        </span>
                        <h4 className="text-sm font-bold text-white">JEE Main PYQs (Immediately After Revision)</h4>
                      </div>
                      <p className="text-xs text-slate-400">
                        Solve past year questions specifically for this chapter. Record accuracy and time taken.
                      </p>
                      {chapter.pyqStats.attempted > 0 && (
                        <div className="flex items-center gap-3 text-xs font-semibold text-cyan-300 pt-1">
                          <span>Attempted: {chapter.pyqStats.attempted}</span>
                          <span>•</span>
                          <span>Accuracy: {chapter.pyqStats.accuracy}%</span>
                          <span>•</span>
                          <span>Correct: {chapter.pyqStats.correct}</span>
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('pyq')}
                      className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-xs font-bold text-white transition-colors cursor-pointer"
                    >
                      Log PYQs
                    </button>
                  </div>
                </div>

                {/* Stage 5: Timed Chapter Test */}
                <div className={`p-4 rounded-xl border transition-all ${
                  chapter.testCompleted ? 'bg-amber-950/20 border-amber-500/40' : 'bg-slate-900/60 border-slate-800'
                }`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-black px-2 py-0.5 rounded bg-amber-600/30 text-amber-300">
                          STAGE 5
                        </span>
                        <h4 className="text-sm font-bold text-white">Timed Chapter Test</h4>
                      </div>
                      <p className="text-xs text-slate-400">
                        Take a 45–60 min timed test under real exam conditions. Evaluate score and exam temperament.
                      </p>
                      {chapter.testRecord && (
                        <div className="text-xs font-semibold text-amber-300 pt-1">
                          Score: {chapter.testRecord.score} / {chapter.testRecord.totalMarks} ({chapter.testRecord.accuracy}%)
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('test')}
                      className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-xs font-bold text-white transition-colors cursor-pointer"
                    >
                      Log Test
                    </button>
                  </div>
                </div>

                {/* Stage 6: Error Analysis */}
                <div className="p-4 rounded-xl border bg-slate-900/60 border-slate-800">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-black px-2 py-0.5 rounded bg-rose-600/30 text-rose-300">
                          STAGE 6
                        </span>
                        <h4 className="text-sm font-bold text-white">Error Analysis & Re-Attempt Queue</h4>
                      </div>
                      <p className="text-xs text-slate-400">
                        Categorize every mistake into one of the 6 buckets: Conceptual, Calculation, Formula, Misread, Time, or Guesswork.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('errors')}
                      className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white transition-colors cursor-pointer"
                    >
                      Log Error
                    </button>
                  </div>
                </div>
              </div>

              {/* Status Override Selector */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-indigo-950 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Official Chapter Status
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Must be backed by verifiable completion of required stages.
                  </p>
                </div>
                <select
                  value={chapter.status}
                  onChange={(e) => handleSetStatus(e.target.value as ChapterStatus)}
                  className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs font-bold text-cyan-300 focus:outline-none focus:border-violet-500 cursor-pointer"
                >
                  {statusOptions.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* TAB 2: JEE MAIN PYQS RECORD */}
          {activeTab === 'pyq' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Target className="w-4 h-4 text-cyan-400" />
                  <span>Chapter-Wise Previous Year Questions (JEE Main 2019–2026)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Solve PYQs immediately after completing revision. Track accuracy and speed.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Total PYQs Available</label>
                  <input
                    type="number"
                    min="0"
                    value={pyqTotal}
                    onChange={(e) => setPyqTotal(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Questions Attempted</label>
                  <input
                    type="number"
                    min="0"
                    value={pyqAttempted}
                    onChange={(e) => setPyqAttempted(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-emerald-400">Correct Answers</label>
                  <input
                    type="number"
                    min="0"
                    value={pyqCorrect}
                    onChange={(e) => setPyqCorrect(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-rose-400">Incorrect Answers</label>
                  <input
                    type="number"
                    min="0"
                    value={pyqIncorrect}
                    onChange={(e) => setPyqIncorrect(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-rose-400"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-300">Average Time per Question (Seconds)</label>
                  <input
                    type="number"
                    min="10"
                    step="5"
                    value={pyqAvgTime}
                    onChange={(e) => setPyqAvgTime(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400"
                  />
                  <p className="text-[11px] text-slate-400">Target for JEE Main: ~120 to 150 seconds per question.</p>
                </div>
              </div>

              {/* Calculated Summary */}
              {pyqAttempted > 0 && (
                <div className="p-4 rounded-xl bg-slate-900 border border-cyan-900/60 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="text-xs text-slate-400">Calculated Accuracy</span>
                    <p className="text-2xl font-black text-cyan-400">
                      {Math.round((pyqCorrect / pyqAttempted) * 100)}%
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400">Unattempted PYQs</span>
                    <p className="text-2xl font-black text-slate-300">
                      {Math.max(0, pyqTotal - pyqAttempted)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleSavePYQ}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 font-bold text-xs text-white shadow-lg cursor-pointer hover:opacity-90"
                  >
                    Save PYQ Metrics
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: TIMED CHAPTER TEST */}
          {activeTab === 'test' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>Timed Chapter Test Performance</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Evaluate readiness under real exam pressure with negative marking (-1 for wrong, +4 for correct).
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Score Obtained</label>
                  <input
                    type="number"
                    value={testScore}
                    onChange={(e) => setTestScore(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Total Marks</label>
                  <input
                    type="number"
                    value={testTotalMarks}
                    onChange={(e) => setTestTotalMarks(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Time Taken (Minutes)</label>
                  <input
                    type="number"
                    value={testTimeTaken}
                    onChange={(e) => setTestTimeTaken(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleSaveTest}
                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 font-bold text-xs text-white shadow-lg cursor-pointer transition-colors"
              >
                Save Test Record
              </button>
            </div>
          )}

          {/* TAB 4: LOG QUESTION ERROR */}
          {activeTab === 'errors' && (
            <form onSubmit={handleSubmitError} className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400" />
                  <span>Add Question to Error Analysis Queue</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Categorize mistake to track recurring weaknesses and schedule for re-attempt.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Question Identifier / Details</label>
                <input
                  type="text"
                  placeholder="e.g. JEE Main 2024 Jan 27 S1 Q14 - Collision on rough surface"
                  value={errQuestion}
                  onChange={(e) => setErrQuestion(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-rose-400"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Error Category (The 6 Buckets)</label>
                <select
                  value={errCategory}
                  onChange={(e) => setErrCategory(e.target.value as ErrorCategory)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-rose-400 cursor-pointer"
                >
                  <option value="Conceptual Error">1. Conceptual Error (Theory gap or misunderstanding)</option>
                  <option value="Calculation Slip">2. Calculation Slip (Algebra, sign, or arithmetic error)</option>
                  <option value="Formula Gap">3. Formula Gap (Forgot formula or applied wrong variant)</option>
                  <option value="Misreading Question">4. Misreading Question (Overlooked &apos;not&apos;, units, or initial condition)</option>
                  <option value="Time Management">5. Time Management (Rushed under time pressure)</option>
                  <option value="Guesswork">6. Guesswork (Unsure attempt or intuitive gamble)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-rose-300">What went wrong? (My Specific Mistake)</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Assumed momentum conserved along Y-axis without checking external impulse from friction..."
                  value={errMistake}
                  onChange={(e) => setErrMistake(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-rose-400"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-emerald-300">Correct Concept & Method to Remember</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Resolve along normal and tangential separately; impulse on wall = integral of N dt..."
                  value={errSolution}
                  onChange={(e) => setErrSolution(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 font-bold text-xs text-white shadow-lg cursor-pointer transition-colors"
              >
                Log to Error Queue
              </button>
            </form>
          )}

          {/* TAB 5: WEAK AREAS & NOTES */}
          {activeTab === 'notes' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-violet-400" />
                  <span>Weak Sub-Topics & Personal Academic Notes</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Tag specific topics that need extra revision before test day.
                </p>
              </div>

              {/* Weak topics tags */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">Weak Topics</label>
                <div className="flex flex-wrap items-center gap-2">
                  {weakTopics.map((topic, i) => (
                    <span
                      key={i}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/50 border border-red-700/50 text-xs text-red-200"
                    >
                      <span>{topic}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveWeakTopic(i)}
                        className="text-red-400 hover:text-red-200 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="Add a weak sub-topic (e.g. Rolling with sliding, Damped oscillations)..."
                    value={newWeakTopic}
                    onChange={(e) => setNewWeakTopic(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddWeakTopic())}
                    className="flex-1 px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-violet-400"
                  />
                  <button
                    type="button"
                    onClick={handleAddWeakTopic}
                    className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white border border-slate-700 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              </div>

              {/* Personal Chapter Notes */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Chapter Strategy Notes</label>
                <textarea
                  rows={4}
                  placeholder="Key shortcuts, mnemonic formulas, teacher cautions, or textbook page numbers..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-violet-400"
                />
              </div>

              <button
                type="button"
                onClick={handleSaveNotes}
                className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 font-bold text-xs text-white cursor-pointer"
              >
                Save Notes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
