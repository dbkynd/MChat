<template>
  <div>
    <input
      :value="channel"
      type="text"
      class="p-1 bg-gray-600 rounded text-white focus:outline-none w-full mb-2"
      placeholder="Channel"
      readonly
    />
    <input
      :value="date"
      type="text"
      class="p-1 bg-gray-600 rounded text-white focus:outline-none w-full mb-2"
      placeholder="Date"
      readonly
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
import { useStatsStore } from '@/stores/stats_store';

const statsStore = useStatsStore();

const props = defineProps<{
  channel: string;
  date: string;
}>();

function process() {
  statsStore.fetchManualResults(props.channel, props.date);
}
</script>
