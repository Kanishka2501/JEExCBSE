import React from 'react';
import { dateOf, formatDate } from '../data/curriculum';

export const PhaseSplit: React.FC = () => {
  const formatRange = (startDay: number, endDay: number) => {
    return `${formatDate(dateOf(startDay), {
      day: 'numeric',
      month: 'short',
    })} to ${formatDate(dateOf(endDay), { day: 'numeric', month: 'short' })}`;
  };

  const phases: [string, string, string][] = [
    [
      'Learn and practise',
      `Days 1 to 61, ${formatRange(1, 61)}`,
      'Day 1 is the diagnostic. Then three 2-hour blocks a day take you through every chapter once, with pre-tests, cards, the 1-3-7 queue, a board Maths task on overlapping chapters and a part test each Sunday.',
    ],
    [
      'Revise with PYQs',
      `Days 62 to 80, ${formatRange(62, 80)}`,
      'Six clusters per subject, each with 40 PYQs, board revision and your error log. Every fourth day has a CBSE sample paper. Sundays are full-syllabus mocks.',
    ],
    [
      'Mock sprint',
      `Days 81 to 90, ${formatRange(81, 90)}`,
      'Six full JEE mocks with long four-bucket analysis, repair days and a board sample paper.',
    ],
    [
      'JEE Session 1 window',
      `Days 91 to 101, ${formatRange(91, 101)}`,
      'Light board revision and card flips, nothing heavy. Day 101 is your Session 1 paper analysis.',
    ],
    [
      'Board Maths sweep',
      `Days 102 to 115, ${formatRange(102, 115)}`,
      'One board chapter a day: NCERT, 20 board-style questions, fresh cards, Physics and Chemistry upkeep, and the 1-3-7 queue. Day 115 repairs your weakest chapters.',
    ],
    [
      'Board paper practice',
      `Days 116 to 128, ${formatRange(116, 128)}`,
      'Nine full CBSE papers in full steps with a lost-marks check, repair days, then a calm last day.',
    ],
    [
      'Maths board exam',
      `Day 129, ${formatRange(129, 129)}`,
      'Tentative date. Tell me if it moves and I will shift the calendar.',
    ],
  ];

  return (
    <section className="py-16 border-t border-[var(--line)]">
      <div className="max-w-[1180px] mx-auto px-[22px]">
        <h2 className="font-serif-fraunces font-light text-[clamp(1.9rem,4vw,2.75rem)] leading-tight tracking-tight text-[var(--ink)]">
          How the 129 days are split
        </h2>
        <p className="text-[var(--muted)] max-w-[68ch] mt-3 text-[1.02rem] leading-relaxed">
          The JEE mock sprint ends on day 90, Thursday 21 January 2027, the day before the tentative Session 1 start on 22 January. The rest of the calendar then counts down to your Maths board paper, tentatively Monday 1 March 2027. Confirm the dates on jeemain.nta.nic.in and cbse.gov.in.
        </p>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(230px,1fr))] gap-7 mt-8">
          {phases.map(([name, dates, desc], i) => (
            <div key={i} className="flex flex-col">
              <h3 className="font-serif-fraunces font-medium text-[1.25rem] text-[var(--ink)]">
                {name}
              </h3>
              <p className="text-[var(--graphite)] text-[0.92rem] font-medium my-1">
                {dates}
              </p>
              <p className="text-[var(--muted)] text-[0.95rem] leading-relaxed mt-1">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
