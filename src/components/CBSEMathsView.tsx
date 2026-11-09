import React, { useState } from 'react';
import {
  Compass,
  CheckCircle2,
  FileText,
  Award,
  BookOpen,
  Sparkles,
  Link as LinkIcon,
  HelpCircle,
} from 'lucide-react';
import { CBSEChapterItem } from '../types';

interface CBSEMathsViewProps {
  cbseChapters: CBSEChapterItem[];
  onUpdateCBSEChapter: (updated: CBSEChapterItem) => void;
}

export const CBSEMathsView: React.FC<CBSEMathsViewProps> = ({
  cbseChapters,
  onUpdateCBSEChapter,
}) => {
  const [selectedChapter, setSelectedChapter] = useState<CBSEChapterItem | null>(null);
  const [sampleScore, setSampleScore] = useState<number>(70);

  const total = cbseChapters.length;
  const ncertDoneCount = cbseChapters.filter((c) => c.ncertExercisesDone).length;
  const stepMarksDoneCount = cbseChapters.filter((c) => c.stepMarksMastered).length;
  const exemplarDoneCount = cbseChapters.filter((c) => c.boardExemplarDone).length;

  const handleToggle = (
    ch: CBSEChapterItem,
    field: 'ncertTheoryDone' | 'ncertExercisesDone' | 'boardExemplarDone' | 'stepMarksMastered' | 'samplePaperAttempted'
  ) => {
    const updated = { ...ch, [field]: !ch[field] };
    onUpdateCBSEChapter(updated);
  };

  const handleSaveScore = (ch: CBSEChapterItem) => {
    const updated = {
      ...ch,
      samplePaperAttempted: true,
      marksScore: Number(sampleScore),
    };
    onUpdateCBSEChapter(updated);
    setSelectedChapter(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#17122E] via-[#0E1026] to-[#0A0D1E] border border-amber-900/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <Compass className="w-5 h-5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
              Board Mastery & Improvement
            </span>
          </div>
          <h1 className="text-2xl font-black text-white">CBSE Class 12 Mathematics Command Centre</h1>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Target: 95%+ in CBSE Mathematics Improvement Examination. Focus on NCERT textbook step-by-step presentation, complete derivations, justification statements, and official marking schemes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-amber-950 text-right">
            <span className="text-[11px] text-slate-400">NCERT Done</span>
            <p className="text-xl font-black text-amber-300">
              {ncertDoneCount} / {total}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-amber-950 text-right">
            <span className="text-[11px] text-slate-400">Step Presentation</span>
            <p className="text-xl font-black text-emerald-400">
              {stepMarksDoneCount} / {total}
            </p>
          </div>
        </div>
      </div>

      {/* CBSE Step-Marking Golden Rules Card */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
        <h3 className="text-sm font-bold text-amber-300 flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          <span>The CBSE Board Presentation Discipline (Crucial for 95+)</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300">
          <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <strong className="text-white block mb-1">1. State Formulas & Theorems</strong>
            Write the standard theorem statement before using it (e.g., &ldquo;Using Mean Value Theorem...&rdquo; or &ldquo;By Bayes&apos; Theorem...&rdquo;).
          </div>
          <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <strong className="text-white block mb-1">2. Box Your Final Answer with Units</strong>
            Examiners award 1 mark for the final boxed answer with appropriate constants of integration (+ C) or geometric units.
          </div>
          <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <strong className="text-white block mb-1">3. Clear Geometric Sketches</strong>
            In Integrals (Area under curve) and Linear Programming, sketch the feasible region with corner points marked clearly.
          </div>
        </div>
      </div>

      {/* 13 CBSE Chapters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cbseChapters.map((ch) => {
          const isMastered = ch.ncertExercisesDone && ch.stepMarksMastered;

          return (
            <div
              key={ch.id}
              className={`p-4 rounded-xl bg-slate-900/80 border transition-all flex flex-col justify-between ${
                isMastered ? 'border-amber-600/50 bg-amber-950/10' : 'border-slate-800'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold text-amber-400">
                    Chapter {ch.chNumber}
                  </span>
                  {ch.jeeOverlapChapterId && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-violet-600/20 text-violet-300 border border-violet-500/30 flex items-center gap-1">
                      <LinkIcon className="w-2.5 h-2.5" />
                      <span>JEE Overlap</span>
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-white">{ch.name}</h3>

                {/* Checklist of 4 Core Pillars */}
                <div className="space-y-2 pt-1 text-xs">
                  <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={ch.ncertTheoryDone}
                      onChange={() => handleToggle(ch, 'ncertTheoryDone')}
                      className="rounded border-slate-700 text-amber-500 focus:ring-amber-400 bg-slate-800"
                    />
                    <span>NCERT Theory & Solved Examples</span>
                  </label>

                  <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={ch.ncertExercisesDone}
                      onChange={() => handleToggle(ch, 'ncertExercisesDone')}
                      className="rounded border-slate-700 text-amber-500 focus:ring-amber-400 bg-slate-800"
                    />
                    <span>All NCERT Exercises + Miscellaneous</span>
                  </label>

                  <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={ch.boardExemplarDone}
                      onChange={() => handleToggle(ch, 'boardExemplarDone')}
                      className="rounded border-slate-700 text-amber-500 focus:ring-amber-400 bg-slate-800"
                    />
                    <span>CBSE Board Exemplar & 5-Year Papers</span>
                  </label>

                  <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={ch.stepMarksMastered}
                      onChange={() => handleToggle(ch, 'stepMarksMastered')}
                      className="rounded border-slate-700 text-amber-500 focus:ring-amber-400 bg-slate-800"
                    />
                    <span className="text-emerald-300 font-semibold">
                      Step-Mark Criteria Mastered
                    </span>
                  </label>
                </div>
              </div>

              {/* Sample Paper Score & Action */}
              <div className="pt-4 mt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                {ch.marksScore !== undefined ? (
                  <span className="text-amber-300 font-bold">
                    Test Score: {ch.marksScore} / 80
                  </span>
                ) : (
                  <span className="text-slate-500">Test: Not Attempted</span>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setSelectedChapter(ch);
                    setSampleScore(ch.marksScore ?? 72);
                  }}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold cursor-pointer transition-colors"
                >
                  Log Marks
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Score Log Modal */}
      {selectedChapter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm p-5 rounded-2xl bg-[#0C1028] border border-amber-900 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-white">
              Log CBSE Test Score: {selectedChapter.name}
            </h3>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Marks Obtained (out of 80)</label>
              <input
                type="number"
                min="0"
                max="80"
                value={sampleScore}
                onChange={(e) => setSampleScore(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedChapter(null)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleSaveScore(selectedChapter)}
                className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-xs font-bold text-white cursor-pointer"
              >
                Save Score
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
