<template>
  <DiskUsage :stats="status?.diskspace" />
  <div v-for="channel in sortedChannels" :key="channel.name">
    <ChannelStats :stats="channel" />
  </div>
</template>

<script setup lang="ts">
import api from '@/plugins/axios';
import { computed, onMounted, ref } from 'vue';
import DiskUsage from '@/components/DiskUsage.vue';
import ChannelStats from './components/ChannelStats.vue';

const status = ref<Status>();

function getStatus() {
  api.get<Status>('/status').then(({ data }) => {
    status.value = data;
  });
}

onMounted(() => {
  getStatus();
  setInterval(getStatus, 1000 * 15);
});

const sortedChannels = computed(() => {
  return status.value?.channels.sort((a, b) => {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
  });
});
</script>

<style scoped></style>
