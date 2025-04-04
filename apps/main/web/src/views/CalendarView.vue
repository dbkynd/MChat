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
    <ScheduleXCalendar :calendar-app="calendarApp" />
  </div>
</template>

<script setup lang="ts">
import {
  createCalendar,
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
} from '@schedule-x/calendar';
import { ScheduleXCalendar } from '@schedule-x/vue';
import { DateTime } from 'luxon';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import '@schedule-x/theme-default/dist/index.css';
import { useChannelStore } from '@/stores/channel_store';
import { useStatsStore } from '@/stores/stats_store';

const router = useRouter();
const channelStore = useChannelStore();
const statsStore = useStatsStore();

const channels = computed(() => {
  return channelStore.sortedChannels;
});
const selectedChannel = ref('');

onMounted(() => {
  if (!channels.value.length) {
    channelStore.fetchChannels();
  }
});

// Do not use a ref here, as the calendar instance is not reactive, and doing so might cause issues
// For updating events, use the events service plugin
const calendarApp = createCalendar({
  selectedDate: DateTime.now().toFormat('yyyy-MM-dd'),
  views: [createViewDay(), createViewWeek(), createViewMonthGrid(), createViewMonthAgenda()],
});

async function fetchStats() {
  if (!selectedChannel.value.trim()) return;
  const startDate = new Date('2025-03-01');
  const endDate = new Date('2025-03-31');
  await statsStore.fetchStats(selectedChannel.value, startDate, endDate);
  calendarApp.events.set(statsStore.asEvents);
}
</script>
