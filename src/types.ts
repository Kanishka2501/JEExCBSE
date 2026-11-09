export type Subject = 'Physics' | 'Chemistry' | 'Mathematics' | 'CBSE Maths';

export type ChapterStatus =
  | 'Not Started'
  | 'Theory in Progress'
  | 'Theory Completed'
  | 'Question Practice'
  | 'Revision Pending'
  | 'Revision Completed'
  | 'PYQs in Progress'
  | 'PYQs Completed'
  | 'Chapter Test Completed'
  | 'Mastered';

export type PriorityLevel = 'Critical' | 'High' | 'Medium';
export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';

export interface PYQStats {
  totalAvailable: number;
  attempted: number;
  correct: number;
  incorrect: number;
  unattempted: number;
  accuracy: number;
  avgTimeSec: number;
}

export interface ChapterTestRecord {
  score: number;
  totalMarks: number;
  date: string;
  accuracy: number;
  timeTakenMinutes: number;
}

export interface ChapterItem {
  id: string;
  name: string;
  subject: Subject;
  category: string; // e.g., 'Mechanics', 'Physical', 'Organic', 'Calculus', etc.
  difficulty: DifficultyLevel;
  priority: PriorityLevel;
  estimatedHours: number;
  actualHours: number;
  status: ChapterStatus;
  theoryDone: boolean;
  practiceDone: boolean;
  revisionDone: boolean;
  pyqsDone: boolean;
  testCompleted: boolean;
  pyqStats: PYQStats;
  testRecord?: ChapterTestRecord;
  weakTopics: string[];
  notes: string;
  isCbseOverlap: boolean;
  lastRevised?: string;
  nextRevisionDate?: string;
  flaggedErrorsCount?: number;
}

export interface CBSEChapterItem {
  id: string;
  chNumber: number;
  name: string;
  jeeOverlapChapterId?: string;
  ncertTheoryDone: boolean;
  ncertExercisesDone: boolean;
  boardExemplarDone: boolean;
  stepMarksMastered: boolean;
  samplePaperAttempted: boolean;
  marksScore?: number;
  notes: string;
}

export interface StudySession {
  id: string;
  date: string; // YYYY-MM-DD (IST)
  subject: Subject;
  chapterId: string;
  chapterName: string;
  durationMinutes: number;
  netFocusedMinutes: number;
  mode: 'focus' | 'pyq' | 'test' | 'revision';
  timestamp: number;
  notes?: string;
}

export interface DailyMissionTask {
  id: string;
  subject: Subject | 'Revision';
  title: string;
  detail: string;
  chapterId?: string;
  targetMinutes: number;
  completed: boolean;
  completedAt?: string;
  isBacklog?: boolean;
  originalDate?: string;
}

export interface DailyReviewData {
  date: string;
  targetHours: number;
  actualFocusedHours: number;
  subjectHours: Record<string, number>;
  questionsAttempted: number;
  accuracy: number;
  understandingRating: number; // 1 to 5
  breakthroughs: string;
  struggles: string;
  completedAt: string;
}

export interface ExamSettings {
  jee1Date: string; // Default: '2027-01-22'
  jee2Date: string; // Default: '2027-04-06'
  cbseMathsDate: string; // Default: '2027-03-01'
  syllabusTargetDate: string; // Default: '2027-01-05'
  prepStartDate: string; // Mandatory: '2026-11-10'
  dailyTargetHours: number; // Default 8, progressive: 8, 10, 11-12
  minimumProductiveTarget: number; // 7
}

export type ErrorCategory =
  | 'Conceptual Error'
  | 'Calculation Slip'
  | 'Formula Gap'
  | 'Misreading Question'
  | 'Time Management'
  | 'Guesswork';

export interface TestErrorItem {
  id: string;
  testId?: string;
  subject: Subject;
  chapterId: string;
  chapterName: string;
  questionDetails: string;
  category: ErrorCategory;
  correctAnswerSolution: string;
  myMistake: string;
  reAttemptSolved: boolean;
  timestamp: number;
}

export interface MockTestEntry {
  id: string;
  title: string;
  type: 'JEE Full Mock' | 'JEE Subject Test' | 'Chapter Test' | 'CBSE Sample Paper';
  date: string;
  score: number;
  totalMarks: number;
  pScore?: number;
  cScore?: number;
  mScore?: number;
  timeTakenMinutes: number;
  buckets: {
    conceptual: number;
    calculation: number;
    formula: number;
    misread: number;
    timeMgmt: number;
    guesswork: number;
  };
  weakChapters: string[];
  notes: string;
  timestamp: number;
}

export interface FlashcardItem {
  id: string;
  subject: Subject;
  chapterId?: string;
  title: string;
  conceptSummary: string;
  triggerWords: string[];
  example: string;
  diagramIdea?: string;
  lastReviewed?: string;
  easeFactor: number;
  timestamp: number;
}

export interface JEEXAppState {
  settings: ExamSettings;
  chapters: ChapterItem[];
  cbseChapters: CBSEChapterItem[];
  sessions: StudySession[];
  dailyTasks: Record<string, DailyMissionTask[]>; // key: YYYY-MM-DD
  dailyReviews: Record<string, DailyReviewData>;
  mocks: MockTestEntry[];
  errors: TestErrorItem[];
  flashcards: FlashcardItem[];
  backlogTasks: DailyMissionTask[];
}

// ==========================================
// LEGACY COMPATIBILITY TYPES
// ==========================================
export type SubjectKey = string;
export type DayPhase = string;
export type DayKind = string;

export interface TaskItem {
  id: string;
  subj: SubjectKey;
  label?: string;
  sub?: string;
  dur?: string;
  type?: string;
  tag?: string;
  [key: string]: any;
}

export interface DayData {
  num?: number;
  n?: number;
  date: Date;
  phase: DayPhase;
  phaseName?: string;
  kind: DayKind;
  desc?: string;
  mSlot?: string;
  pSlot?: string;
  cSlot?: string;
  bSlot?: string;
  rSlot?: string;
  tasks?: TaskItem[];
  items: TaskItem[];
  [key: string]: any;
}

export interface MockEntry {
  title?: string;
  type?: string;
  date?: string;
  p?: any;
  c?: any;
  m?: any;
  b?: any;
  tot?: number;
  tgt?: number;
  pct?: number;
  weak?: string;
  notes?: string;
  ts?: number;
  [key: string]: any;
}

export interface ErrorEntry {
  q?: string;
  subj?: string;
  typ?: string;
  cau?: string;
  fix?: string;
  ch?: string;
  date?: string;
  fixed?: boolean;
  ts?: number;
  chapter?: string;
  reason?: string;
  note?: string;
  [key: string]: any;
}

export interface CardEntry {
  title?: string;
  words?: any;
  ex?: string;
  dia?: string;
  front?: string;
  back?: string;
  subj?: string;
  tag?: string;
  ease?: number;
  int?: number;
  next?: string;
  ts?: number;
  [key: string]: any;
}

export interface BoardEntry {
  ch?: string;
  state?: string;
  notes?: string;
  date?: string;
  type?: string;
  marks?: number;
  reason?: string;
  ts?: number;
  [key: string]: any;
}

export interface AppStateData {
  done: Record<string, boolean>;
  mocks: MockEntry[];
  errors: ErrorEntry[];
  cards: CardEntry[];
  board: BoardEntry[];
}


