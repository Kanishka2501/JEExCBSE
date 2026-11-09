import React from 'react';
import {
  BarChart3,
  Clock,
  Target,
  Award,
  AlertCircle,
  TrendingUp,
  Flame,
} from 'lucide-react';
import {
  ChapterItem,
  StudySession,
  MockTestEntry,
  TestErrorItem,
  ExamSettings,
} from '../types';
import { getPreparationDayNumber, getISTDateString } from '../utils/istDate';

interface AnalyticsViewProps {
  settings: ExamSettings;
  chapters: ChapterItem[];
  sessions: StudySession[];
  mocks: MockTestEntry[];
  errors: TestErrorItem[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  settings,
  chapters,
  sessions,
  mocks,
  errors,
}) => {
  const todayStr = getISTDateString();
  const currentPrepDay = getPreparationDayNumber(settings.prepStartDate, todayStr);

  // Total Focus Hours
  const totalFocusMinutes = sessions.reduce((acc, s) => acc + (s.netFocusedMinutes || s.durationMinutes), 0);
  const totalFocusHours = Number((totalFocusMinutes / 60).toFixed(1));

  // Subject Hours
  const subjHours: Record<string, number> = {
    Mathematics: 0,
    Physics: 0,
    Chemistry: 0,
    'CBSE Maths': 0,
  };
  sessions.forEach((s) => {
    if (subjHours[s.subject] !== undefined) {
      subjHours[s.subject] += (s.netFocusedMinutes || s.durationMinutes) / 60;
    }
  });

  // Syllabus Breakdown
  const totalChapters = chapters.length;
  const masteredCount = chapters.filter((c) => c.status === 'Mastered').length;
  const pyqDoneCount = chapters.filter((c) => c.status === 'PYQs Completed' || c.status === 'Chapter Test Completed' || c.status === 'Mastered').length;
  const inProgressCount = chapters.filter((c) => c.status !== 'Not Started' && c.status !== 'Mastered').length;
  const notStartedCount = chapters.filter((c) => c.status === 'Not Started').length;

  // Error Category Breakdown
  const errorBuckets: Record<string, number> = {
    'Conceptual Error': 0,
    'Calculation Slip': 0,
    'Formula Gap': 0,
    'Misreading Question': 0,
    'Time Management': 0,
    Guesswork: 0,
  };
  errors.forEach((err) => {
    if (errorBuckets[err.category] !== undefined) {
      errorBuckets[err.category] += 1;
    }
  });

  // Mock Average
  const averageMockScore = mocks.length > 0
    ? Math.round(mocks.reduce((acc, m) => acc + (m.score / m.totalMarks) * 100, 0) / mocks.length)
    : 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-violet-600/20 text-violet-400">
            <BarChart3 className="w-5 h-5" />
          </span>
          <div>
            <h1 className="text-2xl font-black text-white">Academic Analytics & Performance Intelligence</h1>
            <p className="text-xs text-slate-400">
              Measurable progress metrics calculated from DAY 01 (10 Nov 2026)
            </p>
          </div>
        </div>
      </div>

      {/* Top 4 Primary Numbers */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#0C112C] border border-indigo-950">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Total Focused Hours</span>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-3xl font-black text-white mt-1">{totalFocusHours}h</p>
          <span className="text-[11px] text-slate-400">Net logged study time</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#0C112C] border border-indigo-950">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Syllabus Mastered</span>
            <Target className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-black text-emerald-400 mt-1">
            {masteredCount} <span className="text-sm text-slate-400">/ {totalChapters}</span>
          </p>
          <span className="text-[11px] text-slate-400">Verified through all 6 stages</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#0C112C] border border-indigo-950">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Test Average</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-3xl font-black text-amber-400 mt-1">{averageMockScore}%</p>
          <span className="text-[11px] text-slate-400">Across {mocks.length} logged tests</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#0C112C] border border-indigo-950">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Error Queue</span>
            <AlertCircle className="w-4 h-4 text-rose-400" />
          </div>
          <p className="text-3xl font-black text-rose-400 mt-1">{errors.length}</p>
          <span className="text-[11px] text-slate-400">Mistakes tracked & analyzed</span>
        </div>
      </div>

      {/* Two Column Layout: Subject Allocation & Syllabus Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subject Time Allocation */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-indigo-950 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-violet-400" />
            <span>Subject Study Time Allocation</span>
          </h3>

          <div className="space-y-3">
            {[
              { label: 'Mathematics', hours: subjHours.Mathematics, color: 'bg-violet-500' },
              { label: 'Physics', hours: subjHours.Physics, color: 'bg-blue-500' },
              { label: 'Chemistry', hours: subjHours.Chemistry, color: 'bg-emerald-500' },
              { label: 'CBSE Maths', hours: subjHours['CBSE Maths'], color: 'bg-amber-500' },
            ].map((s) => {
              const maxHours = Math.max(1, totalFocusHours);
              const pct = Math.round((s.hours / maxHours) * 100);

              return (
                <div key={s.label} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-slate-300">{s.label}</span>
                    <span className="text-slate-400">{s.hours.toFixed(1)}h ({pct}%)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full ${s.color}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Syllabus Completion Funnel */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-indigo-950 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Target className="w-4 h-4 text-cyan-400" />
            <span>Official Syllabus Coverage Funnel</span>
          </h3>

          <div className="space-y-3">
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-emerald-400">Mastered (All 6 Stages)</span>
                <span className="text-slate-400">{masteredCount} chapters</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500" style={{ width: `${(masteredCount / totalChapters) * 100}%` }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-cyan-400">PYQs Solved</span>
                <span className="text-slate-400">{pyqDoneCount} chapters</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-400" style={{ width: `${(pyqDoneCount / totalChapters) * 100}%` }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-violet-400">In Active Preparation</span>
                <span className="text-slate-400">{inProgressCount} chapters</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-violet-500" style={{ width: `${(inProgressCount / totalChapters) * 100}%` }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-slate-400">Not Started</span>
                <span className="text-slate-400">{notStartedCount} chapters</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-slate-700" style={{ width: `${(notStartedCount / totalChapters) * 100}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error Taxonomy Analysis (The 6 Buckets) */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-indigo-950 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400" />
          <span>The 6 Error Buckets Distribution (Where are marks slipping?)</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {Object.entries(errorBuckets).map(([cat, count]) => (
            <div key={cat} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
              <span className="text-xs text-slate-400 block truncate" title={cat}>
                {cat}
              </span>
              <p className="text-2xl font-black text-rose-400 mt-1">{count}</p>
              <span className="text-[10px] text-slate-400">mistakes</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
