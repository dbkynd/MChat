<template>
  <div class="w-85 p-4 bg-gray-800 text-white rounded-lg shadow-lg">
    <h2 class="text-xl font-bold mb-4">Channels</h2>

    <div
      v-for="channel in channels"
      :key="channel._id"
      class="flex items-center justify-between p-2 bg-gray-700 rounded mb-2 w-full"
    >
      <input
        type="checkbox"
        class="h-5 w-5 cursor-pointer mr-1"
        :checked="channel.doPolling"
        @change="setPolling($event, channel)"
      />

      <div v-if="editingId !== channel._id" class="p-1 w-full">
        {{ channel.name }}
      </div>
      <input
        v-else
        v-model="editingChannelName"
        class="p-1 bg-gray-600 rounded text-white focus:outline-none w-full"
        @keyup.enter="editChannel(channel)"
      />

      <div class="flex gap-2 ml-2">
        <button
          v-if="editingId !== channel._id"
          class="bg-blue-500 hover:bg-blue-600 px-2 py-1 rounded text-sm"
          @click="startEdit(channel)"
        >
          Edit
        </button>
        <button
          v-else
          class="bg-green-500 hover:bg-green-600 px-2 py-1 rounded text-sm"
          @click="editChannel(channel)"
        >
          Save
        </button>
        <button
          class="bg-red-500 hover:bg-red-600 px-2 py-1 rounded text-sm"
          @click="confirmDelete(channel)"
        >
          Delete
        </button>
      </div>
    </div>

    <div class="mt-4">
      <input
        v-model="newChannelName"
        class="p-2 w-full bg-gray-600 rounded border border-gray-500 focus:outline-none"
        placeholder="New channel name"
      />
      <button class="mt-2 bg-green-500 hover:bg-green-600 w-full p-2 rounded" @click="addChannel">
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
          Are you sure you want to delete
          <strong>{{ channels.find((x) => x._id === deleteId)?.name }}</strong>
          ?
        </p>
        <div class="flex justify-end mt-4 gap-2">
          <button class="bg-gray-500 px-3 py-1 rounded" @click="showDeleteDialog = false">
            Cancel
          </button>
          <button class="bg-red-500 px-3 py-1 rounded" @click="deleteChannel">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useChannelStore } from '@/stores/channel_store';

const channelStore = useChannelStore();

const newChannelName = ref('');
const editingId = ref<string | null>(null);
const editingChannelName = ref('');
const showDeleteDialog = ref(false);
const deleteId = ref<string | null>(null);

onMounted(() => {
  channelStore.fetchChannels();
});

const channels = computed(() => {
  return channelStore.sortedChannels;
});

async function addChannel() {
  if (!newChannelName.value.trim()) return;
  await channelStore.addChannel(newChannelName.value.trim().toLowerCase());
  newChannelName.value = '';
}

function startEdit(channel: Channel) {
  editingId.value = channel._id;
  editingChannelName.value = channel.name;
}

function editChannel(channel: Channel) {
  if (!editingChannelName.value.trim()) return;
  channel.name = editingChannelName.value.trim().toLowerCase();
  channelStore.updateChannel(channel).then(() => {
    editingId.value = null;
  });
}

function confirmDelete(channel: Channel) {
  deleteId.value = channel._id;
  showDeleteDialog.value = true;
}

function deleteChannel() {
  if (deleteId.value === null) return;
  channelStore.deleteChannel(deleteId.value).then(() => {
    showDeleteDialog.value = false;
    deleteId.value = null;
  });
}

function setPolling(event: Event, channel: Channel) {
  const isChecked = (event.target as HTMLInputElement).checked;
  channel.doPolling = isChecked;
  channelStore.updateChannel(channel);
}
</script>
