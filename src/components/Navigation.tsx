import React from 'react';
import {
  Flame,
  BookOpen,
  CalendarDays,
  Timer,
  Target,
  Compass,
  BarChart3,
  Settings,
  CloudCheck,
  Play,
} from 'lucide-react';
import { getPreparationDayNumber, formatReadableIST, getCurrentISTDate } from '../utils/istDate';

export type ActiveTab =
  | 'dashboard'
  | 'syllabus'
  | 'planner'
  | 'timer'
  | 'tests'
  | 'cbse'
  | 'analytics'
  | 'settings';

interface NavigationProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onStartSession: () => void;
  prepStartDate: string;
  isCloudSynced: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  onStartSession,
  prepStartDate,
  isCloudSynced,
}) => {
  const istDate = getCurrentISTDate();
  const dayNum = getPreparationDayNumber(prepStartDate);
  const formattedToday = formatReadableIST(prepStartDate.length ? prepStartDate : '2026-11-10');

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Flame },
    { id: 'syllabus', label: 'Syllabus', icon: BookOpen },
    { id: 'planner', label: 'Daily Planner', icon: CalendarDays },
    { id: 'timer', label: 'Study Timer', icon: Timer },
    { id: 'tests', label: 'PYQs & Tests', icon: Target },
    { id: 'cbse', label: 'CBSE Maths', icon: Compass },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#080B1A]/95 backdrop-blur-md border-b border-indigo-950/60 shadow-xl shadow-black/40">
      {/* Top Banner: Branding + Day Counter + Start Action */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Brand & Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-violet-600/30 font-black text-white text-base tracking-tighter">
              2.0
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-300 to-cyan-400 text-lg">
                  JEE-X 2.0
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-300 border border-violet-500/30">
                  LOCK-IN EDITION
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                JEE Main 2027 + CBSE Maths Command Centre
              </p>
            </div>
          </div>

          <div className="hidden md:block h-6 w-px bg-indigo-950 mx-1" />

          {/* Day & Date Indicator */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-violet-950/40 border border-violet-800/40 text-xs">
            <span className="font-bold text-violet-300">DAY {String(dayNum).padStart(2, '0')}</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-300 font-medium">10 Nov 2026 Start</span>
          </div>
        </div>

        {/* Right CTA: Cloud Sync & Start Study Session */}
        <div className="flex items-center gap-2.5">
          {/* Cloud Sync Status */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-[11px] text-slate-300"
            title="Real-time multi-browser cloud sync active"
          >
            <CloudCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Sync Active</span>
          </div>

          {/* Primary Action Button */}
          <button
            type="button"
            onClick={onStartSession}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 text-white text-xs font-bold shadow-lg shadow-violet-600/30 hover:shadow-cyan-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>START STUDY SESSION</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="max-w-7xl mx-auto px-2 sm:px-6 border-t border-indigo-950/40 overflow-x-auto scrollbar-none">
        <nav className="flex items-center gap-1 py-1.5 min-w-max">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onTabChange(item.id as ActiveTab)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-violet-600/30 to-indigo-600/20 text-cyan-300 border border-violet-500/40 shadow-inner'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
