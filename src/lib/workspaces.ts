import { STORAGE_PREFIX, readStorage, writeStorage } from "./storage";

/** A serialised Blockly workspace (Blockly.serialization.workspaces.save). */
export type WorkspaceState = { blocks?: unknown; variables?: unknown };

const AUTOSAVE_KEY = STORAGE_PREFIX + "autosave";
// Keys under the prefix that hold settings rather than saved workspaces.
const RESERVED = new Set([
  "autosave",
  "autosaveSource",
  "editorHeight",
  "panelWidth",
  "toolboxVisible",
]);

function parse(json: string | null): WorkspaceState | null {
  if (!json) return null;
  try {
    const value: unknown = JSON.parse(json);
    return isWorkspaceState(value) ? value : null;
  } catch {
    return null;
  }
}

export function isWorkspaceState(value: unknown): value is WorkspaceState {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    ("blocks" in value ||
      "variables" in value ||
      Object.keys(value).length === 0)
  );
}

export const readAutosave = () => parse(readStorage(AUTOSAVE_KEY));
export const writeAutosave = (state: WorkspaceState) =>
  writeStorage(AUTOSAVE_KEY, JSON.stringify(state));

/** Names of workspaces saved in this browser, A–Z. */
export function listSaved(): string[] {
  const names: string[] = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key?.startsWith(STORAGE_PREFIX)) continue;
      const name = key.slice(STORAGE_PREFIX.length);
      if (!RESERVED.has(name)) names.push(name);
    }
  } catch {
    // Storage unavailable.
  }
  return names.sort((a, b) => a.localeCompare(b));
}

export const readSaved = (name: string) =>
  parse(readStorage(STORAGE_PREFIX + name));

export function writeSaved(name: string, state: WorkspaceState): boolean {
  if (RESERVED.has(name)) return false;
  return writeStorage(STORAGE_PREFIX + name, JSON.stringify(state));
}

/** Offers the workspace to the viewer as a .json download. */
export function downloadWorkspace(name: string, state: WorkspaceState) {
  const blob = new Blob([JSON.stringify(state, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${name.replace(/[^\w-]+/g, "-").toLowerCase() || "workspace"}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

/** Reads a workspace from a .json file chosen by the viewer. */
export async function readWorkspaceFile(file: File): Promise<WorkspaceState> {
  let value: unknown;
  try {
    value = JSON.parse(await file.text());
  } catch {
    throw new Error(`${file.name} is not valid JSON.`);
  }
  if (!isWorkspaceState(value)) {
    throw new Error(`${file.name} is not a Blockly workspace.`);
  }
  return value;
}
