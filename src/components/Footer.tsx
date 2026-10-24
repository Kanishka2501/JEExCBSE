import React, { useState } from 'react';

interface FooterProps {
  onClearAllTicks: () => void;
  storageBlocked?: boolean;
}

export const Footer: React.FC<FooterProps> = ({
  onClearAllTicks,
  storageBlocked,
}) => {
  const [armed, setArmed] = useState(false);

  const handleResetClick = () => {
    if (!armed) {
      setArmed(true);
      setTimeout(() => setArmed(false), 4000);
      return;
    }
    setArmed(false);
    onClearAllTicks();
  };

  return (
    <footer className="pt-9 pb-14 border-t border-[var(--line)] text-[var(--muted)] text-[0.93rem] bg-[var(--paper)]">
      <div className="max-w-[1180px] mx-auto px-[22px] space-y-2.5">
        {storageBlocked && (
          <p className="text-[var(--danger)] font-medium">
            This browser is blocking storage, so your ticks, scores and cards will be lost when you close the tab.
          </p>
        )}
        <p className="max-w-[72ch] leading-relaxed">
          Chapter lists follow the recent JEE Main syllabus. NTA trims it from time to time, so check the current syllabus PDF and skip anything removed.
        </p>
        <p className="max-w-[72ch] leading-relaxed">
          Board dates and the CBSE paper pattern can change, so check cbse.gov.in. Everything is stored only in this browser on this device. Dates follow your device clock.
        </p>
        <div className="pt-2">
          <button
            type="button"
            onClick={handleResetClick}
            className="text-[var(--muted)] hover:text-[var(--danger)] underline text-sm transition-colors cursor-pointer"
          >
            {armed ? 'Click again to clear every tick' : 'Clear all task ticks'}
          </button>
        </div>
      </div>
    </footer>
  );
};
