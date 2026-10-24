import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  onSnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { MockEntry, ErrorEntry, CardEntry, BoardEntry } from '../types';

export const DEFAULT_TRACKER_ID = 'main';

function getBasePath(targetId: string, isUser: boolean): string {
  return isUser ? `users/${targetId}` : `study_trackers/${targetId}`;
}

export function subscribeToProgress(
  targetId: string,
  isUser: boolean,
  onUpdate: (done: Record<string, boolean>) => void
): Unsubscribe {
  const base = getBasePath(targetId, isUser);
  const path = `${base}/progress/tracker`;
  const docRef = isUser
    ? doc(db, 'users', targetId, 'progress', 'tracker')
    : doc(db, 'study_trackers', targetId, 'progress', 'tracker');

  return onSnapshot(
    docRef,
    (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        if (data && data.done) {
          onUpdate(data.done);
        }
      }
    },
    (err) => {
      handleFirestoreError(err, OperationType.GET, path);
    }
  );
}

export async function saveProgress(
  targetId: string,
  isUser: boolean,
  done: Record<string, boolean>
): Promise<void> {
  const base = getBasePath(targetId, isUser);
  const path = `${base}/progress/tracker`;
  try {
    const docRef = isUser
      ? doc(db, 'users', targetId, 'progress', 'tracker')
      : doc(db, 'study_trackers', targetId, 'progress', 'tracker');

    await setDoc(docRef, {
      userId: targetId,
      done,
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export function subscribeToMocks(
  targetId: string,
  isUser: boolean,
  onUpdate: (mocks: MockEntry[]) => void
): Unsubscribe {
  const base = getBasePath(targetId, isUser);
  const path = `${base}/mocks`;
  const colRef = isUser
    ? collection(db, 'users', targetId, 'mocks')
    : collection(db, 'study_trackers', targetId, 'mocks');

  return onSnapshot(
    colRef,
    (snap) => {
      const results: MockEntry[] = [];
      snap.forEach((d) => {
        const data = d.data();
        results.push({
          date: data.date,
          p: Number(data.p) || 0,
          c: Number(data.c) || 0,
          m: Number(data.m) || 0,
          b: data.b || [0, 0, 0, 0],
          ts: data.ts || Number(d.id) || Date.now(),
        });
      });
      onUpdate(results);
    },
    (err) => {
      handleFirestoreError(err, OperationType.LIST, path);
    }
  );
}

export async function saveMock(
  targetId: string,
  isUser: boolean,
  mock: MockEntry
): Promise<void> {
  const mockId = String(mock.ts || Date.now());
  const base = getBasePath(targetId, isUser);
  const path = `${base}/mocks/${mockId}`;
  try {
    const docRef = isUser
      ? doc(db, 'users', targetId, 'mocks', mockId)
      : doc(db, 'study_trackers', targetId, 'mocks', mockId);

    await setDoc(docRef, {
      ...mock,
      userId: targetId,
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function deleteMock(
  targetId: string,
  isUser: boolean,
  mock: MockEntry
): Promise<void> {
  const mockId = String(mock.ts);
  const base = getBasePath(targetId, isUser);
  const path = `${base}/mocks/${mockId}`;
  try {
    const docRef = isUser
      ? doc(db, 'users', targetId, 'mocks', mockId)
      : doc(db, 'study_trackers', targetId, 'mocks', mockId);
    await deleteDoc(docRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

export function subscribeToErrors(
  targetId: string,
  isUser: boolean,
  onUpdate: (errors: ErrorEntry[]) => void
): Unsubscribe {
  const base = getBasePath(targetId, isUser);
  const path = `${base}/errors`;
  const colRef = isUser
    ? collection(db, 'users', targetId, 'errors')
    : collection(db, 'study_trackers', targetId, 'errors');

  return onSnapshot(
    colRef,
    (snap) => {
      const results: ErrorEntry[] = [];
      snap.forEach((d) => {
        const data = d.data();
        results.push({
          subj: data.subj,
          chapter: data.chapter,
          reason: data.reason,
          note: data.note || '',
          fixed: !!data.fixed,
          ts: data.ts || Number(d.id) || Date.now(),
        });
      });
      onUpdate(results);
    },
    (err) => {
      handleFirestoreError(err, OperationType.LIST, path);
    }
  );
}

export async function saveError(
  targetId: string,
  isUser: boolean,
  errorItem: ErrorEntry
): Promise<void> {
  const errorId = String(errorItem.ts || Date.now());
  const base = getBasePath(targetId, isUser);
  const path = `${base}/errors/${errorId}`;
  try {
    const docRef = isUser
      ? doc(db, 'users', targetId, 'errors', errorId)
      : doc(db, 'study_trackers', targetId, 'errors', errorId);

    await setDoc(docRef, {
      ...errorItem,
      userId: targetId,
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function updateErrorFixed(
  targetId: string,
  isUser: boolean,
  errorItem: ErrorEntry
): Promise<void> {
  const errorId = String(errorItem.ts);
  const base = getBasePath(targetId, isUser);
  const path = `${base}/errors/${errorId}`;
  try {
    const docRef = isUser
      ? doc(db, 'users', targetId, 'errors', errorId)
      : doc(db, 'study_trackers', targetId, 'errors', errorId);

    await updateDoc(docRef, {
      fixed: errorItem.fixed,
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, path);
  }
}

export async function deleteError(
  targetId: string,
  isUser: boolean,
  errorItem: ErrorEntry
): Promise<void> {
  const errorId = String(errorItem.ts);
  const base = getBasePath(targetId, isUser);
  const path = `${base}/errors/${errorId}`;
  try {
    const docRef = isUser
      ? doc(db, 'users', targetId, 'errors', errorId)
      : doc(db, 'study_trackers', targetId, 'errors', errorId);
    await deleteDoc(docRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

export function subscribeToCards(
  targetId: string,
  isUser: boolean,
  onUpdate: (cards: CardEntry[]) => void
): Unsubscribe {
  const base = getBasePath(targetId, isUser);
  const path = `${base}/cards`;
  const colRef = isUser
    ? collection(db, 'users', targetId, 'cards')
    : collection(db, 'study_trackers', targetId, 'cards');

  return onSnapshot(
    colRef,
    (snap) => {
      const results: CardEntry[] = [];
      snap.forEach((d) => {
        const data = d.data();
        results.push({
          subj: data.subj,
          title: data.title,
          words: data.words,
          ex: data.ex || '',
          dia: data.dia || '',
          ts: data.ts || Number(d.id) || Date.now(),
        });
      });
      onUpdate(results);
    },
    (err) => {
      handleFirestoreError(err, OperationType.LIST, path);
    }
  );
}

export async function saveCard(
  targetId: string,
  isUser: boolean,
  card: CardEntry
): Promise<void> {
  const cardId = String(card.ts || Date.now());
  const base = getBasePath(targetId, isUser);
  const path = `${base}/cards/${cardId}`;
  try {
    const docRef = isUser
      ? doc(db, 'users', targetId, 'cards', cardId)
      : doc(db, 'study_trackers', targetId, 'cards', cardId);

    await setDoc(docRef, {
      ...card,
      userId: targetId,
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function deleteCard(
  targetId: string,
  isUser: boolean,
  card: CardEntry
): Promise<void> {
  const cardId = String(card.ts);
  const base = getBasePath(targetId, isUser);
  const path = `${base}/cards/${cardId}`;
  try {
    const docRef = isUser
      ? doc(db, 'users', targetId, 'cards', cardId)
      : doc(db, 'study_trackers', targetId, 'cards', cardId);
    await deleteDoc(docRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

export function subscribeToBoard(
  targetId: string,
  isUser: boolean,
  onUpdate: (boardEntries: BoardEntry[]) => void
): Unsubscribe {
  const base = getBasePath(targetId, isUser);
  const path = `${base}/board`;
  const colRef = isUser
    ? collection(db, 'users', targetId, 'board')
    : collection(db, 'study_trackers', targetId, 'board');

  return onSnapshot(
    colRef,
    (snap) => {
      const results: BoardEntry[] = [];
      snap.forEach((d) => {
        const data = d.data();
        results.push({
          date: data.date,
          marks: Number(data.marks) || 0,
          type: data.type,
          reason: data.reason || '',
          ts: data.ts || Number(d.id) || Date.now(),
        });
      });
      onUpdate(results);
    },
    (err) => {
      handleFirestoreError(err, OperationType.LIST, path);
    }
  );
}

export async function saveBoard(
  targetId: string,
  isUser: boolean,
  entry: BoardEntry
): Promise<void> {
  const boardId = String(entry.ts || Date.now());
  const base = getBasePath(targetId, isUser);
  const path = `${base}/board/${boardId}`;
  try {
    const docRef = isUser
      ? doc(db, 'users', targetId, 'board', boardId)
      : doc(db, 'study_trackers', targetId, 'board', boardId);

    await setDoc(docRef, {
      ...entry,
      userId: targetId,
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function deleteBoard(
  targetId: string,
  isUser: boolean,
  entry: BoardEntry
): Promise<void> {
  const boardId = String(entry.ts);
  const base = getBasePath(targetId, isUser);
  const path = `${base}/board/${boardId}`;
  try {
    const docRef = isUser
      ? doc(db, 'users', targetId, 'board', boardId)
      : doc(db, 'study_trackers', targetId, 'board', boardId);
    await deleteDoc(docRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}
