import type * as Blockly from "blockly/core";
import type { JavascriptGenerator } from "blockly/javascript";

/**
 * Generates the card code, with a loop guard when the code has loops. Shared
 * by the editor and the MCP server, so both run exactly the same code.
 */
export function generateRunnableCode(
  generator: JavascriptGenerator,
  workspace: Blockly.Workspace,
): string {
  // The guard is evaluated by the simulator, so it must not depend on browser
  // globals like `window`.
  generator.INFINITE_LOOP_TRAP =
    'if (--LoopTrap < 0) throw new Error("Infinite loop.");\n';
  try {
    const code = generator.workspaceToCode(workspace);
    return (code.includes("LoopTrap") ? "let LoopTrap = 1000;\n" : "") + code;
  } finally {
    generator.INFINITE_LOOP_TRAP = null;
  }
}
