<template>
  <div>
    <div class="disk-path">{{ props.stats?.diskPath }}</div>
    <div class="progress-bar-container">
      <div class="progress-bar" :style="{ width: progressBarWidth }"></div>
      <div class="progress-text">{{ freeSpace }} / {{ totalSpace }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import prettyBytes from '@repo/utilities/prettyBytes';
import { computed } from 'vue';

const props = defineProps<{
  stats?: DiskSpace;
}>();

const totalSpace = computed(() => {
  return prettyBytes(props.stats?.size);
});

const freeSpace = computed(() => {
  return prettyBytes(props.stats?.free);
});

const usedSpacePercentage = computed(() => {
  if (props.stats?.size && props.stats?.free) {
    const usedSpace = props.stats.size - props.stats.free;
    return (usedSpace / props.stats.size) * 100;
  }
  return 0;
});

const progressBarWidth = computed(() => {
  return `${usedSpacePercentage.value}%`;
});
</script>

<style scoped>
.disk-path {
  font-weight: bold;
  margin-bottom: 5px;
  font-size: 12px;
}

.progress-bar-container {
  width: 250px;
  height: 20px;
  background-color: #e0e0e0;
  border-radius: 10px;
  margin-bottom: 10px;
  overflow: hidden;
  position: relative;
}

.progress-bar {
  height: 100%;
  background-color: #76c7c0;
  transition: width 0.3s ease;
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 12px;
  color: #333;
}
</style>
