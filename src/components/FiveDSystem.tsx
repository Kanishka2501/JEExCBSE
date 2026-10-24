import React from 'react';

export const FiveDSystem: React.FC = () => {
  return (
    <section className="py-16 border-t border-[var(--line)]">
      <div className="max-w-[1180px] mx-auto px-[22px]">
        <h2 className="font-serif-fraunces font-light text-[clamp(1.9rem,4vw,2.75rem)] leading-tight tracking-tight text-[var(--ink)]">
          The 5D system inside this plan
        </h2>
        <p className="text-[var(--muted)] max-w-[68ch] mt-3 text-[1.02rem] leading-relaxed">
          Each D from your notes is built into the daily tasks, so you never have to remember to apply it. The same methods apply to your board Maths chapters.
        </p>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-8 sm:gap-7 mt-8.5">
          <div className="border-t border-[var(--graphite)] pt-3.5">
            <span className="text-[0.88rem] font-semibold text-[var(--graphite)] uppercase tracking-wider">
              D1
            </span>
            <h3 className="font-serif-fraunces text-[1.25rem] font-medium mt-1 text-[var(--ink)]">
              Diagnose
            </h3>
            <p className="text-[0.95rem] mt-2 text-[var(--muted)] leading-relaxed">
              Day 1 diagnostic paper. Every new chapter starts with a 10-question pre-test, so you study only the gaps. Scan 10 years of PYQs to find what repeats.
            </p>
          </div>

          <div className="border-t border-[var(--graphite)] pt-3.5">
            <span className="text-[0.88rem] font-semibold text-[var(--graphite)] uppercase tracking-wider">
              D2
            </span>
            <h3 className="font-serif-fraunces text-[1.25rem] font-medium mt-1 text-[var(--ink)]">
              Distil
            </h3>
            <p className="text-[0.95rem] mt-2 text-[var(--muted)] leading-relaxed">
              One flashcard per concept (small slip, title, own words, real example, diagram), 2 minutes each. Plus 3 to 4 trigger words per chapter. Physics and physical chemistry: formulas. Biology-style processes: flowcharts. Inorganic: pointers and exceptions. Organic: reaction, exception, mechanism.
            </p>
          </div>

          <div className="border-t border-[var(--graphite)] pt-3.5">
            <span className="text-[0.88rem] font-semibold text-[var(--graphite)] uppercase tracking-wider">
              D3
            </span>
            <h3 className="font-serif-fraunces text-[1.25rem] font-medium mt-1 text-[var(--ink)]">
              Delay
            </h3>
            <p className="text-[0.95rem] mt-2 text-[var(--muted)] leading-relaxed">
              The 1-3-7 rule runs by itself. Each day shows the chapters due for recall (+1 day), notes (+3), re-read and mini-test (+7), then spaced rounds at +17 and +32 days.
            </p>
          </div>

          <div className="border-t border-[var(--graphite)] pt-3.5">
            <span className="text-[0.88rem] font-semibold text-[var(--graphite)] uppercase tracking-wider">
              D4
            </span>
            <h3 className="font-serif-fraunces text-[1.25rem] font-medium mt-1 text-[var(--ink)]">
              Diversify
            </h3>
            <p className="text-[0.95rem] mt-2 text-[var(--muted)] leading-relaxed">
              The daily practice set rotates through Direct, Mixed, PYQ and Timed questions so no type gets neglected.
            </p>
          </div>

          <div className="border-t border-[var(--graphite)] pt-3.5">
            <span className="text-[0.88rem] font-semibold text-[var(--graphite)] uppercase tracking-wider">
              D5
            </span>
            <h3 className="font-serif-fraunces text-[1.25rem] font-medium mt-1 text-[var(--ink)]">
              Detect
            </h3>
            <p className="text-[0.95rem] mt-2 text-[var(--muted)] leading-relaxed">
              After every mock, sort questions into four buckets: Sure but wrong, Unsure but correct, Guessed but correct, Wrong and unaware. Spend the most effort on the first and last, written in red.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
