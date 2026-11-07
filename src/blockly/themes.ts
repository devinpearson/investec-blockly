import * as Blockly from "blockly/core";
import Modern from "@blockly/theme-modern";

// Modern block colours with workspace chrome matched to the page (Tailwind
// gray palette), in light and dark variants.
export const lightTheme = Blockly.Theme.defineTheme("investec-light", {
  name: "investec-light",
  base: Modern,
  componentStyles: {
    workspaceBackgroundColour: "#ffffff",
    toolboxBackgroundColour: "#f9fafb",
    toolboxForegroundColour: "#1f2937",
    flyoutBackgroundColour: "#f3f4f6",
    flyoutForegroundColour: "#374151",
    flyoutOpacity: 0.95,
    scrollbarColour: "#9ca3af",
    scrollbarOpacity: 0.5,
  },
});

export const darkTheme = Blockly.Theme.defineTheme("investec-dark", {
  name: "investec-dark",
  base: Modern,
  componentStyles: {
    workspaceBackgroundColour: "#111827",
    toolboxBackgroundColour: "#1f2937",
    toolboxForegroundColour: "#e5e7eb",
    flyoutBackgroundColour: "#1f2937",
    flyoutForegroundColour: "#d1d5db",
    flyoutOpacity: 0.95,
    scrollbarColour: "#6b7280",
    scrollbarOpacity: 0.5,
    insertionMarkerColour: "#ffffff",
    insertionMarkerOpacity: 0.3,
    cursorColour: "#d1d5db",
  },
});
