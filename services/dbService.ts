import { SavedReport } from '../types';

const DB_NAME = 'HamdamAI_DB';
const DB_VERSION = 1;
const STORE_NAME = 'saved_analyses';

let db: IDBDatabase;

export const initDB = (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    if (db) return resolve(true);

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error('IndexedDB error:', request.error);
      reject('Error opening IndexedDB.');
    };

    request.onsuccess = () => {
      db = request.result;
      resolve(true);
    };

    request.onupgradeneeded = (event) => {
      const dbInstance = (event.target as IDBOpenDBRequest).result;
      if (!dbInstance.objectStoreNames.contains(STORE_NAME)) {
        dbInstance.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
};

export const saveAnalysis = (analysis: SavedReport): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!db) return reject('DB not initialized.');
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(analysis);
    request.onsuccess = () => resolve();
    request.onerror = () => {
      console.error('Save analysis error:', request.error);
      reject('Error saving analysis.');
    };
  });
};

export const getAllSavedAnalyses = (): Promise<SavedReport[]> => {
  return new Promise((resolve, reject) => {
    if (!db) return reject('DB not initialized.');
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onerror = () => {
      console.error('Get all analyses error:', request.error);
      reject('Error fetching analyses.');
    };

    request.onsuccess = () => {
      // Sort by timestamp descending
      const sorted = request.result.sort((a: SavedReport, b: SavedReport) => b.timestamp - a.timestamp);
      resolve(sorted);
    };
  });
};

export const deleteAnalysis = (id: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!db) return reject('DB not initialized.');
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => {
      console.error('Delete analysis error:', request.error);
      reject('Error deleting analysis.');
    };
  });
};
