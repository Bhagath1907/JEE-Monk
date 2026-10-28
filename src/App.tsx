import React, { useEffect, useState } from 'react';
import {
  BugItem,
  CHAPTERS,
  ChapterProgress,
  DEFAULT_APP_STATE,
  DayMode,
  MonkAppState,
  STORAGE_KEY,
  ViewId,
} from './data/chapters';
import {
  calculateProjectedScore,
  getChapterProgress,
  toggleTodayCommit,
  validateAndParseBackup,
} from './utils/monkLogic';
import { TopBar } from './components/TopBar';
import { Sidebar } from './components/Sidebar';
import { ZenFocusView } from './components/ZenFocusView';
import { MindMapView } from './components/MindMapView';
import { AiDecoderView } from './components/AiDecoderView';
import { BugTrackerView } from './components/BugTrackerView';
import { BackupModal } from './components/BackupModal';

function loadInitialState(): MonkAppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_APP_STATE;
    return validateAndParseBackup(raw);
  } catch {
    return DEFAULT_APP_STATE;
  }
}

export function App() {
  const [appState, setAppState] = useState<MonkAppState>(loadInitialState);
  const [activeView, setActiveView] = useState<ViewId>('focus');
  const [backupModalOpen, setBackupModalOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Persist to localStorage under 'jee_monk_studio_v2'
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
    } catch {
      // Ignore quota errors
    }
  }, [appState]);

  const activeChapter =
    CHAPTERS.find((c) => c.id === appState.activeChapterId) || CHAPTERS[0];

  const projectedScore = calculateProjectedScore(CHAPTERS, appState.progress);

  const handleSelectChapter = (chapterId: string) => {
    setAppState((prev) => ({
      ...prev,
      activeChapterId: chapterId,
    }));
  };

  const handleToggleDayMode = (mode: DayMode) => {
    setAppState((prev) => ({
      ...prev,
      dayMode: mode,
    }));
  };

  const handleCommitToday = () => {
    setAppState((prev) => ({
      ...prev,
      commits: toggleTodayCommit(prev.commits),
    }));
  };

  const handleUpdateChapterProgress = (
    chapterId: string,
    updater: (prev: ChapterProgress) => ChapterProgress
  ) => {
    setAppState((prev) => {
      const current = getChapterProgress(prev.progress, chapterId);
      const updated = updater(current);
      return {
        ...prev,
        progress: {
          ...prev.progress,
          [chapterId]: updated,
        },
      };
    });
  };

  const handleAddBug = (bug: BugItem) => {
    setAppState((prev) => ({
      ...prev,
      bugs: [bug, ...prev.bugs],
    }));
  };

  const handleToggleResolveBug = (bugId: string) => {
    setAppState((prev) => ({
      ...prev,
      bugs: prev.bugs.map((b) =>
        b.id === bugId ? { ...b, resolved: !b.resolved } : b
      ),
    }));
  };

  const handleDeleteBug = (bugId: string) => {
    setAppState((prev) => ({
      ...prev,
      bugs: prev.bugs.filter((b) => b.id !== bugId),
    }));
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex">
      {/* Left Sidebar Navigation */}
      <Sidebar
        activeView={activeView}
        onSelectView={setActiveView}
        activeChapterId={activeChapter.id}
        onSelectChapter={handleSelectChapter}
        progress={appState.progress}
        bugCount={appState.bugs.filter((b) => !b.resolved).length}
        projectedScore={projectedScore}
        onOpenBackupModal={() => setBackupModalOpen(true)}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Slim Sticky Top Telemetry Bar */}
        <TopBar
          activeView={activeView}
          projectedScore={projectedScore}
          dayMode={appState.dayMode}
          onToggleDayMode={handleToggleDayMode}
          commits={appState.commits}
          onCommitToday={handleCommitToday}
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
        />

        {/* Active View Workspace */}
        <main className="flex-1 overflow-y-auto">
          {activeView === 'focus' && (
            <ZenFocusView
              chapter={activeChapter}
              progress={getChapterProgress(appState.progress, activeChapter.id)}
              allProgress={appState.progress}
              dayMode={appState.dayMode}
              onUpdateProgress={handleUpdateChapterProgress}
              onSelectChapter={handleSelectChapter}
            />
          )}

          {activeView === 'mindmap' && (
            <MindMapView
              activeChapterId={activeChapter.id}
              progress={appState.progress}
              onSelectActiveFocus={(chapterId) => {
                handleSelectChapter(chapterId);
                setActiveView('focus');
              }}
            />
          )}

          {activeView === 'decoder' && (
            <AiDecoderView
              activeChapterId={activeChapter.id}
              onSelectChapter={handleSelectChapter}
            />
          )}

          {activeView === 'bugs' && (
            <BugTrackerView
              activeChapterId={activeChapter.id}
              bugs={appState.bugs}
              onAddBug={handleAddBug}
              onToggleResolveBug={handleToggleResolveBug}
              onDeleteBug={handleDeleteBug}
            />
          )}
        </main>
      </div>

      {/* JSON Backup / Restore Modal */}
      <BackupModal
        isOpen={backupModalOpen}
        onClose={() => setBackupModalOpen(false)}
        appState={appState}
        onRestoreState={(restored) => setAppState(restored)}
        onResetState={() => setAppState(DEFAULT_APP_STATE)}
      />
    </div>
  );
}

export default App;
