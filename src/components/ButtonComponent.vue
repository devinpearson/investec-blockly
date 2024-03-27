<script setup>
const emit = defineEmits(["onButtonClick"]);

defineProps({
  message: String,
});

const onButtonClick = () => {
  emit("onButtonClick");
};
</script>

<template>
  <button
    v-on:click="onButtonClick()"
    type="button"
    class="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
  >
    {{ message }}
  </button>
</template>
