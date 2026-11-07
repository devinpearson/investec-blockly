import { amountExample } from "./amount";
import { petrolCardExample } from "./petrol-card";
import { defaultExample } from "./default";

export { amountExample, defaultExample, petrolCardExample };

// Example workspaces keyed by the name shown in the workspace dropdown.
export const examples = {
  Default: defaultExample,
  "Petrol Card": petrolCardExample,
  Amount: amountExample,
};
