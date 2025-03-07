<template>
  <div class="grid grid-cols-2 gap-4 w-full">
    <!-- Channel Name & Link -->
    <div>
      <p class="font-medium text-lg">
        {{ stats.name }}
        <span class="text-sm font-medium">
          <a
            :href="`https://twitch.tv/${stats.name}`"
            target="_blank"
            class="text-blue-600 underline"
            >Link</a
          >
        </span>
      </p>
    </div>

    <!-- File Size -->
    <div class="text-sm font-medium text-right text-gray-800">
      {{ prettyBytes(stats.size) }}
    </div>

    <!-- Status Indicators (Icons are now vertically aligned) -->
    <div class="col-span-2 grid grid-cols-3 gap-2 text-sm text-gray-600">
      <span
        :class="statusClass(stats.inDatabase, 'blue')"
        class="flex items-center gap-1 justify-center min-w-[120px]"
      >
        <span>📋</span> <span v-if="stats.inDatabase">In Database</span>
        <span v-else>🚫 Not in DB</span>
      </span>
      <span
        :class="statusClass(stats.isConnected, 'green')"
        class="flex items-center gap-1 justify-center min-w-[120px]"
      >
        <span v-if="stats.isConnected">🟢</span> <span v-if="stats.isConnected">Connected</span>
        <span v-else>⚫ Not Connected</span>
      </span>
      <span
        :class="statusClass(stats.hasLogs, 'gray')"
        class="flex items-center gap-1 justify-center min-w-[120px]"
      >
        <span v-if="stats.hasLogs">📂</span> <span v-if="stats.hasLogs">Logs Exist</span>
        <span v-else>❌ No Logs</span>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import prettyBytes from '@repo/utilities/prettyBytes';

defineProps<{
  stats: ChannelStats;
}>();

const statusClass = (condition: boolean, color: string) => {
  return condition ? `text-${color}-600 font-bold` : 'text-gray-500';
};
</script>
