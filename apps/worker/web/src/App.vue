<template>
  <div v-if="loaded">
    <SetupView v-if="showSetup" :main-node-url="mainNodeUrl" />
    <StatsView v-else @show-setup="showSetup = true" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import SetupView from './SetupView.vue';
import StatsView from './StatsView.vue';
import api from '@/plugins/axios';

const loaded = ref(false);
const showSetup = ref(true);
const mainNodeUrl = ref('');

onMounted(() => {
  api
    .get<WorkerConfig>('/config')
    .then(({ data }) => {
      mainNodeUrl.value = data.main_node_url;
      showSetup.value = !mainNodeUrl.value;
    })
    .finally(() => (loaded.value = true));
});
</script>
