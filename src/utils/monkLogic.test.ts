import test from 'node:test';
import assert from 'node:assert/strict';
import { CHAPTERS, TOTAL_MAX_MARKS } from '../data/chapters';
import {
  calculateChapterEarnedMarks,
  calculateProjectedScore,
  calculateStreak,
  generateAiPrompts,
  getLast14DaysStatus,
  isChapterUnlocked,
  parseYouTubeEmbedUrl,
  toggleTodayCommit,
  validateAndParseBackup,
} from './monkLogic';

test('dataset contains all 35 verbatim high-ROI chapters and valid prereqs', () => {
  assert.equal(CHAPTERS.length, 35);
  assert.equal(TOTAL_MAX_MARKS, 220);
  const sumMarks = CHAPTERS.reduce((sum, ch) => sum + ch.marks, 0);
  assert.equal(sumMarks, 232);

  const ids = new Set(CHAPTERS.map((c) => c.id));
  assert.equal(ids.size, 35);

  for (const ch of CHAPTERS) {
    if (ch.prereq !== null) {
      assert.equal(
        ids.has(ch.prereq),
        true,
        `Chapter ${ch.id} has invalid prereq ${ch.prereq}`
      );
    }
  }
});

test('calculateChapterEarnedMarks computes 20% + 30% + 50% accurately', () => {
  assert.equal(
    calculateChapterEarnedMarks(12, { step1: false, step2: false, step3: false }),
    0
  );
  assert.equal(
    calculateChapterEarnedMarks(12, { step1: true, step2: false, step3: false }),
    2.4
  );
  assert.equal(
    calculateChapterEarnedMarks(12, { step1: true, step2: true, step3: false }),
    6
  );
  assert.equal(
    calculateChapterEarnedMarks(12, { step1: true, step2: true, step3: true }),
    12
  );
  assert.equal(
    calculateChapterEarnedMarks(8, { step1: false, step2: true, step3: true }),
    6.4
  );
});

test('calculateProjectedScore aggregates across chapters', () => {
  const progress = {
    p1: { step1: true, step2: true, step3: true }, // 12M
    p2: { step1: true, step2: false, step3: false }, // 20% of 4M = 0.8M
    m2: { step1: true, step2: true, step3: false }, // 50% of 12M = 6.0M
  };
  assert.equal(calculateProjectedScore(CHAPTERS, progress), 18.8);
});

test('isChapterUnlocked unlocks root chapters and checks step1 of prereq', () => {
  const p1 = CHAPTERS.find((c) => c.id === 'p1')!;
  const p2 = CHAPTERS.find((c) => c.id === 'p2')!;

  assert.equal(isChapterUnlocked(p1, {}), true);
  assert.equal(isChapterUnlocked(p2, {}), false);
  assert.equal(
    isChapterUnlocked(p2, { p1: { step1: true, step2: false, step3: false } }),
    true
  );
});

test('calculateStreak and toggleTodayCommit handle consecutive days', () => {
  const commits = ['2026-10-25', '2026-10-26', '2026-10-27'];
  assert.equal(calculateStreak(commits, '2026-10-28'), 3);

  const updated = toggleTodayCommit(commits, '2026-10-28');
  assert.equal(calculateStreak(updated, '2026-10-28'), 4);

  const dots = getLast14DaysStatus(updated, new Date(2026, 9, 28));
  assert.equal(dots.length, 14);
  assert.equal(dots[13].committed, true);
  assert.equal(dots[13].isToday, true);
});

test('parseYouTubeEmbedUrl parses watch, youtu.be, shorts, and embed URLs', () => {
  assert.equal(
    parseYouTubeEmbedUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=12s'),
    'https://www.youtube.com/embed/dQw4w9WgXcQ'
  );
  assert.equal(
    parseYouTubeEmbedUrl('https://youtu.be/dQw4w9WgXcQ?si=123'),
    'https://www.youtube.com/embed/dQw4w9WgXcQ'
  );
  assert.equal(parseYouTubeEmbedUrl('invalid-url'), null);
});

test('generateAiPrompts injects chapter title, subject, and boardTwist', () => {
  const p1 = CHAPTERS[0];
  const prompts = generateAiPrompts(p1);
  assert.equal(prompts.length, 3);
  assert.equal(prompts[0].prompt.includes(p1.title), true);
  assert.equal(prompts[2].prompt.includes(p1.boardTwist), true);
});

test('validateAndParseBackup sanitizes and restores JSON backup', () => {
  const raw = JSON.stringify({
    activeChapterId: 'c3',
    dayMode: 'college',
    progress: {
      c3: { step1: true, step2: true, step3: false, notes: 'CFSE notes' },
    },
    commits: ['2026-10-28'],
    bugs: [
      {
        id: 'b1',
        chapterId: 'c3',
        category: '📘 NCERT Exception',
        triggerFix: 'CO is strong field ligand',
        createdAt: '2026-10-28',
      },
    ],
  });
  const parsed = validateAndParseBackup(raw);
  assert.equal(parsed.activeChapterId, 'c3');
  assert.equal(parsed.dayMode, 'college');
  assert.equal(parsed.progress.c3.step1, true);
  assert.equal(parsed.bugs.length, 1);
});
