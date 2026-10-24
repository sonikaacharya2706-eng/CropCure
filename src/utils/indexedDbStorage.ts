/**
 * CropCure IndexedDB Offline Village Storage Utility
 * Implements local persistent storage for diagnosis history, offline cache, and sync queue.
 */

const DB_NAME = 'CropCureOfflineDB';
const DB_VERSION = 1;
const STORE_DIAGNOSES = 'diagnoses';
const STORE_SYNC_QUEUE = 'syncQueue';

export function openIndexedDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_DIAGNOSES)) {
        db.createObjectStore(STORE_DIAGNOSES, { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains(STORE_SYNC_QUEUE)) {
        db.createObjectStore(STORE_SYNC_QUEUE, { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}

export async function saveDiagnosisToIndexedDB(record: any): Promise<void> {
  try {
    const db = await openIndexedDB();
    const tx = db.transaction(STORE_DIAGNOSES, 'readwrite');
    const store = tx.objectStore(STORE_DIAGNOSES);
    store.add({ ...record, timestamp: Date.now() });
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (e) {
    console.warn('IndexedDB save warning:', e);
  }
}

export async function getDiagnosesFromIndexedDB(): Promise<any[]> {
  try {
    const db = await openIndexedDB();
    const tx = db.transaction(STORE_DIAGNOSES, 'readonly');
    const store = tx.objectStore(STORE_DIAGNOSES);
    const request = store.getAll();
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  } catch (e) {
    console.warn('IndexedDB fetch warning:', e);
    return [];
  }
}
