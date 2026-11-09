import React, { useState } from 'react';
import { X, AlertTriangle, RotateCcw, Check, Sparkles, Clock, Trash2 } from 'lucide-react';
import { DailyMissionTask } from '../types';
import { redistributeBacklog } from '../utils/plannerEngine';
import { getISTDateString } from '../utils/istDate';

interface BacklogModalProps {
  isOpen: boolean;
  onClose: () => void;
  backlogTasks: DailyMissionTask[];
  tasksByDate: Record<string, DailyMissionTask[]>;
  onApplyRedistribution: (
    updatedTasksByDate: Record<string, DailyMissionTask[]>,
    remainingBacklog: DailyMissionTask[]
  ) => void;
  onRemoveBacklogTask: (taskId: string) => void;
}

export const BacklogModal: React.FC<BacklogModalProps> = ({
  isOpen,
  onClose,
  backlogTasks,
  tasksByDate,
  onApplyRedistribution,
  onRemoveBacklogTask,
}) => {
  if (!isOpen) return null;

  const [spreadDays, setSpreadDays] = useState<number>(3);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const handleRedistribute = () => {
    const todayStr = getISTDateString();
    const result = redistributeBacklog(backlogTasks, tasksByDate, todayStr, spreadDays);

    onApplyRedistribution(result.updatedDailyTasks, result.remainingBacklog);
    setSuccessNotice(`Successfully redistributed ${backlogTasks.length} backlog tasks across next ${spreadDays} days!`);
    setTimeout(() => {
      setSuccessNotice(null);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-2xl bg-[#090D22] border border-amber-900/60 shadow-2xl text-slate-100 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-indigo-950 flex items-center justify-between bg-[#110E24]">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <AlertTriangle className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base font-black text-white">Backlog Recovery System</h2>
              <p className="text-[11px] text-amber-300">
                {backlogTasks.length} Unfinished Missions in Backlog
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-5">
          {successNotice ? (
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-600/40 text-emerald-300 text-center font-bold text-sm flex items-center justify-center gap-2">
              <Check className="w-5 h-5" />
              <span>{successNotice}</span>
            </div>
          ) : (
            <>
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                <p className="font-bold text-white mb-1">How JEE-X Backlog Recovery Works:</p>
                Falling behind is human; crashing by dumping 20 missed hours into tomorrow is fatal.
                The intelligent recovery engine distributes your pending tasks evenly across upcoming days alongside your standard blocks.
              </div>

              {/* Spread selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">
                  Redistribute Across:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[2, 3, 5].map((days) => (
                    <button
                      key={days}
                      type="button"
                      onClick={() => setSpreadDays(days)}
                      className={`py-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                        spreadDays === days
                          ? 'bg-amber-600/30 border-amber-500 text-amber-200 shadow-md'
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Next {days} Days
                    </button>
                  ))}
                </div>
              </div>

              {/* Task list */}
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {backlogTasks.length === 0 ? (
                  <p className="text-xs text-slate-500 italic text-center py-4">
                    Zero backlog items! Your execution is 100% on schedule.
                  </p>
                ) : (
                  backlogTasks.map((task) => (
                    <div
                      key={task.id}
                      className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-amber-400">{task.subject}</span>
                          <span className="text-slate-500">•</span>
                          <span className="text-slate-400">{task.targetMinutes} min</span>
                        </div>
                        <p className="font-medium text-white mt-0.5">{task.title}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => onRemoveBacklogTask(task.id)}
                        className="text-slate-500 hover:text-red-400 p-1 cursor-pointer"
                        title="Dismiss task"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {backlogTasks.length > 0 && (
                <button
                  type="button"
                  onClick={handleRedistribute}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-500 text-white font-black text-xs uppercase tracking-wider shadow-lg hover:opacity-90 cursor-pointer flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Execute Smart Redistribution Now</span>
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
