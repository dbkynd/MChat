<template>
  <div>
    <input
      v-model="channel"
      type="text"
      class="p-1 bg-gray-600 rounded text-white focus:outline-none w-full mb-2"
      placeholder="Channel"
    />
    <input
      v-model="date"
      type="text"
      class="p-1 bg-gray-600 rounded text-white focus:outline-none w-full mb-2"
      placeholder="Date"
    />
    <button
      class="bg-blue-500 hover:bg-blue-600 px-2 py-1 rounded text-sm text-white"
      @click="process"
    >
      Process
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import api from '@/plugins/axios.js';

const channel = ref('');
const date = ref('');

function process() {
  api.post('/sync', { channel: channel.value, date: date.value });
}
</script>
