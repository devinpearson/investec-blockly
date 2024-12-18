<script setup>
const workspaceName = defineModel("workspaceName");
</script>
<template>
  <select
    id="workspaceName"
    v-model="workspaceName"
    name="workspaceName"
    class="mt-2 rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
  >
    <option>Default</option>
    <option>Petrol Card</option>
    <option>Amount</option>
  </select>
</template>
