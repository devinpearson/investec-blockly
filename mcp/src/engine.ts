// The editor's blocks running headless in Node: the same block definitions,
// generators, toolbox and examples as the web app, so what the MCP server and
// the skill reference say about a block is what the editor does with it.
import * as Blockly from "blockly";
import {
  javascriptGenerator,
  type JavascriptGenerator,
} from "blockly/javascript";
import { installBlocks } from "../../src/blocks";
import { HANDLER_TYPES, placementRules } from "../../src/blocks/context";
import { examples } from "../../src/examples";
import { generateRunnableCode } from "../../src/lib/codegen";
import {
  isWorkspaceState,
  type WorkspaceState,
} from "../../src/lib/workspaces";
import * as toolbox from "../../src/toolbox";

const generator = javascriptGenerator as JavascriptGenerator;
installBlocks({ javascript: generator });

export { examples, HANDLER_TYPES };

// ---------------------------------------------------------------------------
// Catalogue

type ToolboxItem = {
  kind: string;
  type?: string;
  text?: string;
  name?: string;
  custom?: string;
  contents?: ToolboxItem[];
  [key: string]: unknown;
};

// Variables and Functions are dynamic categories in the editor.
const CUSTOM_CATEGORY_BLOCKS: Record<string, string[]> = {
  VARIABLE: ["variables_get", "variables_set", "math_change"],
  PROCEDURE: [
    "procedures_defnoreturn",
    "procedures_defreturn",
    "procedures_callnoreturn",
    "procedures_callreturn",
    "procedures_ifreturn",
  ],
};

export type FieldInfo = {
  name: string;
  kind: string;
  default: unknown;
  options?: [string, string][];
};
export type InputInfo = {
  name: string;
  kind: "value" | "statement" | "dummy";
  check: string[] | null;
  fields: FieldInfo[];
};
export type BlockInfo = {
  type: string;
  category: string;
  /** The block as it reads in the editor, with ? for empty inputs. */
  text: string;
  tooltip: string;
  output: string[] | null | false;
  previousStatement: boolean;
  nextStatement: boolean;
  inputs: InputInfo[];
  placement?: string;
  /** Example block state from the toolbox (default shadows etc). */
  toolboxState?: Record<string, unknown>;
};

export type Template = { section: string; title: string; block: unknown };

// In the editor's toolbox order (a module namespace is sorted A–Z).
/** A toolbox entry as block state (the toolbox adds `kind`). */
function withoutKind(item: ToolboxItem): Record<string, unknown> {
  const state: Record<string, unknown> = { ...item };
  delete state.kind;
  return state;
}

const categories = [
  toolbox.InvestecToolbox,
  toolbox.TemplatesToolbox,
  toolbox.HttpToolbox,
  toolbox.DateTimeToolbox,
  toolbox.LogicToolbox,
  toolbox.LoopsToolbox,
  toolbox.MathToolbox,
  toolbox.TextToolbox,
  toolbox.ListsToolbox,
  toolbox.VariablesToolbox,
  toolbox.FunctionsToolbox,
] as ToolboxItem[];

function fieldKind(field: Blockly.Field): string {
  // FieldVariable is a dropdown too, so check it first.
  if (field instanceof Blockly.FieldVariable) return "variable";
  if (field instanceof Blockly.FieldDropdown) return "dropdown";
  if (field instanceof Blockly.FieldNumber) return "number";
  if (field instanceof Blockly.FieldCheckbox) return "checkbox";
  if (field instanceof Blockly.FieldTextInput) return "text";
  return "label";
}

function describeBlock(
  type: string,
  category: string,
  toolboxState?: Record<string, unknown>,
): BlockInfo {
  const workspace = new Blockly.Workspace();
  try {
    const block = workspace.newBlock(type);
    const inputs: InputInfo[] = block.inputList.map((input) => ({
      name: input.name,
      kind:
        input.type === Blockly.inputs.inputTypes.VALUE
          ? "value"
          : input.type === Blockly.inputs.inputTypes.STATEMENT
            ? "statement"
            : "dummy",
      check: input.connection?.getCheck() ?? null,
      fields: input.fieldRow
        .filter((field) => field.name && field.EDITABLE)
        .map((field) => ({
          name: field.name!,
          kind: fieldKind(field),
          // Variables are set by name: { "name": "total" }; their ids are random.
          default:
            field instanceof Blockly.FieldVariable
              ? { name: field.getVariable()?.name ?? "" }
              : field.getValue(),
          ...(field instanceof Blockly.FieldDropdown &&
          !(field instanceof Blockly.FieldVariable)
            ? {
                options: field
                  .getOptions(false)
                  .map(([label, value]) => [
                    typeof label === "string" ? label : value,
                    value,
                  ]) as [string, string][],
              }
            : {}),
        })),
    }));
    const tooltip = Blockly.Tooltip.getTooltipOfObject(block);
    return {
      type,
      category,
      text: block.toString(),
      tooltip,
      output: block.outputConnection
        ? block.outputConnection.getCheck()
        : false,
      previousStatement: Boolean(block.previousConnection),
      nextStatement: Boolean(block.nextConnection),
      inputs,
      placement: placementRules.get(type)?.message,
      toolboxState:
        toolboxState && Object.keys(toolboxState).length > 1
          ? toolboxState
          : undefined,
    };
  } finally {
    workspace.dispose();
  }
}

let catalogueCache: BlockInfo[] | null = null;

/** Every block the editor's toolbox offers, by category, in toolbox order. */
export function blockCatalogue(): BlockInfo[] {
  if (catalogueCache) return catalogueCache;
  const blocks: BlockInfo[] = [];
  const seen = new Set<string>();
  for (const category of categories) {
    if (category.name === "Templates") continue;
    const name = category.name ?? "Other";
    const items: { type: string; state?: Record<string, unknown> }[] =
      category.custom
        ? (CUSTOM_CATEGORY_BLOCKS[category.custom] ?? []).map((type) => ({
            type,
          }))
        : (category.contents ?? [])
            .filter((item) => item.kind === "block" && item.type)
            .map((item) => ({
              type: item.type!,
              state: withoutKind(item),
            }));
    for (const { type, state } of items) {
      if (seen.has(type)) continue;
      seen.add(type);
      blocks.push(describeBlock(type, name, state));
    }
  }
  catalogueCache = blocks;
  return blocks;
}

/** The Templates category: ready-made statement blocks with their titles. */
export function templates(): Template[] {
  const category = categories.find((item) => item.name === "Templates");
  const result: Template[] = [];
  let section = "";
  const contents = category?.contents ?? [];
  contents.forEach((item, index) => {
    if (item.kind !== "label") return;
    const next = contents[index + 1];
    if (next?.kind === "block") {
      result.push({
        section,
        title: item.text ?? "",
        block: withoutKind(next),
      });
    } else {
      section = item.text ?? "";
    }
  });
  return result;
}

// ---------------------------------------------------------------------------
// Validation and code generation

export type Problem = {
  severity: "error" | "warning";
  message: string;
  blockId?: string;
  blockType?: string;
};

export type CheckResult = {
  ok: boolean;
  problems: Problem[];
  /** The JavaScript the card would run; empty when the workspace won't load. */
  code: string;
  /** The workspace as the editor would save it (normalised). */
  workspace?: WorkspaceState;
};

const LOOSE_TOP_LEVEL_OK = new Set([
  ...HANDLER_TYPES,
  "procedures_defnoreturn",
  "procedures_defreturn",
  // Top-level variables are shared by the handlers (see Petrol Card).
  "variables_set",
]);

/** Accepts a workspace object, a JSON string, or a bare block / list of blocks. */
export function normaliseWorkspace(input: unknown): WorkspaceState {
  let value = input;
  if (typeof value === "string") {
    try {
      value = JSON.parse(value);
    } catch (e) {
      throw new Error(`Not valid JSON: ${(e as Error).message}`, { cause: e });
    }
  }
  if (Array.isArray(value)) {
    value = { blocks: { languageVersion: 0, blocks: value } };
  } else if (
    value &&
    typeof value === "object" &&
    "type" in value &&
    !("blocks" in value)
  ) {
    value = { blocks: { languageVersion: 0, blocks: [value] } };
  }
  if (!isWorkspaceState(value)) {
    throw new Error(
      'Expected a Blockly workspace: { "blocks": { "languageVersion": 0, "blocks": [ … ] } }.',
    );
  }
  return value;
}

function compareFields(
  input: unknown,
  workspace: Blockly.Workspace,
  problems: Problem[],
) {
  // Fields whose value the block rejected (e.g. an unknown dropdown option)
  // load silently with the default, so compare what was asked for.
  const visit = (state: unknown) => {
    if (!state || typeof state !== "object") return;
    if (Array.isArray(state)) return state.forEach(visit);
    const record = state as Record<string, unknown>;
    if (typeof record.type === "string" && typeof record.id === "string") {
      const block = workspace.getBlockById(record.id);
      const fields = record.fields as Record<string, unknown> | undefined;
      if (block && fields) {
        for (const [name, wanted] of Object.entries(fields)) {
          const field = block.getField(name);
          if (!field) {
            problems.push({
              severity: "error",
              message: `${record.type} has no field "${name}".`,
              blockId: block.id,
              blockType: block.type,
            });
            continue;
          }
          if (typeof wanted === "object") continue; // variables: {id}
          const actual = field.getValue();
          if (String(actual) !== String(wanted)) {
            const options =
              field instanceof Blockly.FieldDropdown
                ? ` Allowed: ${field
                    .getOptions(false)
                    .map(([, value]) => value)
                    .join(", ")}.`
                : "";
            problems.push({
              severity: "error",
              message: `${record.type} field ${name} can't be ${JSON.stringify(wanted)}; it fell back to ${JSON.stringify(actual)}.${options}`,
              blockId: block.id,
              blockType: block.type,
            });
          }
        }
      }
    }
    Object.values(record).forEach(visit);
  };
  visit(input);
}

/** Gives every block state an id so problems can point at it. */
function withIds(state: WorkspaceState): WorkspaceState {
  let counter = 0;
  const visit = (value: unknown): unknown => {
    if (Array.isArray(value)) return value.map(visit);
    if (!value || typeof value !== "object") return value;
    const record = Object.fromEntries(
      Object.entries(value).map(([key, inner]) => [key, visit(inner)]),
    );
    if (typeof record.type === "string" && !record.id && isBlockLike(record)) {
      record.id = `b${++counter}`;
    }
    return record;
  };
  return visit(state) as WorkspaceState;
}

const isBlockLike = (record: Record<string, unknown>) =>
  Boolean(Blockly.Blocks[record.type as string]) ||
  "fields" in record ||
  "inputs" in record ||
  "next" in record;

/** Loads the workspace headless, checks it like the editor would, and generates its code. */
export function checkWorkspace(input: unknown): CheckResult {
  const problems: Problem[] = [];
  let state: WorkspaceState;
  try {
    state = withIds(normaliseWorkspace(input));
  } catch (e) {
    return {
      ok: false,
      problems: [{ severity: "error", message: (e as Error).message }],
      code: "",
    };
  }

  const workspace = new Blockly.Workspace();
  const warn = console.warn;
  try {
    console.warn = (...args: unknown[]) =>
      problems.push({
        severity: "warning",
        message: args.map(String).join(" "),
      });
    try {
      Blockly.serialization.workspaces.load(state, workspace);
    } catch (e) {
      const message = (e as Error).message;
      return {
        ok: false,
        problems: [
          ...problems,
          {
            severity: "error",
            message: /Invalid block definition|Unknown block type/i.test(
              message,
            )
              ? `${message} — call list_blocks for the block types this editor has.`
              : message,
          },
        ],
        code: "",
      };
    } finally {
      console.warn = warn;
    }

    compareFields(state, workspace, problems);

    const top = workspace.getTopBlocks(true);
    const handlers = top.filter((block) => HANDLER_TYPES.includes(block.type));
    if (handlers.length === 0) {
      problems.push({
        severity: "error",
        message:
          "No handler block. Put the logic inside investec_card_before_transaction, investec_card_after_transaction or investec_card_after_decline.",
      });
    }
    for (const type of HANDLER_TYPES) {
      const count = handlers.filter((block) => block.type === type).length;
      if (count > 1) {
        problems.push({
          severity: "error",
          message: `${type} appears ${count} times; each handler can only be used once.`,
          blockType: type,
        });
      }
    }
    for (const block of top) {
      if (!LOOSE_TOP_LEVEL_OK.has(block.type)) {
        problems.push({
          severity: "warning",
          message: `${block.type} is not inside a handler, so it runs when the code loads rather than for a card event.`,
          blockId: block.id,
          blockType: block.type,
        });
      }
    }
    for (const block of workspace.getAllBlocks(false)) {
      const rule = placementRules.get(block.type);
      if (rule && !rule.isValid(block)) {
        problems.push({
          severity: "warning",
          message: `${block.type}: ${rule.message}`,
          blockId: block.id,
          blockType: block.type,
        });
      }
    }

    const code = generateRunnableCode(generator, workspace);
    try {
      new Function(code);
    } catch (e) {
      problems.push({
        severity: "error",
        message: `Generated code does not parse: ${(e as Error).message}`,
      });
    }
    return {
      ok: !problems.some((problem) => problem.severity === "error"),
      problems,
      code,
      workspace: Blockly.serialization.workspaces.save(workspace),
    };
  } finally {
    console.warn = warn;
    workspace.dispose();
  }
}
