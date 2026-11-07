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
import type { Example } from "./types";

export type { Example } from "./types";

// Example workspaces keyed by the name shown in the workspace dropdown.
export const examples: Record<string, Example> = {
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
