<script setup>
import { reactive } from "vue";
import OutputComponent from "./OutputComponent.vue";

const outputRef = defineModel("outputRef");
defineProps({ running: Boolean, error: String });
const emit = defineEmits(["onSimulate"]);

const transaction = reactive({
  currencyCode: "zar",
  centsAmount: 1000,
  merchantCode: "0000",
  merchantName: "Test Merchant",
  merchantCity: "Cape Town",
  merchantCountry: "ZA",
});

const fields = [
  { name: "currencyCode", label: "Currency", placeholder: "zar" },
  {
    name: "centsAmount",
    label: "Amount (cents)",
    placeholder: "1000",
    type: "number",
  },
  { name: "merchantCode", label: "Merchant Code", placeholder: "5542" },
  { name: "merchantName", label: "Merchant Name", placeholder: "Shell" },
  { name: "merchantCity", label: "Merchant City", placeholder: "Cape Town" },
  { name: "merchantCountry", label: "Merchant Country", placeholder: "ZA" },
];

const onSubmit = () => {
  emit("onSimulate", { ...transaction });
};
</script>

<template>
  <div class="overflow-hidden rounded-lg bg-white shadow">
    <div class="px-4 py-5 sm:p-6">
      <form @submit.prevent="onSubmit">
        <div class="border-b border-gray-900/10 pb-6">
          <h2 class="text-base font-semibold leading-7 text-gray-900">
            Simulate Transaction
          </h2>
          <p class="mt-1 text-sm leading-6 text-gray-600">
            Runs the workspace code against this transaction on the card
            simulator.
          </p>
          <div v-for="field in fields" :key="field.name" class="mt-3">
            <label
              :for="field.name"
              class="block text-sm font-medium leading-6 text-gray-900"
              >{{ field.label }}</label
            >
            <input
              v-if="field.type === 'number'"
              :id="field.name"
              :name="field.name"
              type="number"
              min="0"
              step="1"
              :placeholder="field.placeholder"
              v-model.number="transaction[field.name]"
              required
              class="mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
            <input
              v-else
              :id="field.name"
              :name="field.name"
              type="text"
              :placeholder="field.placeholder"
              v-model.trim="transaction[field.name]"
              required
              class="mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
          <button
            type="submit"
            :disabled="running"
            class="mt-4 rounded bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-wait disabled:opacity-50"
          >
            {{ running ? "Running…" : "Run Transaction" }}
          </button>
        </div>
      </form>
      <div class="mt-4">
        <p v-if="error" role="alert" class="mb-2 text-sm text-red-600">
          {{ error }}
        </p>
        <output-component v-model="outputRef"></output-component>
      </div>
    </div>
  </div>
</template>
