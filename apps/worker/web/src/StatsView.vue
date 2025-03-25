<template>
  <div class="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-md min-w-[400px]">
    <h2 class="text-xl font-semibold mb-4">Server Status</h2>

    <div>
      <span>Main Node URL:</span>
      <span class="text-gray-700 ml-2">{{ status?.config.main_node_url }}</span>
      <span class="ml-1">
        <span v-if="status?.connections.mainNode">🟢</span>
        <span v-else>⚫</span>
      </span>
    </div>
    <div class="mb-4">
      Uptime:
      <span class="text-gray-700">
        {{ status?.uptime }}
      </span>
    </div>

    <DiskUsage :stats="status?.diskspace" class="mb-6" />

    <div v-if="sortedChannels?.length">
      <h3 class="text-lg font-semibold mb-2">Channels</h3>
      <div
        v-for="channel in sortedChannels"
        :key="channel.name"
        class="p-3 rounded-md mb-2"
        :class="errorState(channel)"
      >
        <ChannelStats :stats="channel" />
      </div>
    </div>

    <div class="mt-6 flex justify-end">
      <MyButton color="blue" @click="showSetup"> Back to Setup </MyButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MyButton } from '@repo/ui';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import ChannelStats from '@/components/ChannelStats.vue';
import DiskUsage from '@/components/DiskUsage.vue';
import api from '@/plugins/axios';

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

// Sort channels based on connection, database presence, logs, then alphabetically
const sortedChannels = computed(() => {
  return [...(status.value?.channels || [])].sort((a, b) => {
    return (
      Number(b.isConnected) - Number(a.isConnected) ||
      Number(b.inDatabase) - Number(a.inDatabase) ||
      Number(b.hasLogs) - Number(a.hasLogs) ||
      a.name.localeCompare(b.name)
    );
  });
});

function showSetup() {
  emit('show-setup');
}

function errorState(channel: ChannelStats) {
  const isInError = channel.inDatabase && !channel.isConnected;
  return isInError ? 'bg-red-200' : 'bg-gray-100';
}
</script>
