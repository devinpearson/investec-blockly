import { amountExample } from "./amount";
import { petrolCardExample } from "./petrol-card";
import { defaultExample } from "./default";
import { afterHoursExample } from "./after-hours";
import {
  airtableLogExample,
  killSwitchExample,
  makeAutomationExample,
  teenCardExample,
  travelModeExample,
} from "./integrations";
import { guides } from "./guides";
import type { Example } from "./types";

export type { Example, Guide, Scenario } from "./types";

// Example workspaces keyed by the name shown in the workspace dropdown.
const workspaces: Record<string, Example> = {
  Default: { state: defaultExample },
  "Petrol Card": { state: petrolCardExample },
  Amount: { state: amountExample },
  "After Hours": { state: afterHoursExample },
  "Teen Card": teenCardExample,
  "Travel Mode": travelModeExample,
  "Expense Log (Airtable)": airtableLogExample,
  "Make.com Automation": makeAutomationExample,
  "Remote Kill Switch": killSwitchExample,
};

// Each example carries its write-up from guides.ts.
export const examples: Record<string, Example> = Object.fromEntries(
  Object.entries(workspaces).map(([name, example]) => [
    name,
    { ...example, guide: guides[name] },
  ]),
);
