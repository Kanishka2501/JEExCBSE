import {
  ChapterItem,
  DailyMissionTask,
  ExamSettings,
} from '../types';
import { getDaysRemaining } from './istDate';

export interface PaceAnalysis {
  totalEstimatedHours: number;
  completedHours: number;
  remainingHours: number;
  remainingEstimatedHours: number;
  unstartedChapters: number;
  inProgressChapters: number;
  masteredChapters: number;
  daysUntilSyllabusTarget: number;
  requiredDailyHours: number;
  currentDailyTarget: number;
  hoursGap: number;
  status: 'AHEAD' | 'ON_TRACK' | 'SLIGHT_DEFICIT' | 'CRITICAL_DEFICIT';
  recommendation: string;
  projectedFinishDate: string;
}

export function calculatePace(
  chapters: ChapterItem[],
  settings: ExamSettings,
  currentDateStr: string
): PaceAnalysis {
  let totalEstimatedHours = 0;
  let completedHours = 0;

  chapters.forEach((ch) => {
    totalEstimatedHours += ch.estimatedHours;
    if (ch.status === 'Mastered' || ch.status === 'Chapter Test Completed') {
      completedHours += ch.estimatedHours;
    } else if (ch.status === 'PYQs Completed' || ch.status === 'PYQs in Progress') {
      completedHours += ch.estimatedHours * 0.8;
    } else if (ch.status === 'Revision Completed') {
      completedHours += ch.estimatedHours * 0.65;
    } else if (ch.status === 'Question Practice') {
      completedHours += ch.estimatedHours * 0.45;
    } else if (ch.status === 'Theory Completed') {
      completedHours += ch.estimatedHours * 0.3;
    } else if (ch.status === 'Theory in Progress') {
      completedHours += ch.estimatedHours * 0.15;
    }
  });

  const remainingHours = Math.max(0, Math.round(totalEstimatedHours - completedHours));
  const daysUntilSyllabusTarget = Math.max(1, getDaysRemaining(settings.syllabusTargetDate, currentDateStr));
  const requiredDailyHours = Number((remainingHours / daysUntilSyllabusTarget).toFixed(1));
  const currentDailyTarget = settings.dailyTargetHours || 8;
  const hoursGap = Number((requiredDailyHours - currentDailyTarget).toFixed(1));

  const unstartedChapters = chapters.filter((c) => c.status === 'Not Started').length;
  const inProgressChapters = chapters.filter((c) => c.status !== 'Not Started' && c.status !== 'Mastered').length;
  const masteredChapters = chapters.filter((c) => c.status === 'Mastered').length;

  let status: PaceAnalysis['status'] = 'ON_TRACK';
  let recommendation = '';

  if (hoursGap <= -1.5) {
    status = 'AHEAD';
    recommendation = `You are well ahead of schedule! At ${currentDailyTarget}h/day, you will finish well before the January exam. Dedicate extra hours to full-length JEE mocks and cold PYQ solving.`;
  } else if (hoursGap <= 0.5) {
    status = 'ON_TRACK';
    recommendation = `Optimal lock-in pace! Maintaining ${currentDailyTarget} focused hours daily will complete the entire syllabus by ${settings.syllabusTargetDate}, leaving a solid buffer for full mocks.`;
  } else if (hoursGap <= 2.5) {
    status = 'SLIGHT_DEFICIT';
    recommendation = `Pace Alert: You need ${requiredDailyHours}h/day to finish theory & PYQs by ${settings.syllabusTargetDate}. Increase your focus session target from ${currentDailyTarget}h to ${Math.min(12, Math.ceil(requiredDailyHours))}h/day.`;
  } else {
    status = 'CRITICAL_DEFICIT';
    recommendation = `Urgent Adjustment Needed: ${requiredDailyHours}h/day required to finish by ${settings.syllabusTargetDate}. Prioritize Critical chapters first and consider high-intensity 11–12 hour study blocks.`;
  }

  // Calculate projected finish date at current daily pace
  const daysNeededAtCurrentPace = currentDailyTarget > 0 ? Math.ceil(remainingHours / currentDailyTarget) : 999;
  const [cy, cm, cd] = currentDateStr.split('-').map(Number);
  const projDate = new Date(Date.UTC(cy, cm - 1, cd + daysNeededAtCurrentPace));
  const projectedFinishDate = projDate.toISOString().split('T')[0];

  return {
    totalEstimatedHours,
    completedHours: Math.round(completedHours),
    remainingHours,
    remainingEstimatedHours: remainingHours,
    unstartedChapters,
    inProgressChapters,
    masteredChapters,
    daysUntilSyllabusTarget,
    requiredDailyHours,
    currentDailyTarget,
    hoursGap,
    status,
    recommendation,
    projectedFinishDate,
  };
}

/**
 * Generates an intelligent daily mission timetable for a specific date and day number
 */
export function generateDailyMissions(
  arg1: any,
  arg2?: any,
  arg3?: any
): DailyMissionTask[] {
  let chapters: ChapterItem[] = [];
  let dateStr = '';

  if (Array.isArray(arg1)) {
    // Called as: generateDailyMissions(chapters, cbseChapters, dateStr)
    chapters = arg1;
    dateStr = typeof arg3 === 'string' ? arg3 : typeof arg2 === 'string' ? arg2 : new Date().toISOString().split('T')[0];
  } else {
    // Called as: generateDailyMissions(dayNumber, dateStr, chapters)
    dateStr = typeof arg2 === 'string' ? arg2 : new Date().toISOString().split('T')[0];
    chapters = Array.isArray(arg3) ? arg3 : [];
  }

  // Find top priority unmastered chapters for Math, Physics, and Chem
  const getNextChapter = (subj: 'Mathematics' | 'Physics' | 'Chemistry'): ChapterItem | undefined => {
    const subjChapters = chapters.filter((c) => c.subject === subj);
    // First find in-progress chapters
    const inProgress = subjChapters.find((c) => c.status !== 'Not Started' && c.status !== 'Mastered');
    if (inProgress) return inProgress;
    // Otherwise pick unstarted by priority
    return (
      subjChapters.find((c) => c.status === 'Not Started' && c.priority === 'Critical') ||
      subjChapters.find((c) => c.status === 'Not Started' && c.priority === 'High') ||
      subjChapters.find((c) => c.status === 'Not Started')
    );
  };

  const nextMath = getNextChapter('Mathematics') || chapters.find((c) => c.subject === 'Mathematics') || {
    id: 'm1',
    name: 'Sets, Relations and Functions',
    subject: 'Mathematics',
  };
  const nextPhy = getNextChapter('Physics') || chapters.find((c) => c.subject === 'Physics') || {
    id: 'p1',
    name: 'Units and Measurements',
    subject: 'Physics',
  };
  const nextChem = getNextChapter('Chemistry') || chapters.find((c) => c.subject === 'Chemistry') || {
    id: 'c1',
    name: 'Some Basic Concepts in Chemistry',
    subject: 'Chemistry',
  };

  const missions: DailyMissionTask[] = [
    {
      id: `${dateStr}-math`,
      subject: 'Mathematics',
      title: `Block 1: ${nextMath.name}`,
      detail: `Morning Focus (06:30 - 09:30). High-cognition deep work. Graded exercises, key proofs, and module numericals.`,
      chapterId: nextMath.id,
      targetMinutes: 180,
      completed: false,
    },
    {
      id: `${dateStr}-phy`,
      subject: 'Physics',
      title: `Block 2: ${nextPhy.name}`,
      detail: `Midday Focus (10:15 - 13:15). Concept gaps, key derivations, and Level 1 & 2 module problems.`,
      chapterId: nextPhy.id,
      targetMinutes: 180,
      completed: false,
    },
    {
      id: `${dateStr}-chem`,
      subject: 'Chemistry',
      title: `Block 3: ${nextChem.name}`,
      detail: `Afternoon Focus (14:30 - 17:30). Line-by-line NCERT theory reading, reaction mechanisms, and numericals.`,
      chapterId: nextChem.id,
      targetMinutes: 180,
      completed: false,
    },
    {
      id: `${dateStr}-cbse`,
      subject: 'CBSE Maths',
      title: `Block 4: CBSE Maths Step-Writing Practice`,
      detail: `Evening Focus (18:30 - 20:30). NCERT Exemplar & CBSE Board questions written in step-by-step format for full step marks.`,
      targetMinutes: 120,
      completed: false,
    },
    {
      id: `${dateStr}-rev`,
      subject: 'Revision',
      title: `Block 5: 1-3-7 Revision Queue & Error Cold-Solve`,
      detail: `Night Focus (21:15 - 22:30). Formula recall from memory, Flashcard review, and re-attempting flagged red error items.`,
      targetMinutes: 75,
      completed: false,
    },
  ];

  return missions;
}

/**
 * Intelligent Backlog Recovery:
 * When days are missed, identifies unfinished missions and redistributes them evenly across upcoming days.
 */
export function redistributeBacklog(
  backlogTasks: DailyMissionTask[],
  tasksByDateOrDates: Record<string, DailyMissionTask[]> | string[],
  todayStr?: string,
  spreadDays: number = 3
): {
  updatedDailyTasks: Record<string, DailyMissionTask[]>;
  remainingBacklog: DailyMissionTask[];
} {
  let upcomingDates: string[] = [];
  let existingTasksByDate: Record<string, DailyMissionTask[]> = {};

  if (Array.isArray(tasksByDateOrDates)) {
    upcomingDates = tasksByDateOrDates;
  } else {
    existingTasksByDate = { ...tasksByDateOrDates };
    const base = todayStr || new Date().toISOString().split('T')[0];
    const [y, m, d] = base.split('-').map(Number);
    for (let i = 1; i <= spreadDays; i++) {
      const nextD = new Date(Date.UTC(y, m - 1, d + i));
      upcomingDates.push(nextD.toISOString().split('T')[0]);
    }
  }

  const updatedDailyTasks = { ...existingTasksByDate };
  upcomingDates.forEach((d) => {
    if (!updatedDailyTasks[d]) {
      updatedDailyTasks[d] = [];
    } else {
      updatedDailyTasks[d] = [...updatedDailyTasks[d]];
    }
  });

  let dateIdx = 0;
  backlogTasks.forEach((task) => {
    const targetDate = upcomingDates[dateIdx % upcomingDates.length];
    if (targetDate) {
      updatedDailyTasks[targetDate].push({
        ...task,
        isBacklog: true,
        originalDate: task.originalDate || task.id.split('-')[0],
        detail: `[RECOVERY TASK]: ${task.detail} (Shortened 45-min focus block)`,
        targetMinutes: Math.min(45, task.targetMinutes),
      });
      dateIdx++;
    }
  });

  return {
    updatedDailyTasks,
    remainingBacklog: [],
  };
}
