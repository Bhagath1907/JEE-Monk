import React, { useState } from 'react';
import { ArrowRight, Lock, Unlock, Crosshair, CheckCircle2 } from 'lucide-react';
import {
  CHAPTERS,
  Chapter,
  ChapterProgress,
} from '../data/chapters';
import {
  calculateChapterEarnedMarks,
  getChapterProgress,
  getPrerequisiteChapter,
  groupChaptersByChain,
  isChapterFullyMastered,
  isChapterUnlocked,
} from '../utils/monkLogic';

interface MindMapViewProps {
  activeChapterId: string;
  progress: Record<string, ChapterProgress>;
  onSelectActiveFocus: (chapterId: string) => void;
}

type MindMapFilter =
  | 'all'
  | 'Physics'
  | 'Chemistry'
  | 'Math'
  | 'puc12'
  | 'unfinished';

export const MindMapView: React.FC<MindMapViewProps> = ({
  activeChapterId,
  progress,
  onSelectActiveFocus,
}) => {
  const [filter, setFilter] = useState<MindMapFilter>('all');

  const filteredChapters = CHAPTERS.filter((ch) => {
    if (filter === 'Physics') return ch.subject === 'Physics';
    if (filter === 'Chemistry') return ch.subject === 'Chemistry';
    if (filter === 'Math') return ch.subject === 'Math';
    if (filter === 'puc12') return ch.classTag === '12th PUC Sync';
    if (filter === 'unfinished')
      return !isChapterFullyMastered(progress[ch.id]);
    return true;
  });

  const chainGroups = groupChaptersByChain(filteredChapters);

  const filterButtons: Array<{ id: MindMapFilter; label: string }> = [
    { id: 'all', label: 'All (35)' },
    { id: 'Physics', label: 'Physics (12)' },
    { id: 'Chemistry', label: 'Chemistry (13)' },
    { id: 'Math', label: 'Math (9)' },
    { id: 'puc12', label: '12th PUC Sync Only' },
    { id: 'unfinished', label: 'Unfinished Only' },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 lg:p-8 space-y-6">
      {/* Top Header & Filter Pills */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/80 pb-5">
        <div>
          <h2 className="text-lg font-semibold text-zinc-100 tracking-tight">
            Dependency Mind Map (35 High-ROI Chapters)
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Execute chapters in strict prerequisite order to unlock downstream
            concepts and maximize marks.
          </p>
        </div>

        {/* Filter Pills */}
        <div
          className="flex flex-wrap items-center gap-1.5"
          role="group"
          aria-label="Chapter Pipeline Filters"
        >
          {filterButtons.map((btn) => {
            const isActive = filter === btn.id;
            return (
              <button
                key={btn.id}
                type="button"
                onClick={() => setFilter(btn.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                  isActive
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                    : 'bg-zinc-900/70 text-zinc-400 hover:text-zinc-200 border border-zinc-800/80'
                }`}
              >
                {btn.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Chain Pipeline Groups */}
      {chainGroups.length === 0 ? (
        <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-10 text-center space-y-2">
          <p className="text-sm font-medium text-zinc-300">
            All chapters matching this filter are mastered!
          </p>
          <button
            type="button"
            onClick={() => setFilter('all')}
            className="text-xs text-indigo-400 hover:underline"
          >
            Reset filter to All (35)
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {chainGroups.map((group) => {
            const chainTotalMarks = group.chapters.reduce(
              (s, c) => s + c.marks,
              0
            );
            const chainEarnedMarks = group.chapters.reduce(
              (s, c) =>
                s + calculateChapterEarnedMarks(c.marks, progress[c.id]),
              0
            );

            return (
              <section
                key={group.chain}
                className="space-y-3"
                aria-label={group.chain}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-semibold text-zinc-200">
                      {group.chain}
                    </span>
                    <span aria-hidden="true" className="text-zinc-700">
                      ·
                    </span>
                    <span className="text-zinc-400">{group.subject}</span>
                  </div>
                  <span className="font-mono text-xs tabular-nums text-emerald-400">
                    {Math.round(chainEarnedMarks * 10) / 10} / {chainTotalMarks}{' '}
                    Marks
                  </span>
                </div>

                {/* Connected Pipeline Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {group.chapters.map((ch, idx) => {
                    const prog = getChapterProgress(progress, ch.id);
                    const unlocked = isChapterUnlocked(ch, progress);
                    const prereq = getPrerequisiteChapter(ch, CHAPTERS);
                    const isCurrentFocus = ch.id === activeChapterId;
                    const mastered = isChapterFullyMastered(prog);
                    const hasNextInGroup = idx < group.chapters.length - 1;

                    return (
                      <div
                        key={ch.id}
                        className="relative flex items-stretch"
                      >
                        <div
                          className={`flex-1 flex flex-col justify-between rounded-xl border p-4 transition-colors ${
                            isCurrentFocus
                              ? 'bg-indigo-950/15 border-indigo-500/50'
                              : mastered
                              ? 'bg-emerald-950/10 border-emerald-500/30'
                              : 'bg-zinc-900/60 border-zinc-800/80 hover:border-zinc-700/80'
                          }`}
                        >
                          <div className="space-y-2.5">
                            {/* Top row: ID + ClassTag + Marks */}
                            <div className="flex items-center justify-between gap-2 text-xs">
                              <div className="flex items-center gap-1.5 text-zinc-400 font-mono">
                                <span className="uppercase text-zinc-300 font-semibold">
                                  {ch.id}
                                </span>
                                <span aria-hidden="true">·</span>
                                <span className="font-sans text-[11px]">
                                  {ch.classTag}
                                </span>
                              </div>
                              <span className="font-mono font-semibold text-emerald-400 tabular-nums">
                                +{ch.marks} Marks
                              </span>
                            </div>

                            {/* Title */}
                            <h3 className="text-sm font-semibold text-zinc-100 leading-snug">
                              {ch.title}
                            </h3>

                            {/* Prerequisite Status */}
                            <div className="text-xs">
                              {unlocked ? (
                                <span className="inline-flex items-center gap-1 text-emerald-400">
                                  <span>🔓 Unlocked</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-amber-400">
                                  <span className="truncate">
                                    🔒 Do {prereq?.title || ch.prereq} first
                                  </span>
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Bottom row: 3 Mini Progress Dots + 1-click Set as Active Focus */}
                          <div className="pt-4 mt-3 border-t border-zinc-800/70 flex items-center justify-between gap-2">
                            {/* 3 Mini Progress Dots */}
                            <div
                              className="flex items-center gap-1.5"
                              title={`Step 1: ${prog.step1 ? 'Done' : 'Pending'} | Step 2: ${prog.step2 ? 'Done' : 'Pending'} | Step 3: ${prog.step3 ? 'Done' : 'Pending'}`}
                            >
                              <span
                                className={`w-2 h-2 rounded-full ${
                                  prog.step1 ? 'bg-emerald-400' : 'bg-zinc-700'
                                }`}
                              />
                              <span
                                className={`w-2 h-2 rounded-full ${
                                  prog.step2 ? 'bg-emerald-400' : 'bg-zinc-700'
                                }`}
                              />
                              <span
                                className={`w-2 h-2 rounded-full ${
                                  prog.step3 ? 'bg-emerald-400' : 'bg-zinc-700'
                                }`}
                              />
                              <span className="text-[11px] font-mono text-zinc-500 ml-1 tabular-nums">
                                {[prog.step1, prog.step2, prog.step3].filter(
                                  Boolean
                                ).length}
                                /3
                              </span>
                            </div>

                            {isCurrentFocus ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-indigo-500/20 text-indigo-300 text-xs font-medium">
                                <Crosshair className="w-3 h-3" />
                                <span>Active Focus</span>
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => onSelectActiveFocus(ch.id)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-zinc-800/90 hover:bg-indigo-600 text-zinc-200 hover:text-white text-xs font-medium transition-colors"
                              >
                                {mastered && (
                                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                )}
                                <span>Set as Active Focus</span>
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Pipeline Connector Arrow on Desktop */}
                        {hasNextInGroup && (
                          <div
                            aria-hidden="true"
                            className="hidden lg:flex items-center justify-center -mr-3 ml-0.5 text-zinc-700"
                          >
                            <ArrowRight className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
};
