<script setup>
// Key/value rows sent to the simulator as environmentVariables, which the
// card code reads from process.env. Kept in memory only, so secrets such as
// webhook URLs and tokens are not written to browser storage.
const rows = defineModel({ type: Array, required: true });

const addRow = () => rows.value.push({ name: "", value: "" });
const removeRow = (index) => rows.value.splice(index, 1);

const inputClass =
  "block w-full min-w-0 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6";
</script>

<template>
  <fieldset class="mt-6">
    <legend class="text-sm font-semibold leading-6 text-gray-900">
      Environment Variables
    </legend>
    <p class="text-xs leading-5 text-gray-600">
      Read in blocks with <code>env</code>. Not saved — re-enter after a reload.
    </p>
    <div
      v-for="(row, index) in rows"
      :key="index"
      class="mt-2 flex items-center gap-2"
    >
      <input
        v-model.trim="row.name"
        :aria-label="`Variable ${index + 1} name`"
        placeholder="NAME"
        spellcheck="false"
        autocomplete="off"
        :class="[inputClass, 'basis-2/5 font-mono']"
      />
      <input
        v-model="row.value"
        :aria-label="`Variable ${index + 1} value`"
        placeholder="value"
        spellcheck="false"
        autocomplete="off"
        :class="[inputClass, 'basis-3/5']"
      />
      <button
        type="button"
        :aria-label="`Remove variable ${row.name || index + 1}`"
        class="rounded px-2 py-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
        @click="removeRow(index)"
      >
        ×
      </button>
    </div>
    <button
      type="button"
      class="mt-2 text-sm font-medium text-indigo-600 hover:text-indigo-500"
      @click="addRow"
    >
      + Add variable
    </button>
  </fieldset>
</template>
