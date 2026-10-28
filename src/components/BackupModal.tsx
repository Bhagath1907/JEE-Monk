import React, { useState } from 'react';
import { Download, Upload, Copy, Check, X, RotateCcw } from 'lucide-react';
import { MonkAppState, STORAGE_KEY } from '../data/chapters';
import { validateAndParseBackup } from '../utils/monkLogic';

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  appState: MonkAppState;
  onRestoreState: (newState: MonkAppState) => void;
  onResetState: () => void;
}

export const BackupModal: React.FC<BackupModalProps> = ({
  isOpen,
  onClose,
  appState,
  onRestoreState,
  onResetState,
}) => {
  const [importText, setImportText] = useState('');
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  if (!isOpen) return null;

  const exportedJson = JSON.stringify(appState, null, 2);

  const handleCopyJson = async () => {
    try {
      await navigator.clipboard.writeText(exportedJson);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setErrorMsg('Clipboard access failed. You can copy from the box directly.');
    }
  };

  const handleDownloadJson = () => {
    const blob = new Blob([exportedJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${STORAGE_KEY}_backup.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    if (!importText.trim()) {
      setErrorMsg('Please paste a valid JSON backup payload first.');
      return;
    }
    try {
      const validated = validateAndParseBackup(importText);
      onRestoreState(validated);
      setSuccessMsg('Workspace state successfully restored from JSON.');
      setImportText('');
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : 'Invalid JSON backup format.'
      );
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="backup-modal-title"
    >
      <div className="w-full max-w-xl bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl">
        <div className="px-6 py-4 border-b border-zinc-800/80 flex items-center justify-between">
          <div>
            <h2
              id="backup-modal-title"
              className="text-sm font-semibold text-zinc-100"
            >
              LocalStorage Backup & Restore
            </h2>
            <p className="text-xs text-zinc-400 font-mono mt-0.5">
              Key: &apos;{STORAGE_KEY}&apos;
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close backup modal"
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Export Section */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="export-json-textarea"
                className="text-xs font-medium text-zinc-300"
              >
                Export Current State JSON
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyJson}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs text-zinc-200 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy JSON</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleDownloadJson}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 text-xs text-indigo-300 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .json</span>
                </button>
              </div>
            </div>
            <textarea
              id="export-json-textarea"
              readOnly
              value={exportedJson}
              rows={5}
              className="w-full rounded-lg bg-zinc-900/70 border border-zinc-800/80 p-3 text-xs font-mono text-zinc-300 focus:outline-none"
            />
          </div>

          {/* Import Section */}
          <form onSubmit={handleImportSubmit} className="space-y-2.5">
            <label
              htmlFor="import-json-textarea"
              className="block text-xs font-medium text-zinc-300"
            >
              Import / Restore JSON Backup
            </label>
            <textarea
              id="import-json-textarea"
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder='Paste your {"activeChapterId": "p1", ...} JSON backup here...'
              rows={4}
              className="w-full rounded-lg bg-zinc-900/70 border border-zinc-800/80 p-3 text-xs font-mono text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50"
            />
            {errorMsg && (
              <p className="text-xs text-rose-400 font-medium">{errorMsg}</p>
            )}
            {successMsg && (
              <p className="text-xs text-emerald-400 font-medium">
                {successMsg}
              </p>
            )}
            <div className="flex items-center justify-between pt-1">
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-medium text-white transition-colors"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Restore JSON Backup</span>
              </button>

              {!confirmReset ? (
                <button
                  type="button"
                  onClick={() => setConfirmReset(true)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-zinc-500 hover:text-rose-400 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Default Data</span>
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onResetState();
                      setConfirmReset(false);
                      setSuccessMsg('Workspace reset to default seed state.');
                    }}
                    className="px-2.5 py-1 rounded-md bg-rose-500/20 border border-rose-500/40 text-xs text-rose-300 hover:bg-rose-500/30"
                  >
                    Confirm Reset
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmReset(false)}
                    className="px-2 py-1 text-xs text-zinc-400 hover:text-zinc-200"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
