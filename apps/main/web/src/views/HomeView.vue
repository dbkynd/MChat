<template>
  <div class="mb-4">
    <button
      class="bg-blue-500 hover:bg-blue-600 px-2 py-1 rounded text-sm text-white"
      @click="router.push('/calendar')"
    >
      Calendar
    </button>
  </div>
  <div class="flex">
    <ChannelCRUD class="mr-4" />
    <WorkerCRUD class="mx-4" />
    <ManualSync class="ml-4" />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import ChannelCRUD from '@/components/ChannelCRUD.vue';
import ManualSync from '@/components/ManualSync.vue';
import WorkerCRUD from '@/components/WorkerCRUD.vue';

const router = useRouter();
</script>
