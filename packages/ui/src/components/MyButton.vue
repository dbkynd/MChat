<template>
  <button
    class="px-4 py-2 text-white rounded-md transition"
    :class="[btnColor, btnHoverColor]"
    @click="onClick"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  onClick?: () => void;
  color: string;
}>();

const btnColor = computed(() => {
  return `bg-${props.color}-600`;
});

const btnHoverColor = computed(() => {
  return `hover:bg-${props.color}-700`;
});
</script>
