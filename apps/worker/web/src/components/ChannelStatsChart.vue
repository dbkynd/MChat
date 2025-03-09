<template>
  <div class="w-full h-10">
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Line } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  CategoryScale,
  type TooltipItem,
} from 'chart.js';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  CategoryScale,
);

const props = defineProps<{
  stats: { timestamp: number; count: number }[];
}>();

const chartData = computed(() => {
  const now = Date.now();
  const intervalSize = 5 * 60 * 1000;
  const oneHourAgo =
    Math.floor((now - 60 * 60 * 1000) / intervalSize) * intervalSize + intervalSize;

  const fullTimestamps = Array.from({ length: 12 }, (_, i) => oneHourAgo + i * intervalSize);
  const statsMap = new Map(props.stats.map((entry) => [entry.timestamp, entry.count]));
  const filledStats = fullTimestamps.map((timestamp) => ({
    timestamp,
    count: statsMap.get(timestamp) ?? 0,
  }));

  return {
    labels: filledStats.map((entry) =>
      new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    ),
    datasets: [
      {
        label: '',
        data: filledStats.map((entry) => entry.count),
        borderColor: '#8884d8',
        backgroundColor: 'rgba(136,132,216,0.2)',
        fill: true,
      },
    ],
  };
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      display: false,
    },
    y: {
      display: false,
      beginAtZero: true,
    },
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      enabled: true,
      intersect: false,
      displayColors: false,
      callbacks: {
        title: () => '',
        label: (tooltipItem: TooltipItem<'line'>) => `${tooltipItem.raw}`,
      },
    },
  },
};
</script>
