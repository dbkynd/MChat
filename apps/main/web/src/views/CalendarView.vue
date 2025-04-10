<template>
  <div class="mb-4 flex flex-row">
    <button
      class="bg-blue-500 hover:bg-blue-600 px-2 py-1 rounded text-sm text-white mr-4"
      @click="router.push('/')"
    >
      Home
    </button>
    <div class="flex-column">
      <label for="channel-select" class="block text-sm font-medium text-white mb-1">
        Select a Channel
      </label>
      <select
        id="channel-select"
        v-model="selectedChannel"
        class="block w-64 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white text-gray-900"
        @change="fetchStats"
      >
        <option v-for="channel in channels" :key="channel._id" class="text-gray-900 bg-white">
          {{ channel.name }}
        </option>
      </select>
    </div>
  </div>
  <div class="">
    <Calendar v-model="selectedDate" class="mb-2" :attributes="attributes" @dayclick="clicked" />
  </div>
  <div>
    <ManualSync :channel="selectedChannel" :date="selectedDate" />
  </div>
  <div>
    <SyncResults />
  </div>
</template>

<script setup lang="ts">
import { DateTime } from 'luxon';
import { Calendar } from 'v-calendar';
import type { CalendarDay } from 'v-calendar/dist/types/src/utils/page.js';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import ManualSync from '@/components/ManualSync.vue';
import SyncResults from '@/components/SyncResults.vue';
import { useChannelStore } from '@/stores/channel_store';
import { useStatsStore } from '@/stores/stats_store';
import 'v-calendar/style.css';

const router = useRouter();
const channelStore = useChannelStore();
const statsStore = useStatsStore();

const channels = computed(() => {
  return channelStore.sortedChannels;
});
const selectedChannel = ref('');
const selectedDate = ref('');

onMounted(() => {
  if (!channels.value.length) {
    channelStore.fetchChannels();
  }
});

const attributes = ref([]);

async function fetchStats() {
  if (!selectedChannel.value.trim()) return;
  const startDate = new Date('2025-03-01');
  const endDate = new Date('2025-03-31');
  await statsStore.fetchStats(selectedChannel.value, startDate, endDate);
}

function clicked(day: CalendarDay) {
  selectedDate.value = DateTime.fromJSDate(day.date).toFormat('yyyy-MM-dd');
}
</script>
