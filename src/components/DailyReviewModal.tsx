import React, { useState } from 'react';
import { X, Star, Sparkles, CheckCircle2 } from 'lucide-react';
import { DailyReviewData, ExamSettings, StudySession } from '../types';
import { getISTDateString, formatReadableIST } from '../utils/istDate';

interface DailyReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ExamSettings;
  sessions: StudySession[];
  onSaveReview: (review: DailyReviewData) => void;
  existingReview?: DailyReviewData;
}

export const DailyReviewModal: React.FC<DailyReviewModalProps> = ({
  isOpen,
  onClose,
  settings,
  sessions,
  onSaveReview,
  existingReview,
}) => {
  if (!isOpen) return null;

  const todayStr = getISTDateString();
  const formattedToday = formatReadableIST(todayStr);

  // Compute today's focus hours from sessions
  const todaySessions = sessions.filter((s) => s.date === todayStr);
  const totalMins = todaySessions.reduce((acc, s) => acc + (s.netFocusedMinutes || s.durationMinutes), 0);
  const autoHours = Number((totalMins / 60).toFixed(1));

  const [rating, setRating] = useState<number>(existingReview?.understandingRating || 4);
  const [questionsAttempted, setQuestionsAttempted] = useState<number>(existingReview?.questionsAttempted || 40);
  const [accuracy, setAccuracy] = useState<number>(existingReview?.accuracy || 75);
  const [breakthroughs, setBreakthroughs] = useState<string>(existingReview?.breakthroughs || '');
  const [struggles, setStruggles] = useState<string>(existingReview?.struggles || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const review: DailyReviewData = {
      date: todayStr,
      targetHours: settings.dailyTargetHours || 8,
      actualFocusedHours: autoHours,
      subjectHours: {},
      questionsAttempted: Number(questionsAttempted),
      accuracy: Number(accuracy),
      understandingRating: rating,
      breakthroughs: breakthroughs.trim(),
      struggles: struggles.trim(),
      completedAt: new Date().toISOString(),
    };

    onSaveReview(review);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#090D22] border border-indigo-900 shadow-2xl text-slate-100 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-indigo-950 flex items-center justify-between bg-[#0D122E]">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-violet-600/20 text-violet-400">
              <Sparkles className="w-5 h-5 text-cyan-300" />
            </span>
            <div>
              <h2 className="text-base font-black text-white">Daily Performance Audit</h2>
              <p className="text-[11px] text-slate-400">{formattedToday}</p>
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
          {/* Study Hours summary */}
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-400">Net Focused Study Hours</span>
              <p className="text-xl font-black text-white">{autoHours} hrs</p>
            </div>
            <div className="text-right">
              <span className="text-slate-400">Daily Target</span>
              <p className="text-xl font-black text-cyan-400">{settings.dailyTargetHours} hrs</p>
            </div>
          </div>

          {/* Rating */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">
              Depth of Understanding & Mental Retention (1 to 5)
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 text-slate-600 hover:scale-110 transition-transform cursor-pointer"
                >
                  <Star
                    className={`w-7 h-7 ${
                      star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs font-bold text-slate-400 ml-2">
                {rating === 5 ? 'Elite Focus' : rating >= 4 ? 'Solid Deep Work' : rating >= 3 ? 'Average' : 'High Friction'}
              </span>
            </div>
          </div>

          {/* Questions & Accuracy */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Questions Attempted</label>
              <input
                type="number"
                min="0"
                value={questionsAttempted}
                onChange={(e) => setQuestionsAttempted(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-violet-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Accuracy %</label>
              <input
                type="number"
                min="0"
                max="100"
                value={accuracy}
                onChange={(e) => setAccuracy(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>

          {/* Breakthroughs */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-emerald-400">
              Key Breakthroughs & What Worked Well
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Mastered King Rule in Definite Integrals; completed 20 PYQs with 85% accuracy..."
              value={breakthroughs}
              onChange={(e) => setBreakthroughs(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Struggles */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-rose-400">
              Struggles, Bottlenecks or Weak Areas
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Lost 40 mins due to phone notification; need to re-derive rotation energy formula..."
              value={struggles}
              onChange={(e) => setStruggles(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-rose-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 text-white font-black text-xs uppercase tracking-wider shadow-lg hover:opacity-95 cursor-pointer transition-opacity"
          >
            Lock In Daily Audit
          </button>
        </form>
      </div>
    </div>
  );
};
