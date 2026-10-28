import React from 'react';
import {
  Crosshair,
  GitBranch,
  Sparkles,
  Bug,
  Database,
  CheckCircle2,
  X,
} from 'lucide-react';
import {
  CHAPTERS,
  Chapter,
  ChapterProgress,
  TOTAL_MAX_MARKS,
  ViewId,
} from '../data/chapters';
import {
  calculateChapterEarnedMarks,
  isChapterFullyMastered,
} from '../utils/monkLogic';

interface SidebarProps {
  activeView: ViewId;
  onSelectView: (view: ViewId) => void;
  activeChapterId: string;
  onSelectChapter: (chapterId: string) => void;
  progress: Record<string, ChapterProgress>;
  bugCount: number;
  projectedScore: number;
  onOpenBackupModal: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onSelectView,
  activeChapterId,
  onSelectChapter,
  progress,
  bugCount,
  projectedScore,
  onOpenBackupModal,
  mobileOpen,
  onCloseMobile,
}) => {
  const masteredCount = CHAPTERS.filter((ch) =>
    isChapterFullyMastered(progress[ch.id])
  ).length;

  const getSubjectStats = (subject: Chapter['subject']) => {
    const subChapters = CHAPTERS.filter((c) => c.subject === subject);
    const maxMarks = subChapters.reduce((s, c) => s + c.marks, 0);
    const earned = subChapters.reduce(
      (s, c) => s + calculateChapterEarnedMarks(c.marks, progress[c.id]),
      0
    );
    return {
      earned: Math.round(earned * 10) / 10,
      maxMarks,
      count: subChapters.length,
    };
  };

  const navItems: Array<{
    id: ViewId;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    meta?: string;
  }> = [
    {
      id: 'focus',
      label: 'Zen Monk Focus',
      icon: Crosshair,
      meta: activeChapterId.toUpperCase(),
    },
    {
      id: 'mindmap',
      label: 'Dependency Mind Map',
      icon: GitBranch,
      meta: `${masteredCount}/35`,
    },
    {
      id: 'decoder',
      label: 'AI Twist Decoder Hub',
      icon: Sparkles,
      meta: '3 Prompts',
    },
    {
      id: 'bugs',
      label: 'Bug Tracker',
      icon: Bug,
      meta: String(bugCount),
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full w-64 bg-zinc-950 border-r border-zinc-800/80 select-none">
      {/* Brand Header */}
      <div className="h-14 px-5 flex items-center justify-between border-b border-zinc-800/80">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-md bg-indigo-500/15 border border-indigo-500/40 flex items-center justify-center text-xs font-mono font-bold text-indigo-400">
            M
          </div>
          <div>
            <div className="text-sm font-semibold text-zinc-100 tracking-tight leading-none">
              JEE Monk OS
            </div>
            <div className="text-[11px] font-mono text-zinc-500 mt-1 leading-none">
              Target · Jan 20, 2027
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onCloseMobile}
          aria-label="Close sidebar"
          className="lg:hidden p-1 rounded-md text-zinc-400 hover:text-zinc-100"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Primary Workspace Views */}
      <div className="p-3 space-y-1">
        <div className="px-2.5 py-1 text-[11px] font-medium text-zinc-500">
          Workspace Views
        </div>
        <nav aria-label="Main Workspace Navigation" className="space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onSelectView(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-zinc-900 text-zinc-100 border border-zinc-800/90'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50 border border-transparent'
                }`}
              >
                <span className="flex items-center gap-2.5 truncate">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-indigo-400' : 'text-zinc-500'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </span>
                {item.meta && (
                  <span
                    className={`text-[11px] font-mono tabular-nums whitespace-nowrap shrink-0 ml-2 ${
                      isActive ? 'text-indigo-300' : 'text-zinc-500'
                    }`}
                  >
                    {item.meta}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Subject Yield Breakdown */}
      <div className="px-5 py-3 border-t border-zinc-900 space-y-2.5">
        <div className="flex items-center justify-between text-[11px] text-zinc-500 font-medium">
          <span>Subject Yield</span>
          <span className="font-mono tabular-nums text-emerald-400">
            {projectedScore}/{TOTAL_MAX_MARKS}M
          </span>
        </div>
        {(['Physics', 'Chemistry', 'Math'] as const).map((subj) => {
          const st = getSubjectStats(subj);
          const pct = Math.min(100, (st.earned / st.maxMarks) * 100);
          return (
            <div key={subj} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400">{subj}</span>
                <span className="font-mono text-[11px] tabular-nums text-zinc-400">
                  {st.earned} / {st.maxMarks}M
                </span>
              </div>
              <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-zinc-400 rounded-full transition-all duration-300"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Chapter Switcher List */}
      <div className="flex-1 min-h-0 flex flex-col border-t border-zinc-900 pt-2">
        <div className="px-5 py-1.5 flex items-center justify-between text-[11px] font-medium text-zinc-500">
          <span>35 High-ROI Chapters</span>
          <span className="font-mono tabular-nums">{masteredCount} Mastered</span>
        </div>
        <div className="flex-1 overflow-y-auto px-3 py-1 space-y-0.5">
          {CHAPTERS.map((ch) => {
            const isSelected = ch.id === activeChapterId;
            const prog = progress[ch.id];
            const mastered = isChapterFullyMastered(prog);
            const earned = calculateChapterEarnedMarks(ch.marks, prog);
            return (
              <button
                key={ch.id}
                type="button"
                onClick={() => {
                  onSelectChapter(ch.id);
                  if (activeView !== 'focus') {
                    onSelectView('focus');
                  }
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-md text-left text-xs transition-colors ${
                  isSelected
                    ? 'bg-indigo-500/10 text-indigo-200 border border-indigo-500/30'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60 border border-transparent'
                }`}
              >
                <span className="flex items-center gap-2 min-w-0">
                  <span className="font-mono text-[10px] text-zinc-500 uppercase w-6 shrink-0">
                    {ch.id}
                  </span>
                  <span className="truncate">{ch.title}</span>
                </span>
                <span className="flex items-center gap-1.5 shrink-0">
                  {mastered ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : earned > 0 ? (
                    <span className="font-mono text-[10px] text-emerald-400 tabular-nums">
                      +{earned}M
                    </span>
                  ) : (
                    <span className="font-mono text-[10px] text-zinc-600 tabular-nums">
                      {ch.marks}M
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer: Export / Import JSON Backup */}
      <div className="p-3 border-t border-zinc-800/80">
        <button
          type="button"
          onClick={onOpenBackupModal}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800/80 text-xs text-zinc-300 hover:text-zinc-100 transition-colors"
        >
          <span className="flex items-center gap-2">
            <Database className="w-3.5 h-3.5 text-zinc-400" />
            <span>Backup / Restore JSON</span>
          </span>
          <span className="font-mono text-[10px] text-zinc-500">v2</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden lg:block shrink-0">{sidebarContent}</aside>

      {/* Mobile Slide-Over Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-xs"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <div className="relative z-10 h-full">{sidebarContent}</div>
        </div>
      )}
    </>
  );
};
