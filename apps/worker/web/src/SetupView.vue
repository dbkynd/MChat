<template>
  <input type="text" v-model="apiUrl" />
  <button @click="submit"></button>
</template>

<script setup lang="ts">
import api from '@/plugins/axios';
import { ref } from 'vue';

const apiUrl = ref('');

function submit() {
  api.post('api_url', { url: apiUrl.value }).then(() => {
    window.location.reload();
  });
}
</script>
<style scoped></style>
