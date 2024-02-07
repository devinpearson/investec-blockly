<script setup>
/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Main Vue component that includes the Blockly component.
 * @author dcoodien@google.com (Dylan Coodien)
 */

import { ref } from "vue";
import BlocklyComponent from "./components/BlocklyComponent.vue";
import "./blocks";
import { InvestecToolbox, LogicToolbox, LoopsToolbox, MathToolbox, TextToolbox, ListsToolbox, VariablesToolbox, FunctionsToolbox} from "./toolbox";
import { javascriptGenerator } from "blockly/javascript";

const foo = ref();
const code = ref();
const options = {
  media: "media/",
  grid: {
    spacing: 25,
    length: 3,
    colour: "#ccc",
    snap: true,
  },
  toolbox: {
    "kind": "categoryToolbox",
    "contents": [
    InvestecToolbox,
    LogicToolbox,
    LoopsToolbox,
    MathToolbox,
    TextToolbox,
    ListsToolbox,
    VariablesToolbox,
    FunctionsToolbox,
    ]
  },
};

const showCode = () => (code.value = javascriptGenerator.workspaceToCode(foo.value.workspace));
const runCode = () => {
      // Generate JavaScript code and run it.
      window.LoopTrap = 1000;
      javascriptGenerator.INFINITE_LOOP_TRAP =
          'if (--window.LoopTrap < 0) throw "Infinite loop.";\n';
      var code = javascriptGenerator.workspaceToCode(foo.value.workspace);
      javascriptGenerator.INFINITE_LOOP_TRAP = null;
      try {
        eval(code);
      } catch (e) {
        alert(e);
      }
    }
</script>

<template>
  <div id="app">

    <BlocklyComponent id="blockly2" :options="options" ref="foo"></BlocklyComponent>
    <p id="code">
      <button v-on:click="showCode()">Show JavaScript</button>
      <button v-on:click="runCode()">Run Code</button>
      <pre v-html="code"></pre>
    </p>
  </div>
</template>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

html,
body {
  margin: 0;
}

#code {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 50%;
  margin: 0;
  background-color: beige;
}

#blockly1 {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 50%;
  height: 50%;
}

#blockly2 {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 50%;
}
</style>
