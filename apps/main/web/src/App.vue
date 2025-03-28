<template>
  <div class="flex">
    <ChannelCRUD class="mr-4" />
    <WorkerCRUD class="mx-4" />
    <Calendar class="ml-4" />
  </div>
</template>

<script setup lang="ts">
import Calendar from '@/components/Calendar.vue';
import ChannelCRUD from '@/components/ChannelCRUD.vue';
import WorkerCRUD from '@/components/WorkerCRUD.vue';
</script>
