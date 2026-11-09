import {
  doc,
  setDoc,
  onSnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { JEEXAppState } from '../types';

export const DEFAULT_TRACKER_ID = 'main';

/**
 * Subscribes to real-time JEE-X 2.0 command centre state
 */
export function subscribeToJEEXState(
  targetId: string,
  isUser: boolean,
  onUpdate: (state: Partial<JEEXAppState>) => void
): Unsubscribe {
  const path = isUser ? `users/${targetId}/jeex/state` : `study_trackers/${targetId}/jeex/state`;
  const docRef = isUser
    ? doc(db, 'users', targetId, 'jeex', 'state')
    : doc(db, 'study_trackers', targetId, 'jeex', 'state');

  return onSnapshot(
    docRef,
    (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        if (data && data.statePayload) {
          try {
            const parsed = JSON.parse(data.statePayload);
            onUpdate(parsed);
          } catch (e) {
            console.error('Error parsing cloud state payload:', e);
          }
        }
      }
    },
    (err) => {
      handleFirestoreError(err, OperationType.GET, path);
    }
  );
}

/**
 * Saves JEE-X 2.0 command centre state to Firestore
 */
export async function saveJEEXState(
  targetId: string,
  isUser: boolean,
  state: JEEXAppState
): Promise<void> {
  const path = isUser ? `users/${targetId}/jeex/state` : `study_trackers/${targetId}/jeex/state`;
  try {
    const docRef = isUser
      ? doc(db, 'users', targetId, 'jeex', 'state')
      : doc(db, 'study_trackers', targetId, 'jeex', 'state');

    await setDoc(docRef, {
      userId: targetId,
      statePayload: JSON.stringify(state),
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}
