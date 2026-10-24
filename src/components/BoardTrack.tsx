import React, { useState } from 'react';
import { BoardEntry } from '../types';
import { formatDate } from '../data/curriculum';

interface BoardTrackProps {
  boardEntries: BoardEntry[];
  onAddBoardEntry: (entry: BoardEntry) => void;
  onRemoveBoardEntry: (entry: BoardEntry) => void;
}

const BREASONS = [
  'Concept gap',
  'Calculation slip',
  'Steps not written',
  'Time pressure',
];

export const BoardTrack: React.FC<BoardTrackProps> = ({
  boardEntries,
  onAddBoardEntry,
  onRemoveBoardEntry,
}) => {
  const todayIso = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(todayIso);
  const [marks, setMarks] = useState<string>('');
  const [type, setType] = useState('Sample paper');
  const [reason, setReason] = useState(BREASONS[0]);
  const [msg, setMsg] = useState<{ text: string; bad?: boolean } | null>(null);

  const sortedEntries = [...boardEntries].sort((a, b) =>
    a.date < b.date ? -1 : a.date > b.date ? 1 : (a.ts || 0) - (b.ts || 0)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      setMsg({ text: 'Pick the date.', bad: true });
      return;
    }
    const num = Number(marks);
    if (marks === '' || !Number.isInteger(num) || num < 0 || num > 80) {
      setMsg({
        text: 'Enter marks as a whole number from 0 to 80.',
        bad: true,
      });
      return;
    }

    onAddBoardEntry({
      date,
      marks: num,
      type,
      reason,
      ts: Date.now(),
    });
    setMarks('');
    setMsg({ text: `Saved. ${num} out of 80.`, bad: false });
  };

  // Insight computation
  let insightText = 'Your CBSE paper scores appear here once you save one.';
  if (sortedEntries.length > 0) {
    const last = sortedEntries[sortedEntries.length - 1];
    insightText = `Latest: ${last.marks} out of 80.`;
    if (sortedEntries.length > 1) {
      const prev = sortedEntries[sortedEntries.length - 2];
      const diff = last.marks - prev.marks;
      if (diff === 0) {
        insightText += ' Level with the previous paper.';
      } else if (diff > 0) {
        insightText += ` Up ${diff} from the previous paper.`;
      } else {
        insightText += ` Down ${Math.abs(diff)} from the previous paper.`;
      }
    }
  }

  const shortDate = (iso: string) => {
    const d = new Date(iso + 'T00:00:00');
    return formatDate(d, { day: 'numeric', month: 'short' });
  };

  return (
    <section id="board" className="py-16 border-t border-[var(--line)]">
      <div className="max-w-[1180px] mx-auto px-[22px]">
        <h2 className="font-serif-fraunces font-light text-[clamp(1.9rem,4vw,2.75rem)] leading-tight tracking-tight text-[var(--ink)]">
          CBSE Class 12 Maths: board track
        </h2>
        <p className="text-[var(--muted)] max-w-[68ch] mt-3 text-[1.02rem] leading-relaxed">
          Board Maths runs alongside JEE Maths, not on top of it. Most board chapters overlap with JEE, so each JEE chapter gets a 45-minute board task with NCERT questions written in full steps. Board-only Linear Programming is paired with Straight lines. JEE-only topics (complex numbers, sequences, binomial theorem, conics, statistics) have no board task.
        </p>

        {/* 6 Strategy Cards */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(230px,1fr))] gap-7 mt-8.5">
          <div className="border-t border-[var(--graphite)] pt-3.5">
            <span className="text-[0.88rem] font-semibold text-[var(--graphite)]">Chapters</span>
            <h3 className="font-serif-fraunces text-[1.25rem] font-medium mt-1 text-[var(--ink)]">
              13 board chapters
            </h3>
            <p className="text-[0.95rem] mt-2 text-[var(--muted)] leading-relaxed">
              Relations and Functions, Inverse Trigonometry, Matrices, Determinants, Continuity and Differentiability, Applications of Derivatives, Integrals, Applications of Integrals, Differential Equations, Vector Algebra, 3D Geometry, Linear Programming, Probability.
            </p>
          </div>

          <div className="border-t border-[var(--graphite)] pt-3.5">
            <span className="text-[0.88rem] font-semibold text-[var(--graphite)]">Rule 1</span>
            <h3 className="font-serif-fraunces text-[1.25rem] font-medium mt-1 text-[var(--ink)]">
              NCERT first
            </h3>
            <p className="text-[0.95rem] mt-2 text-[var(--muted)] leading-relaxed">
              Use Oswaal One for All: read the solved examples, do every exercise, then the miscellaneous exercise. Board papers lean heavily on NCERT.
            </p>
          </div>

          <div className="border-t border-[var(--graphite)] pt-3.5">
            <span className="text-[0.88rem] font-semibold text-[var(--graphite)]">Rule 2</span>
            <h3 className="font-serif-fraunces text-[1.25rem] font-medium mt-1 text-[var(--ink)]">
              Write for step marks
            </h3>
            <p className="text-[0.95rem] mt-2 text-[var(--muted)] leading-relaxed">
              JEE rewards the final answer, boards reward steps. Write formula, substitution, working and conclusion. Practise on paper, not on screen.
            </p>
          </div>

          <div className="border-t border-[var(--graphite)] pt-3.5">
            <span className="text-[0.88rem] font-semibold text-[var(--graphite)]">Rule 3</span>
            <h3 className="font-serif-fraunces text-[1.25rem] font-medium mt-1 text-[var(--ink)]">
              Paper practice
            </h3>
            <p className="text-[0.95rem] mt-2 text-[var(--muted)] leading-relaxed">
              One paper from Oswaal 15 Sample Papers (80 marks, 3 hours) roughly every fourth revision day, plus one in the mock sprint and nine in the final stretch. The 2027 design: Section A 20 MCQ and assertion-reason (20 marks), B 5 very short (10), C 6 short (18), D 4 long (20), E 3 case-based (12), 38 questions in all. Check the official sample paper on cbse.gov.in.
            </p>
          </div>

          <div className="border-t border-[var(--graphite)] pt-3.5">
            <span className="text-[0.88rem] font-semibold text-[var(--graphite)]">Dates</span>
            <h3 className="font-serif-fraunces text-[1.25rem] font-medium mt-1 text-[var(--ink)]">
              Maths paper: 1 March (tentative)
            </h3>
            <p className="text-[0.95rem] mt-2 text-[var(--muted)] leading-relaxed">
              Day 129 is set to 1 March 2027. If CBSE publishes a different date, tell me and I will shift the calendar. Confirm on cbse.gov.in.
            </p>
          </div>

          <div className="border-t border-[var(--graphite)] pt-3.5">
            <span className="text-[0.88rem] font-semibold text-[var(--graphite)]">Days 91 to 129</span>
            <h3 className="font-serif-fraunces text-[1.25rem] font-medium mt-1 text-[var(--ink)]">
              Board mode
            </h3>
            <p className="text-[0.95rem] mt-2 text-[var(--muted)] leading-relaxed">
              A light revision window during JEE Session 1, a 14-day chapter sweep of all 13 board chapters (with the 1-3-7 queue), then nine full sample or previous-year papers, repair days and a calm last day.
            </p>
          </div>
        </div>

        {/* Board Log Form & Table */}
        <div className="grid grid-cols-1 lg:grid-cols-[330px_minmax(0,1fr)] gap-10 lg:gap-14 mt-10">
          <form
            onSubmit={handleSubmit}
            className="grid gap-3.5 content-start bg-[var(--sheet)] border border-[var(--line)] rounded-[18px] p-5 shadow-sm"
            noValidate
          >
            <label className="grid gap-1 font-medium text-[0.93rem] text-[var(--ink)]">
              Date
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border border-[var(--line)] bg-[var(--paper)] text-[var(--ink)] rounded-[10px] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--hilite)]"
              />
            </label>

            <div className="grid grid-cols-2 gap-2.5">
              <label className="grid gap-1 font-medium text-[0.93rem] text-[var(--ink)]">
                Marks (/80)
                <input
                  type="number"
                  min="0"
                  max="80"
                  step="1"
                  inputMode="numeric"
                  value={marks}
                  onChange={(e) => setMarks(e.target.value)}
                  placeholder="0 - 80"
                  className="w-full border border-[var(--line)] bg-[var(--paper)] text-[var(--ink)] rounded-[10px] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--hilite)]"
                />
              </label>

              <label className="grid gap-1 font-medium text-[0.93rem] text-[var(--ink)]">
                Type
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full border border-[var(--line)] bg-[var(--paper)] text-[var(--ink)] rounded-[10px] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--hilite)]"
                >
                  <option>Sample paper</option>
                  <option>Previous year paper</option>
                  <option>Chapter test</option>
                </select>
              </label>
            </div>

            <label className="grid gap-1 font-medium text-[0.93rem] text-[var(--ink)]">
              Biggest source of lost marks
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full border border-[var(--line)] bg-[var(--paper)] text-[var(--ink)] rounded-[10px] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--hilite)]"
              >
                {BREASONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </label>

            <button
              type="submit"
              className="mt-2 bg-[var(--graphite)] border border-[var(--graphite)] text-[var(--sheet)] rounded-full px-4.5 py-2.5 font-semibold hover:brightness-110 transition-all cursor-pointer text-sm"
            >
              Save board paper
            </button>

            {msg && (
              <p
                role="status"
                className={`min-h-[1.4em] text-[0.93rem] mt-1 ${
                  msg.bad ? 'text-[var(--danger)]' : 'text-[var(--muted)]'
                }`}
              >
                {msg.text}
              </p>
            )}
          </form>

          <div>
            <p className="text-[var(--ink)] font-medium text-[0.98rem] mb-3">
              {insightText}
            </p>

            <div className="overflow-x-auto border border-[var(--line)] rounded-xl bg-[var(--sheet)]">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-[var(--graphite)] text-[var(--muted)] font-medium text-[0.85rem]">
                    <th className="py-2.5 px-3 whitespace-nowrap">Date</th>
                    <th className="py-2.5 px-3 whitespace-nowrap">Type</th>
                    <th className="py-2.5 px-3 whitespace-nowrap">Marks /80</th>
                    <th className="py-2.5 px-3 whitespace-nowrap">Main loss</th>
                    <th className="py-2.5 px-3 whitespace-nowrap text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedEntries.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-[var(--muted)]">
                        No board papers logged yet.
                      </td>
                    </tr>
                  ) : (
                    [...sortedEntries].reverse().map((entry, idx) => (
                      <tr
                        key={entry.ts || idx}
                        className="border-b border-[var(--line)] hover:bg-[var(--line)]/20 transition-colors"
                      >
                        <td className="py-2.5 px-3 whitespace-nowrap text-[var(--ink)]">
                          {shortDate(entry.date)}
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap text-[var(--muted)]">
                          {entry.type}
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap font-serif-fraunces font-semibold text-[1.05rem] text-[var(--ink)]">
                          {entry.marks}
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap text-[var(--muted)]">
                          {entry.reason}
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap text-right">
                          <button
                            type="button"
                            onClick={() => onRemoveBoardEntry(entry)}
                            className="text-[var(--muted)] hover:text-[var(--danger)] underline text-xs cursor-pointer"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
