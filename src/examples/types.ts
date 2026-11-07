import type { WorkspaceState } from "../lib/workspaces";

export type Example = {
  state: WorkspaceState;
  /** Environment variables the example reads; shown in the panel on open. */
  env?: string[];
};
