// localStorage can be unavailable or throw (private mode, blocked site data),
// so every access goes through these helpers and fails quietly.
export const STORAGE_PREFIX = "investec-blockly:";

export function readStorage(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

/** Returns false if the value could not be stored. */
export function writeStorage(key: string, value: string): boolean {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}
