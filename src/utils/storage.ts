import { JEEXAppState } from '../types';
import { INITIAL_JEE_CHAPTERS, INITIAL_CBSE_CHAPTERS } from '../data/syllabusDatabase';

export const DEFAULT_APP_STATE: JEEXAppState = {
  settings: {
    jee1Date: '2027-01-22',
    jee2Date: '2027-04-06',
    cbseMathsDate: '2027-03-01',
    syllabusTargetDate: '2027-01-05',
    prepStartDate: '2026-11-10',
    dailyTargetHours: 8,
    minimumProductiveTarget: 7,
  },
  chapters: INITIAL_JEE_CHAPTERS,
  cbseChapters: INITIAL_CBSE_CHAPTERS,
  sessions: [],
  dailyTasks: {},
  dailyReviews: {},
  mocks: [],
  errors: [],
  flashcards: [],
  backlogTasks: [],
};

export function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch (e) {
    console.warn(`Storage load failed for ${key}`, e);
    return fallback;
  }
}

export function saveToStorage<T>(key: string, value: T): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    console.warn(`Storage save failed for ${key}`, e);
    return false;
  }
}

export function exportJEEXBackup(state: JEEXAppState) {
  const jsonString = JSON.stringify(state, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const dateStr = new Date().toISOString().split('T')[0];
  a.href = url;
  a.download = `JEE-X-2.0-backup-${dateStr}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export type { AppStateData } from '../types';

export function exportBackup(data: any) {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const dateStr = new Date().toISOString().split('T')[0];
  a.href = url;
  a.download = `sys90-backup-${dateStr}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

