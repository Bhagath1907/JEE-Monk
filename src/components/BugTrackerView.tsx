import React, { useState } from 'react';
import { Bug, Plus, Trash2, CheckCircle2, Circle } from 'lucide-react';
import {
  BugCategory,
  BugItem,
  CHAPTERS,
} from '../data/chapters';
import { formatLocalDateYYYYMMDD } from '../utils/monkLogic';

interface BugTrackerViewProps {
  activeChapterId: string;
  bugs: BugItem[];
  onAddBug: (bug: BugItem) => void;
  onToggleResolveBug: (bugId: string) => void;
  onDeleteBug: (bugId: string) => void;
}

const BUG_CATEGORIES: BugCategory[] = [
  '🧩 Twist Misread',
  '🧠 Formula Forgotten',
  '📘 NCERT Exception',
  '🔢 Calculation Bug',
];

export const BugTrackerView: React.FC<BugTrackerViewProps> = ({
  activeChapterId,
  bugs,
  onAddBug,
  onToggleResolveBug,
  onDeleteBug,
}) => {
  const [chapterId, setChapterId] = useState(activeChapterId);
  const [category, setCategory] = useState<BugCategory>('🧩 Twist Misread');
  const [triggerFix, setTriggerFix] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [filterSubject, setFilterSubject] = useState<string>('ALL');
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = triggerFix.trim();
    if (!trimmed) {
      setValidationError('Please enter a 1-Line Mental Trigger Fix before logging.');
      return;
    }
    setValidationError(null);

    const newBug: BugItem = {
      id: `bug-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      chapterId,
      category,
      triggerFix: trimmed,
      createdAt: formatLocalDateYYYYMMDD(),
      resolved: false,
    };
    onAddBug(newBug);
    setTriggerFix('');
  };

  const chapterMap = new Map(CHAPTERS.map((c) => [c.id, c]));

  const filteredBugs = bugs.filter((b) => {
    const ch = chapterMap.get(b.chapterId);
    if (filterCategory !== 'ALL' && b.category !== filterCategory) return false;
    if (filterSubject !== 'ALL' && ch?.subject !== filterSubject) return false;
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto p-6 lg:p-8 space-y-6">
      {/* Header & Quick Inline Form */}
      <section
        aria-label="Log New PYQ or Mock Mistake"
        className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-6 space-y-4"
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Bug className="w-4 h-4 text-indigo-400" />
            <h2 className="text-lg font-semibold text-zinc-100 tracking-tight">
              Bug Tracker (PYQ &amp; Mock Mistake Log)
            </h2>
          </div>
          <span className="text-xs font-mono tabular-nums text-zinc-400">
            {bugs.length} Logged
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="bug-chapter-select"
                className="block text-[11px] font-medium text-zinc-400 mb-1"
              >
                Chapter
              </label>
              <select
                id="bug-chapter-select"
                value={chapterId}
                onChange={(e) => setChapterId(e.target.value)}
                className="w-full rounded-lg bg-zinc-950 border border-zinc-800 px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-indigo-500/50"
              >
                {CHAPTERS.map((ch) => (
                  <option key={ch.id} value={ch.id}>
                    [{ch.id.toUpperCase()}] {ch.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="bug-category-select"
                className="block text-[11px] font-medium text-zinc-400 mb-1"
              >
                Bug Category
              </label>
              <select
                id="bug-category-select"
                value={category}
                onChange={(e) => setCategory(e.target.value as BugCategory)}
                className="w-full rounded-lg bg-zinc-950 border border-zinc-800 px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-indigo-500/50"
              >
                {BUG_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="flex-1">
              <label htmlFor="bug-trigger-input" className="sr-only">
                1-Line Mental Trigger Fix
              </label>
              <input
                id="bug-trigger-input"
                type="text"
                value={triggerFix}
                onChange={(e) => {
                  setTriggerFix(e.target.value);
                  if (validationError) setValidationError(null);
                }}
                placeholder="1-Line Mental Trigger Fix (e.g., 'Always check if battery is disconnected before applying U = Q²/2C')"
                className="w-full rounded-lg bg-zinc-950 border border-zinc-800 px-3.5 py-2 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-medium text-white transition-colors whitespace-nowrap shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Bug Fix</span>
            </button>
          </div>

          {validationError && (
            <p className="text-xs text-rose-400 font-medium">
              {validationError}
            </p>
          )}
        </form>
      </section>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div
          className="flex flex-wrap items-center gap-1.5"
          role="group"
          aria-label="Filter Bugs by Category"
        >
          <button
            type="button"
            onClick={() => setFilterCategory('ALL')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
              filterCategory === 'ALL'
                ? 'bg-zinc-800 text-zinc-100'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            All Categories
          </button>
          {BUG_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilterCategory(cat)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                filterCategory === cat
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                  : 'bg-zinc-900/60 text-zinc-400 hover:text-zinc-200 border border-zinc-800/80'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          {(['ALL', 'Physics', 'Chemistry', 'Math'] as const).map((subj) => (
            <button
              key={subj}
              type="button"
              onClick={() => setFilterSubject(subj)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                filterSubject === subj
                  ? 'bg-zinc-800 text-zinc-100'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {subj === 'ALL' ? 'All Subjects' : subj}
            </button>
          ))}
        </div>
      </div>

      {/* Logged Bugs List */}
      <div className="space-y-2.5">
        {filteredBugs.length === 0 ? (
          <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-10 text-center space-y-1">
            <p className="text-sm font-medium text-zinc-300">
              No mistakes logged for this filter.
            </p>
            <p className="text-xs text-zinc-500">
              Whenever a PYQ tricks you, log a 1-line mental trigger rule above
              so you never repeat it.
            </p>
          </div>
        ) : (
          filteredBugs.map((bug) => {
            const ch = chapterMap.get(bug.chapterId);
            return (
              <div
                key={bug.id}
                className={`flex items-start justify-between gap-4 rounded-xl border p-4 transition-colors ${
                  bug.resolved
                    ? 'bg-zinc-950/60 border-zinc-900 opacity-60'
                    : 'bg-zinc-900/60 border-zinc-800/80'
                }`}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <button
                    type="button"
                    onClick={() => onToggleResolveBug(bug.id)}
                    aria-label={
                      bug.resolved
                        ? `Mark bug "${bug.triggerFix}" as unresolved`
                        : `Resolve bug "${bug.triggerFix}"`
                    }
                    className="mt-0.5 text-zinc-400 hover:text-emerald-400 transition-colors shrink-0"
                  >
                    {bug.resolved ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Circle className="w-4 h-4" />
                    )}
                  </button>

                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400">
                      <span className="text-indigo-300 font-medium">
                        {bug.category}
                      </span>
                      <span aria-hidden="true" className="text-zinc-700">
                        ·
                      </span>
                      <span className="text-zinc-300 font-medium">
                        {ch ? `${ch.subject}: ${ch.title}` : bug.chapterId}
                      </span>
                      <span aria-hidden="true" className="text-zinc-700">
                        ·
                      </span>
                      <span className="font-mono text-[11px] text-zinc-500 tabular-nums">
                        {bug.createdAt}
                      </span>
                    </div>

                    <p
                      className={`text-sm leading-relaxed ${
                        bug.resolved
                          ? 'line-through text-zinc-500'
                          : 'text-zinc-100'
                      }`}
                    >
                      {bug.triggerFix}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onDeleteBug(bug.id)}
                  aria-label={`Delete bug "${bug.triggerFix}"`}
                  className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-zinc-900 transition-colors shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
