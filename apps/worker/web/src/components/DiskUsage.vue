<template>
  <div>
    <div class="font-bold text-sm mb-1">{{ props.stats?.diskPath }}</div>

    <div class="relative w-64 h-5 bg-gray-300 rounded-lg overflow-hidden">
      <div
        class="h-full transition-all duration-300"
        :class="progressBarColor"
        :style="{ width: progressBarWidth }"
      ></div>
      <div class="absolute inset-0 flex items-center justify-center text-xs text-gray-800">
        {{ freeSpace }} / {{ totalSpace }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import prettyBytes from '@repo/utilities/prettyBytes';
import { computed } from 'vue';

const props = defineProps<{
  stats?: DiskSpace;
}>();

const totalSpace = computed(() => prettyBytes(props.stats?.size));
const freeSpace = computed(() => prettyBytes(props.stats?.free));

const usedSpacePercentage = computed(() => {
  if (props.stats?.size && props.stats?.free) {
    const usedSpace = props.stats.size - props.stats.free;
    return (usedSpace / props.stats.size) * 100;
  }
  return 0;
});

const progressBarWidth = computed(() => `${usedSpacePercentage.value}%`);

// Dynamically change the progress bar color based on used space percentage
const progressBarColor = computed(() => {
  if (usedSpacePercentage.value >= 90) return 'bg-red-500'; // Critical (90%+)
  if (usedSpacePercentage.value >= 75) return 'bg-orange-500'; // High (75%+)
  if (usedSpacePercentage.value >= 50) return 'bg-yellow-500'; // Medium (50%+)
  return 'bg-teal-500'; // Normal (Under 50%)
});
</script>
