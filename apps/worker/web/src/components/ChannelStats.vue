<template>
  <div>
    <div class="flex items-center w-full">
      <!-- Channel Name & Link -->
      <div>
        <p class="flex font-medium text-lg">
          <span class="text-sm font-medium flex items-center mt-1 pr-2">
            <a
              :href="`https://twitch.tv/${stats.name}`"
              target="_blank"
              class="text-blue-600 underline"
            >
              <img src="@/assets/img/twitch-icon.png" alt="" class="h-3" />
            </a>
          </span>
          {{ stats.name }}
        </p>
      </div>

      <!-- File Size -->
      <div class="text-sm font-medium text-right text-gray-800 file-size">
        {{ prettyBytes(stats.size) }}
      </div>

      <!-- Status Indicators -->
      <div class="pl-2">
        <span>
          <span v-if="stats.inDatabase">📋</span>
          <span v-else>🚫</span>
        </span>
        <span>
          <span v-if="stats.isConnected">🟢</span>
          <span v-else>⚫</span>
        </span>
        <span>
          <span v-if="stats.hasLogs">📂</span>
          <span v-else>❌</span>
        </span>
      </div>
    </div>
    <!-- Line Chart for Channel Stats -->
    <div>
      <ChannelStatsChart :stats="stats.stats" />
    </div>
  </div>
</template>

<script setup lang="ts">
import prettyBytes from '@repo/utilities/prettyBytes';
import ChannelStatsChart from './ChannelStatsChart.vue';

defineProps<{
  stats: ChannelStats;
}>();
</script>

<style scoped>
.file-size {
  flex-grow: 1;
}
</style>
