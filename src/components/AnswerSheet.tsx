import React, { useMemo } from 'react';
import { DayData } from '../types';
import { TOTAL_DAYS, formatDate } from '../data/curriculum';

interface AnswerSheetProps {
  days: (DayData | null)[];
  todayNum: number;
  selectedDayNum: number;
  done: Record<string, boolean>;
  onSelectDay: (dayNum: number) => void;
}

export const AnswerSheet: React.FC<AnswerSheetProps> = ({
  days,
  todayNum,
  selectedDayNum,
  done,
  onSelectDay,
}) => {
  // Compute progress for each day
  const dayProgressMap = useMemo(() => {
    const map = new Map<number, { c: number; t: number; p: number }>();
    for (let n = 1; n <= TOTAL_DAYS; n++) {
      const d = days[n];
      if (!d) continue;
      const t = d.items.length;
      let c = 0;
      for (let i = 0; i < t; i++) {
        if (done[`${n}:${d.items[i].id}`]) c++;
      }
      const p = t > 0 ? Math.round((c / t) * 100) : 0;
      map.set(n, { c, t, p });
    }
    return map;
  }, [days, done]);

  // Overall stats
  const overallStats = useMemo(() => {
    let finishedDays = 0;
    let completedTasks = 0;
    let totalTasks = 0;

    for (let n = 1; n <= TOTAL_DAYS; n++) {
      const stat = dayProgressMap.get(n);
      if (stat) {
        completedTasks += stat.c;
        totalTasks += stat.t;
        if (stat.t > 0 && stat.c === stat.t) {
          finishedDays++;
        }
      }
    }
    return { finishedDays, completedTasks, totalTasks };
  }, [dayProgressMap]);

  // Calendar matrix calculation
  const numRows = Math.floor((TOTAL_DAYS + 4) / 7) + 1;
  const dayHeaders = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <aside className="sheetcol lg:sticky lg:top-20 self-start max-h-[calc(100vh-40px)] overflow-y-auto sheet-scroll">
      <div className="bg-[var(--sheet)] border border-[var(--line)] rounded-[26px] p-5 shadow-[0_40px_80px_-50px_var(--glow)] transition-colors">
        <h2 className="font-serif-fraunces italic font-normal text-[1.45rem] text-[var(--ink)]">
          Your answer sheet
        </h2>
        <p className="text-[var(--muted)] text-[0.92rem] mt-1 mb-4.5 leading-snug">
          Day 1 is Saturday 24 October 2026 and day 129 is your Maths board exam (tentative, Monday 1 March 2027). Pick any day to see its tasks.
        </p>

        {/* Matrix grid */}
        <div className="grid grid-cols-[40px_repeat(7,minmax(0,1fr))] gap-y-2 gap-x-1 items-center">
          <span aria-hidden="true" />
          {dayHeaders.map((dh) => (
            <span
              key={dh}
              className="text-[0.76rem] font-medium text-[var(--muted)] text-center tracking-tight"
            >
              {dh}
            </span>
          ))}

          {Array.from({ length: numRows }).map((_, r) => {
            const rowDate = new Date(2026, 9, 19 + 7 * r);
            const rowLabel = formatDate(rowDate, {
              day: 'numeric',
              month: 'short',
            });

            return (
              <React.Fragment key={r}>
                <span className="text-[0.74rem] text-[var(--muted)] whitespace-nowrap text-right pr-1">
                  {rowLabel}
                </span>

                {Array.from({ length: 7 }).map((__, c) => {
                  const n = r * 7 + c - 4;
                  if (n < 1 || n > TOTAL_DAYS) {
                    return <span key={c} aria-hidden="true" />;
                  }

                  const dayData = days[n];
                  const progress = dayProgressMap.get(n) || { c: 0, t: 0, p: 0 };
                  const isDone = progress.t > 0 && progress.c === progress.t;
                  const isSunday = dayData?.dow === 0;
                  const isToday = n === todayNum;
                  const isSelected = n === selectedDayNum;

                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => {
                        onSelectDay(n);
                        const headline = document.getElementById('dayTitle');
                        if (headline && headline.getBoundingClientRect().top < 0) {
                          headline.scrollIntoView({
                            behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
                              ? 'auto'
                              : 'smooth',
                            block: 'start',
                          });
                        }
                      }}
                      style={{ '--p': progress.p } as React.CSSProperties}
                      className={`bubble-cell ${isSunday ? 'sun' : ''} ${
                        isToday ? 'today' : ''
                      } ${isDone ? 'done' : ''} ${isSelected ? 'selected' : ''}`}
                      aria-pressed={isSelected}
                      aria-label={`Day ${n}, ${
                        dayData
                          ? formatDate(dayData.date, {
                              weekday: 'short',
                              day: 'numeric',
                              month: 'short',
                            })
                          : ''
                      }${isSunday ? ', Sunday test day' : ''}, ${progress.c} of ${
                        progress.t
                      } tasks done`}
                      title={`Day ${n}: ${progress.c}/${progress.t} tasks (${progress.p}%)`}
                    >
                      <span>{n}</span>
                    </button>
                  );
                })}
              </React.Fragment>
            );
          })}
        </div>

        {/* Legend */}
        <ul className="flex flex-wrap gap-x-4 gap-y-2 list-none p-0 mt-5 text-[0.84rem] text-[var(--muted)]">
          <li className="flex items-center gap-2">
            <span
              className="bubble-cell !w-4.5 !h-4.5 !max-w-none text-[0px] pointer-events-none"
              aria-hidden="true"
            />
            <span>Not started</span>
          </li>
          <li className="flex items-center gap-2">
            <span
              className="bubble-cell !w-4.5 !h-4.5 !max-w-none text-[0px] pointer-events-none"
              style={{ '--p': 50 } as React.CSSProperties}
              aria-hidden="true"
            />
            <span>In progress</span>
          </li>
          <li className="flex items-center gap-2">
            <span
              className="bubble-cell done !w-4.5 !h-4.5 !max-w-none text-[0px] pointer-events-none"
              aria-hidden="true"
            />
            <span>Finished</span>
          </li>
          <li className="flex items-center gap-2">
            <span
              className="bubble-cell sun !w-4.5 !h-4.5 !max-w-none text-[0px] pointer-events-none"
              aria-hidden="true"
            />
            <span>Sunday test</span>
          </li>
          <li className="flex items-center gap-2">
            <span
              className="bubble-cell today !w-4.5 !h-4.5 !max-w-none text-[0px] pointer-events-none"
              aria-hidden="true"
            />
            <span>Today</span>
          </li>
        </ul>
      </div>

      <p className="mt-4 text-[var(--muted)] text-[0.94rem]">
        <strong className="text-[var(--ink)] font-serif-fraunces text-[1.12rem] font-semibold">
          {overallStats.finishedDays} of {TOTAL_DAYS}
        </strong>{' '}
        days finished.{' '}
        <strong className="text-[var(--ink)] font-serif-fraunces text-[1.12rem] font-semibold">
          {overallStats.completedTasks}
        </strong>{' '}
        of {overallStats.totalTasks} tasks done.
      </p>
    </aside>
  );
};
