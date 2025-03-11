<template>
  <div class="w-85 p-4 bg-gray-800 text-white rounded-lg shadow-lg">
    <h2 class="text-xl font-bold mb-4">Channels</h2>

    <div
      v-for="(channel, index) in channels"
      :key="channel"
      class="flex items-center justify-between p-2 bg-gray-700 rounded mb-2 w-full"
    >
      <div v-if="editingIndex !== index" class="p-1">
        {{ channel }}
      </div>
      <input
        v-else
        v-model="editText"
        class="p-1 bg-gray-600 rounded text-white focus:outline-none w-full"
        @keyup.enter="updateChannel(index)"
      />

      <div class="flex gap-2 ml-2">
        <button
          v-if="editingIndex !== index"
          @click="startEdit(index, channel)"
          class="bg-blue-500 hover:bg-blue-600 px-2 py-1 rounded text-sm"
        >
          Edit
        </button>
        <button
          v-else
          @click="updateChannel(index)"
          class="bg-green-500 hover:bg-green-600 px-2 py-1 rounded text-sm"
        >
          Save
        </button>
        <button
          @click="confirmDelete(index)"
          class="bg-red-500 hover:bg-red-600 px-2 py-1 rounded text-sm"
        >
          Delete
        </button>
      </div>
    </div>

    <div class="mt-4">
      <input
        v-model="newChannel"
        class="p-2 w-full bg-gray-600 rounded border border-gray-500 focus:outline-none"
        placeholder="New channel name"
      />
      <button @click="addChannel" class="mt-2 bg-green-500 hover:bg-green-600 w-full p-2 rounded">
        Add Channel
      </button>
    </div>

    <!-- Delete Confirmation Dialog -->
    <div
      v-if="showDeleteDialog"
      class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
    >
      <div class="bg-gray-800 p-4 rounded-lg shadow-lg">
        <p>
          Are you sure you want to delete <strong>{{ channels[deleteIndex] }}</strong
          >?
        </p>
        <div class="flex justify-end mt-4 gap-2">
          <button @click="showDeleteDialog = false" class="bg-gray-500 px-3 py-1 rounded">
            Cancel
          </button>
          <button @click="deleteChannel" class="bg-red-500 px-3 py-1 rounded">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import api from '@/plugins/axios.js';
import { onMounted, ref } from 'vue';

const channels = ref<string[]>([]);
const newChannel = ref('');
const editingIndex = ref<number>(-1);
const editText = ref('');
const showDeleteDialog = ref(false);
const deleteIndex = ref<number>(-1);

onMounted(() => {
  fetchChannels();
});

function fetchChannels() {
  api.get<string[]>('/channels').then(({ data }) => {
    channels.value = data;
  });
}

function addChannel() {
  if (!newChannel.value.trim()) return;
  api.post('/channels', { name: newChannel.value.trim() }).then(() => {
    channels.value.push(newChannel.value);
    newChannel.value = '';
  });
}

function startEdit(index: number, channel: string) {
  editingIndex.value = index;
  editText.value = channel;
}

function updateChannel(index: number) {
  if (!editText.value.trim()) return;
  api.put(`/channels/${channels.value[index]}`, { name: editText.value.trim() }).then(() => {
    channels.value[index] = editText.value;
    editingIndex.value = -1;
  });
}

function confirmDelete(index: number) {
  deleteIndex.value = index;
  showDeleteDialog.value = true;
}

function deleteChannel() {
  if (deleteIndex.value === null) return;
  api.delete(`/channels/${channels.value[deleteIndex.value]}`).then(() => {
    channels.value.splice(deleteIndex.value, 1);
    showDeleteDialog.value = false;
    deleteIndex.value = -1;
  });
}
</script>
