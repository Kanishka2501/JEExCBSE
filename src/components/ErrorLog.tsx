import React, { useState } from 'react';
import { ErrorEntry } from '../types';
import { BUCKETS } from '../data/curriculum';

interface ErrorLogProps {
  errors: ErrorEntry[];
  onAddError: (err: ErrorEntry) => void;
  onToggleErrorFixed: (err: ErrorEntry) => void;
  onRemoveError: (err: ErrorEntry) => void;
}

export const ErrorLog: React.FC<ErrorLogProps> = ({
  errors,
  onAddError,
  onToggleErrorFixed,
  onRemoveError,
}) => {
  const [subj, setSubj] = useState('Maths');
  const [chap, setChap] = useState('');
  const [reason, setReason] = useState(BUCKETS[0]);
  const [note, setNote] = useState('');
  const [msg, setMsg] = useState<{ text: string; bad?: boolean } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedChap = chap.trim();
    if (!trimmedChap) {
      setMsg({ text: 'Add the chapter name.', bad: true });
      return;
    }

    onAddError({
      subj,
      chapter: trimmedChap,
      reason,
      note: note.trim(),
      fixed: false,
      ts: Date.now(),
    });

    setChap('');
    setNote('');
    setMsg({ text: 'Added to the error log.', bad: false });
  };

  const openErrors = errors
    .filter((e) => !e.fixed)
    .sort((a, b) => (b.ts || 0) - (a.ts || 0));
  const fixedErrors = errors
    .filter((e) => e.fixed)
    .sort((a, b) => (b.ts || 0) - (a.ts || 0));

  const allDisplayErrors = [...openErrors, ...fixedErrors];

  const counts = BUCKETS.map(
    (r) => openErrors.filter((e) => e.reason === r).length
  );
  const maxCount = Math.max(1, ...counts);

  return (
    <section id="errors" className="py-16 border-t border-[var(--line)]">
      <div className="max-w-[1180px] mx-auto px-[22px]">
        <h2 className="font-serif-fraunces font-light text-[clamp(1.9rem,4vw,2.75rem)] leading-tight tracking-tight text-[var(--ink)]">
          Error log
        </h2>
        <p className="text-[var(--muted)] max-w-[68ch] mt-3 text-[1.02rem] leading-relaxed">
          One line per wrong or skipped question. Sure-but-wrong and wrong-and-unaware entries show in red. Tick an entry as fixed only after you solve a fresh question of the same type cleanly.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-[330px_minmax(0,1fr)] gap-10 lg:gap-14 mt-8">
          {/* Error Form */}
          <form
            onSubmit={handleSubmit}
            className="grid gap-3.5 content-start bg-[var(--sheet)] border border-[var(--line)] rounded-[18px] p-5 shadow-sm"
            noValidate
          >
            <label className="grid gap-1 font-medium text-[0.93rem] text-[var(--ink)]">
              Subject
              <select
                value={subj}
                onChange={(e) => setSubj(e.target.value)}
                className="w-full border border-[var(--line)] bg-[var(--paper)] text-[var(--ink)] rounded-[10px] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--hilite)]"
              >
                <option>Maths</option>
                <option>Physics</option>
                <option>Chemistry</option>
              </select>
            </label>

            <label className="grid gap-1 font-medium text-[0.93rem] text-[var(--ink)]">
              Chapter
              <input
                type="text"
                maxLength={80}
                value={chap}
                onChange={(e) => setChap(e.target.value)}
                placeholder="e.g. Rotational motion"
                className="w-full border border-[var(--line)] bg-[var(--paper)] text-[var(--ink)] rounded-[10px] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--hilite)]"
              />
            </label>

            <label className="grid gap-1 font-medium text-[0.93rem] text-[var(--ink)]">
              Bucket
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full border border-[var(--line)] bg-[var(--paper)] text-[var(--ink)] rounded-[10px] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--hilite)]"
              >
                {BUCKETS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-1 font-medium text-[0.93rem] text-[var(--ink)]">
              What to remember
              <input
                type="text"
                maxLength={160}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Optional, one line reminder"
                className="w-full border border-[var(--line)] bg-[var(--paper)] text-[var(--ink)] rounded-[10px] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--hilite)]"
              />
            </label>

            <button
              type="submit"
              className="mt-2 bg-[var(--graphite)] border border-[var(--graphite)] text-[var(--sheet)] rounded-full px-4.5 py-2.5 font-semibold hover:brightness-110 transition-all cursor-pointer text-sm"
            >
              Add to error log
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

          {/* Bars and Error list */}
          <div>
            {errors.length === 0 ? (
              <p className="text-[var(--muted)] text-[0.95rem] py-4">
                Nothing logged yet. After your day 1 diagnostic, add every wrong or skipped question here.
              </p>
            ) : (
              <div className="space-y-4">
                <p className="text-[0.93rem] text-[var(--muted)] font-medium">
                  {openErrors.length} to fix, {fixedErrors.length} fixed. Bars show what is still open.
                </p>

                {/* Progress bars */}
                <div className="grid gap-2.5 bg-[var(--sheet)] border border-[var(--line)] p-4 rounded-xl">
                  {BUCKETS.map((r, i) => (
                    <div
                      key={r}
                      className="grid grid-cols-[140px_minmax(0,1fr)_30px] gap-2.5 items-center text-[0.88rem]"
                    >
                      <span className={`truncate font-medium ${i === 0 || i === 3 ? 'text-red-600' : 'text-[var(--ink)]'}`}>
                        {r}
                      </span>
                      <div className="h-2 rounded-full bg-[var(--line)] overflow-hidden">
                        <div
                          className={`h-full ${i === 0 || i === 3 ? 'bg-red-500' : 'bg-[var(--graphite)]'} transition-all duration-300`}
                          style={{
                            width: `${(counts[i] / maxCount) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-right text-[var(--muted)] font-semibold">
                        {counts[i]}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Items list */}
                <ul className="list-none p-0 m-0 border-t border-[var(--line)] divide-y divide-[var(--line)]">
                  {allDisplayErrors.map((err) => {
                    const isRed =
                      err.reason === BUCKETS[0] || err.reason === BUCKETS[3];
                    return (
                      <li
                        key={err.ts}
                        className={`grid grid-cols-[auto_minmax(0,1fr)_auto] gap-3.5 py-3.5 items-start ${
                          err.fixed ? 'opacity-65' : ''
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={err.fixed}
                          onChange={() => onToggleErrorFixed(err)}
                          aria-label={`Mark fixed: ${err.chapter}`}
                          className="w-5 h-5 mt-0.5 rounded cursor-pointer accent-[var(--graphite)]"
                        />

                        <div className="grid gap-0.5 min-w-0">
                          <p
                            className={`font-semibold text-[0.98rem] leading-snug ${
                              err.fixed
                                ? 'line-through text-[var(--muted)]'
                                : isRed
                                ? 'text-red-600'
                                : 'text-[var(--ink)]'
                            }`}
                          >
                            {err.subj}: {err.chapter}
                          </p>
                          <p className="text-[0.9rem] text-[var(--muted)] leading-relaxed">
                            {err.reason}
                            {err.note ? `. ${err.note}` : ''}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => onRemoveError(err)}
                          aria-label={`Remove entry: ${err.chapter}`}
                          className="text-[var(--muted)] hover:text-[var(--danger)] underline text-xs cursor-pointer pt-0.5"
                        >
                          Remove
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
