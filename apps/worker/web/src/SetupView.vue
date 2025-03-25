<template>
  <div class="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-md">
    <h2 class="text-xl font-semibold mb-4">Worker Node Setup</h2>

    <form @submit.prevent="validateAndSubmit">
      <label for="mainNodeUrl" class="block font-medium mb-1">Main Node URL:</label>
      <input
        id="mainNodeUrl"
        v-model="mainNodeUrl"
        type="text"
        class="w-full p-2 border rounded-md"
        required
        @blur="validateUrl"
      />

      <p v-if="urlError" class="text-red-600 mt-1">{{ urlError }}</p>
      <p v-if="apiError" class="text-red-600 mt-1">{{ apiError }}</p>

      <button
        type="submit"
        class="w-full mt-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        :disabled="isCheckingUrl || !!urlError"
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
        <h3 class="text-lg font-semibold">Main Node Unreachable</h3>
        <p class="mt-2">The Main Node did not respond. Do you want to retry or submit anyway?</p>

        <div class="mt-4 flex justify-end space-x-3">
          <button class="px-4 py-2 bg-gray-300 rounded-md" @click="showDialog = false">
            Cancel
          </button>
          <button
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            @click="validateAndSubmit"
          >
            Retry
          </button>
          <button
            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            @click="submitConfig"
          >
            Submit Anyway
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import logger from 'loglevel';
import { ref } from 'vue';
import api from '@/plugins/axios';

const props = defineProps<{
  mainNodeUrl: string;
}>();

const mainNodeUrl = ref(props.mainNodeUrl || '');
const isCheckingUrl = ref(false);
const apiError = ref('');
const urlError = ref('');
const showDialog = ref(false);
const urlPattern = /^(https?:\/\/)([\w.-]+|\d{1,3}(\.\d{1,3}){3})(:\d+)?(\/.*)?$/;

const validateUrl = () => {
  urlError.value = '';
  if (!mainNodeUrl.value) return;
  if (!urlPattern.test(mainNodeUrl.value)) {
    urlError.value = 'Invalid URL format.';
  }
};

async function validateAndSubmit() {
  showDialog.value = false;

  validateUrl();
  if (urlError.value) return;

  apiError.value = '';
  isCheckingUrl.value = true;

  try {
    const registrationEndpoint = mainNodeUrl.value.replace(/\/$/, '') + '/api';
    await axios.get(registrationEndpoint, { timeout: 5000 });
    submitConfig();
  } catch (error) {
    logger.error('Unable to reach the Main Node', error);
    apiError.value = 'Unable to reach the Main Node. Please check the URL.';
    showDialog.value = true;
  } finally {
    isCheckingUrl.value = false;
  }
}

const submitConfig = () => {
  const config: WorkerConfigUpdate = { main_node_url: mainNodeUrl.value };

  api.post('/config', config).then(() => {
    window.location.reload();
  });
};
</script>
