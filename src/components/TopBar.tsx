import React from 'react';
import { Menu } from 'lucide-react';
import {
  DayMode,
  TARGET_98_PERCENTILE_MARKS,
  TOTAL_MAX_MARKS,
  ViewId,
} from '../data/chapters';
import {
  calculateDaysToExam,
  calculateStreak,
  formatLocalDateYYYYMMDD,
  getLast14DaysStatus,
} from '../utils/monkLogic';

interface TopBarProps {
  activeView: ViewId;
  projectedScore: number;
  dayMode: DayMode;
  onToggleDayMode: (mode: DayMode) => void;
  commits: string[];
  onCommitToday: () => void;
  onOpenMobileSidebar: () => void;
}

const VIEW_TITLES: Record<ViewId, string> = {
  focus: 'Zen Monk Focus',
  mindmap: 'Dependency Mind Map',
  decoder: 'AI Twist Decoder Hub',
  bugs: 'Bug Tracker',
};

export const TopBar: React.FC<TopBarProps> = ({
  activeView,
  projectedScore,
  dayMode,
  onToggleDayMode,
  commits,
  onCommitToday,
  onOpenMobileSidebar,
}) => {
  const daysLeft = calculateDaysToExam();
  const todayStr = formatLocalDateYYYYMMDD();
  const isCommittedToday = commits.includes(todayStr);
  const streak = calculateStreak(commits, todayStr);
  const last14Days = getLast14DaysStatus(commits);

  const scorePct = Math.min(
    100,
    Math.max(0, (projectedScore / TOTAL_MAX_MARKS) * 100)
  );
  const targetMarkerPct = (TARGET_98_PERCENTILE_MARKS / TOTAL_MAX_MARKS) * 100;

  return (
    <header className="sticky top-0 z-30 h-14 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/80 px-3 sm:px-5 flex items-center justify-between gap-2">
      {/* Left: Mobile Menu + Current View Title + Live Countdown */}
      <div className="flex items-center gap-2 min-w-0">
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          aria-label="Open navigation menu"
          className="lg:hidden p-1.5 rounded-md text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 transition-colors shrink-0"
        >
          <Menu className="w-4 h-4" />
        </button>

        <h1 className="text-xs sm:text-sm font-semibold text-zinc-100 tracking-tight whitespace-nowrap truncate">
          {VIEW_TITLES[activeView]}
        </h1>

        <span
          className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-zinc-900/90 border border-zinc-800/80 text-[11px] font-mono tabular-nums text-zinc-400 whitespace-nowrap shrink-0"
          title="Target Exam Date: January 20, 2027"
        >
          <span className="text-indigo-400 font-semibold">{daysLeft} Days</span>
          <span>to Jan 20, 2027</span>
        </span>
      </div>

      {/* Center: Sleek Projected JEE Score Meter */}
      <div className="hidden lg:flex items-center gap-2.5 shrink-0">
        <div className="flex items-baseline gap-1.5 text-xs whitespace-nowrap">
          <span className="text-zinc-400 font-medium">Projected Score:</span>
          <span
            data-testid="projected-score-value"
            className="font-mono font-semibold text-emerald-400 tabular-nums"
          >
            {projectedScore} / {TOTAL_MAX_MARKS} Marks
          </span>
        </div>

        <div
          className="relative flex items-center"
          title="160 Marks (98%ile Target)"
        >
          <div
            className="h-1.5 w-28 xl:w-36 bg-zinc-800 rounded-full overflow-hidden"
            role="progressbar"
            aria-valuenow={projectedScore}
            aria-valuemin={0}
            aria-valuemax={TOTAL_MAX_MARKS}
            aria-label="Projected JEE Score Progress"
          >
            <div
              className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
              style={{ width: `${scorePct}%` }}
            />
          </div>
          {/* 160 Marks (98%ile Target) Marker */}
          <div
            className="absolute -top-1 bottom-[-4px] w-0.5 bg-amber-400"
            style={{ left: `${targetMarkerPct}%` }}
          />
        </div>

        <span className="hidden 2xl:inline text-[11px] font-mono tabular-nums text-zinc-500 whitespace-nowrap">
          160M (98%ile)
        </span>
      </div>

      {/* Right: Day Mode Pill Toggle + Daily Streak Commit Button */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {/* Day Mode Pill Toggle */}
        <div
          className="flex items-center p-0.5 bg-zinc-900 border border-zinc-800/80 rounded-lg shrink-0"
          role="group"
          aria-label="Day Mode Protocol Switch"
        >
          <button
            type="button"
            onClick={() => onToggleDayMode('home')}
            title="Home Day (Full Monk: 8-10h)"
            className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors whitespace-nowrap ${
              dayMode === 'home'
                ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30'
                : 'text-zinc-400 hover:text-zinc-200 border border-transparent'
            }`}
          >
            <span className="hidden xl:inline">🏠 Home (8-10h)</span>
            <span className="xl:hidden">🏠 Home</span>
          </button>
          <button
            type="button"
            onClick={() => onToggleDayMode('college')}
            title="College Day (Stealth: 4h)"
            className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors whitespace-nowrap ${
              dayMode === 'college'
                ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30'
                : 'text-zinc-400 hover:text-zinc-200 border border-transparent'
            }`}
          >
            <span className="hidden xl:inline">🎒 College (4h)</span>
            <span className="xl:hidden">🎒 College</span>
          </button>
        </div>

        {/* Daily Streak Commit Button + 14-day dot indicator */}
        <button
          type="button"
          onClick={onCommitToday}
          title={
            isCommittedToday
              ? `Committed for ${todayStr} — Keep grinding!`
              : `Click to commit today's study session (${todayStr})`
          }
          className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-colors whitespace-nowrap shrink-0 ${
            isCommittedToday
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-zinc-900/80 border-zinc-800/80 text-zinc-300 hover:border-zinc-700 hover:text-zinc-100'
          }`}
        >
          <span className="font-mono tabular-nums">
            🔥 {streak}
            <span className="hidden sm:inline"> Day Streak</span>
            <span className="sm:hidden">d</span>
          </span>

          {/* Tiny 14-day dot indicator */}
          <span
            className="hidden xl:flex items-center gap-0.5 pl-1.5 border-l border-zinc-800"
            aria-label="14-day streak history"
          >
            {last14Days.map((d) => (
              <span
                key={d.date}
                title={`${d.date}: ${d.committed ? 'Committed' : 'Uncommitted'}`}
                className={`w-1 h-1 rounded-full ${
                  d.committed
                    ? 'bg-emerald-400'
                    : d.isToday
                    ? 'bg-zinc-600'
                    : 'bg-zinc-800'
                }`}
              />
            ))}
          </span>
        </button>
      </div>
    </header>
  );
};
