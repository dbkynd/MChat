<template>
  <div class="mb-4">
    <button
      class="bg-blue-500 hover:bg-blue-600 px-2 py-1 rounded text-sm text-white"
      @click="router.push('/')"
    >
      Home
    </button>
  </div>
  <div>Hello World</div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();
</script>
