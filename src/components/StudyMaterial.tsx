import React from 'react';

export const StudyMaterial: React.FC = () => {
  return (
    <section id="material" className="py-16 border-t border-[var(--line)]">
      <div className="max-w-[1180px] mx-auto px-[22px]">
        <h2 className="font-serif-fraunces font-light text-[clamp(1.9rem,4vw,2.75rem)] leading-tight tracking-tight text-[var(--ink)]">
          Your study material
        </h2>
        <p className="text-[var(--muted)] max-w-[68ch] mt-3 text-[1.02rem] leading-relaxed">
          Every task in the plan points to one of these. Stick to them and do not add new sources.
        </p>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(230px,1fr))] gap-8 sm:gap-7 mt-8.5">
          <div className="border-t border-[var(--graphite)] pt-3.5">
            <span className="text-[0.88rem] font-semibold text-[var(--graphite)]">JEE lectures</span>
            <h3 className="font-serif-fraunces text-[1.25rem] font-medium mt-1 text-[var(--ink)]">
              Vora Classes (YouTube)
            </h3>
            <p className="text-[0.95rem] mt-2 text-[var(--muted)] leading-relaxed">
              Watch the lecture for the chapter on its day, note only the gaps, and turn each concept into a card.
            </p>
          </div>

          <div className="border-t border-[var(--graphite)] pt-3.5">
            <span className="text-[0.88rem] font-semibold text-[var(--graphite)]">JEE practice</span>
            <h3 className="font-serif-fraunces text-[1.25rem] font-medium mt-1 text-[var(--ink)]">
              Sri Chaitanya modules
            </h3>
            <p className="text-[0.95rem] mt-2 text-[var(--muted)] leading-relaxed">
              Your Class 11 and 12 modules for Maths, Physics and Chemistry. Basic questions first, then JEE Main level, then the harder exercises.
            </p>
          </div>

          <div className="border-t border-[var(--graphite)] pt-3.5">
            <span className="text-[0.88rem] font-semibold text-[var(--graphite)]">JEE PYQs</span>
            <h3 className="font-serif-fraunces text-[1.25rem] font-medium mt-1 text-[var(--ink)]">
              Examside & Newton School
            </h3>
            <p className="text-[0.95rem] mt-2 text-[var(--muted)] leading-relaxed">
              Chapter-wise PYQs after each chapter, the daily PYQ and timed sets, and full mocks for the Sunday tests and the mock sprint.
            </p>
          </div>

          <div className="border-t border-[var(--graphite)] pt-3.5">
            <span className="text-[0.88rem] font-semibold text-[var(--graphite)]">Board 1</span>
            <h3 className="font-serif-fraunces text-[1.25rem] font-medium mt-1 text-[var(--ink)]">
              Oswaal One for All, Class 12 Maths
            </h3>
            <p className="text-[0.95rem] mt-2 text-[var(--muted)] leading-relaxed">
              NCERT textbook and Exemplar questions, fully solved. Your base for every board chapter.
            </p>
          </div>

          <div className="border-t border-[var(--graphite)] pt-3.5">
            <span className="text-[0.88rem] font-semibold text-[var(--graphite)]">Board 2</span>
            <h3 className="font-serif-fraunces text-[1.25rem] font-medium mt-1 text-[var(--ink)]">
              Oswaal CBSE Question Bank
            </h3>
            <p className="text-[0.95rem] mt-2 text-[var(--muted)] leading-relaxed">
              Chapter-wise and topic-wise solved papers from 2017 to 2026. Use it for board-style questions after NCERT.
            </p>
          </div>

          <div className="border-t border-[var(--graphite)] pt-3.5">
            <span className="text-[0.88rem] font-semibold text-[var(--graphite)]">Board 3</span>
            <h3 className="font-serif-fraunces text-[1.25rem] font-medium mt-1 text-[var(--ink)]">
              Oswaal 15 Sample Papers
            </h3>
            <p className="text-[0.95rem] mt-2 text-[var(--muted)] leading-relaxed">
              Built on the CBSE sample paper released on 21 September 2026 for the 2027 exam. Used for timed, handwritten papers.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
