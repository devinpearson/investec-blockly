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
import "./blocks/investec";

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
    {
      "kind": "category",
      "name": "Investec",
      "colour": "#5C81A6",
      "contents": [
        {
          "kind": "block",
          "type": "investec_card_before_transaction"
        },
        {
          "kind": "block",
          "type": "investec_card_after_transaction"
        },
        {
          "kind": "block",
          "type": "investec_card_after_decline"
        },
        {
          "kind": "block",
          "type": "investec_currencies"
        },
        {
          "kind": "block",
          "type": "investec_auth_value"
        },
        {
          "kind": "block",
          "type": "investec_trans_value"
        },
        {
          "kind": "block",
          "type": "investec_console_log"
        },
        {
          "kind": "block",
          "type": "investec_before_transaction_return"
        }
        // {
        //   "kind": "block",
        //   "type": "investec_init"
        // }
      ]
    },
    {
      "kind": "category",
      "name": "Logic",
      "categorystyle":"logic_category",
      "contents": [
        {
          "kind": "block",
          "type": "controls_if"
        },
        {
          "kind": "block",
          "type": "logic_compare"
        },
        {
          "kind": "block",
          "type": "logic_operation"
        },
        {
          "kind": "block",
          "type": "logic_negate"
        },
        {
          "kind": "block",
          "type": "logic_boolean"
        }
      ]
    },
    {
      "kind": "category",
      "name": "Loops",
      "categorystyle":"loop_category",
      "contents": [
        {
          "kind": "block",
          "type": "controls_if"
        },
        {
            "kind":"block",
            "type":"controls_repeat_ext",
            "inputs":{
                "TIMES":{
                "block":{
                    "type":"math_number",
                    "fields":{
                    "NUM":10
                    }
                }
                }
            }
            },
        {
          "kind": "block",
          "type": "controls_whileUntil"
        },
        {
          "kind": "block",
          "type": "controls_for"
        },
        {
          "kind": "block",
          "type": "controls_forEach"
        },
        {
          "kind": "block",
          "type": "controls_flow_statements"
        }
      ]
    },
    {
      "kind": "category",
      "name": "Math",
      "categorystyle":"math_category",
      "contents": [
        {
          "kind": "block",
          "type": "math_number",
          "fields": {
            "NUM": 123
          }
        },
        {
          "kind": "block",
          "type": "math_arithmetic"
        },
        {
          "kind": "block",
          "type": "math_single"
        },
        {
                "kind":"block",
                "type":"math_random_int",
                "inputs":{
                  "FROM":{
                    "block":{
                      "type":"math_number",
                      "fields":{
                        "NUM":1
                      }
                    }
                  },
                  "TO":{
                    "block":{
                      "type":"math_number",
                      "fields":{
                        "NUM":100
                      }
                    }
                  }
                }
            }
      ]
    },
    {
      "kind": "category",
      "name": "Text",
      "categorystyle":"text_category",
      "contents": [
        {
          "kind": "block",
          "type": "text"
        },
        {
          "kind": "block",
          "type": "text_length"
        },
        {
          "kind": "block",
          "type": "text_print"
        },
      ]
    },
    {
            "kind":"category",
            "name":"Lists",
            "categorystyle":"list_category",
            "contents":[
              {
                "kind":"block",
                "type":"lists_create_empty"
              },
              {
                "kind":"block",
                "type":"lists_create_with",
                "extraState":{
                  "itemCount":3
                }
              },
              {
                "kind":"block",
                "type":"lists_repeat",
                "inputs":{
                  "NUM":{
                    "block":{
                      "type":"math_number",
                      "fields":{
                        "NUM":5
                      }
                    }
                  }
                }
              },
              {
                "kind":"block",
                "type":"lists_length"
              },
              {
                "kind":"block",
                "type":"lists_isEmpty"
              },
              {
                "kind":"block",
                "type":"lists_indexOf",
                "fields":{
                  "END":"FIRST"
                }
              },
              {
                "kind":"block",
                "type":"lists_getIndex",
                "fields":{
                  "MODE":"GET",
                  "WHERE":"FROM_START"
                }
              },
              {
                "kind":"block",
                "type":"lists_setIndex",
                "fields":{
                  "MODE":"SET",
                  "WHERE":"FROM_START"
                }
              },
            ]
          },
          {
            "kind":"category",
            "name":"Variables",
            "categorystyle":"variable_category",
            "custom":"VARIABLE"
          },
          {
            "kind":"category",
            "name":"Functions",
            "categorystyle":"procedure_category",
            "custom":"PROCEDURE"
          },
    ]
  },
};

const showCode = () => (code.value = javascriptGenerator.workspaceToCode(foo.value.workspace));
</script>

<template>
  <div id="app">

    <BlocklyComponent id="blockly2" :options="options" ref="foo"></BlocklyComponent>
    <p id="code">
      <button v-on:click="showCode()">Show JavaScript</button>
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
