<template>
  <div v-if="loaded">
    <StatsView v-if="hasApiUrl" @doSetup="doSetup" />
    <SetupView v-else />
  </div>
</template>

<script setup lang="ts">
import api from '@/plugins/axios';
import { onMounted, ref } from 'vue';
import SetupView from './SetupView.vue';
import StatsView from './StatsView.vue';

const loaded = ref(false);
const hasApiUrl = ref(false);

function getStatus() {
  api
    .get<{ ready: boolean }>('/ready')
    .then(({ data }) => {
      hasApiUrl.value = data.ready;
    })
    .finally(() => (loaded.value = true));
}

onMounted(() => {
  getStatus();
});

function doSetup() {
  hasApiUrl.value = false;
}
</script>

<style scoped></style>
