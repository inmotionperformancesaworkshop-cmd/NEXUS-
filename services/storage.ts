import { SessionState } from '../types';

const STORAGE_KEY = 'arcovel_sessions_v1';

export const saveSessionToHistory = (session: SessionState) => {
  // Only save if completed and has a prompt
  if (!session.prompt || session.status !== 'complete') return;
  
  const history = getHistory();
  
  // Check if session already exists in history to update it, or add new
  const existingIndex = history.findIndex(h => h.id === session.id);
  
  const entryToSave = { 
    ...session, 
    savedAt: Date.now() 
  };

  let updatedHistory;
  if (existingIndex >= 0) {
    updatedHistory = [...history];
    updatedHistory[existingIndex] = entryToSave;
  } else {
    updatedHistory = [entryToSave, ...history];
  }

  // Limit to last 20 entries to save space
  const trimmedHistory = updatedHistory.slice(0, 20);
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedHistory));
  } catch (e) {
    console.warn("LocalStorage full or disabled", e);
  }
};

export const getHistory = (): SessionState[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

export const clearHistory = () => {
  localStorage.removeItem(STORAGE_KEY);
};
