<script setup>
const code = defineModel();
const workspaceName = defineModel();
</script>

<template>
  <div class="bg-amber-100">
    <button-component
      message="Show JavaScript"
      @onButtonClick="showCode"
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
    <drop-down-component
      v-model:workspaceName="workspaceName"
    ></drop-down-component>
    <pre v-html="code"></pre>
  </div>
</template>
