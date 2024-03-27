<script setup>
const outputRef = defineModel();
</script>

<template>
  <h2 class="text-base font-semibold leading-7 text-gray-900">
    Simulation Response:
  </h2>
  <ul v-if="outputRef">
    <li v-for="item in outputRef" :key="item.id">
      <h2>{{ item.type }}</h2>
      <ul class="list-disc pl-4" v-for="log in item.logs" :key="log.id">
        <li>{{ log.level }}: {{ log.content }}</li>
      </ul>
    </li>
  </ul>
  <p v-else>...run simulation to see results</p>
</template>
