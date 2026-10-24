import React from 'react';

export const StudyRhythm: React.FC = () => {
  return (
    <section className="py-16 border-t border-[var(--line)]">
      <div className="max-w-[1180px] mx-auto px-[22px]">
        <h2 className="font-serif-fraunces font-light text-[clamp(1.9rem,4vw,2.75rem)] leading-tight tracking-tight text-[var(--ink)]">
          A normal study day
        </h2>
        <p className="text-[var(--muted)] max-w-[68ch] mt-3 text-[1.02rem] leading-relaxed">
          Hardest subject first. Move the clock to suit you, but keep the order and the blocks.
        </p>

        <ul className="list-none p-0 mt-7 max-w-[780px] space-y-0">
          <li className="grid grid-cols-[130px_minmax(0,1fr)] gap-3.5 py-3 pl-4.5 border-l-3 border-[var(--partial)] border-b border-[var(--line)]">
            <span className="text-[var(--muted)] text-[0.95rem] font-medium">06:30</span>
            <span className="text-[var(--ink)]">Wake up, walk, water. Phone stays out of the study room.</span>
          </li>

          <li className="grid grid-cols-[130px_minmax(0,1fr)] gap-3.5 py-3 pl-4.5 border-l-3 border-[var(--math)] border-b border-[var(--line)] bg-[var(--math)]/5">
            <span className="text-[var(--math)] text-[0.95rem] font-semibold">07:00 to 09:00</span>
            <span className="text-[var(--ink)]">Maths: 10-question pre-test, Vora Classes lecture on the gaps, Sri Chaitanya module practice, make the cards</span>
          </li>

          <li className="grid grid-cols-[130px_minmax(0,1fr)] gap-3.5 py-3 pl-4.5 border-l-3 border-[var(--partial)] border-b border-[var(--line)]">
            <span className="text-[var(--muted)] text-[0.95rem] font-medium">09:00 to 09:30</span>
            <span className="text-[var(--ink)]">Breakfast</span>
          </li>

          <li className="grid grid-cols-[130px_minmax(0,1fr)] gap-3.5 py-3 pl-4.5 border-l-3 border-[var(--phys)] border-b border-[var(--line)] bg-[var(--phys)]/5">
            <span className="text-[var(--phys)] text-[0.95rem] font-semibold">09:30 to 11:30</span>
            <span className="text-[var(--ink)]">Physics block, same routine (Vora lecture, then your Sri Chaitanya module)</span>
          </li>

          <li className="grid grid-cols-[130px_minmax(0,1fr)] gap-3.5 py-3 pl-4.5 border-l-3 border-[var(--chem)] border-b border-[var(--line)] bg-[var(--chem)]/5">
            <span className="text-[var(--chem)] text-[0.95rem] font-semibold">11:45 to 13:45</span>
            <span className="text-[var(--ink)]">Chemistry block, same routine (Vora lecture, then your Sri Chaitanya module)</span>
          </li>

          <li className="grid grid-cols-[130px_minmax(0,1fr)] gap-3.5 py-3 pl-4.5 border-l-3 border-[var(--partial)] border-b border-[var(--line)]">
            <span className="text-[var(--muted)] text-[0.95rem] font-medium">13:45 to 15:30</span>
            <span className="text-[var(--ink)]">Lunch and a proper rest</span>
          </li>

          <li className="grid grid-cols-[130px_minmax(0,1fr)] gap-3.5 py-3 pl-4.5 border-l-3 border-[var(--partial)] border-b border-[var(--line)]">
            <span className="text-[var(--muted)] text-[0.95rem] font-medium">15:30 to 16:30</span>
            <span className="text-[var(--ink)]">Practice set of the day (Direct, Mixed, PYQ or Timed), PYQs from Examside or Newton School of Technology</span>
          </li>

          <li className="grid grid-cols-[130px_minmax(0,1fr)] gap-3.5 py-3 pl-4.5 border-l-3 border-[var(--math)] border-b border-[var(--line)] bg-[var(--math)]/5">
            <span className="text-[var(--math)] text-[0.95rem] font-semibold">16:30 to 17:15</span>
            <span className="text-[var(--ink)]">Board Maths: NCERT exercise from Oswaal One for All, every answer written in full steps</span>
          </li>

          <li className="grid grid-cols-[130px_minmax(0,1fr)] gap-3.5 py-3 pl-4.5 border-l-3 border-[var(--partial)] border-b border-[var(--line)]">
            <span className="text-[var(--muted)] text-[0.95rem] font-medium">17:15 to 18:00</span>
            <span className="text-[var(--ink)]">Exercise and free time</span>
          </li>

          <li className="grid grid-cols-[130px_minmax(0,1fr)] gap-3.5 py-3 pl-4.5 border-l-3 border-[var(--hilite)] border-b border-[var(--line)] bg-[var(--hilite)]/5">
            <span className="text-[var(--graphite)] text-[0.95rem] font-semibold">18:00 to 18:45</span>
            <span className="text-[var(--ink)]">1-3-7 revision queue</span>
          </li>

          <li className="grid grid-cols-[130px_minmax(0,1fr)] gap-3.5 py-3 pl-4.5 border-l-3 border-[var(--partial)] border-b border-[var(--line)]">
            <span className="text-[var(--muted)] text-[0.95rem] font-medium">18:45 to 19:15</span>
            <span className="text-[var(--ink)]">Error log, four buckets, formulas from memory</span>
          </li>

          <li className="grid grid-cols-[130px_minmax(0,1fr)] gap-3.5 py-3 pl-4.5 border-l-3 border-[var(--partial)] border-b border-[var(--line)]">
            <span className="text-[var(--muted)] text-[0.95rem] font-medium">22:00</span>
            <span className="text-[var(--ink)]">Flip through your cards for 10 minutes instead of scrolling. Lights out by 23:00.</span>
          </li>
        </ul>

        <p className="mt-5 text-[var(--muted)] max-w-[66ch] text-[0.95rem] italic leading-relaxed">
          A bad day still counts if you finish one block per subject and the revision queue. Never double up the next day to catch up. Sunday evening is off.
        </p>
      </div>
    </section>
  );
};
