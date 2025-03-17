<template>
  <div v-if="status === state.OK">✅</div>
  <div v-else-if="status === state.ERROR">❌</div>
  <div v-else>⚠️</div>
</template>

<script setup lang="ts">
import api from '@/plugins/axios.js';
import { onMounted, ref } from 'vue';

const props = defineProps<{
  url: string;
}>();

const status = ref<state>();
enum state {
  OK,
  ERROR,
  NOT_WORKER,
  MISSING_CHANNELS,
}

onMounted(() => checkStatus());

function checkStatus() {
  api
    .get<Status>(props.url + '/api/status')
    .then(({ data }) => {
      if (data.module !== 'worker') {
        status.value = state.NOT_WORKER;
        return;
      }
      const channels = data.channels;

      status.value = state.OK;
    })
    .catch((err) => {
      console.error(err);
      status.value = state.ERROR;
    });
}
</script>
