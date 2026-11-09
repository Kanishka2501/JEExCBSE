import React from 'react';
import {
  Play,
  CheckCircle2,
  Clock,
  Target,
  Sparkles,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  RotateCcw,
} from 'lucide-react';
import {
  ChapterItem,
  DailyMissionTask,
  ExamSettings,
  StudySession,
} from '../types';
import {
  getPreparationDayNumber,
  getDaysRemaining,
  formatReadableIST,
  getISTDateString,
} from '../utils/istDate';
import { calculatePace } from '../utils/plannerEngine';

interface DashboardViewProps {
  settings: ExamSettings;
  chapters: ChapterItem[];
  todayTasks: DailyMissionTask[];
  sessions: StudySession[];
  backlogTasks: DailyMissionTask[];
  onToggleTask: (taskId: string) => void;
  onStartSession: (subject?: string, chapterId?: string) => void;
  onOpenReview: () => void;
  onOpenBacklogManager: () => void;
  onNavigateTab: (tab: any) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  settings,
  chapters,
  todayTasks,
  sessions,
  backlogTasks,
  onToggleTask,
  onStartSession,
  onOpenReview,
  onOpenBacklogManager,
  onNavigateTab,
}) => {
  const todayStr = getISTDateString();
  const dayNum = getPreparationDayNumber(settings.prepStartDate, todayStr);
  const formattedDate = formatReadableIST(todayStr);

  // Today's focused study time (net focus minutes from completed sessions today)
  const todaySessions = sessions.filter((s) => s.date === todayStr);
  const todayMinutes = todaySessions.reduce((acc, s) => acc + (s.netFocusedMinutes || s.durationMinutes), 0);
  const todayHours = Number((todayMinutes / 60).toFixed(1));
  const targetHours = settings.dailyTargetHours || 8;
  const hoursProgress = Math.min(100, Math.round((todayHours / targetHours) * 100));

  // Today's tasks completion
  const totalTasks = todayTasks.length;
  const completedTasks = todayTasks.filter((t) => t.completed).length;
  const taskProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const remainingTasks = totalTasks - completedTasks;

  // Exam Countdowns
  const jee1Days = getDaysRemaining(settings.jee1Date, todayStr);
  const jee2Days = getDaysRemaining(settings.jee2Date, todayStr);
  const cbseDays = getDaysRemaining(settings.cbseMathsDate, todayStr);
  const syllabusTargetDays = getDaysRemaining(settings.syllabusTargetDate, todayStr);

  // Overall Syllabus Progress
  const totalChapters = chapters.length;
  const masteredCount = chapters.filter((c) => c.status === 'Mastered').length;
  const pyqDoneCount = chapters.filter((c) => c.status === 'PYQs Completed' || c.status === 'Chapter Test Completed' || c.status === 'Mastered').length;
  const syllabusPercent = totalChapters > 0 ? Math.round((masteredCount / totalChapters) * 100) : 0;
  const syllabusCoveragePercent = totalChapters > 0 ? Math.round((pyqDoneCount / totalChapters) * 100) : 0;

  // Pace Analysis
  const pace = calculatePace(chapters, settings, todayStr);

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Backlog Alert Banner if backlog exists */}
      {backlogTasks.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-amber-950/40 border border-amber-600/40 text-amber-200">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            <p className="text-xs sm:text-sm font-medium">
              <strong>{backlogTasks.length} Unfinished Tasks in Backlog.</strong> Smart recovery can distribute these across upcoming days without overloading tomorrow.
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenBacklogManager}
            className="px-3.5 py-1.5 rounded-lg bg-amber-600/30 hover:bg-amber-600/50 border border-amber-500/50 text-xs font-bold text-amber-100 transition-colors cursor-pointer"
          >
            Redistribute Backlog
          </button>
        </div>
      )}

      {/* Hero Mission Card: Command Centre Status */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0D122B] via-[#090D22] to-[#060816] border border-indigo-900/50 p-6 sm:p-8 shadow-2xl shadow-black/60">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-1 rounded-full bg-gradient-to-r from-violet-600/40 to-indigo-600/40 border border-violet-500/50 text-xs font-black text-cyan-300 tracking-wider uppercase">
                DAY {String(dayNum).padStart(2, '0')} • {formattedDate}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                Cycle Started 10 Nov 2026 (IST)
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              Today&apos;s Execution Mission
            </h1>

            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
              No more restarting. Only structured daily execution. Complete today&apos;s 5 study blocks, log net focused hours, and solve chapter PYQs immediately.
            </p>
          </div>

          {/* Primary Action Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
            <button
              type="button"
              onClick={() => onStartSession()}
              className="flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 text-white font-black text-sm tracking-wide shadow-xl shadow-violet-600/40 hover:shadow-cyan-400/30 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>START STUDY SESSION</span>
            </button>

            <button
              type="button"
              onClick={onOpenReview}
              className="flex items-center justify-center gap-2 px-4 py-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold transition-all cursor-pointer"
              title="Daily Performance Review"
            >
              <Sparkles className="w-4 h-4 text-violet-400" />
              <span>Daily Review</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-indigo-950/60">
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-indigo-950/80">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Today&apos;s Focus Hours</span>
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-black text-white">{todayHours}h</span>
              <span className="text-xs text-slate-400 font-semibold">/ {targetHours}h target</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-violet-500 to-cyan-400 transition-all duration-300"
                style={{ width: `${hoursProgress}%` }}
              />
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-indigo-950/80">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Tasks Completed</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-black text-white">{completedTasks}</span>
              <span className="text-xs text-slate-400 font-semibold">/ {totalTasks} tasks</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${taskProgress}%` }}
              />
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-indigo-950/80">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Overall Syllabus</span>
              <TrendingUp className="w-3.5 h-3.5 text-violet-400" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-black text-white">{syllabusCoveragePercent}%</span>
              <span className="text-xs text-slate-400 font-semibold">{pyqDoneCount} chs practiced</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                style={{ width: `${syllabusCoveragePercent}%` }}
              />
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-indigo-950/80">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Pace to Jan 05</span>
              <Target className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-black text-white">{pace.requiredDailyHours}h</span>
              <span className="text-xs text-slate-400 font-semibold">needed/day</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1 truncate">
              {pace.status === 'ON_TRACK' || pace.status === 'AHEAD' ? '✅ Pace is On Track' : '⚠️ Need +1.5h/day'}
            </p>
          </div>
        </div>
      </div>

      {/* Examination Countdown Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-indigo-950 hover:border-violet-600/40 transition-colors">
          <p className="text-[11px] font-bold text-violet-400 uppercase tracking-wider">PRIMARY TARGET</p>
          <h3 className="text-sm font-bold text-white mt-0.5">JEE Main Session 1</h3>
          <p className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-violet-300 mt-1">
            {jee1Days} <span className="text-xs font-semibold text-slate-400">days left</span>
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Tentative: {settings.jee1Date}</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-indigo-950 hover:border-cyan-600/40 transition-colors">
          <p className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">INTERNAL MILESTONE</p>
          <h3 className="text-sm font-bold text-white mt-0.5">Syllabus Finish Target</h3>
          <p className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-300 mt-1">
            {syllabusTargetDays} <span className="text-xs font-semibold text-slate-400">days left</span>
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Target: {settings.syllabusTargetDate}</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-indigo-950 hover:border-indigo-600/40 transition-colors">
          <p className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">BOARD IMPROVEMENT</p>
          <h3 className="text-sm font-bold text-white mt-0.5">CBSE Class 12 Maths</h3>
          <p className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-amber-300 mt-1">
            {cbseDays} <span className="text-xs font-semibold text-slate-400">days left</span>
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Tentative: {settings.cbseMathsDate}</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-indigo-950 hover:border-emerald-600/40 transition-colors">
          <p className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">SECONDARY TARGET</p>
          <h3 className="text-sm font-bold text-white mt-0.5">JEE Main Session 2</h3>
          <p className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-emerald-300 mt-1">
            {jee2Days} <span className="text-xs font-semibold text-slate-400">days left</span>
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Tentative: {settings.jee2Date}</p>
        </div>
      </div>

      {/* Main Two-Column Layout: Today's Tasks & Timetable vs Quick Execution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Mission Tasks (2 Columns) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>Today&apos;s Specific Mission Tasks</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                  {remainingTasks} remaining
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Check off each block as you finish studying. Focus on genuine completed work.
              </p>
            </div>

            <button
              type="button"
              onClick={() => onNavigateTab('planner')}
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
            >
              <span>Full Timetable</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {todayTasks.map((task) => {
              const subjColors: Record<string, string> = {
                Mathematics: 'border-l-violet-500 bg-violet-950/10',
                Physics: 'border-l-blue-500 bg-blue-950/10',
                Chemistry: 'border-l-emerald-500 bg-emerald-950/10',
                'CBSE Maths': 'border-l-amber-500 bg-amber-950/10',
                Revision: 'border-l-pink-500 bg-pink-950/10',
              };

              return (
                <div
                  key={task.id}
                  className={`p-4 rounded-xl bg-slate-900/90 border border-slate-800 border-l-4 ${
                    subjColors[task.subject] || 'border-l-slate-500'
                  } hover:border-slate-700 transition-all`}
                >
                  <div className="flex items-start gap-3.5">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => onToggleTask(task.id)}
                      className="mt-1 w-5 h-5 rounded border-slate-700 text-violet-600 focus:ring-violet-500 bg-slate-800 cursor-pointer"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                          {task.subject}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-slate-400">
                            {task.targetMinutes} min
                          </span>
                          {!task.completed && (
                            <button
                              type="button"
                              onClick={() => onStartSession(task.subject, task.chapterId)}
                              className="px-2 py-0.5 rounded bg-violet-600/30 hover:bg-violet-600/50 text-[11px] font-bold text-violet-300 flex items-center gap-1 cursor-pointer"
                            >
                              <Play className="w-2.5 h-2.5 fill-violet-300" />
                              <span>Focus Timer</span>
                            </button>
                          )}
                        </div>
                      </div>

                      <h3
                        className={`text-sm sm:text-base font-bold text-white mt-0.5 ${
                          task.completed ? 'line-through text-slate-500' : ''
                        }`}
                      >
                        {task.title}
                      </h3>

                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        {task.detail}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Sidebar: Daily Timetable & Discipline Guide */}
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-indigo-950 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-violet-400" />
              <span>Standard Daily Rhythm (10h Target)</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <span className="font-mono text-cyan-400 font-bold shrink-0">06:30 - 09:30</span>
                <div>
                  <p className="font-bold text-slate-200">Block 1: Mathematics</p>
                  <p className="text-slate-400">Hardest subject first. Deep concept mastery & module practice.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="font-mono text-cyan-400 font-bold shrink-0">10:15 - 13:15</span>
                <div>
                  <p className="font-bold text-slate-200">Block 2: Physics</p>
                  <p className="text-slate-400">Core derivations, concept gaps, Level 1 & 2 module problems.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="font-mono text-cyan-400 font-bold shrink-0">14:30 - 17:30</span>
                <div>
                  <p className="font-bold text-slate-200">Block 3: Chemistry</p>
                  <p className="text-slate-400">NCERT line-by-line, reaction mechanisms, numerical stoichiometry.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="font-mono text-cyan-400 font-bold shrink-0">18:30 - 20:30</span>
                <div>
                  <p className="font-bold text-slate-200">Block 4: CBSE Maths & PYQs</p>
                  <p className="text-slate-400">NCERT step-by-step writing practice + Chapter PYQs.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="font-mono text-cyan-400 font-bold shrink-0">21:15 - 22:30</span>
                <div>
                  <p className="font-bold text-slate-200">Block 5: 1-3-7 Spaced Revision & Errors</p>
                  <p className="text-slate-400">Formula recall from memory, Flashcards & error log red team review.</p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 italic">
                Bedtime 23:00 sharp. 7.5 hours uninterrupted sleep is mandatory for neural memory consolidation.
              </div>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2.5">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Academic Hubs
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => onNavigateTab('syllabus')}
                className="p-2.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-left text-slate-200 font-medium cursor-pointer transition-colors"
              >
                📚 Full Syllabus
              </button>
              <button
                type="button"
                onClick={() => onNavigateTab('tests')}
                className="p-2.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-left text-slate-200 font-medium cursor-pointer transition-colors"
              >
                🎯 PYQs & Mocks
              </button>
              <button
                type="button"
                onClick={() => onNavigateTab('cbse')}
                className="p-2.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-left text-slate-200 font-medium cursor-pointer transition-colors"
              >
                📐 CBSE Maths
              </button>
              <button
                type="button"
                onClick={() => onNavigateTab('analytics')}
                className="p-2.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-left text-slate-200 font-medium cursor-pointer transition-colors"
              >
                📊 Progress Stats
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
