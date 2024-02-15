<script setup>

import { onMounted } from "vue";

const props = defineProps(["options"]);

onMounted(() => {
//   const options = props.options || {};

//   console.log(executionItems)
//         executionItems.forEach((item) => {
//         console.log('\n💻 ', item.type);
//         item.logs.forEach((log) => {
//         console.log('\n', log.level, log.content);
});
</script>

<template>
    <div>
      <h1>Fetched Data:</h1>
      <ul v-if="props.options">
        <li v-for="item in props.options" :key="item.id">{{ item.type }}</li>
      </ul>
      <p v-else>Loading...</p>
    </div>
  </template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.blocklyDiv {
  height: 100%;
  width: 100%;
  text-align: left;
}
</style>
