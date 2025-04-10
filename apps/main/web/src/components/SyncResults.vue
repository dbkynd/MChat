<template>
  <div>
    <h3>Results</h3>
    <div v-if="manualResults">
      <p><strong>Channel:</strong> {{ manualResults.channel }}</p>
      <p><strong>Date:</strong> {{ manualResults.date }}</p>
      <p><strong>Cycle Time:</strong> {{ manualResults.result.cycleTime }} ms</p>
      <p><strong>Lines:</strong></p>
      <ul>
        <li><strong>Strict:</strong> {{ manualResults.result.lines.strict }}</li>
        <li><strong>Loose:</strong> {{ manualResults.result.lines.loose }}</li>
        <li><strong>Total:</strong> {{ manualResults.result.lines.total }}</li>
      </ul>
      <p><strong>Added:</strong></p>
      <ul>
        <li><strong>Strict:</strong> {{ manualResults.result.added.strict }}</li>
        <li><strong>Loose:</strong> {{ manualResults.result.added.loose }}</li>
        <li><strong>Total:</strong> {{ manualResults.result.added.total }}</li>
      </ul>
      <p><strong>Workers:</strong></p>
      <ul>
        <li v-for="worker in manualResults.result.workers" :key="worker.uri">
          <p><strong>URI:</strong> {{ worker.uri }}</p>
          <p><strong>Status:</strong> {{ worker.status }}</p>
          <p><strong>Lines:</strong> {{ worker.lines }}</p>
        </li>
      </ul>
      <p><strong>Created At:</strong> {{ manualResults.createdAt }}</p>
    </div>
    <div v-else>
      <p>No results available.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useStatsStore } from '@/stores/stats_store';

const statsStore = useStatsStore();

const manualResults = computed(() => {
  return statsStore.manualResults;
});
</script>
