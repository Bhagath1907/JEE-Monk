import {
  CHAPTERS,
  Chapter,
  ChapterProgress,
  DEFAULT_APP_STATE,
  MonkAppState,
  TARGET_EXAM_DATE,
} from '../data/chapters';

export function getChapterProgress(
  progressMap: Record<string, ChapterProgress>,
  chapterId: string
): ChapterProgress {
  return (
    progressMap[chapterId] || {
      step1: false,
      step2: false,
      step3: false,
      pinnedVideoUrl: '',
      notes: '',
    }
  );
}

/**
 * Score math: Each chapter has a `marks` value.
 * Checking Step 1 adds 20% of that chapter's marks,
 * Step 2 adds 30%,
 * Step 3 adds 50%.
 */
export function calculateChapterEarnedMarks(
  marks: number,
  prog?: ChapterProgress
): number {
  if (!prog) return 0;
  let multiplier = 0;
  if (prog.step1) multiplier += 0.2;
  if (prog.step2) multiplier += 0.3;
  if (prog.step3) multiplier += 0.5;
  return Math.round(marks * multiplier * 10) / 10;
}

export function calculateProjectedScore(
  chapters: Chapter[],
  progressMap: Record<string, ChapterProgress>
): number {
  const total = chapters.reduce((acc, ch) => {
    return acc + calculateChapterEarnedMarks(ch.marks, progressMap[ch.id]);
  }, 0);
  return Math.round(total * 10) / 10;
}

export function isChapterFullyMastered(prog?: ChapterProgress): boolean {
  return Boolean(prog?.step1 && prog?.step2 && prog?.step3);
}

export function isChapterUnlocked(
  chapter: Chapter,
  progressMap: Record<string, ChapterProgress>
): boolean {
  if (!chapter.prereq) return true;
  const prereqProg = progressMap[chapter.prereq];
  return Boolean(prereqProg?.step1);
}

export function getPrerequisiteChapter(
  chapter: Chapter,
  chapters: Chapter[] = CHAPTERS
): Chapter | undefined {
  if (!chapter.prereq) return undefined;
  return chapters.find((c) => c.id === chapter.prereq);
}

export function getNextRecommendedChapter(
  currentChapterId: string,
  chapters: Chapter[] = CHAPTERS,
  progressMap: Record<string, ChapterProgress> = {}
): Chapter {
  const currentIndex = chapters.findIndex((c) => c.id === currentChapterId);
  // Look for next unfinished chapter starting after currentIndex
  for (let offset = 1; offset <= chapters.length; offset++) {
    const candidate = chapters[(currentIndex + offset) % chapters.length];
    if (!isChapterFullyMastered(progressMap[candidate.id])) {
      return candidate;
    }
  }
  return chapters[(currentIndex + 1) % chapters.length];
}

export function formatLocalDateYYYYMMDD(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function calculateDaysToExam(now: Date = new Date()): number {
  const target = new Date(TARGET_EXAM_DATE);
  const diffMs = target.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
}

export function calculateStreak(
  commits: string[],
  todayStr: string = formatLocalDateYYYYMMDD()
): number {
  if (!commits || commits.length === 0) return 0;
  const uniqueSet = new Set(commits);

  const parseDate = (str: string) => {
    const [y, m, d] = str.split('-').map(Number);
    return new Date(y, m - 1, d);
  };

  const stepBackDay = (dateStr: string): string => {
    const dt = parseDate(dateStr);
    dt.setDate(dt.getDate() - 1);
    return formatLocalDateYYYYMMDD(dt);
  };

  let cursor = todayStr;
  if (!uniqueSet.has(cursor)) {
    const yesterday = stepBackDay(todayStr);
    if (!uniqueSet.has(yesterday)) {
      return 0;
    }
    cursor = yesterday;
  }

  let streak = 0;
  while (uniqueSet.has(cursor)) {
    streak++;
    cursor = stepBackDay(cursor);
  }
  return streak;
}

export interface DayCommitDot {
  date: string;
  committed: boolean;
  isToday: boolean;
}

export function getLast14DaysStatus(
  commits: string[],
  today: Date = new Date()
): DayCommitDot[] {
  const uniqueSet = new Set(commits);
  const result: DayCommitDot[] = [];
  for (let i = 13; i >= 0; i--) {
    const dt = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    dt.setDate(dt.getDate() - i);
    const dateStr = formatLocalDateYYYYMMDD(dt);
    result.push({
      date: dateStr,
      committed: uniqueSet.has(dateStr),
      isToday: i === 0,
    });
  }
  return result;
}

export function toggleTodayCommit(
  commits: string[],
  todayStr: string = formatLocalDateYYYYMMDD()
): string[] {
  const exists = commits.includes(todayStr);
  if (exists) {
    return commits; // Clicking commit keeps today committed (idempotent or adds today)
  }
  return Array.from(new Set([...commits, todayStr])).sort();
}

export function parseYouTubeEmbedUrl(rawInput: string): string | null {
  const input = rawInput.trim();
  if (!input) return null;

  try {
    const url = new URL(input);
    const host = url.hostname.replace(/^www\./, '');

    if (host === 'youtu.be') {
      const id = url.pathname.slice(1).split('/')[0];
      if (id) return `https://www.youtube.com/embed/${id}`;
    }

    if (host === 'youtube.com' || host === 'm.youtube.com') {
      if (url.pathname === '/watch') {
        const v = url.searchParams.get('v');
        if (v) return `https://www.youtube.com/embed/${v}`;
      }
      if (url.pathname.startsWith('/embed/')) {
        const id = url.pathname.split('/embed/')[1]?.split('/')[0];
        if (id) return `https://www.youtube.com/embed/${id}`;
      }
      if (url.pathname.startsWith('/shorts/')) {
        const id = url.pathname.split('/shorts/')[1]?.split('/')[0];
        if (id) return `https://www.youtube.com/embed/${id}`;
      }
      if (url.pathname.startsWith('/live/')) {
        const id = url.pathname.split('/live/')[1]?.split('/')[0];
        if (id) return `https://www.youtube.com/embed/${id}`;
      }
    }
  } catch {
    // Fallback regex match for youtube.com or youtu.be without protocol
    const match = input.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
  }

  return null;
}

export interface AiPromptCardData {
  id: string;
  title: string;
  subtitle: string;
  prompt: string;
}

export function generateAiPrompts(chapter: Chapter): AiPromptCardData[] {
  return [
    {
      id: 'decode-twist',
      title: 'Prompt 1: Decode Question Twist (Board ➔ JEE/KCET)',
      subtitle: 'Bridge Karnataka 2nd PUC board theory to hidden JEE Main / KCET patterns',
      prompt: `I am a Class 12 student (Karnataka 2nd PUC) studying ${chapter.title} (${chapter.subject}). I know the board-level theory, but I cannot decode how this JEE/KCET question is framed. Analyze my question and tell me: 1. What hidden keyword/clue tells me which formula to use? 2. What is the twist compared to a standard board question? 3. Step-by-step solution. 4. A 1-line Mental Trigger Rule to spot this pattern in 10 seconds.`,
    },
    {
      id: 'swe-analogy',
      title: 'Prompt 2: Explain via AI / Software Engineering Analogy',
      subtitle: 'Map physical/chemical/math systems to algorithms, state machines & ML intuition',
      prompt: `I am an AI builder studying ${chapter.title} (${chapter.subject}) for JEE Main. Explain the core intuition, formulas, and sign conventions using analogies from software engineering, algorithms, or AI/ML. Then list the exact formulas I must memorize.`,
    },
    {
      id: 'top-10-archetypes',
      title: 'Prompt 3: Top 10 Repeated JEE Archetypes Cheat-Sheet',
      subtitle: 'Extract high-frequency 2022–2026 question patterns, shortcuts & traps',
      prompt: `For ${chapter.title} (${chapter.subject}), list the Top 10 most repeated question archetypes in JEE Main (2022–2026). For each, show how the question looks, the shortcut formula, and the #1 trap students fall into (Context: ${chapter.boardTwist}).`,
    },
  ];
}

export function groupChaptersByChain(
  chapters: Chapter[]
): Array<{ chain: string; subject: Chapter['subject']; chapters: Chapter[] }> {
  const map = new Map<
    string,
    { chain: string; subject: Chapter['subject']; chapters: Chapter[] }
  >();

  for (const ch of chapters) {
    const existing = map.get(ch.chain);
    if (existing) {
      existing.chapters.push(ch);
    } else {
      map.set(ch.chain, {
        chain: ch.chain,
        subject: ch.subject,
        chapters: [ch],
      });
    }
  }

  return Array.from(map.values());
}

export function validateAndParseBackup(rawJson: string): MonkAppState {
  const parsed = JSON.parse(rawJson);
  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Backup must be a valid JSON object.');
  }

  const validChapterIds = new Set(CHAPTERS.map((c) => c.id));
  const activeChapterId =
    typeof parsed.activeChapterId === 'string' &&
    validChapterIds.has(parsed.activeChapterId)
      ? parsed.activeChapterId
      : DEFAULT_APP_STATE.activeChapterId;

  const dayMode =
    parsed.dayMode === 'home' || parsed.dayMode === 'college'
      ? parsed.dayMode
      : DEFAULT_APP_STATE.dayMode;

  const progress: Record<string, ChapterProgress> = {};
  if (parsed.progress && typeof parsed.progress === 'object') {
    for (const [k, v] of Object.entries(parsed.progress)) {
      if (validChapterIds.has(k) && v && typeof v === 'object') {
        const item = v as Record<string, unknown>;
        progress[k] = {
          step1: Boolean(item.step1),
          step2: Boolean(item.step2),
          step3: Boolean(item.step3),
          pinnedVideoUrl:
            typeof item.pinnedVideoUrl === 'string' ? item.pinnedVideoUrl : '',
          notes: typeof item.notes === 'string' ? item.notes : '',
        };
      }
    }
  }

  const commits = Array.isArray(parsed.commits)
    ? parsed.commits.filter((c: unknown): c is string => typeof c === 'string')
    : [];

  const bugs = Array.isArray(parsed.bugs)
    ? parsed.bugs
        .filter((b: unknown) => b && typeof b === 'object')
        .map((b: Record<string, unknown>, idx: number) => ({
          id: typeof b.id === 'string' ? b.id : `imported-bug-${idx}`,
          chapterId:
            typeof b.chapterId === 'string' && validChapterIds.has(b.chapterId)
              ? b.chapterId
              : 'p1',
          category:
            b.category === '🧩 Twist Misread' ||
            b.category === '🧠 Formula Forgotten' ||
            b.category === '📘 NCERT Exception' ||
            b.category === '🔢 Calculation Bug'
              ? b.category
              : '🧩 Twist Misread',
          triggerFix:
            typeof b.triggerFix === 'string' ? b.triggerFix : 'Review concept',
          createdAt:
            typeof b.createdAt === 'string'
              ? b.createdAt
              : formatLocalDateYYYYMMDD(),
          resolved: Boolean(b.resolved),
        }))
    : [];

  return {
    activeChapterId,
    dayMode,
    progress,
    commits,
    bugs,
  };
}
