import React, { useState } from 'react';
import { CardEntry } from '../types';
import { Search } from 'lucide-react';

interface FlashcardStackProps {
  cards: CardEntry[];
  onAddCard: (card: CardEntry) => void;
  onRemoveCard: (card: CardEntry) => void;
}

export const FlashcardStack: React.FC<FlashcardStackProps> = ({
  cards,
  onAddCard,
  onRemoveCard,
}) => {
  const [subj, setSubj] = useState('Maths');
  const [title, setTitle] = useState('');
  const [words, setWords] = useState('');
  const [ex, setEx] = useState('');
  const [dia, setDia] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSubj, setFilterSubj] = useState('all');
  const [msg, setMsg] = useState<{ text: string; bad?: boolean } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const t = title.trim();
    const w = words.trim();
    if (!t || !w) {
      setMsg({
        text: 'Add a title and the concept in your own words.',
        bad: true,
      });
      return;
    }

    onAddCard({
      subj,
      title: t,
      words: w,
      ex: ex.trim(),
      dia: dia.trim(),
      ts: Date.now(),
    });

    setTitle('');
    setWords('');
    setEx('');
    setDia('');
    setMsg({ text: 'Card added.', bad: false });
  };

  const filteredCards = cards.filter((c) => {
    const matchesSubj = filterSubj === 'all' || c.subj === filterSubj;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesSubj;
    return (
      matchesSubj &&
      (c.title.toLowerCase().includes(q) ||
        c.words.toLowerCase().includes(q) ||
        (c.ex && c.ex.toLowerCase().includes(q)) ||
        (c.dia && c.dia.toLowerCase().includes(q)))
    );
  });

  return (
    <section id="cards" className="py-16 border-t border-[var(--line)]">
      <div className="max-w-[1180px] mx-auto px-[22px]">
        <h2 className="font-serif-fraunces font-light text-[clamp(1.9rem,4vw,2.75rem)] leading-tight tracking-tight text-[var(--ink)]">
          Flashcard stack
        </h2>
        <p className="text-[var(--muted)] max-w-[68ch] mt-3 text-[1.02rem] leading-relaxed">
          1 concept = 1 card = 2 minutes. Write the title, your own words (Hindi, English or mixed), one real-life example, and a diagram idea. Keep the paper slip as the real card and use this as your searchable backup.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-[330px_minmax(0,1fr)] gap-10 lg:gap-14 mt-8">
          {/* Card Form */}
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
              Title
              <input
                type="text"
                maxLength={80}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Concept or theorem title"
                className="w-full border border-[var(--line)] bg-[var(--paper)] text-[var(--ink)] rounded-[10px] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--hilite)]"
              />
            </label>

            <label className="grid gap-1 font-medium text-[0.93rem] text-[var(--ink)]">
              In your own words
              <textarea
                rows={3}
                maxLength={220}
                value={words}
                onChange={(e) => setWords(e.target.value)}
                placeholder="Explain in plain words (Hindi, English or mixed)"
                className="w-full border border-[var(--line)] bg-[var(--paper)] text-[var(--ink)] rounded-[10px] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--hilite)] resize-none"
              />
            </label>

            <label className="grid gap-1 font-medium text-[0.93rem] text-[var(--ink)]">
              Real-life example
              <input
                type="text"
                maxLength={160}
                value={ex}
                onChange={(e) => setEx(e.target.value)}
                placeholder="Physical analogy or intuition"
                className="w-full border border-[var(--line)] bg-[var(--paper)] text-[var(--ink)] rounded-[10px] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--hilite)]"
              />
            </label>

            <label className="grid gap-1 font-medium text-[0.93rem] text-[var(--ink)]">
              Diagram idea
              <input
                type="text"
                maxLength={120}
                value={dia}
                onChange={(e) => setDia(e.target.value)}
                placeholder="Optional, what you would sketch"
                className="w-full border border-[var(--line)] bg-[var(--paper)] text-[var(--ink)] rounded-[10px] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--hilite)]"
              />
            </label>

            <button
              type="submit"
              className="mt-2 bg-[var(--graphite)] border border-[var(--graphite)] text-[var(--sheet)] rounded-full px-4.5 py-2.5 font-semibold hover:brightness-110 transition-all cursor-pointer text-sm"
            >
              Add card
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

          {/* Cards List & Search */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <p className="text-[var(--muted)] text-[0.94rem]">
                {cards.length
                  ? `${cards.length} card${
                      cards.length > 1 ? 's' : ''
                    } in your stack. Aim for 4 new cards a day, 8 to 10 minutes.`
                  : "No cards yet. Make your first one while studying today's chapter."}
              </p>

              {/* Search & filter */}
              {cards.length > 0 && (
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-48">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                    <input
                      type="text"
                      placeholder="Search cards..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-8 pr-2.5 py-1 text-xs border border-[var(--line)] rounded-lg bg-[var(--paper)] text-[var(--ink)]"
                    />
                  </div>
                  <select
                    value={filterSubj}
                    onChange={(e) => setFilterSubj(e.target.value)}
                    className="text-xs border border-[var(--line)] rounded-lg bg-[var(--paper)] text-[var(--ink)] py-1 px-2"
                  >
                    <option value="all">All subjects</option>
                    <option value="Maths">Maths</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                  </select>
                </div>
              )}
            </div>

            <div className="space-y-2.5">
              {filteredCards.length === 0 && cards.length > 0 ? (
                <p className="text-xs text-[var(--muted)] italic py-3">
                  No cards match your search.
                </p>
              ) : null}

              {[...filteredCards].reverse().map((card) => (
                <details
                  key={card.ts}
                  className="group border border-[var(--line)] border-l-[3.5px] border-l-[var(--graphite)] rounded-r-[16px] rounded-l-[4px] bg-[var(--sheet)] p-3.5 shadow-sm transition-all"
                >
                  <summary className="cursor-pointer font-serif-fraunces font-medium text-[1.12rem] text-[var(--ink)] flex items-center justify-between select-none">
                    <span>
                      {card.title}{' '}
                      <span className="font-sans-instrument text-[0.82rem] font-normal text-[var(--muted)] ml-1.5 px-2 py-0.5 rounded-full border border-[var(--line)]">
                        {card.subj}
                      </span>
                    </span>
                  </summary>

                  <div className="mt-3 text-[0.95rem] text-[var(--ink)] space-y-2 leading-relaxed border-t border-[var(--line)] pt-3">
                    <p className="whitespace-pre-line">{card.words}</p>
                    {card.ex && (
                      <p className="text-[0.92rem] text-[var(--muted)]">
                        <strong className="text-[var(--ink)] font-medium">Example:</strong> {card.ex}
                      </p>
                    )}
                    {card.dia && (
                      <p className="text-[0.88rem] text-[var(--muted)] italic">
                        <strong className="text-[var(--ink)] font-medium">Diagram idea:</strong> {card.dia}
                      </p>
                    )}

                    <div className="pt-1 flex justify-end">
                      <button
                        type="button"
                        onClick={() => onRemoveCard(card)}
                        aria-label={`Remove card: ${card.title}`}
                        className="text-[var(--muted)] hover:text-[var(--danger)] underline text-xs cursor-pointer"
                      >
                        Remove card
                      </button>
                    </div>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
