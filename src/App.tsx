import { useCallback, useRef, useState, type CSSProperties } from "react";
import * as Blockly from "blockly/core";
import {
  javascriptGenerator,
  type JavascriptGenerator,
} from "blockly/javascript";
import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import "highlight.js/styles/github.css";

import { BlocklyWorkspace } from "./components/BlocklyWorkspace";
import { Button } from "./components/Button";
import { ExampleSelect } from "./components/ExampleSelect";
import { ResizeHandle } from "./components/ResizeHandle";
import { TransactionPanel } from "./components/TransactionPanel";
import { useResizable } from "./hooks/useResizable";
import { installBlocks } from "./blocks";
import { examples } from "./examples";
import {
  simulate,
  type EnvironmentVariables,
  type ExecutionItem,
  type TransactionInput,
} from "./lib/simulator";
import { STORAGE_PREFIX, readStorage, writeStorage } from "./lib/storage";
import {
  InvestecToolbox,
  HttpToolbox,
  DateTimeToolbox,
  LogicToolbox,
  LoopsToolbox,
  MathToolbox,
  TextToolbox,
  ListsToolbox,
  VariablesToolbox,
  FunctionsToolbox,
} from "./toolbox";

// TODO: upload code to a card via the API.

// Blockly 10 types javascriptGenerator as `any`; the class type is exported.
const generator = javascriptGenerator as JavascriptGenerator;

hljs.registerLanguage("javascript", javascript);
installBlocks({ javascript: generator });

const exampleNames = Object.keys(examples);
const DEFAULT_EXAMPLE = "Petrol Card";

const options: Blockly.BlocklyOptions = {
  media: "media/",
  // Each handler can only be defined once (it becomes a const in the code).
  maxInstances: {
    investec_card_before_transaction: 1,
    investec_card_after_transaction: 1,
    investec_card_after_decline: 1,
  },
  grid: {
    spacing: 25,
    length: 3,
    colour: "#ccc",
    snap: true,
  },
  toolbox: {
    kind: "categoryToolbox",
    contents: [
      InvestecToolbox,
      HttpToolbox,
      DateTimeToolbox,
      LogicToolbox,
      LoopsToolbox,
      MathToolbox,
      TextToolbox,
      ListsToolbox,
      VariablesToolbox,
      FunctionsToolbox,
    ],
  },
};

const storageKey = (name: string) => STORAGE_PREFIX + name;

/** Generates the card code, with a loop guard when the code has loops. */
function generateRunnableCode(workspace: Blockly.Workspace): string {
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

export default function App() {
  const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);
  const [workspaceName, setWorkspaceName] = useState(DEFAULT_EXAMPLE);
  const [codeHtml, setCodeHtml] = useState("");
  const [status, setStatus] = useState("");
  const [running, setRunning] = useState(false);
  const [simulationError, setSimulationError] = useState("");
  const [output, setOutput] = useState<ExecutionItem[] | null>(null);

  // Draggable layout: editor height (handle below it) and side-panel width
  // (handle between editor and panel, wide screens only).
  const editor = useResizable({
    storageKey: STORAGE_PREFIX + "editorHeight",
    initial: Math.max(400, window.innerHeight - 140),
    min: 250,
    max: () => 3000,
    axis: "y",
  });
  const panel = useResizable({
    storageKey: STORAGE_PREFIX + "panelWidth",
    initial: 320,
    min: 260,
    max: () => window.innerWidth * 0.6,
    axis: "x",
    direction: -1,
  });

  const showCode = useCallback(() => {
    const workspace = workspaceRef.current;
    if (!workspace) return;
    const code = generator.workspaceToCode(workspace);
    // hljs escapes the source, so its output is safe to inject.
    setCodeHtml(hljs.highlight(code, { language: "javascript" }).value);
  }, []);

  const loadState = useCallback(
    (state: object) => {
      const workspace = workspaceRef.current;
      if (!workspace) return;
      Blockly.serialization.workspaces.load(state, workspace);
      showCode();
    },
    [showCode],
  );

  const onInject = useCallback(
    (workspace: Blockly.WorkspaceSvg) => {
      workspaceRef.current = workspace;
      // Keep the code preview in sync with the blocks.
      workspace.addChangeListener((event) => {
        if (!event.isUiEvent) showCode();
      });
      const example = examples[DEFAULT_EXAMPLE];
      if (example) loadState(example);
    },
    [loadState, showCode],
  );

  function loadExample() {
    const example = examples[workspaceName];
    if (!example) return;
    loadState(example);
    setStatus(`Loaded the "${workspaceName}" example.`);
  }

  function saveWorkspace() {
    const workspace = workspaceRef.current;
    if (!workspace) return;
    const state = Blockly.serialization.workspaces.save(workspace);
    setStatus(
      writeStorage(storageKey(workspaceName), JSON.stringify(state))
        ? `Saved "${workspaceName}".`
        : "Could not save: browser storage is unavailable.",
    );
  }

  function loadWorkspace() {
    // Fall back to the un-prefixed key used by earlier versions.
    const saved =
      readStorage(storageKey(workspaceName)) ?? readStorage(workspaceName);
    if (!saved) {
      setStatus(`No saved workspace named "${workspaceName}".`);
      return;
    }
    try {
      loadState(JSON.parse(saved));
      setStatus(`Loaded "${workspaceName}".`);
    } catch (e) {
      setStatus(`Saved workspace is invalid: ${(e as Error).message}`);
    }
  }

  function clearWorkspace() {
    workspaceRef.current?.clear();
    showCode();
    setStatus("");
  }

  async function runCode(
    transaction: TransactionInput,
    environmentVariables: EnvironmentVariables,
  ) {
    const workspace = workspaceRef.current;
    if (!workspace) return;
    setRunning(true);
    setSimulationError("");
    try {
      setOutput(
        await simulate(
          generateRunnableCode(workspace),
          transaction,
          environmentVariables,
        ),
      );
    } catch (e) {
      setOutput(null);
      setSimulationError((e as Error).message);
    } finally {
      setRunning(false);
    }
  }

  const resizing = editor.dragging
    ? "cursor-row-resize select-none"
    : panel.dragging
      ? "cursor-col-resize select-none"
      : "";

  return (
    <div className={`mx-2 py-2 ${resizing}`}>
      <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
        Programmable Card Simulation
      </h1>
      <div className="mt-2 flex flex-col gap-4 lg:flex-row lg:items-start lg:gap-0">
        <div className="min-w-0 flex-1">
          <BlocklyWorkspace
            className="w-full"
            style={{ height: editor.size }}
            options={options}
            onInject={onInject}
          />
          <ResizeHandle resizable={editor} label="Resize editor height" />
          <div className="overflow-hidden rounded-lg bg-gray-50">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex flex-wrap items-center gap-2">
                <ExampleSelect
                  value={workspaceName}
                  options={exampleNames}
                  onChange={setWorkspaceName}
                />
                <Button onClick={loadExample}>Load Example</Button>
                <Button onClick={saveWorkspace}>Save Workspace</Button>
                <Button onClick={loadWorkspace}>Load Workspace</Button>
                <Button onClick={clearWorkspace}>Clear Workspace</Button>
                <span className="text-sm text-gray-600" aria-live="polite">
                  {status}
                </span>
              </div>
              <h2 className="mt-4 text-sm font-semibold text-gray-900">
                Generated JavaScript
              </h2>
              <pre
                className="mt-2 overflow-x-auto rounded bg-white p-3 text-sm"
                dangerouslySetInnerHTML={{ __html: codeHtml }}
              />
            </div>
          </div>
        </div>
        <ResizeHandle
          resizable={panel}
          label="Resize side panel"
          className="hidden lg:flex"
        />
        <TransactionPanel
          className="w-full lg:w-[var(--panel-width)] lg:shrink-0"
          style={{ "--panel-width": `${panel.size}px` } as CSSProperties}
          running={running}
          error={simulationError}
          output={output}
          onSimulate={runCode}
        />
      </div>
    </div>
  );
}
