<script setup>
const workspaceName = defineModel("workspaceName");
defineProps({ options: { type: Array, required: true } });
</script>
<template>
  <label for="workspaceName" class="sr-only">Workspace</label>
  <select
    id="workspaceName"
    v-model="workspaceName"
    name="workspaceName"
    class="rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
  >
    <option v-for="option in options" :key="option">{{ option }}</option>
  </select>
</template>
