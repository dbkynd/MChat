<template>
  <div>
    <input
      type="text"
      v-model="channel"
      class="p-1 bg-gray-600 rounded text-white focus:outline-none w-full"
    />
    <input
      type="text"
      v-model="date"
      class="p-1 bg-gray-600 rounded text-white focus:outline-none w-full"
    />
    <button class="bg-blue-500 hover:bg-blue-600 px-2 py-1 rounded text-sm" @click="process">
      Process
    </button>
  </div>
</template>

<script setup lang="ts">
import api from '@/plugins/axios.js';
import { ref } from 'vue';

const channel = ref('');
const date = ref('');

function process() {
  api.post('/sync', { channel: channel.value, date: date.value });
}
</script>
