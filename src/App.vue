<script setup>
import "./style.css";
import { onMounted, ref } from "vue";
import * as Blockly from "blockly/core";
import { javascriptGenerator } from "blockly/javascript";
import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import "highlight.js/styles/github.css";

import BlocklyComponent from "./components/BlocklyComponent.vue";
import TransactionComponent from "./components/TransactionComponent.vue";
import ButtonComponent from "./components/ButtonComponent.vue";
import DropDownComponent from "./components/DropDownComponent.vue";
import { installBlocks } from "./blocks";
import { examples } from "./examples";
import {
  InvestecToolbox,
  LogicToolbox,
  LoopsToolbox,
  MathToolbox,
  TextToolbox,
  ListsToolbox,
  VariablesToolbox,
  FunctionsToolbox,
} from "./toolbox";

// TODO: component to store env variables; upload code to a card via the API.

hljs.registerLanguage("javascript", javascript);
installBlocks({ javascript: javascriptGenerator });

// Card simulator (https://github.com/devinpearson/investec-card-server).
// Override with VITE_SIMULATOR_URL in a .env.local file.
const SIMULATOR_URL =
  import.meta.env.VITE_SIMULATOR_URL ?? "http://localhost:3010";
const STORAGE_PREFIX = "investec-blockly:";

const blockly = ref();
const code = ref("");
const outputRef = ref();
const workspaceName = ref("Petrol Card");
const status = ref("");
const simulationError = ref("");
const running = ref(false);
const exampleNames = Object.keys(examples);

const options = {
  media: "media/",
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

const workspace = () => blockly.value.workspace;

function showCode() {
  const codeText = javascriptGenerator.workspaceToCode(workspace());
  code.value = hljs.highlight(codeText, { language: "javascript" }).value;
}

function setStatus(message) {
  status.value = message;
}

function storageKey(name) {
  return STORAGE_PREFIX + name;
}

async function runCode(transaction) {
  // Generate the code with an infinite-loop guard. The trap is evaluated by
  // the simulator, so it must not depend on browser globals like `window`.
  javascriptGenerator.INFINITE_LOOP_TRAP =
    'if (--LoopTrap < 0) throw new Error("Infinite loop.");\n';
  let generated;
  try {
    generated = javascriptGenerator.workspaceToCode(workspace());
  } finally {
    javascriptGenerator.INFINITE_LOOP_TRAP = null;
  }
  const usesTrap = generated.includes("LoopTrap");
  const source = (usesTrap ? "let LoopTrap = 1000;\n" : "") + generated;

  running.value = true;
  simulationError.value = "";
  try {
    const response = await fetch(`${SIMULATOR_URL}/simulate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transaction, code: encodeURI(source) }),
    });
    if (!response.ok) {
      throw new Error(`Simulator returned ${response.status}`);
    }
    outputRef.value = await response.json();
  } catch (e) {
    outputRef.value = undefined;
    simulationError.value =
      e instanceof TypeError
        ? `Could not reach the simulator at ${SIMULATOR_URL}. Is investec-card-server running?`
        : e.message;
  } finally {
    running.value = false;
  }
}

function saveWorkspace() {
  const state = Blockly.serialization.workspaces.save(workspace());
  try {
    localStorage.setItem(
      storageKey(workspaceName.value),
      JSON.stringify(state),
    );
    setStatus(`Saved "${workspaceName.value}".`);
  } catch (e) {
    setStatus(`Could not save: ${e.message}`);
  }
}

function loadWorkspace() {
  let saved = null;
  try {
    // Fall back to the un-prefixed key used by earlier versions.
    saved =
      localStorage.getItem(storageKey(workspaceName.value)) ??
      localStorage.getItem(workspaceName.value);
  } catch {
    // Storage unavailable (private mode, blocked site data).
  }
  if (!saved) {
    setStatus(`No saved workspace named "${workspaceName.value}".`);
    return;
  }
  try {
    Blockly.serialization.workspaces.load(JSON.parse(saved), workspace());
    showCode();
    setStatus(`Loaded "${workspaceName.value}".`);
  } catch (e) {
    setStatus(`Saved workspace is invalid: ${e.message}`);
  }
}

function loadExample() {
  const example = examples[workspaceName.value];
  if (!example) return;
  Blockly.serialization.workspaces.load(example, workspace());
  showCode();
  setStatus(`Loaded the "${workspaceName.value}" example.`);
}

function clearWorkspace() {
  workspace().clear();
  showCode();
  setStatus("");
}

onMounted(() => {
  // Keep the code preview in sync with the blocks.
  workspace().addChangeListener((event) => {
    if (event.isUiEvent) return;
    showCode();
  });
  loadExample();
  setStatus("");
});
</script>

<template>
  <div class="mx-2 py-2">
    <h1 class="text-3xl font-bold leading-tight tracking-tight text-gray-900">
      Programmable Card Simulation
    </h1>
    <div class="mt-2 flex flex-col gap-4 lg:flex-row lg:items-start">
      <div class="min-w-0 flex-1">
        <BlocklyComponent
          class="h-[600px] w-full"
          :options="options"
          ref="blockly"
        ></BlocklyComponent>
        <div class="mt-2 overflow-hidden rounded-lg bg-gray-50">
          <div class="px-4 py-5 sm:p-6">
            <div class="flex flex-wrap items-center gap-2">
              <drop-down-component
                v-model:workspaceName="workspaceName"
                :options="exampleNames"
              ></drop-down-component>
              <button-component
                message="Load Example"
                @onButtonClick="loadExample"
              ></button-component>
              <button-component
                message="Save Workspace"
                @onButtonClick="saveWorkspace"
              ></button-component>
              <button-component
                message="Load Workspace"
                @onButtonClick="loadWorkspace"
              ></button-component>
              <button-component
                message="Clear Workspace"
                @onButtonClick="clearWorkspace"
              ></button-component>
              <span class="text-sm text-gray-600" aria-live="polite">{{
                status
              }}</span>
            </div>
            <h2 class="mt-4 text-sm font-semibold text-gray-900">
              Generated JavaScript
            </h2>
            <pre
              v-html="code"
              class="mt-2 overflow-x-auto rounded bg-white p-3 text-sm"
            ></pre>
          </div>
        </div>
      </div>
      <transaction-component
        class="w-full lg:w-80 lg:shrink-0"
        v-model:outputRef="outputRef"
        :running="running"
        :error="simulationError"
        @on-simulate="runCode"
      ></transaction-component>
    </div>
  </div>
</template>

<style>
svg[display="none"] {
  display: none;
}
</style>
