<template>{{ stats.name }} - {{ prettyBytes(stats.size) }}</template>

<script setup lang="ts">
import prettyBytes from '@repo/utilities/prettyBytes';

defineProps<{
  stats: ChannelStats;
}>();
</script>

<style scoped></style>
