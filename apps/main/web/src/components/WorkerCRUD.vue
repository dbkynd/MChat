<template>
  <div class="w-100 p-4 bg-gray-800 text-white rounded-lg shadow-lg">
    <h2 class="text-xl font-bold mb-4">Workers</h2>

    <div
      v-for="(worker, index) in workers"
      :key="worker"
      class="flex items-center justify-between p-2 bg-gray-700 rounded mb-2 w-full"
    >
      <WorkerStatus :url="worker" class="mr-1" />

      <div v-if="editingIndex !== index" class="p-1 w-full">
        {{ worker }}
      </div>
      <input
        v-else
        v-model="editText"
        class="p-1 bg-gray-600 rounded text-white focus:outline-none w-full"
        @keyup.enter="updateWorker(index)"
      />

      <div class="flex gap-2 ml-2">
        <button>
          <a :href="worker + '/api/status'" target="_blank">
            <img src="@/assets/open-external.svg" alt="" class="h-6 w-6 object-contain" />
          </a>
        </button>
        <button
          v-if="editingIndex !== index"
          class="bg-blue-500 hover:bg-blue-600 px-2 py-1 rounded text-sm"
          @click="startEdit(index, worker)"
        >
          Edit
        </button>
        <button
          v-else
          class="bg-green-500 hover:bg-green-600 px-2 py-1 rounded text-sm"
          @click="updateWorker(index)"
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
        v-model="newWorker"
        class="p-2 w-full bg-gray-600 rounded border border-gray-500 focus:outline-none"
        placeholder="New worker URI"
      />
      <button class="mt-2 bg-green-500 hover:bg-green-600 w-full p-2 rounded" @click="addWorker">
        Add Worker
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
          <strong>{{ workers[deleteIndex] }}</strong>
          ?
        </p>
        <div class="flex justify-end mt-4 gap-2">
          <button class="bg-gray-500 px-3 py-1 rounded" @click="showDeleteDialog = false">
            Cancel
          </button>
          <button class="bg-red-500 px-3 py-1 rounded" @click="deleteWorker">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import api from '@/plugins/axios.js';
import { onMounted, ref } from 'vue';
import WorkerStatus from '@/components/WorkerStatus.vue';

const workers = ref<string[]>([]);
const newWorker = ref('');
const editingIndex = ref<number>(-1);
const editText = ref('');
const showDeleteDialog = ref(false);
const deleteIndex = ref<number>(-1);

onMounted(() => {
  fetchWorkers();
});

function fetchWorkers() {
  api.get<string[]>('/workers').then(({ data }) => {
    workers.value = data;
  });
}

function addWorker() {
  if (!newWorker.value.trim()) return;
  api.post('/workers', { uri: newWorker.value.trim() }).then(() => {
    workers.value.push(newWorker.value);
    newWorker.value = '';
  });
}

function startEdit(index: number, worker: string) {
  editingIndex.value = index;
  editText.value = worker;
}

function updateWorker(index: number) {
  if (!editText.value.trim()) return;
  api.put('/workers', { uri: workers.value[index], newUri: editText.value.trim() }).then(() => {
    workers.value[index] = editText.value;
    editingIndex.value = -1;
  });
}

function confirmDelete(index: number) {
  deleteIndex.value = index;
  showDeleteDialog.value = true;
}

function deleteWorker() {
  if (deleteIndex.value === null) return;
  api
    .delete('/workers', {
      data: {
        uri: workers.value[deleteIndex.value],
      },
    })
    .then(() => {
      workers.value.splice(deleteIndex.value, 1);
      showDeleteDialog.value = false;
      deleteIndex.value = -1;
    });
}
</script>
