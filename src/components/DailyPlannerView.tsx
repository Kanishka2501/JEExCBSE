import React, { useState } from 'react';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Play,
  CheckCircle2,
  Plus,
  AlertTriangle,
  Sparkles,
  Target,
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
  formatReadableIST,
  getISTDateString,
} from '../utils/istDate';
import { calculatePace } from '../utils/plannerEngine';

interface DailyPlannerViewProps {
  settings: ExamSettings;
  chapters: ChapterItem[];
  tasksByDate: Record<string, DailyMissionTask[]>;
  sessions: StudySession[];
  backlogTasks: DailyMissionTask[];
  onToggleTask: (date: string, taskId: string) => void;
  onAddTask: (date: string, task: DailyMissionTask) => void;
  onStartFocusSession: (subject?: string, chapterId?: string) => void;
  onOpenBacklogManager: () => void;
  onOpenDailyReview: () => void;
}

export const DailyPlannerView: React.FC<DailyPlannerViewProps> = ({
  settings,
  chapters,
  tasksByDate,
  sessions,
  backlogTasks,
  onToggleTask,
  onAddTask,
  onStartFocusSession,
  onOpenBacklogManager,
  onOpenDailyReview,
}) => {
  const [currentDateStr, setCurrentDateStr] = useState<string>(getISTDateString());
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskSubject, setNewTaskSubject] = useState<'Mathematics' | 'Physics' | 'Chemistry' | 'CBSE Maths' | 'Revision'>('Mathematics');
  const [newTaskDetail, setNewTaskDetail] = useState('');
  const [newTaskMinutes, setNewTaskMinutes] = useState(60);

  const dayNum = getPreparationDayNumber(settings.prepStartDate, currentDateStr);
  const formattedDate = formatReadableIST(currentDateStr);
  const pace = calculatePace(chapters, settings, currentDateStr);

  const currentTasks = tasksByDate[currentDateStr] || [];
  const completedTasks = currentTasks.filter((t) => t.completed).length;
  const totalTasks = currentTasks.length;

  // Day's logged focus time
  const daySessions = sessions.filter((s) => s.date === currentDateStr);
  const dayMinutes = daySessions.reduce((acc, s) => acc + (s.netFocusedMinutes || s.durationMinutes), 0);
  const dayHours = Number((dayMinutes / 60).toFixed(1));

  // Date stepper
  const handlePrevDay = () => {
    const d = new Date(currentDateStr);
    d.setDate(d.getDate() - 1);
    setCurrentDateStr(d.toISOString().slice(0, 10));
  };

  const handleNextDay = () => {
    const d = new Date(currentDateStr);
    d.setDate(d.getDate() + 1);
    setCurrentDateStr(d.toISOString().slice(0, 10));
  };

  const handleToday = () => {
    setCurrentDateStr(getISTDateString());
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const task: DailyMissionTask = {
      id: `task_${Date.now()}`,
      subject: newTaskSubject,
      title: newTaskTitle.trim(),
      detail: newTaskDetail.trim() || 'Custom academic target for the day',
      targetMinutes: Number(newTaskMinutes) || 60,
      completed: false,
    };

    onAddTask(currentDateStr, task);
    setNewTaskTitle('');
    setNewTaskDetail('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Top Header & Date Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#090D22] border border-indigo-900/60 shadow-xl">
        <div className="flex items-center gap-3">
          <span className="p-2.5 rounded-xl bg-violet-600/20 border border-violet-500/30 text-violet-400">
            <Calendar className="w-6 h-6" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded bg-violet-600/30 text-cyan-300">
                DAY {String(dayNum).padStart(2, '0')}
              </span>
              <span className="text-xs text-slate-400 font-medium">Cycle start: 10 Nov 2026</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white mt-0.5">{formattedDate}</h1>
          </div>
        </div>

        {/* Date Selector Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrevDay}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer transition-colors"
            title="Previous Day"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleToday}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 cursor-pointer transition-colors"
          >
            Today (IST)
          </button>
          <button
            type="button"
            onClick={handleNextDay}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer transition-colors"
            title="Next Day"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Pace & Milestone Card */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-[#0C122C] to-[#0A0E24] border border-indigo-950 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Syllabus Completion Pace (Target: {settings.syllabusTargetDate})
            </span>
          </div>
          <p className="text-xs text-slate-400">
            {pace.remainingEstimatedHours} estimated hours remaining across {pace.unstartedChapters + pace.inProgressChapters} chapters.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="text-left md:text-right">
            <span className="text-[11px] text-slate-400">Required Daily Focus</span>
            <p className="text-xl font-black text-cyan-400">{pace.requiredDailyHours} hrs/day</p>
          </div>

          <div className={`px-3 py-1.5 rounded-xl border text-xs font-bold ${
            pace.status === 'ON_TRACK' || pace.status === 'AHEAD'
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
          }`}>
            {pace.status === 'ON_TRACK' || pace.status === 'AHEAD' ? '✅ Pace On Track' : '⚠️ Intensity Increase Required'}
          </div>
        </div>
      </div>

      {/* Backlog Alert if any */}
      {backlogTasks.length > 0 && (
        <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-600/40 flex flex-wrap items-center justify-between gap-3 text-amber-200">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-xs sm:text-sm font-semibold">
              {backlogTasks.length} task(s) in backlog need redistribution.
            </span>
          </div>
          <button
            type="button"
            onClick={onOpenBacklogManager}
            className="px-3.5 py-1.5 rounded-lg bg-amber-600/30 hover:bg-amber-600/50 text-xs font-bold text-amber-100 cursor-pointer transition-colors"
          >
            Redistribute Backlog
          </button>
        </div>
      )}

      {/* Today's Tasks Section */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>Day&apos;s Mission Tasks</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                {completedTasks}/{totalTasks} Completed
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Logged today: <strong className="text-white">{dayHours}h</strong> net focus study time
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Custom Task</span>
            </button>
            <button
              type="button"
              onClick={onOpenDailyReview}
              className="px-3 py-1.5 rounded-lg bg-violet-600/30 hover:bg-violet-600/50 border border-violet-500/40 text-xs font-bold text-violet-200 flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
              <span>End-of-Day Review</span>
            </button>
          </div>
        </div>

        {/* Task Cards */}
        <div className="space-y-3">
          {currentTasks.length === 0 ? (
            <div className="p-8 rounded-2xl bg-slate-900/40 border border-dashed border-slate-800 text-center space-y-2">
              <Clock className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-sm font-semibold text-slate-300">No tasks planned for this date yet</p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Add a custom task or open Today&apos;s date to see your auto-generated 5-block execution timetable.
              </p>
              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="mt-2 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-xs font-bold text-white cursor-pointer"
              >
                Create Task
              </button>
            </div>
          ) : (
            currentTasks.map((task) => {
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
                      onChange={() => onToggleTask(currentDateStr, task.id)}
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
                              onClick={() => onStartFocusSession(task.subject, task.chapterId)}
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
            })
          )}
        </div>
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <form
            onSubmit={handleCreateTask}
            className="w-full max-w-md p-6 rounded-2xl bg-[#0A0E24] border border-indigo-900 shadow-2xl space-y-4"
          >
            <h3 className="text-base font-black text-white">Add Custom Task</h3>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Subject</label>
              <select
                value={newTaskSubject}
                onChange={(e) => setNewTaskSubject(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-violet-500"
              >
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="CBSE Maths">CBSE Maths</option>
                <option value="Revision">Revision</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Task Title</label>
              <input
                type="text"
                placeholder="e.g. Definite Integrals: King Rule 25 PYQs"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-violet-500"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Detail / Objective</label>
              <input
                type="text"
                placeholder="e.g. Focus on substitution limits and piecewise symmetry"
                value={newTaskDetail}
                onChange={(e) => setNewTaskDetail(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-violet-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Target Duration (Minutes)</label>
              <input
                type="number"
                min="15"
                step="15"
                value={newTaskMinutes}
                onChange={(e) => setNewTaskMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-violet-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-xs font-bold text-white cursor-pointer"
              >
                Add Task
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
