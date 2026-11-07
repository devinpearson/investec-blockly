<script setup>
/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Blockly Vue Component.
 * @author dcoodien@gmail.com (Dylan Coodien)
 */

import { onBeforeUnmount, onMounted, ref, shallowRef } from "vue";
// The full package (not blockly/core) registers the built-in blocks and messages.
import * as Blockly from "blockly";
import Theme from "@blockly/theme-modern";

const props = defineProps({ options: { type: Object, default: () => ({}) } });
const blocklyToolbox = ref();
const blocklyDiv = ref();
const workspace = shallowRef();
let resizeObserver;

defineExpose({ workspace });

onMounted(() => {
  // Copy so we don't mutate the parent's options object.
  const options = { theme: Theme, ...props.options };
  if (!options.toolbox) {
    options.toolbox = blocklyToolbox.value;
  }
  workspace.value = Blockly.inject(blocklyDiv.value, options);

  // Keep the SVG sized to its container when the layout changes.
  resizeObserver = new ResizeObserver(() => {
    if (workspace.value) Blockly.svgResize(workspace.value);
  });
  resizeObserver.observe(blocklyDiv.value);
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  workspace.value?.dispose();
});
</script>

<template>
  <div>
    <div class="h-full w-full text-left" ref="blocklyDiv"></div>
    <xml ref="blocklyToolbox" style="display: none">
      <slot></slot>
    </xml>
  </div>
</template>
