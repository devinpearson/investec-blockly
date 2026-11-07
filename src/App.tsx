import {
  useCallback,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import * as Blockly from "blockly/core";
import {
  javascriptGenerator,
  type JavascriptGenerator,
} from "blockly/javascript";

import { BlocklyWorkspace } from "./components/BlocklyWorkspace";
import { AboutDialog } from "./components/AboutDialog";
import { CodeView } from "./components/CodeView";
import { GuideView } from "./components/GuideView";
import type { EnvironmentRow } from "./components/EnvironmentEditor";
import { Header, type WorkspaceSource } from "./components/Header";
import { ResizeHandle } from "./components/ResizeHandle";
import { ResultsView } from "./components/ResultsView";
import { SidePanel, type PanelTab } from "./components/SidePanel";
import { Toasts } from "./components/Toasts";
import { TransactionForm } from "./components/TransactionForm";
import { darkTheme, lightTheme } from "./blockly/themes";
import { usePrefersDark } from "./hooks/usePrefersDark";
import { useResizable } from "./hooks/useResizable";
import { useToasts } from "./hooks/useToasts";
import { installBlocks } from "./blocks";
import { examples, type Scenario } from "./examples";
import {
  defaultTransaction,
  simulate,
  validateTransaction,
  type ExecutionItem,
  type TransactionInput,
} from "./lib/simulator";
import { STORAGE_PREFIX, readStorage, writeStorage } from "./lib/storage";
import {
  downloadWorkspace,
  listSaved,
  readAutosave,
  readSaved,
  readWorkspaceFile,
  writeAutosave,
  writeSaved,
  type WorkspaceState,
} from "./lib/workspaces";
import {
  InvestecToolbox,
  TemplatesToolbox,
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
installBlocks({ javascript: generator });

const exampleNames = Object.keys(examples);
const DEFAULT_EXAMPLE = "Petrol Card";
const AUTOSAVE_DELAY_MS = 500;
const TOOLBOX_KEY = STORAGE_PREFIX + "toolboxVisible";
// Which example or saved workspace the autosave came from, for its guide.
const SOURCE_KEY = STORAGE_PREFIX + "autosaveSource";
// Set once the About dialog has been seen, so it only opens by itself once.
const ABOUT_SEEN_KEY = STORAGE_PREFIX + "aboutSeen";

/** Remembered choice, else shown except on phone-sized screens. */
function initialToolboxVisible(): boolean {
  const stored = readStorage(TOOLBOX_KEY);
  return stored === null ? window.innerWidth >= 768 : stored === "true";
}

/** Shows or hides the block toolbox and lets the workspace take the space. */
function applyToolboxVisible(
  workspace: Blockly.WorkspaceSvg,
  visible: boolean,
) {
  workspace.getToolbox()?.setVisible(visible);
  Blockly.svgResize(workspace);
}

const options: Blockly.BlocklyOptions = {
  media: "media/",
  // Each handler can only be defined once (it becomes a const in the code).
  maxInstances: {
    investec_card_before_transaction: 1,
    investec_card_after_transaction: 1,
    investec_card_after_decline: 1,
  },
  // A neutral grid that reads on both the light and dark backgrounds.
  grid: {
    spacing: 25,
    length: 3,
    colour: "rgba(156, 163, 175, 0.45)",
    snap: true,
  },
  zoom: { controls: true, wheel: false, startScale: 0.9 },
  trashcan: true,
  toolbox: {
    kind: "categoryToolbox",
    contents: [
      InvestecToolbox,
      TemplatesToolbox,
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

const sourceName = (source: WorkspaceSource | "") =>
  source ? source.slice(source.indexOf(":") + 1) : "";

export default function App() {
  const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);
  const autosaveTimer = useRef<number | undefined>(undefined);
  const { toasts, notify, dismiss } = useToasts();
  const prefersDark = usePrefersDark();

  const [source, setSource] = useState<WorkspaceSource | "">("");
  const [saved, setSaved] = useState(listSaved);
  const [code, setCode] = useState("");
  const [tab, setTab] = useState<PanelTab>("transaction");
  const [aboutOpen, setAboutOpen] = useState(
    () => readStorage(ABOUT_SEEN_KEY) === null,
  );
  const [currentTransaction, setTransaction] =
    useState<TransactionInput>(defaultTransaction);
  const [currentEnvironment, setEnvironment] = useState<EnvironmentRow[]>([]);
  const environment = currentEnvironment;
  const [running, setRunning] = useState(false);
  const [error, setError] = useState("");
  const [output, setOutput] = useState<ExecutionItem[] | null>(null);
  const [outputFor, setOutputFor] = useState<TransactionInput | null>(null);
  const [toolboxVisible, setToolboxVisible] = useState(initialToolboxVisible);
  // Read on inject, so a re-created workspace keeps the current choice.
  const toolboxVisibleRef = useRef(toolboxVisible);

  // Width of the side panel; the handle sits between editor and panel.
  const panel = useResizable({
    storageKey: STORAGE_PREFIX + "panelWidth",
    initial: 380,
    min: 300,
    max: () => window.innerWidth * 0.6,
    axis: "x",
    direction: -1,
  });

  const loadState = useCallback((state: WorkspaceState) => {
    const workspace = workspaceRef.current;
    if (!workspace) return;
    Blockly.serialization.workspaces.load(state, workspace);
    setCode(generator.workspaceToCode(workspace));
  }, []);

  const onInject = useCallback(
    (workspace: Blockly.WorkspaceSvg) => {
      workspaceRef.current = workspace;
      applyToolboxVisible(workspace, toolboxVisibleRef.current);
      workspace.addChangeListener((event) => {
        if (event.isUiEvent) return;
        // Keep the code view in sync and autosave shortly after edits.
        setCode(generator.workspaceToCode(workspace));
        window.clearTimeout(autosaveTimer.current);
        autosaveTimer.current = window.setTimeout(
          () => writeAutosave(Blockly.serialization.workspaces.save(workspace)),
          AUTOSAVE_DELAY_MS,
        );
      });

      // Pick up where the viewer left off, or start from an example.
      const autosave = readAutosave();
      if (autosave) {
        try {
          loadState(autosave);
          const saved = readStorage(SOURCE_KEY) ?? "";
          if (/^(example|saved):/.test(saved)) {
            setSource(saved as WorkspaceSource);
          }
          return;
        } catch {
          // A broken autosave falls through to the default example.
        }
      }
      const example = examples[DEFAULT_EXAMPLE];
      if (example) {
        loadState(example.state);
        setSource(`example:${DEFAULT_EXAMPLE}`);
        // First visit: start with the write-up.
        if (example.guide) setTab("guide");
      }
    },
    [loadState],
  );

  useEffect(() => () => window.clearTimeout(autosaveTimer.current), []);
  useEffect(() => {
    writeStorage(SOURCE_KEY, source);
  }, [source]);

  // The open example's write-up, if it has one.
  const currentExample = source.startsWith("example:")
    ? examples[sourceName(source)]
    : undefined;
  const guide = currentExample?.guide;
  const activeTab: PanelTab = tab === "guide" && !guide ? "transaction" : tab;

  function toggleToolbox() {
    const visible = !toolboxVisible;
    setToolboxVisible(visible);
    toolboxVisibleRef.current = visible;
    writeStorage(TOOLBOX_KEY, String(visible));
    if (workspaceRef.current)
      applyToolboxVisible(workspaceRef.current, visible);
  }

  const hasBlocks = () =>
    (workspaceRef.current?.getTopBlocks(false).length ?? 0) > 0;
  const confirmReplace = () =>
    !hasBlocks() ||
    window.confirm(
      "Replace the current workspace? Export or save it first if you want to keep it.",
    );

  function open(next: WorkspaceSource) {
    if (!confirmReplace()) return;
    const name = sourceName(next);
    const example = next.startsWith("example:") ? examples[name] : undefined;
    const state = example ? example.state : readSaved(name);
    if (!state) {
      notify(`Could not open "${name}".`, "error");
      return;
    }
    try {
      loadState(state);
      setSource(next);
      if (example?.guide) setTab("guide");
      // Add the variables the example reads, keeping any values already set.
      const needed = example?.env ?? [];
      const missing = needed.filter(
        (variable) => !environment.some((row) => row.name === variable),
      );
      if (missing.length) {
        setEnvironment([
          ...environment,
          ...missing.map((variable) => ({ name: variable, value: "" })),
        ]);
      }
      const unset = needed.filter(
        (variable) => !environment.find((row) => row.name === variable)?.value,
      );
      notify(
        unset.length
          ? `Opened "${name}". Set ${unset.join(", ")} under Environment variables.`
          : `Opened "${name}".`,
        unset.length ? "info" : "success",
      );
    } catch (e) {
      notify(`"${name}" could not be loaded: ${(e as Error).message}`, "error");
    }
  }

  function saveAs() {
    const workspace = workspaceRef.current;
    if (!workspace) return;
    const name = window
      .prompt("Save this workspace in the browser as:", sourceName(source))
      ?.trim();
    if (!name) return;
    if (
      saved.includes(name) &&
      !window.confirm(`Replace the saved workspace "${name}"?`)
    ) {
      return;
    }
    if (writeSaved(name, Blockly.serialization.workspaces.save(workspace))) {
      setSaved(listSaved());
      setSource(`saved:${name}`);
      notify(`Saved "${name}".`);
    } else {
      notify(`Could not save "${name}".`, "error");
    }
  }

  function exportWorkspace() {
    const workspace = workspaceRef.current;
    if (!workspace) return;
    downloadWorkspace(
      sourceName(source) || "workspace",
      Blockly.serialization.workspaces.save(workspace),
    );
  }

  async function importWorkspace(file: File) {
    try {
      const state = await readWorkspaceFile(file);
      if (!confirmReplace()) return;
      loadState(state);
      setSource("");
      notify(`Imported ${file.name}.`);
    } catch (e) {
      notify((e as Error).message, "error");
    }
  }

  function clearWorkspace() {
    if (!confirmReplace()) return;
    workspaceRef.current?.clear();
    setCode("");
    setSource("");
  }

  async function run(
    transaction: TransactionInput = currentTransaction,
    environment: EnvironmentRow[] = currentEnvironment,
  ) {
    const workspace = workspaceRef.current;
    if (!workspace || running) return;
    const invalid = validateTransaction(transaction);
    if (invalid) {
      setTab("transaction");
      notify(invalid, "error");
      return;
    }
    const environmentVariables = Object.fromEntries(
      environment.filter((row) => row.name).map((row) => [row.name, row.value]),
    );
    const input = {
      ...transaction,
      merchantName: transaction.merchantName.trim(),
      merchantCity: transaction.merchantCity.trim(),
    };
    setRunning(true);
    setError("");
    try {
      setOutput(
        await simulate(
          generateRunnableCode(workspace),
          input,
          environmentVariables,
        ),
      );
      setOutputFor(input);
    } catch (e) {
      setOutput(null);
      setError((e as Error).message);
    } finally {
      setRunning(false);
      setTab("results");
    }
  }

  /** Fills in the guide's scenario and runs it. */
  function runScenario(scenario: Scenario) {
    const next = { ...defaultTransaction, ...scenario.transaction };
    let rows = environment;
    for (const [name, value] of Object.entries(scenario.env ?? {})) {
      rows = rows.some((row) => row.name === name)
        ? rows.map((row) => (row.name === name ? { ...row, value } : row))
        : [...rows, { name, value }];
    }
    setTransaction(next);
    setEnvironment(rows);
    void run(next, rows);
  }

  // Cmd/Ctrl+Enter runs from anywhere on the page.
  const onShortcut = useEffectEvent((event: KeyboardEvent) => {
    if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      void run();
    }
  });
  useEffect(() => {
    const listener = (event: KeyboardEvent) => onShortcut(event);
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, []);

  // A dot on the Results tab shows the outcome of the last run.
  const approved = output?.find(
    (item) => item.type === "before_transaction",
  )?.authorizationApproved;
  const resultsBadge =
    activeTab === "results" ? null : output ? (
      <span
        className={`size-2 rounded-full ${approved ? "bg-emerald-500" : "bg-red-500"}`}
        aria-label={approved ? "approved" : "declined"}
      />
    ) : error ? (
      <span className="size-2 rounded-full bg-red-500" aria-label="error" />
    ) : null;

  return (
    <div
      className={`flex min-h-dvh flex-col lg:h-dvh ${
        panel.dragging ? "cursor-col-resize select-none" : ""
      }`}
    >
      <Header
        examples={exampleNames}
        saved={saved}
        source={source}
        running={running}
        toolboxVisible={toolboxVisible}
        onToggleToolbox={toggleToolbox}
        onAbout={() => setAboutOpen(true)}
        onOpen={open}
        onSaveAs={saveAs}
        onImport={importWorkspace}
        onExport={exportWorkspace}
        onClear={clearWorkspace}
        onRun={() => void run()}
      />
      <main className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <BlocklyWorkspace
          className="h-[60vh] min-h-80 min-w-0 lg:h-auto lg:min-h-0 lg:flex-1"
          options={options}
          theme={prefersDark ? darkTheme : lightTheme}
          onInject={onInject}
        />
        <ResizeHandle
          resizable={panel}
          label="Resize side panel"
          className="hidden border-l border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900 lg:flex"
        />
        <SidePanel
          tab={activeTab}
          onTabChange={setTab}
          resultsBadge={resultsBadge}
          showGuide={Boolean(guide)}
          className="border-t lg:w-[var(--panel-width)] lg:shrink-0 lg:border-t-0"
          style={{ "--panel-width": `${panel.size}px` } as CSSProperties}
        >
          {activeTab === "guide" && guide && (
            <GuideView
              name={sourceName(source)}
              guide={guide}
              envNames={currentExample?.env ?? []}
              environment={environment}
              running={running}
              onRunScenario={runScenario}
              onShowEnvironment={() => setTab("transaction")}
            />
          )}
          {activeTab === "transaction" && (
            <TransactionForm
              transaction={currentTransaction}
              onTransactionChange={setTransaction}
              environment={environment}
              onEnvironmentChange={setEnvironment}
              running={running}
              onRun={() => void run()}
            />
          )}
          {activeTab === "results" && (
            <ResultsView
              items={output}
              transaction={outputFor}
              error={error}
              onShowServerHelp={() => setAboutOpen(true)}
            />
          )}
          {activeTab === "code" && (
            <CodeView code={code} onCopied={() => notify("Code copied.")} />
          )}
        </SidePanel>
      </main>
      <AboutDialog
        open={aboutOpen}
        onClose={() => {
          setAboutOpen(false);
          writeStorage(ABOUT_SEEN_KEY, "1");
        }}
      />
      <Toasts toasts={toasts} onDismiss={dismiss} />
    </div>
  );
}
