<template>
  <div>Hello World</div>
</template>

<script setup lang="ts">
import api from '@/plugins/axios';
import { onMounted, ref } from 'vue';

const status = ref<Status>({
  module: 'worker',
  system_ts: Date.now(),
  uptime: '',
});

function getStatus() {
  api.get<Status>('/status').then(({ data }) => {
    status.value = data;
  });
}

onMounted(() => {
  getStatus();
  setInterval(getStatus, 1000 * 15);
});
</script>

<style scoped></style>
