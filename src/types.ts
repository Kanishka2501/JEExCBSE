export type SubjectKey = 
  | 'math' 
  | 'phys' 
  | 'chem' 
  | 'delay' 
  | 'board' 
  | 'mock' 
  | 'review' 
  | 'log' 
  | 'rest' 
  | 'plan' 
  | 'mix';

export interface TaskItem {
  id: string;
  subj: SubjectKey;
  tag: string;
  title: string;
  detail: string;
  time: string;
}

export type DayPhase = 
  | 'learn' 
  | 'revise' 
  | 'mocks' 
  | 'window' 
  | 'bsweep' 
  | 'bpaper' 
  | 'bexam';

export type DayKind = 
  | 'diagnostic' 
  | 'setup' 
  | 'study' 
  | 'test' 
  | 'mock' 
  | 'board';

export interface DayData {
  n: number;
  date: Date;
  dow: number;
  phase: DayPhase;
  kind: DayKind;
  items: TaskItem[];
  learn: string[] | null;
  bch: string[] | null;
}

export interface MockEntry {
  date: string;
  p: number;
  c: number;
  m: number;
  b: [number, number, number, number]; // [sure-but-wrong, unsure-correct, guessed-correct, wrong-unaware]
  ts: number;
}

export interface ErrorEntry {
  subj: string;
  chapter: string;
  reason: string;
  note: string;
  fixed: boolean;
  ts: number;
}

export interface CardEntry {
  subj: string;
  title: string;
  words: string;
  ex: string;
  dia: string;
  ts: number;
}

export interface BoardEntry {
  date: string;
  marks: number;
  type: string;
  reason: string;
  ts: number;
}
