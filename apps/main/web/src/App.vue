<template>
  <div class="flex">
    <ChannelCRUD class="mr-4" />
    <WorkerCRUD class="mx-4" />
    <ManualSync class="ml-4" />
  </div>
</template>

<script setup lang="ts">
import ChannelCRUD from '@/components/ChannelCRUD.vue';
import ManualSync from '@/components/ManualSync.vue';
import WorkerCRUD from '@/components/WorkerCRUD.vue';
</script>
