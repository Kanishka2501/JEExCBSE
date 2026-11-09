import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Target,
  Sparkles,
  Play,
  Layers,
  ChevronRight,
  Flame,
} from 'lucide-react';
import { ChapterItem, Subject, ChapterStatus, PriorityLevel } from '../types';

interface SyllabusViewProps {
  chapters: ChapterItem[];
  onSelectChapter: (chapter: ChapterItem) => void;
  onStartFocusSession: (subject: string, chapterId: string) => void;
}

export const SyllabusView: React.FC<SyllabusViewProps> = ({
  chapters,
  onSelectChapter,
  onStartFocusSession,
}) => {
  const [selectedSubject, setSelectedSubject] = useState<Subject | 'All'>('All');
  const [selectedPriority, setSelectedPriority] = useState<PriorityLevel | 'All'>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Statistics
  const totalChapters = chapters.length;
  const masteredCount = chapters.filter((c) => c.status === 'Mastered').length;
  const pyqDoneCount = chapters.filter((c) => c.status === 'PYQs Completed' || c.status === 'Chapter Test Completed' || c.status === 'Mastered').length;
  const inProgressCount = chapters.filter((c) => c.status !== 'Not Started' && c.status !== 'Mastered').length;

  const physicsChapters = chapters.filter((c) => c.subject === 'Physics');
  const chemChapters = chapters.filter((c) => c.subject === 'Chemistry');
  const mathChapters = chapters.filter((c) => c.subject === 'Mathematics');

  const filteredChapters = useMemo(() => {
    return chapters.filter((ch) => {
      if (selectedSubject !== 'All' && ch.subject !== selectedSubject) return false;
      if (selectedPriority !== 'All' && ch.priority !== selectedPriority) return false;
      if (selectedStatus !== 'All') {
        if (selectedStatus === 'Mastered' && ch.status !== 'Mastered') return false;
        if (selectedStatus === 'PYQ Done' && !ch.pyqsDone) return false;
        if (selectedStatus === 'Not Started' && ch.status !== 'Not Started') return false;
        if (selectedStatus === 'In Progress' && (ch.status === 'Not Started' || ch.status === 'Mastered')) return false;
      }
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchesName = ch.name.toLowerCase().includes(term);
        const matchesCat = ch.category.toLowerCase().includes(term);
        const matchesWeak = ch.weakTopics?.some((w) => w.toLowerCase().includes(term));
        if (!matchesName && !matchesCat && !matchesWeak) return false;
      }
      return true;
    });
  }, [chapters, selectedSubject, selectedPriority, selectedStatus, searchTerm]);

  const getStatusBadge = (status: ChapterStatus) => {
    switch (status) {
      case 'Mastered':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'Chapter Test Completed':
      case 'PYQs Completed':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
      case 'PYQs in Progress':
      case 'Revision Completed':
      case 'Revision Pending':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      case 'Question Practice':
      case 'Theory Completed':
      case 'Theory in Progress':
        return 'bg-violet-500/20 text-violet-300 border-violet-500/40';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-violet-600/20 border border-violet-500/30 text-violet-400">
              <BookOpen className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-2xl font-black text-white">Official JEE Main 2027 Syllabus</h1>
              <p className="text-xs text-slate-400">
                61 Prescribed Chapters (Physics: 21 • Chemistry: 21 • Mathematics: 19)
              </p>
            </div>
          </div>
        </div>

        {/* Quick Subject Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-indigo-950">
          {(['All', 'Physics', 'Chemistry', 'Mathematics'] as const).map((subj) => (
            <button
              key={subj}
              type="button"
              onClick={() => setSelectedSubject(subj)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedSubject === subj
                  ? 'bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {subj === 'All' ? 'All Subjects' : subj}
            </button>
          ))}
        </div>
      </div>

      {/* Progress Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-indigo-950">
          <span className="text-xs text-slate-400">Total Chapters</span>
          <p className="text-2xl font-black text-white mt-1">{totalChapters}</p>
          <span className="text-[11px] text-slate-400">Official syllabus database</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-indigo-950">
          <span className="text-xs text-slate-400">Mastered (All 6 Stages)</span>
          <p className="text-2xl font-black text-emerald-400 mt-1">{masteredCount}</p>
          <span className="text-[11px] text-slate-400">{Math.round((masteredCount / totalChapters) * 100)}% fully conquered</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-indigo-950">
          <span className="text-xs text-slate-400">PYQs Solved</span>
          <p className="text-2xl font-black text-cyan-400 mt-1">{pyqDoneCount}</p>
          <span className="text-[11px] text-slate-400">{Math.round((pyqDoneCount / totalChapters) * 100)}% chapters with PYQs</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-indigo-950">
          <span className="text-xs text-slate-400">In Progress</span>
          <p className="text-2xl font-black text-violet-400 mt-1">{inProgressCount}</p>
          <span className="text-[11px] text-slate-400">Active preparation stages</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-indigo-950 flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search chapters, sub-topics, or weak areas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-violet-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value as any)}
            className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-300 focus:outline-none cursor-pointer"
          >
            <option value="All">All Priorities</option>
            <option value="Critical">Critical Priority</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-300 focus:outline-none cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Mastered">Mastered Only</option>
            <option value="PYQ Done">PYQs Completed</option>
            <option value="In Progress">In Progress</option>
            <option value="Not Started">Not Started</option>
          </select>
        </div>
      </div>

      {/* Chapters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredChapters.map((chapter) => {
          const isMastered = chapter.status === 'Mastered';

          return (
            <div
              key={chapter.id}
              className={`p-4 rounded-xl bg-slate-900/80 border transition-all hover:border-violet-500/50 flex flex-col justify-between group ${
                isMastered ? 'border-emerald-600/40 bg-emerald-950/10' : 'border-indigo-950/80'
              }`}
            >
              <div className="space-y-2.5">
                {/* Top Badges */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    {chapter.subject} • {chapter.category}
                  </span>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      chapter.priority === 'Critical'
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                        : chapter.priority === 'High'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                    }`}
                  >
                    {chapter.priority}
                  </span>
                </div>

                {/* Chapter Title */}
                <h3
                  onClick={() => onSelectChapter(chapter)}
                  className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors cursor-pointer"
                >
                  {chapter.name}
                </h3>

                {/* Status & CBSE overlap */}
                <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getStatusBadge(
                      chapter.status
                    )}`}
                  >
                    {chapter.status}
                  </span>

                  {chapter.isCbseOverlap && (
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
                      CBSE Overlap
                    </span>
                  )}
                </div>

                {/* 6 Stages Checklist Miniature */}
                <div className="grid grid-cols-5 gap-1 pt-1.5">
                  <div
                    title="Stage 1: Theory"
                    className={`h-1.5 rounded-full ${
                      chapter.theoryDone ? 'bg-violet-500' : 'bg-slate-800'
                    }`}
                  />
                  <div
                    title="Stage 2: Practice"
                    className={`h-1.5 rounded-full ${
                      chapter.practiceDone ? 'bg-indigo-500' : 'bg-slate-800'
                    }`}
                  />
                  <div
                    title="Stage 3: Revision"
                    className={`h-1.5 rounded-full ${
                      chapter.revisionDone ? 'bg-blue-500' : 'bg-slate-800'
                    }`}
                  />
                  <div
                    title="Stage 4: PYQs"
                    className={`h-1.5 rounded-full ${
                      chapter.pyqsDone ? 'bg-cyan-400' : 'bg-slate-800'
                    }`}
                  />
                  <div
                    title="Stage 5: Test"
                    className={`h-1.5 rounded-full ${
                      chapter.testCompleted ? 'bg-emerald-400' : 'bg-slate-800'
                    }`}
                  />
                </div>

                {/* PYQ Performance if logged */}
                {chapter.pyqStats.attempted > 0 && (
                  <div className="text-[11px] text-cyan-300 bg-cyan-950/20 px-2.5 py-1 rounded-lg border border-cyan-800/30 flex items-center justify-between">
                    <span>PYQs: {chapter.pyqStats.attempted} done</span>
                    <span className="font-bold">{chapter.pyqStats.accuracy}% acc</span>
                  </div>
                )}
              </div>

              {/* Bottom Card Controls */}
              <div className="pt-4 mt-3 border-t border-slate-800/80 flex items-center justify-between gap-2 text-xs">
                <span className="text-slate-400 text-[11px]">
                  {chapter.actualHours.toFixed(1)}h / {chapter.estimatedHours}h
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => onStartFocusSession(chapter.subject, chapter.id)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                    title="Start focus timer on this chapter"
                  >
                    <Play className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onSelectChapter(chapter)}
                    className="px-3 py-1 rounded-lg bg-violet-600/30 hover:bg-violet-600/50 border border-violet-500/40 text-violet-200 font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <span>Manage</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
