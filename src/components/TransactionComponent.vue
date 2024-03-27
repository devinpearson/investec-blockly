<script setup>
import { reactive } from "vue";
import OutputComponent from "./OutputComponent.vue";
// const transaction = defineModel("transaction");
const outputRef = defineModel("outputRef");

const transaction = reactive({
  currencyCode: "zar",
  centsAmount: 1000,
  merchantCode: "0000",
  merchantName: "Test Merchant",
  merchantCity: "Cape Town",
  merchantCountry: "ZA",
});

const emit = defineEmits(["onSimulate"]);

const onSubmit = () => {
  emit("onSimulate", transaction);
};
</script>

<template>
  <div class="absolute top-0 right-0">
    <div class="overflow-hidden rounded-lg bg-white shadow">
      <div class="px-4 py-5 sm:p-6">
        <form @submit.prevent="onSubmit">
          <div class="space-y-12">
            <div class="border-b border-gray-900/10 pb-12">
              <h2 class="text-base font-semibold leading-7 text-gray-900">
                Simulate Transaction
              </h2>
              <p class="mt-1 text-sm leading-6 text-gray-600">
                This information will be displayed publicly so be careful what
                you share.
              </p>
              <div>
                <label
                  for="currencyCode"
                  class="block text-sm font-medium leading-6 text-gray-900"
                  >Currency</label
                >
                <div class="mt-2">
                  <input
                    type="text"
                    name="currencyCode"
                    id="currencyCode"
                    class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder="ZAR"
                    v-model="transaction.currencyCode"
                    required
                  />
                </div>
              </div>
              <div>
                <label
                  for="centsAmount"
                  class="block text-sm font-medium leading-6 text-gray-900"
                  >Amount</label
                >
                <div class="mt-2">
                  <input
                    type="text"
                    name="centsAmount"
                    id="centsAmount"
                    class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder="ZAR"
                    v-model="transaction.centsAmount"
                    required
                  />
                </div>
              </div>
              <div>
                <label
                  for="merchantCode"
                  class="block text-sm font-medium leading-6 text-gray-900"
                  >Merchant Code</label
                >
                <div class="mt-2">
                  <input
                    type="text"
                    name="merchantCode"
                    id="merchantCode"
                    class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder="ZAR"
                    v-model="transaction.merchantCode"
                    required
                  />
                </div>
              </div>
              <div>
                <label
                  for="merchantName"
                  class="block text-sm font-medium leading-6 text-gray-900"
                  >Merchant Name</label
                >
                <div class="mt-2">
                  <input
                    type="text"
                    name="merchantName"
                    id="merchantName"
                    class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder="ZAR"
                    v-model="transaction.merchantName"
                    required
                  />
                </div>
              </div>
              <div>
                <label
                  for="merchantCity"
                  class="block text-sm font-medium leading-6 text-gray-900"
                  >Merchant City</label
                >
                <div class="mt-2">
                  <input
                    type="text"
                    name="merchantCity"
                    id="merchantCity"
                    class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder="ZAR"
                    v-model="transaction.merchantCity"
                    required
                  />
                </div>
              </div>
              <div>
                <label
                  for="merchantCountry"
                  class="block text-sm font-medium leading-6 text-gray-900"
                  >Merchant Country</label
                >
                <div class="mt-2">
                  <input
                    type="text"
                    name="merchantCountry"
                    id="merchantCountry"
                    class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder="ZAR"
                    v-model="transaction.merchantCountry"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                class="rounded bg-white px-2 mt-2 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                Run Transaction
              </button>
            </div>
          </div>
        </form>
        <output-component v-model="outputRef"></output-component>
      </div>
    </div>
  </div>
</template>
