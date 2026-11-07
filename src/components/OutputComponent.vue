<script setup>
const outputRef = defineModel();
</script>

<template>
  <h2 class="text-base font-semibold leading-7 text-gray-900">
    Simulation Response:
  </h2>
  <ul v-if="outputRef?.length" class="space-y-2">
    <li v-for="(item, i) in outputRef" :key="item.id ?? i">
      <h3 class="text-sm font-medium text-gray-900">{{ item.type }}</h3>
      <ul class="list-disc pl-4 text-sm text-gray-700">
        <li v-for="(log, j) in item.logs" :key="log.id ?? j">
          {{ log.level }}: {{ log.content }}
        </li>
      </ul>
    </li>
  </ul>
  <p v-else class="text-sm text-gray-500">...run simulation to see results</p>
</template>
