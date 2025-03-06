<template>
  <div class="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-md">
    <h2 class="text-xl font-semibold mb-4">Worker Node Setup</h2>

    <form @submit.prevent="validateAndSubmit">
      <label for="apiUrl" class="block font-medium mb-1">API URL:</label>
      <input
        id="apiUrl"
        v-model="apiUrl"
        type="text"
        class="w-full p-2 border rounded-md"
        required
      />

      <p v-if="apiError" class="text-red-600 mt-2">{{ apiError }}</p>

      <button
        type="submit"
        class="w-full mt-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        :disabled="isCheckingUrl"
      >
        {{ isCheckingUrl ? 'Checking...' : 'Submit' }}
      </button>
    </form>

    <!-- Dialog for API Unreachable -->
    <div
      v-if="showDialog"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div class="bg-white p-6 rounded-md shadow-lg max-w-sm">
        <h3 class="text-lg font-semibold">API Unreachable</h3>
        <p class="mt-2">The API URL did not respond. Do you want to retry or submit anyway?</p>

        <div class="mt-4 flex justify-end space-x-3">
          <button class="px-4 py-2 bg-gray-300 rounded-md" @click="showDialog = false">
            Cancel
          </button>
          <button
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            @click="retryCheck"
          >
            Retry
          </button>
          <button
            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            @click="forceSubmit"
          >
            Submit Anyway
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';
import api from '@/plugins/axios';

const apiUrl = ref('');
const isCheckingUrl = ref(false);
const apiError = ref('');
const showDialog = ref(false);

const validateAndSubmit = async () => {
  apiError.value = '';
  isCheckingUrl.value = true;

  try {
    await axios.get(apiUrl.value, { timeout: 5000 });
    console.log('API URL is reachable. Submitting...');
    submitConfig();
  } catch (error) {
    apiError.value = 'Unable to reach API. Please check the URL.';
    showDialog.value = true;
  } finally {
    isCheckingUrl.value = false;
  }
};

const retryCheck = async () => {
  isCheckingUrl.value = true;
  apiError.value = '';

  try {
    await axios.get(apiUrl.value, { timeout: 5000 });
    console.log('API URL is now reachable. Submitting...');
    showDialog.value = false;
    submitConfig();
  } catch (error) {
    apiError.value = 'Still unable to reach API. Please check the URL.';
  } finally {
    isCheckingUrl.value = false;
  }
};

const forceSubmit = () => {
  showDialog.value = false;
  submitConfig();
};

const submitConfig = () => {
  console.log('Submitting configuration...');
  api.post('api_url', { api_url: apiUrl.value }).then(() => {
    window.location.reload();
  });
};
</script>

<style scoped></style>
