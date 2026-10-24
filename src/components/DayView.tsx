import React, { useId } from 'react';
import { DayData, TaskItem } from '../types';
import {
  formatDate,
  TOTAL_DAYS,
  EXAM_DATE,
  BEXAM_DATE,
  ONE_DAY_MS,
  PHASE_NAMES,
} from '../data/curriculum';

interface DayViewProps {
  day: DayData;
  todayNum: number;
  selectedDayNum: number;
  done: Record<string, boolean>;
  onToggleTask: (dayNum: number, taskId: string) => void;
  onSelectDay: (dayNum: number) => void;
}

export const DayView: React.FC<DayViewProps> = ({
  day,
  todayNum,
  selectedDayNum,
  done,
  onToggleTask,
  onSelectDay,
}) => {
  const dayTitleId = useId();

  // Progress computation
  const totalTasks = day.items.length;
  const completedTasks = day.items.filter(
    (item) => done[`${selectedDayNum}:${item.id}`]
  ).length;
  const progressPercent =
    totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const isFinished = totalTasks > 0 && completedTasks === totalTasks;

  // Relative label
  const diffDays = selectedDayNum - todayNum;
  const relLabel =
    diffDays === 0
      ? 'Today'
      : diffDays === 1
      ? 'Tomorrow'
      : diffDays === -1
      ? 'Yesterday'
      : diffDays > 1
      ? `In ${diffDays} days`
      : `${-diffDays} days ago`;

  // Kind note
  const kindNote =
    day.kind === 'test'
      ? ' Weekly test day.'
      : day.kind === 'diagnostic'
      ? ' Diagnostic day.'
      : day.kind === 'setup'
      ? ' Setup day, light.'
      : '';

  // JEE Countdown
  const now = new Date();
  const todayZero = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const jeeLeft = Math.round(
    (EXAM_DATE.getTime() - todayZero.getTime()) / ONE_DAY_MS
  );

  // Board Countdown
  const boardLeft = Math.round(
    (BEXAM_DATE.getTime() - todayZero.getTime()) / ONE_DAY_MS
  );

  return (
    <section aria-labelledby={dayTitleId} className="flex-1 min-w-0">
      {/* Day Navigation */}
      <div className="flex flex-wrap items-center gap-2.5 mb-6.5">
        <button
          type="button"
          onClick={() => onSelectDay(selectedDayNum - 1)}
          disabled={selectedDayNum <= 1}
          className="border border-[var(--line)] bg-transparent rounded-full px-4.5 py-2 font-medium text-[var(--muted)] hover:bg-[var(--line)] hover:text-[var(--ink)] disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm"
        >
          Previous day
        </button>

        <button
          type="button"
          onClick={() => onSelectDay(todayNum)}
          className="bg-[var(--graphite)] border border-[var(--graphite)] text-[var(--sheet)] rounded-full px-5 py-2 font-semibold hover:brightness-110 shadow-sm transition-all text-sm"
        >
          Go to today
        </button>

        <button
          type="button"
          onClick={() => onSelectDay(selectedDayNum + 1)}
          disabled={selectedDayNum >= TOTAL_DAYS}
          className="border border-[var(--line)] bg-transparent rounded-full px-4.5 py-2 font-medium text-[var(--muted)] hover:bg-[var(--line)] hover:text-[var(--ink)] disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm"
        >
          Next day
        </button>

        <div className="ml-auto flex items-center gap-1.5 text-xs text-[var(--muted)]">
          <span>Jump to:</span>
          <select
            value={selectedDayNum}
            onChange={(e) => onSelectDay(Number(e.target.value))}
            className="border border-[var(--line)] bg-[var(--paper)] rounded-lg px-2 py-1 text-xs text-[var(--ink)] cursor-pointer"
          >
            {Array.from({ length: TOTAL_DAYS }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                Day {n} {n === todayNum ? '(Today)' : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Headline & Sub */}
      <h1
        id="dayTitle"
        className="font-serif-fraunces italic font-light text-[clamp(2.5rem,6.5vw,4.5rem)] leading-[1.04] tracking-tight text-[var(--ink)]"
      >
        {formatDate(day.date, { weekday: 'long', day: 'numeric', month: 'long' })}
      </h1>

      <p className="text-[1.08rem] font-medium text-[var(--ink)] mt-3.5">
        {relLabel}. Day {selectedDayNum} of {TOTAL_DAYS}. {PHASE_NAMES[day.phase]}.
        {kindNote}
      </p>

      {/* Countdowns */}
      <div className="mt-2 space-y-0.5 text-[0.95rem] text-[var(--muted)]">
        <p>
          {jeeLeft > 1 ? (
            <>
              <strong className="text-[var(--ink)] font-semibold">{jeeLeft} days</strong> until JEE Main Session 1 (tentative start, 22 January 2027).
            </>
          ) : jeeLeft >= -8 ? (
            'The Session 1 window is near or open (tentative, 22 to 30 January 2027). Check NTA.'
          ) : (
            'The Session 1 window has passed. Session 2 is expected in April 2027.'
          )}
        </p>
        <p>
          {boardLeft > 0 ? (
            <>
              <strong className="text-[var(--ink)] font-semibold">{boardLeft} days</strong> until your Maths board paper (tentative, 1 March 2027).
            </>
          ) : boardLeft === 0 ? (
            'Your Maths board paper is today (tentative date). Good luck.'
          ) : (
            'The tentative Maths board date has passed.'
          )}
        </p>
      </div>

      {/* Meter */}
      <div className="h-1.5 rounded-full bg-[var(--line)] overflow-hidden mt-5.5" aria-hidden="true">
        <div
          className="h-full bg-gradient-to-r from-[var(--hilite)] to-[var(--graphite)] transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <p className="text-[var(--muted)] mt-1.5 text-[0.94rem]" aria-live="polite">
        {completedTasks} of {totalTasks} tasks done
        {isFinished ? '. Day finished.' : '.'}
      </p>

      {/* Task list */}
      <ul className="list-none m-0 p-0 mt-6.5 space-y-0">
        {day.items.map((item: TaskItem) => {
          const isDone = !!done[`${selectedDayNum}:${item.id}`];
          return (
            <li
              key={item.id}
              className={`task-item subj-${item.subj} group`}
            >
              <label className="grid grid-cols-[auto_minmax(0,1fr)_auto] gap-4 py-4.5 pr-2 pl-6 cursor-pointer items-start select-none">
                <input
                  type="checkbox"
                  checked={isDone}
                  onChange={() => onToggleTask(selectedDayNum, item.id)}
                  className="custom-checkbox-input sr-only"
                />
                <span className="custom-checkbox-box" aria-hidden="true" />

                <div className="grid gap-1">
                  <span className="text-[0.88rem] font-semibold text-[var(--stripe)] tracking-tight">
                    {item.tag}
                  </span>
                  <span
                    className={`font-serif-fraunces text-[1.22rem] font-medium leading-[1.3] text-[var(--ink)] transition-colors ${
                      isDone ? 'line-through text-[var(--muted)]' : ''
                    }`}
                  >
                    {item.title}
                  </span>
                  <p className="text-[var(--muted)] text-[0.96rem] max-w-[68ch] whitespace-pre-line leading-relaxed mt-0.5">
                    {item.detail}
                  </p>
                </div>

                {item.time && (
                  <span className="text-[0.9rem] text-[var(--muted)] whitespace-nowrap pt-1 font-medium">
                    {item.time}
                  </span>
                )}
              </label>
            </li>
          );
        })}
      </ul>
    </section>
  );
};
