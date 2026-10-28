import React, { useState } from 'react';
import {
  ArrowRight,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Play,
  Sparkles,
  FileText,
  Check,
  Copy,
  X,
  Lock,
  Unlock,
} from 'lucide-react';
import {
  CHAPTERS,
  Chapter,
  ChapterProgress,
  DayMode,
} from '../data/chapters';
import {
  calculateChapterEarnedMarks,
  generateAiPrompts,
  getNextRecommendedChapter,
  getPrerequisiteChapter,
  isChapterUnlocked,
  parseYouTubeEmbedUrl,
} from '../utils/monkLogic';

interface ZenFocusViewProps {
  chapter: Chapter;
  progress: ChapterProgress;
  allProgress: Record<string, ChapterProgress>;
  dayMode: DayMode;
  onUpdateProgress: (
    chapterId: string,
    updater: (prev: ChapterProgress) => ChapterProgress
  ) => void;
  onSelectChapter: (chapterId: string) => void;
}

export const ZenFocusView: React.FC<ZenFocusViewProps> = ({
  chapter,
  progress,
  allProgress,
  dayMode,
  onUpdateProgress,
  onSelectChapter,
}) => {
  const [twistExpanded, setTwistExpanded] = useState(true);
  const [scratchpadOpen, setScratchpadOpen] = useState(false);
  const [playerModalOpen, setPlayerModalOpen] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [videoInputUrl, setVideoInputUrl] = useState(
    progress.pinnedVideoUrl || ''
  );
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);

  const earnedMarks = calculateChapterEarnedMarks(chapter.marks, progress);
  const unlocked = isChapterUnlocked(chapter, allProgress);
  const prereqChapter = getPrerequisiteChapter(chapter, CHAPTERS);

  const handleStepToggle = (step: 'step1' | 'step2' | 'step3') => {
    onUpdateProgress(chapter.id, (prev) => ({
      ...prev,
      [step]: !prev[step],
    }));
  };

  const handleNextChapter = () => {
    const next = getNextRecommendedChapter(chapter.id, CHAPTERS, allProgress);
    onSelectChapter(next.id);
  };

  const openPlayerModal = () => {
    setVideoInputUrl(progress.pinnedVideoUrl || '');
    setPlayerModalOpen(true);
  };

  const handleSavePinnedVideo = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProgress(chapter.id, (prev) => ({
      ...prev,
      pinnedVideoUrl: videoInputUrl.trim(),
    }));
  };

  const embedUrl = parseYouTubeEmbedUrl(
    progress.pinnedVideoUrl || videoInputUrl
  );
  const aiPrompts = generateAiPrompts(chapter);

  const handleCopyPrompt = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedPromptId(id);
      setTimeout(() => setCopiedPromptId(null), 2000);
    } catch {
      // Fallback
    }
  };

  const step1Marks = Math.round(chapter.marks * 0.2 * 10) / 10;
  const step2Marks = Math.round(chapter.marks * 0.3 * 10) / 10;
  const step3Marks = Math.round(chapter.marks * 0.5 * 10) / 10;

  return (
    <div className="max-w-4xl mx-auto p-6 lg:p-8 space-y-6">
      {/* 1. Chapter Header Card */}
      <section
        aria-label="Active Chapter Header"
        className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-6 space-y-4"
      >
        {/* Top Metadata Row */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400">
            <span className="font-semibold text-indigo-400">
              {chapter.subject}
            </span>
            <span aria-hidden="true" className="text-zinc-700">
              ·
            </span>
            <span className="text-zinc-300">{chapter.classTag}</span>
            <span aria-hidden="true" className="text-zinc-700">
              ·
            </span>
            <span className="text-zinc-400">{chapter.chain}</span>
            {prereqChapter && (
              <>
                <span aria-hidden="true" className="text-zinc-700">
                  ·
                </span>
                {unlocked ? (
                  <span className="inline-flex items-center gap-1 text-emerald-400">
                    <Unlock className="w-3 h-3" />
                    <span>Prereq {prereqChapter.id.toUpperCase()} Cleared</span>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => onSelectChapter(prereqChapter.id)}
                    className="inline-flex items-center gap-1 text-amber-400 hover:underline"
                  >
                    <Lock className="w-3 h-3" />
                    <span>Do {prereqChapter.title} first</span>
                  </button>
                )}
              </>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono font-semibold text-emerald-400 tabular-nums">
              +{chapter.marks} JEE Marks
              {earnedMarks > 0 && (
                <span className="text-emerald-300/80 font-normal">
                  ({earnedMarks}M earned)
                </span>
              )}
            </span>
          </div>
        </div>

        {/* Title & Switch/Next Chapter Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-100 tracking-tight leading-snug">
            {chapter.title}
          </h2>

          <button
            type="button"
            onClick={handleNextChapter}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800/90 border border-zinc-800 text-xs font-medium text-zinc-200 hover:text-zinc-100 transition-colors shrink-0 self-start sm:self-auto"
          >
            <span>Switch / Next Chapter</span>
            <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
          </button>
        </div>

        {/* Mode Context Protocol Line */}
        <div className="pt-3 border-t border-zinc-800/70 flex items-center justify-between gap-4 text-xs">
          <p className="text-zinc-300 font-medium">
            {dayMode === 'home' ? (
              <span>
                <span className="text-indigo-400 font-semibold">
                  Monk Protocol:
                </span>{' '}
                Finish all 3 steps today before switching subjects.
              </span>
            ) : (
              <span>
                <span className="text-indigo-400 font-semibold">
                  Stealth Protocol:
                </span>{' '}
                Watch Step 1 &amp; 2 at home (3h); solve 30 PYQs on the
                backbench at college.
              </span>
            )}
          </p>

          <span className="font-mono text-[11px] text-zinc-500 uppercase shrink-0">
            ID: {chapter.id}
          </span>
        </div>
      </section>

      {/* 2. Collapsible "2nd PUC Board vs. JEE Twist" Insight Box */}
      <section
        aria-label="2nd PUC Board vs JEE Twist Insight"
        className="bg-amber-500/[0.04] border border-amber-500/20 rounded-xl overflow-hidden"
      >
        <button
          type="button"
          onClick={() => setTwistExpanded((prev) => !prev)}
          aria-expanded={twistExpanded}
          className="w-full px-6 py-3.5 flex items-center justify-between text-left hover:bg-amber-500/[0.03] transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-semibold text-amber-300 tracking-tight">
              2nd PUC Board vs. JEE Twist Insight
            </span>
            <span className="text-[11px] text-amber-400/70 hidden sm:inline">
              · How JEE &amp; KCET disguise standard Karnataka Board concepts
            </span>
          </div>
          {twistExpanded ? (
            <ChevronUp className="w-4 h-4 text-amber-400/80 shrink-0" />
          ) : (
            <ChevronDown className="w-4 h-4 text-amber-400/80 shrink-0" />
          )}
        </button>

        {twistExpanded && (
          <div className="px-6 pb-4 pt-1 text-sm text-zinc-200 leading-relaxed border-t border-amber-500/10">
            {chapter.boardTwist}
          </div>
        )}
      </section>

      {/* 3. The 3-Step Interactive Stepper */}
      <section aria-label="3-Step Execution Stepper" className="space-y-3">
        {/* Step 1 */}
        <div
          className={`rounded-xl border p-5 transition-colors ${
            progress.step1
              ? 'bg-emerald-950/10 border-emerald-500/30'
              : 'bg-zinc-900/60 border-zinc-800/80'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <label className="flex items-start gap-3.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={progress.step1}
                onChange={() => handleStepToggle('step1')}
                className="mt-1 w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-indigo-500 focus:ring-indigo-500/40"
              />
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`text-sm font-semibold ${
                      progress.step1 ? 'text-emerald-300' : 'text-zinc-100'
                    }`}
                  >
                    Step 1: Fast Concept &amp; Formula Sync
                  </span>
                  <span className="text-xs font-mono tabular-nums text-zinc-400">
                    1.5–2h · +20% Marks (+{step1Marks}M)
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-1">
                  Build rapid formula recall and concept clarity before touching
                  questions.
                </p>
              </div>
            </label>

            <div className="flex flex-wrap items-center gap-2 pl-7 sm:pl-0 shrink-0">
              <a
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                  chapter.fastQuery
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-medium text-zinc-200 transition-colors whitespace-nowrap"
              >
                <span>⚡ Fast Hinglish Revision</span>
                <ExternalLink className="w-3 h-3 text-zinc-500" />
              </a>
              <a
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                  chapter.fullQuery
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-medium text-zinc-300 transition-colors whitespace-nowrap"
              >
                <span>📚 Full One-Shot</span>
                <ExternalLink className="w-3 h-3 text-zinc-500" />
              </a>
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div
          className={`rounded-xl border p-5 transition-colors ${
            progress.step2
              ? 'bg-emerald-950/10 border-emerald-500/30'
              : 'bg-zinc-900/60 border-zinc-800/80'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <label className="flex items-start gap-3.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={progress.step2}
                onChange={() => handleStepToggle('step2')}
                className="mt-1 w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-indigo-500 focus:ring-indigo-500/40"
              />
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`text-sm font-semibold ${
                      progress.step2 ? 'text-emerald-300' : 'text-zinc-100'
                    }`}
                  >
                    Step 2: Guided PYQ Decoding Session
                  </span>
                  <span className="text-xs font-mono tabular-nums text-indigo-400">
                    2h · +30% Marks (+{step2Marks}M — THE BRIDGE)
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-1">
                  Pause on each question for 60s, spot how JEE twisted the
                  wording, then watch the teacher solve it.
                </p>
              </div>
            </label>

            <div className="flex flex-wrap items-center gap-2 pl-7 sm:pl-0 shrink-0">
              <a
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                  chapter.pyqQuery
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 text-xs font-medium text-indigo-300 transition-colors whitespace-nowrap"
              >
                <span>🔥 Watch Guided Top PYQs</span>
                <ExternalLink className="w-3 h-3 text-indigo-400" />
              </a>
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div
          className={`rounded-xl border p-5 transition-colors ${
            progress.step3
              ? 'bg-emerald-950/10 border-emerald-500/30'
              : 'bg-zinc-900/60 border-zinc-800/80'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <label className="flex items-start gap-3.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={progress.step3}
                onChange={() => handleStepToggle('step3')}
                className="mt-1 w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-indigo-500 focus:ring-indigo-500/40"
              />
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`text-sm font-semibold ${
                      progress.step3 ? 'text-emerald-300' : 'text-zinc-100'
                    }`}
                  >
                    Step 3: Solo PYQ Grind — 35–40 Questions
                  </span>
                  <span className="text-xs font-mono tabular-nums text-emerald-400">
                    3–4h · +50% Marks (+{step3Marks}M)
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-1">
                  Timed independent solving of 2022–2026 JEE Main PYQs. Log any
                  missed patterns in the Bug Tracker.
                </p>
              </div>
            </label>

            <div className="flex flex-wrap items-center gap-2 pl-7 sm:pl-0 shrink-0">
              <a
                href="https://web.getmarks.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-xs font-medium text-emerald-300 transition-colors whitespace-nowrap"
              >
                <span>🎯 Open MARKS App</span>
                <ExternalLink className="w-3 h-3 text-emerald-400" />
              </a>
              <a
                href="https://ncert.nic.in/textbook.php"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-medium text-zinc-300 transition-colors whitespace-nowrap"
              >
                <span>📘 NCERT PDF</span>
                <ExternalLink className="w-3 h-3 text-zinc-500" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Clean Action Bar at Bottom of Active Chapter */}
      <section
        aria-label="Chapter Tools and Scratchpad"
        className="pt-2 space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={openPlayerModal}
            className="flex items-center justify-between gap-2 px-4 py-3 rounded-xl bg-zinc-900/80 hover:bg-zinc-900 border border-zinc-800/90 text-xs font-medium text-zinc-200 hover:text-zinc-100 transition-colors"
          >
            <span className="flex items-center gap-2 truncate">
              <Play className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span className="truncate">🎬 Watch Pinned Lecture</span>
            </span>
            <span className="font-mono text-[10px] text-zinc-500 shrink-0">
              {progress.pinnedVideoUrl ? 'Pinned' : 'Player'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setAiModalOpen(true)}
            className="flex items-center justify-between gap-2 px-4 py-3 rounded-xl bg-zinc-900/80 hover:bg-zinc-900 border border-zinc-800/90 text-xs font-medium text-zinc-200 hover:text-zinc-100 transition-colors"
          >
            <span className="flex items-center gap-2 truncate">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate">🤖 Open AI Twist Decoder Prompts</span>
            </span>
            <span className="font-mono text-[10px] text-zinc-500 shrink-0">
              3 Prompts
            </span>
          </button>

          <button
            type="button"
            onClick={() => setScratchpadOpen((prev) => !prev)}
            aria-expanded={scratchpadOpen}
            className={`flex items-center justify-between gap-2 px-4 py-3 rounded-xl border text-xs font-medium transition-colors ${
              scratchpadOpen || (progress.notes && progress.notes.trim())
                ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-200'
                : 'bg-zinc-900/80 hover:bg-zinc-900 border-zinc-800/90 text-zinc-200'
            }`}
          >
            <span className="flex items-center gap-2 truncate">
              <FileText className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span className="truncate">📝 Chapter Formula &amp; Trap Scratchpad</span>
            </span>
            <span className="font-mono text-[10px] text-zinc-500 shrink-0">
              {progress.notes && progress.notes.trim().length > 0
                ? 'Saved'
                : 'Notes'}
            </span>
          </button>
        </div>

        {/* Expandable Clean Scratchpad Textarea */}
        {scratchpadOpen && (
          <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="chapter-scratchpad-input"
                className="text-xs font-medium text-zinc-300"
              >
                Formula &amp; Trap Scratchpad — {chapter.title}
              </label>
              <span className="text-[11px] font-mono text-zinc-500">
                Auto-saved to localStorage
              </span>
            </div>
            <textarea
              id="chapter-scratchpad-input"
              rows={5}
              value={progress.notes || ''}
              onChange={(e) => {
                const val = e.target.value;
                onUpdateProgress(chapter.id, (prev) => ({
                  ...prev,
                  notes: val,
                }));
              }}
              placeholder="Write key shortcut formulas, sign conventions, or PYQ traps for this chapter..."
              className="w-full rounded-lg bg-zinc-950 border border-zinc-800/90 p-3 text-xs font-mono text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50 leading-relaxed"
            />
          </div>
        )}
      </section>

      {/* Modal 1: Pinned Lecture Distraction-Free Player */}
      {playerModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-labelledby="player-modal-title"
        >
          <div className="w-full max-w-3xl bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-zinc-800/80 flex items-center justify-between">
              <div>
                <h3
                  id="player-modal-title"
                  className="text-sm font-semibold text-zinc-100"
                >
                  🎬 Distraction-Free Lecture Player — {chapter.title}
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Paste any YouTube URL (watch?v=... or youtu.be/...) to study
                  without YouTube&apos;s distracting feed.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPlayerModalOpen(false)}
                aria-label="Close lecture player modal"
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <form
                onSubmit={handleSavePinnedVideo}
                className="flex flex-col sm:flex-row gap-2"
              >
                <input
                  type="text"
                  value={videoInputUrl}
                  onChange={(e) => setVideoInputUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                  aria-label="YouTube Video URL"
                  className="flex-1 rounded-lg bg-zinc-900 border border-zinc-800 px-3.5 py-2 text-xs font-mono text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-medium text-white transition-colors whitespace-nowrap"
                >
                  Pin &amp; Load Lecture
                </button>
              </form>

              {embedUrl ? (
                <div className="aspect-video w-full rounded-xl overflow-hidden bg-black border border-zinc-800">
                  <iframe
                    src={embedUrl}
                    title={`Pinned Lecture for ${chapter.title}`}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="aspect-video w-full rounded-xl bg-zinc-900/50 border border-zinc-800/80 flex flex-col items-center justify-center p-6 text-center space-y-3">
                  <Play className="w-8 h-8 text-zinc-600" />
                  <div className="space-y-1 max-w-md">
                    <p className="text-xs font-medium text-zinc-300">
                      No valid YouTube URL pinned for this chapter yet.
                    </p>
                    <p className="text-xs text-zinc-500">
                      Copy a lecture link from your Step 1 or Step 2 search and
                      paste it above to watch in pure Zen focus.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: AI Twist Decoder Prompts Drawer/Modal */}
      {aiModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-labelledby="ai-modal-title"
        >
          <div className="w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-zinc-800/80 flex items-center justify-between">
              <div>
                <h3
                  id="ai-modal-title"
                  className="text-sm font-semibold text-zinc-100"
                >
                  🤖 AI Twist Decoder Prompts — {chapter.title}
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  1-click copy prompts pre-loaded with this chapter&apos;s
                  Karnataka 2nd PUC vs. JEE Twist context.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAiModalOpen(false)}
                aria-label="Close AI prompts modal"
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {aiPrompts.map((item) => {
                const isCopied = copiedPromptId === item.id;
                return (
                  <div
                    key={item.id}
                    className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-4 space-y-2.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <h4 className="text-xs font-semibold text-zinc-100">
                          {item.title}
                        </h4>
                        <p className="text-[11px] text-zinc-400">
                          {item.subtitle}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopyPrompt(item.id, item.prompt)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 text-xs font-medium text-indigo-300 transition-colors shrink-0"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Prompt</span>
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-xs font-mono text-zinc-300 bg-zinc-950/90 border border-zinc-800/80 rounded-lg p-3 leading-relaxed">
                      {item.prompt}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
