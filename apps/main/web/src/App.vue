<template>
  <div class="flex">
    <ChannelCRUD class="mr-4" />
    <WorkerCRUD class="ml-4" />
  </div>
</template>

<script setup lang="ts">
import ChannelCRUD from '@/components/ChannelCRUD.vue';
import WorkerCRUD from '@/components/WorkerCRUD.vue';
</script>
