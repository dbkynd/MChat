<template>
  <div v-if="currentState === state.OK">✅</div>
  <div v-else-if="currentState === state.ERROR">❌</div>
  <div v-else>
    <span :title="warningTooltip">⚠️</span>
  </div>
</template>

<script setup lang="ts">
import { arraysMatchUnordered } from '@repo/utilities/arrays';
import axios from 'axios';
import logger from 'loglevel';
import { computed, onMounted, ref } from 'vue';
import { useChannelStore } from '@/stores/channel_store';

const props = defineProps<{
  uri: string;
}>();

const channelStore = useChannelStore();

const currentState = ref<state>();
enum state {
  OK,
  ERROR,
  NOT_WORKER,
  MISSING_CHANNELS,
}

onMounted(() => checkStatus());

function checkStatus() {
  axios
    .get<Status>(props.uri + '/api/status')
    .then(({ data }) => {
      logger.info(data);
      if (data.module !== 'worker') {
        currentState.value = state.NOT_WORKER;
        return;
      }

      const workerChannels = data.channels
        .filter((channel) => channel.isConnected)
        .map((channel) => channel.name);
      const databaseChannels = channelStore.channels.map((channel) => channel.name);

      if (!arraysMatchUnordered(workerChannels, databaseChannels)) {
        currentState.value = state.MISSING_CHANNELS;
        return;
      }

      currentState.value = state.OK;
    })
    .catch((err) => {
      logger.error(err);
      currentState.value = state.ERROR;
    });
}

const warningTooltip = computed(() => {
  switch (currentState.value) {
    case state.NOT_WORKER:
      return 'This is not a worker node';
      break;
    case state.MISSING_CHANNELS:
      return 'Worker channels do not match database channels';
      break;
    default:
      return '';
  }
});
</script>
