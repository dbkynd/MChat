<template>
  <div class="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-md">
    <h2 class="text-xl font-semibold mb-4">Server Status</h2>

    <div class="mb-4">
      <span class="font-medium">Main Node URL:</span>
      <span class="text-gray-700">{{ status?.config.main_node_url }}</span>
    </div>

    <DiskUsage :stats="status?.diskspace" class="mb-6" />

    <div v-if="sortedChannels?.length">
      <h3 class="text-lg font-semibold mb-2">Channels</h3>
      <div
        v-for="channel in sortedChannels"
        :key="channel.name"
        class="p-3 bg-gray-100 rounded-md mb-2"
      >
        <ChannelStats :stats="channel" />
      </div>
    </div>

    <div class="mt-6 flex justify-end">
      <button
        @click="showSetup"
        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
      >
        Back to Setup
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import api from '@/plugins/axios';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import DiskUsage from '@/components/DiskUsage.vue';
import ChannelStats from './components/ChannelStats.vue';

const emit = defineEmits(['show-setup']);

const status = ref<Status>();

function getStatus() {
  api.get<Status>('/status').then(({ data }) => {
    status.value = data;
  });
}

let timer: ReturnType<typeof setInterval>;

onMounted(() => {
  getStatus();
  timer = setInterval(getStatus, 1000 * 30);
});

onBeforeUnmount(() => {
  if (timer) clearInterval(timer);
});

const sortedChannels = computed(() => {
  return status.value?.channels.sort((a, b) => {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
  });
});

function showSetup() {
  emit('show-setup');
}
</script>
