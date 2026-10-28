import React, { useState } from 'react';
import { Copy, Check, ExternalLink, Sparkles } from 'lucide-react';
import { CHAPTERS } from '../data/chapters';
import { generateAiPrompts } from '../utils/monkLogic';

interface AiDecoderViewProps {
  activeChapterId: string;
  onSelectChapter: (chapterId: string) => void;
}

export const AiDecoderView: React.FC<AiDecoderViewProps> = ({
  activeChapterId,
  onSelectChapter,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const selectedChapter =
    CHAPTERS.find((c) => c.id === activeChapterId) || CHAPTERS[0];
  const prompts = generateAiPrompts(selectedChapter);

  const handleCopy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 lg:p-8 space-y-6">
      {/* Header + Chapter Dropdown + Quick Launch Links */}
      <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <h2 className="text-lg font-semibold text-zinc-100 tracking-tight">
                AI Twist Decoder Hub
              </h2>
            </div>
            <p className="text-xs text-zinc-400">
              Select any chapter to generate context-aware prompts bridged to
              Karnataka 2nd PUC &amp; JEE Main.
            </p>
          </div>

          {/* Quick Launch Links */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <a
              href="https://chatgpt.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-medium text-zinc-200 transition-colors"
            >
              <span>ChatGPT</span>
              <ExternalLink className="w-3 h-3 text-zinc-500" />
            </a>
            <a
              href="https://claude.ai/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-medium text-zinc-200 transition-colors"
            >
              <span>Claude</span>
              <ExternalLink className="w-3 h-3 text-zinc-500" />
            </a>
            <a
              href="https://notebooklm.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-medium text-zinc-200 transition-colors"
            >
              <span>Google NotebookLM</span>
              <ExternalLink className="w-3 h-3 text-zinc-500" />
            </a>
          </div>
        </div>

        {/* Chapter Dropdown Selector */}
        <div className="pt-2 border-t border-zinc-800/80 flex flex-col sm:flex-row sm:items-center gap-3">
          <label
            htmlFor="ai-decoder-chapter-select"
            className="text-xs font-medium text-zinc-300 whitespace-nowrap"
          >
            Bound Chapter:
          </label>
          <select
            id="ai-decoder-chapter-select"
            value={selectedChapter.id}
            onChange={(e) => onSelectChapter(e.target.value)}
            className="flex-1 rounded-lg bg-zinc-950 border border-zinc-800 px-3.5 py-2 text-xs text-zinc-100 focus:outline-none focus:border-indigo-500/50"
          >
            {CHAPTERS.map((ch) => (
              <option key={ch.id} value={ch.id}>
                [{ch.id.toUpperCase()}] {ch.subject} — {ch.title} (+{ch.marks}M)
              </option>
            ))}
          </select>
        </div>

        {/* Context Twist Preview */}
        <div className="rounded-lg bg-amber-500/[0.04] border border-amber-500/20 p-3.5 text-xs text-zinc-300 leading-relaxed">
          <span className="font-semibold text-amber-300">
            Injected Board vs. JEE Twist:{' '}
          </span>
          {selectedChapter.boardTwist}
        </div>
      </div>

      {/* 3 Prompt Cards */}
      <div className="space-y-4">
        {prompts.map((item) => {
          const isCopied = copiedId === item.id;
          return (
            <section
              key={item.id}
              aria-label={item.title}
              className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-6 space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold text-zinc-100">
                    {item.title}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    {item.subtitle}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopy(item.id, item.prompt)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 text-xs font-medium text-indigo-300 transition-colors shrink-0 self-start sm:self-auto"
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

              <div className="rounded-lg bg-zinc-950 border border-zinc-800/90 p-4 text-xs font-mono text-zinc-200 leading-relaxed select-all">
                {item.prompt}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};
