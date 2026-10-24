import { MockEntry, ErrorEntry, CardEntry, BoardEntry } from '../types';

export interface AppStateData {
  done: Record<string, boolean>;
  mocks: MockEntry[];
  errors: ErrorEntry[];
  cards: CardEntry[];
  board: BoardEntry[];
}

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

export function exportBackup(data: AppStateData) {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const dateStr = new Date().toISOString().split('T')[0];
  a.href = url;
  a.download = `study-system-backup-${dateStr}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
