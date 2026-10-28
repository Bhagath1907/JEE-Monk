# JEE Monk OS

Minimalist, high-ROI execution system for **JEE Main (Target: January 20, 2027)** and **Karnataka 2nd PUC** preparation.

## Core Modules
- **Zen Monk Focus**: Distraction-free active chapter execution with a 3-step stepper (Fast Concept Sync, Guided PYQ Decoding, Solo PYQ Grind), collapsible *2nd PUC Board vs. JEE Twist* insight callouts, embedded distraction-free YouTube lecture player, AI prompt drawer, and auto-saving formula scratchpad.
- **Dependency Mind Map**: Visual pipeline of all 35 high-ROI chapters across Physics, Chemistry, and Mathematics with prerequisite unlocking and live marks tracking.
- **AI Twist Decoder Hub**: Dynamic chapter-bound prompts for ChatGPT, Claude, and Google NotebookLM.
- **Bug Tracker (Mistake Log)**: Issue tracker for wrong PYQs and mock test mistakes categorized by Twist Misread, Formula Forgotten, NCERT Exception, and Calculation Bug.
- **Local Persistence**: Automatic state persistence in `localStorage` (`jee_monk_studio_v2`) with full JSON export and restore.

## Getting Started

```bash
npm install
npm run dev
```

## Running Tests

```bash
npx --yes tsx --test src/utils/monkLogic.test.ts
```
