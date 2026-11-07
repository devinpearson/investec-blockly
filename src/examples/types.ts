import type { TransactionInput } from "../lib/simulator";
import type { WorkspaceState } from "../lib/workspaces";

export type GuideLink = { label: string; url: string };

export type SetupStep = { text: string; link?: GuideLink };

/** A ready-made transaction to run from the guide. */
export type Scenario = {
  label: string;
  /** What should happen, e.g. "Approved, push sent". */
  expect: string;
  transaction: Partial<TransactionInput>;
  /** Environment variables to set in the panel before running. */
  env?: Record<string, string>;
};

/** The write-up shown in the Guide tab while an example is open. */
export type Guide = {
  summary: string;
  /** What the blocks do, in the order they run. */
  steps: string[];
  /** What to set up outside this page; omitted when nothing is needed. */
  setup?: SetupStep[];
  scenarios: Scenario[];
  /** Caveats worth knowing before relying on the example. */
  notes?: string[];
};

export type Example = {
  state: WorkspaceState;
  /** Environment variables the example reads; shown in the panel on open. */
  env?: string[];
  guide?: Guide;
};
