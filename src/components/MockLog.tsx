import React, { useState } from 'react';
import { MockEntry } from '../types';
import { formatDate } from '../data/curriculum';

interface MockLogProps {
  mocks: MockEntry[];
  onAddMock: (mock: MockEntry) => void;
  onRemoveMock: (mock: MockEntry) => void;
}

export const MockLog: React.FC<MockLogProps> = ({
  mocks,
  onAddMock,
  onRemoveMock,
}) => {
  const todayIso = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(todayIso);
  const [mP, setMP] = useState('');
  const [mC, setMC] = useState('');
  const [mM, setMM] = useState('');

  const [b0, setB0] = useState('');
  const [b1, setB1] = useState('');
  const [b2, setB2] = useState('');
  const [b3, setB3] = useState('');

  const [msg, setMsg] = useState<{ text: string; bad?: boolean } | null>(null);

  const total = (m: MockEntry) => m.p + m.c + m.m;

  const sortedMocks = [...mocks].sort((a, b) =>
    a.date < b.date ? -1 : a.date > b.date ? 1 : (a.ts || 0) - (b.ts || 0)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      setMsg({ text: 'Pick the date of the mock.', bad: true });
      return;
    }

    const pNum = Number(mP);
    const cNum = Number(mC);
    const mNum = Number(mM);

    if (
      mP === '' ||
      mC === '' ||
      mM === '' ||
      !Number.isInteger(pNum) ||
      !Number.isInteger(cNum) ||
      !Number.isInteger(mNum) ||
      pNum < -30 ||
      pNum > 100 ||
      cNum < -30 ||
      cNum > 100 ||
      mNum < -30 ||
      mNum > 100
    ) {
      setMsg({
        text: 'Enter each subject score as a whole number from -30 to 100.',
        bad: true,
      });
      return;
    }

    const b0Num = b0 === '' ? 0 : Number(b0);
    const b1Num = b1 === '' ? 0 : Number(b1);
    const b2Num = b2 === '' ? 0 : Number(b2);
    const b3Num = b3 === '' ? 0 : Number(b3);

    const bVals = [b0Num, b1Num, b2Num, b3Num];
    if (bVals.some((v) => !Number.isInteger(v) || v < 0 || v > 90)) {
      setMsg({
        text: 'Bucket counts must be whole numbers from 0 to 90.',
        bad: true,
      });
      return;
    }

    const newMock: MockEntry = {
      date,
      p: pNum,
      c: cNum,
      m: mNum,
      b: [b0Num, b1Num, b2Num, b3Num],
      ts: Date.now(),
    };

    onAddMock(newMock);
    setMP('');
    setMC('');
    setMM('');
    setB0('');
    setB1('');
    setB2('');
    setB3('');
    setMsg({
      text: `Saved. Total ${total(newMock)} out of 300.`,
      bad: false,
    });
  };

  let insightText =
    'Your scores and bucket counts appear here once you save a mock. The day 1 diagnostic is the first entry.';

  if (sortedMocks.length > 0) {
    const last = sortedMocks[sortedMocks.length - 1];
    let s = `Latest: ${total(last)} out of 300.`;
    if (sortedMocks.length > 1) {
      const prev = sortedMocks[sortedMocks.length - 2];
      const df = total(last) - total(prev);
      s +=
        df === 0
          ? ' Level with the previous mock.'
          : (df > 0 ? ' Up ' : ' Down ') +
            Math.abs(df) +
            ' from the previous mock.';
    }
    if (last.b) {
      s += ` Sure-but-wrong: ${last.b[0]}, wrong-and-unaware: ${last.b[3]}. These two are where to practise.`;
    }
    insightText = s;
  }

  const shortDate = (iso: string) => {
    const d = new Date(iso + 'T00:00:00');
    return formatDate(d, { day: 'numeric', month: 'short' });
  };

  return (
    <section id="mocks" className="py-16 border-t border-[var(--line)]">
      <div className="max-w-[1180px] mx-auto px-[22px]">
        <h2 className="font-serif-fraunces font-light text-[clamp(1.9rem,4vw,2.75rem)] leading-tight tracking-tight text-[var(--ink)]">
          Mock log with the four buckets
        </h2>
        <p className="text-[var(--muted)] max-w-[68ch] mt-3 text-[1.02rem] leading-relaxed">
          Log the day 1 diagnostic first. Each paper is out of 300. Next to the scores, count how many questions fell into each bucket.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-[330px_minmax(0,1fr)] gap-10 lg:gap-14 mt-8">
          {/* Mock Form */}
          <form
            onSubmit={handleSubmit}
            className="grid gap-3.5 content-start bg-[var(--sheet)] border border-[var(--line)] rounded-[18px] p-5 shadow-sm"
            noValidate
          >
            <label className="grid gap-1 font-medium text-[0.93rem] text-[var(--ink)]">
              Date of the mock
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border border-[var(--line)] bg-[var(--paper)] text-[var(--ink)] rounded-[10px] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--hilite)]"
              />
            </label>

            <div className="grid grid-cols-3 gap-2">
              <label className="grid gap-1 font-medium text-[0.93rem] text-[var(--ink)]">
                Physics
                <input
                  type="number"
                  min="-30"
                  max="100"
                  step="1"
                  inputMode="numeric"
                  placeholder="P"
                  value={mP}
                  onChange={(e) => setMP(e.target.value)}
                  className="w-full border border-[var(--line)] bg-[var(--paper)] text-[var(--ink)] rounded-[10px] px-2.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--hilite)]"
                />
              </label>

              <label className="grid gap-1 font-medium text-[0.93rem] text-[var(--ink)]">
                Chemistry
                <input
                  type="number"
                  min="-30"
                  max="100"
                  step="1"
                  inputMode="numeric"
                  placeholder="C"
                  value={mC}
                  onChange={(e) => setMC(e.target.value)}
                  className="w-full border border-[var(--line)] bg-[var(--paper)] text-[var(--ink)] rounded-[10px] px-2.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--hilite)]"
                />
              </label>

              <label className="grid gap-1 font-medium text-[0.93rem] text-[var(--ink)]">
                Maths
                <input
                  type="number"
                  min="-30"
                  max="100"
                  step="1"
                  inputMode="numeric"
                  placeholder="M"
                  value={mM}
                  onChange={(e) => setMM(e.target.value)}
                  className="w-full border border-[var(--line)] bg-[var(--paper)] text-[var(--ink)] rounded-[10px] px-2.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--hilite)]"
                />
              </label>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <label className="grid gap-1 font-medium text-[0.88rem] text-[var(--ink)]">
                Sure but wrong
                <input
                  type="number"
                  min="0"
                  max="90"
                  step="1"
                  inputMode="numeric"
                  placeholder="0"
                  value={b0}
                  onChange={(e) => setB0(e.target.value)}
                  className="w-full border border-[var(--line)] bg-[var(--paper)] text-[var(--ink)] rounded-[10px] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--hilite)]"
                />
              </label>

              <label className="grid gap-1 font-medium text-[0.88rem] text-[var(--ink)]">
                Wrong & unaware
                <input
                  type="number"
                  min="0"
                  max="90"
                  step="1"
                  inputMode="numeric"
                  placeholder="0"
                  value={b3}
                  onChange={(e) => setB3(e.target.value)}
                  className="w-full border border-[var(--line)] bg-[var(--paper)] text-[var(--ink)] rounded-[10px] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--hilite)]"
                />
              </label>

              <label className="grid gap-1 font-medium text-[0.88rem] text-[var(--ink)]">
                Unsure, correct
                <input
                  type="number"
                  min="0"
                  max="90"
                  step="1"
                  inputMode="numeric"
                  placeholder="0"
                  value={b1}
                  onChange={(e) => setB1(e.target.value)}
                  className="w-full border border-[var(--line)] bg-[var(--paper)] text-[var(--ink)] rounded-[10px] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--hilite)]"
                />
              </label>

              <label className="grid gap-1 font-medium text-[0.88rem] text-[var(--ink)]">
                Guessed, correct
                <input
                  type="number"
                  min="0"
                  max="90"
                  step="1"
                  inputMode="numeric"
                  placeholder="0"
                  value={b2}
                  onChange={(e) => setB2(e.target.value)}
                  className="w-full border border-[var(--line)] bg-[var(--paper)] text-[var(--ink)] rounded-[10px] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--hilite)]"
                />
              </label>
            </div>

            <button
              type="submit"
              className="mt-2 bg-[var(--graphite)] border border-[var(--graphite)] text-[var(--sheet)] rounded-full px-4.5 py-2.5 font-semibold hover:brightness-110 transition-all cursor-pointer text-sm"
            >
              Save mock
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

          {/* Table & Insights */}
          <div>
            <p className="text-[var(--ink)] font-medium text-[0.98rem] mb-3 leading-relaxed">
              {insightText}
            </p>

            <div className="overflow-x-auto border border-[var(--line)] rounded-xl bg-[var(--sheet)]">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-[var(--graphite)] text-[var(--muted)] font-medium text-[0.84rem]">
                    <th className="py-2.5 px-3 whitespace-nowrap">Date</th>
                    <th className="py-2.5 px-3 whitespace-nowrap">Phy</th>
                    <th className="py-2.5 px-3 whitespace-nowrap">Chem</th>
                    <th className="py-2.5 px-3 whitespace-nowrap">Maths</th>
                    <th className="py-2.5 px-3 whitespace-nowrap">Total</th>
                    <th className="py-2.5 px-3 whitespace-nowrap text-red-600">Sure, wrong</th>
                    <th className="py-2.5 px-3 whitespace-nowrap text-red-600">Wrong, unaware</th>
                    <th className="py-2.5 px-3 whitespace-nowrap">Guessed correct</th>
                    <th className="py-2.5 px-3 whitespace-nowrap text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedMocks.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-6 text-center text-[var(--muted)]">
                        No mocks logged yet. Take Day 1 diagnostic paper to begin.
                      </td>
                    </tr>
                  ) : (
                    [...sortedMocks].reverse().map((mock, idx) => (
                      <tr
                        key={mock.ts || idx}
                        className="border-b border-[var(--line)] hover:bg-[var(--line)]/20 transition-colors"
                      >
                        <td className="py-2.5 px-3 whitespace-nowrap text-[var(--ink)]">
                          {shortDate(mock.date)}
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap text-[var(--muted)]">
                          {mock.p}
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap text-[var(--muted)]">
                          {mock.c}
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap text-[var(--muted)]">
                          {mock.m}
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap font-serif-fraunces font-semibold text-[1.08rem] text-[var(--ink)]">
                          {total(mock)}
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap font-medium text-red-600">
                          {mock.b ? mock.b[0] : ''}
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap font-medium text-red-600">
                          {mock.b ? mock.b[3] : ''}
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap text-[var(--muted)]">
                          {mock.b ? mock.b[2] : ''}
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap text-right">
                          <button
                            type="button"
                            onClick={() => onRemoveMock(mock)}
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
