import React, { useState } from 'react';
import {
  Target,
  Plus,
  AlertCircle,
  CheckCircle2,
  Trash2,
  RotateCcw,
  Award,
  BarChart2,
  Filter,
} from 'lucide-react';
import {
  MockTestEntry,
  TestErrorItem,
  ErrorCategory,
  Subject,
} from '../types';

interface TestsAndPYQViewProps {
  mocks: MockTestEntry[];
  errors: TestErrorItem[];
  onAddMock: (mock: MockTestEntry) => void;
  onRemoveMock: (mockId: string) => void;
  onAddError: (error: TestErrorItem) => void;
  onToggleErrorSolved: (errorId: string) => void;
  onRemoveError: (errorId: string) => void;
}

export const TestsAndPYQView: React.FC<TestsAndPYQViewProps> = ({
  mocks,
  errors,
  onAddMock,
  onRemoveMock,
  onAddError,
  onToggleErrorSolved,
  onRemoveError,
}) => {
  const [activeTab, setActiveTab] = useState<'mocks' | 'errors'>('mocks');

  // New Mock Form
  const [showAddMockModal, setShowAddMockModal] = useState(false);
  const [mockTitle, setMockTitle] = useState('');
  const [mockType, setMockType] = useState<MockTestEntry['type']>('JEE Full Mock');
  const [mockPScore, setMockPScore] = useState(60);
  const [mockCScore, setMockCScore] = useState(65);
  const [mockMScore, setMockMScore] = useState(55);
  const [mockTimeTaken, setMockTimeTaken] = useState(180);
  const [mockNotes, setMockNotes] = useState('');

  // Error filters
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('All');

  const handleCreateMock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mockTitle.trim()) return;

    const p = Number(mockPScore) || 0;
    const c = Number(mockCScore) || 0;
    const m = Number(mockMScore) || 0;
    const totalMarks = mockType === 'CBSE Sample Paper' ? 80 : 300;
    const score = mockType === 'CBSE Sample Paper' ? m : p + c + m;

    const entry: MockTestEntry = {
      id: `mock_${Date.now()}`,
      title: mockTitle.trim(),
      type: mockType,
      date: new Date().toISOString().slice(0, 10),
      score,
      totalMarks,
      pScore: mockType !== 'CBSE Sample Paper' ? p : undefined,
      cScore: mockType !== 'CBSE Sample Paper' ? c : undefined,
      mScore: m,
      timeTakenMinutes: Number(mockTimeTaken),
      buckets: {
        conceptual: 0,
        calculation: 0,
        formula: 0,
        misread: 0,
        timeMgmt: 0,
        guesswork: 0,
      },
      weakChapters: [],
      notes: mockNotes.trim(),
      timestamp: Date.now(),
    };

    onAddMock(entry);
    setMockTitle('');
    setMockNotes('');
    setShowAddMockModal(false);
  };

  // Filtered errors
  const filteredErrors = errors.filter((err) => {
    if (selectedCategoryFilter !== 'All' && err.category !== selectedCategoryFilter) return false;
    if (selectedSubjectFilter !== 'All' && err.subject !== selectedSubjectFilter) return false;
    return true;
  });

  const pendingErrorsCount = errors.filter((e) => !e.reAttemptSolved).length;
  const solvedErrorsCount = errors.filter((e) => e.reAttemptSolved).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-cyan-600/20 text-cyan-400">
              <Target className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-2xl font-black text-white">Tests & Error Intelligence Centre</h1>
              <p className="text-xs text-slate-400">
                JEE Full Mocks, Chapter Tests, and the 6-Bucket Error Queue
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900 border border-indigo-950">
            <button
              type="button"
              onClick={() => setActiveTab('mocks')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'mocks'
                  ? 'bg-gradient-to-r from-violet-600 to-cyan-500 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Mock Tests Log ({mocks.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('errors')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'errors'
                  ? 'bg-gradient-to-r from-violet-600 to-cyan-500 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Error Analysis ({pendingErrorsCount} pending)
            </button>
          </div>

          {activeTab === 'mocks' && (
            <button
              type="button"
              onClick={() => setShowAddMockModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Test</span>
            </button>
          )}
        </div>
      </div>

      {/* TAB 1: MOCK TESTS */}
      {activeTab === 'mocks' && (
        <div className="space-y-4">
          {mocks.length === 0 ? (
            <div className="p-8 rounded-2xl bg-slate-900/40 border border-dashed border-slate-800 text-center space-y-2">
              <Award className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-sm font-semibold text-slate-300">No mock tests recorded yet</p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Take regular chapter tests and JEE full mocks under strict timed conditions to track your percentile readiness.
              </p>
              <button
                type="button"
                onClick={() => setShowAddMockModal(true)}
                className="mt-2 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-xs font-bold text-white cursor-pointer"
              >
                Log First Test
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mocks.map((mock) => {
                const percent = Math.round((mock.score / mock.totalMarks) * 100);

                return (
                  <div
                    key={mock.id}
                    className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-all space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/40">
                          {mock.type}
                        </span>
                        <span className="text-xs text-slate-400">{mock.date}</span>
                      </div>

                      <h3 className="text-base font-bold text-white">{mock.title}</h3>

                      <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 flex items-baseline justify-between">
                        <div>
                          <span className="text-[11px] text-slate-400">Total Score</span>
                          <p className="text-2xl font-black text-cyan-400">
                            {mock.score} <span className="text-xs text-slate-400 font-semibold">/ {mock.totalMarks}</span>
                          </p>
                        </div>
                        <span className="text-sm font-black text-white">{percent}%</span>
                      </div>

                      {/* Subject breakdown if JEE */}
                      {mock.type !== 'CBSE Sample Paper' && (
                        <div className="grid grid-cols-3 gap-1.5 text-center text-xs pt-1">
                          <div className="p-1.5 rounded bg-blue-950/30 border border-blue-900/30">
                            <span className="text-blue-400 font-bold block">P</span>
                            <span className="text-white font-black">{mock.pScore ?? '-'}</span>
                          </div>
                          <div className="p-1.5 rounded bg-emerald-950/30 border border-emerald-900/30">
                            <span className="text-emerald-400 font-bold block">C</span>
                            <span className="text-white font-black">{mock.cScore ?? '-'}</span>
                          </div>
                          <div className="p-1.5 rounded bg-violet-950/30 border border-violet-900/30">
                            <span className="text-violet-400 font-bold block">M</span>
                            <span className="text-white font-black">{mock.mScore ?? '-'}</span>
                          </div>
                        </div>
                      )}

                      {mock.notes && (
                        <p className="text-xs text-slate-400 italic pt-1">&ldquo;{mock.notes}&rdquo;</p>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                      <span className="text-slate-400">{mock.timeTakenMinutes} mins taken</span>
                      <button
                        type="button"
                        onClick={() => onRemoveMock(mock.id)}
                        className="text-slate-500 hover:text-red-400 p-1 cursor-pointer"
                        title="Delete record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: ERROR ANALYSIS */}
      {activeTab === 'errors' && (
        <div className="space-y-5">
          {/* Filter Bar */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-300">Filter By Category:</span>
              <select
                value={selectedCategoryFilter}
                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 cursor-pointer"
              >
                <option value="All">All Categories</option>
                <option value="Conceptual Error">Conceptual Error</option>
                <option value="Calculation Slip">Calculation Slip</option>
                <option value="Formula Gap">Formula Gap</option>
                <option value="Misreading Question">Misreading Question</option>
                <option value="Time Management">Time Management</option>
                <option value="Guesswork">Guesswork</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-300">Subject:</span>
              <select
                value={selectedSubjectFilter}
                onChange={(e) => setSelectedSubjectFilter(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 cursor-pointer"
              >
                <option value="All">All Subjects</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Mathematics">Mathematics</option>
                <option value="CBSE Maths">CBSE Maths</option>
              </select>
            </div>
          </div>

          {/* Errors List */}
          {filteredErrors.length === 0 ? (
            <div className="p-8 rounded-2xl bg-slate-900/40 border border-dashed border-slate-800 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <p className="text-sm font-semibold text-slate-300">No matching questions in error queue</p>
              <p className="text-xs text-slate-400">
                Log tricky or incorrectly answered questions from chapter tests and PYQs to review them here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredErrors.map((err) => {
                const catColors: Record<string, string> = {
                  'Conceptual Error': 'bg-rose-500/20 text-rose-300 border-rose-500/30',
                  'Calculation Slip': 'bg-amber-500/20 text-amber-300 border-amber-500/30',
                  'Formula Gap': 'bg-violet-500/20 text-violet-300 border-violet-500/30',
                  'Misreading Question': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
                  'Time Management': 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
                  Guesswork: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
                };

                return (
                  <div
                    key={err.id}
                    className={`p-4 sm:p-5 rounded-xl bg-slate-900/90 border transition-all ${
                      err.reAttemptSolved
                        ? 'border-emerald-700/40 opacity-75'
                        : 'border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                            {err.subject} • {err.chapterName}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                              catColors[err.category] || 'bg-slate-800 text-slate-300'
                            }`}
                          >
                            {err.category}
                          </span>
                          {err.reAttemptSolved && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              Resolved in Re-Attempt
                            </span>
                          )}
                        </div>

                        <h4 className="text-sm font-bold text-white">{err.questionDetails}</h4>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
                          <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-900/30">
                            <span className="font-bold text-rose-300 block mb-0.5">My Mistake:</span>
                            <p className="text-slate-300 leading-relaxed">{err.myMistake}</p>
                          </div>
                          {err.correctAnswerSolution && (
                            <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-900/30">
                              <span className="font-bold text-emerald-300 block mb-0.5">Correct Method:</span>
                              <p className="text-slate-300 leading-relaxed">{err.correctAnswerSolution}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center sm:flex-col gap-2 shrink-0 pt-2 sm:pt-0">
                        <button
                          type="button"
                          onClick={() => onToggleErrorSolved(err.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors ${
                            err.reAttemptSolved
                              ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                              : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{err.reAttemptSolved ? 'Mark Pending' : 'Solved!'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onRemoveError(err.id)}
                          className="p-1.5 text-slate-500 hover:text-red-400 cursor-pointer"
                          title="Delete error item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Add Mock Modal */}
      {showAddMockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <form
            onSubmit={handleCreateMock}
            className="w-full max-w-lg p-6 rounded-2xl bg-[#090E26] border border-indigo-900 shadow-2xl space-y-4"
          >
            <h3 className="text-base font-black text-white">Log Test Performance</h3>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Test Type</label>
              <select
                value={mockType}
                onChange={(e) => setMockType(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="JEE Full Mock">JEE Full Mock (300 Marks)</option>
                <option value="JEE Subject Test">JEE Subject Test (100 Marks)</option>
                <option value="Chapter Test">Timed Chapter Test</option>
                <option value="CBSE Sample Paper">CBSE Sample Paper (80 Marks)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Test Title / Identifier</label>
              <input
                type="text"
                placeholder="e.g. Allen Leader CBT-04 or MathonGo Mock 01"
                value={mockTitle}
                onChange={(e) => setMockTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400"
                required
              />
            </div>

            {mockType !== 'CBSE Sample Paper' ? (
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-blue-400">Physics (/100)</label>
                  <input
                    type="number"
                    value={mockPScore}
                    onChange={(e) => setMockPScore(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-400"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-emerald-400">Chemistry (/100)</label>
                  <input
                    type="number"
                    value={mockCScore}
                    onChange={(e) => setMockCScore(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-violet-400">Maths (/100)</label>
                  <input
                    type="number"
                    value={mockMScore}
                    onChange={(e) => setMockMScore(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-violet-400"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                <label className="text-xs font-bold text-amber-400">CBSE Maths Score (/80)</label>
                <input
                  type="number"
                  min="0"
                  max="80"
                  value={mockMScore}
                  onChange={(e) => setMockMScore(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Time Taken (Minutes)</label>
              <input
                type="number"
                value={mockTimeTaken}
                onChange={(e) => setMockTimeTaken(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Notes / Reflection</label>
              <textarea
                rows={2}
                placeholder="Key takeaways, time-management issues, silly mistakes to fix..."
                value={mockNotes}
                onChange={(e) => setMockNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddMockModal(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-xs font-bold text-white cursor-pointer"
              >
                Save Test
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
