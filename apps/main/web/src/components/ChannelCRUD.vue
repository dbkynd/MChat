<template>
  <div class="w-85 p-4 bg-gray-800 text-white rounded-lg shadow-lg">
    <h2 class="text-xl font-bold mb-4">Channels</h2>

    <div
      v-for="(channel, index) in channels"
      :key="index"
      class="flex items-center justify-between p-2 bg-gray-700 rounded mb-2 w-full"
    >
      <input
        type="checkbox"
        class="h-5 w-5 cursor-pointer mr-1"
        :checked="channel.doPolling"
        @change="setPolling($event, channel)"
      />

      <div v-if="editingIndex !== index" class="p-1">
        {{ channel.name }}
      </div>
      <input
        v-else
        v-model="editText"
        class="p-1 bg-gray-600 rounded text-white focus:outline-none w-full"
        @keyup.enter="editChannel(index)"
      />

      <div class="flex gap-2 ml-2">
        <button
          v-if="editingIndex !== index"
          class="bg-blue-500 hover:bg-blue-600 px-2 py-1 rounded text-sm"
          @click="startEdit(index, channel.name)"
        >
          Edit
        </button>
        <button
          v-else
          class="bg-green-500 hover:bg-green-600 px-2 py-1 rounded text-sm"
          @click="editChannel(index)"
        >
          Save
        </button>
        <button
          class="bg-red-500 hover:bg-red-600 px-2 py-1 rounded text-sm"
          @click="confirmDelete(index)"
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
          <strong>{{ channels[deleteIndex].name }}</strong>
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

const newChannel = ref('');
const editingIndex = ref<number>(-1);
const editText = ref('');
const showDeleteDialog = ref(false);
const deleteIndex = ref(-1);

onMounted(() => {
  channelStore.fetchChannels();
});

const channels = computed(() => {
  return channelStore.sortedChannels;
});

async function addChannel() {
  if (!newChannel.value.trim()) return;
  await channelStore.addChannel(newChannel.value.trim());
  newChannel.value = '';
}

function startEdit(index: number, name: string) {
  editingIndex.value = index;
  editText.value = name;
}

function editChannel(index: number) {
  if (!editText.value.trim()) return;
  const channel = channels.value[index];
  channelStore.updateChannel(channel).then(() => {
    editingIndex.value = -1;
  });
}

function confirmDelete(index: number) {
  deleteIndex.value = index;
  showDeleteDialog.value = true;
}

function deleteChannel() {
  if (deleteIndex.value === -1) return;
  const id = channels.value[deleteIndex.value]._id.toString();
  channelStore.deleteChannel(id).then(() => {
    showDeleteDialog.value = false;
    deleteIndex.value = -1;
  });
}

function setPolling(event: Event, channel: ChannelDoc) {
  const isChecked = (event.target as HTMLInputElement).checked;
  channel.doPolling = isChecked;
  channelStore.updateChannel(channel);
}
</script>
