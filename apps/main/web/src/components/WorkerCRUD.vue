<template>
  <div class="w-100 p-4 bg-gray-800 text-white rounded-lg shadow-lg">
    <h2 class="text-xl font-bold mb-4">Workers</h2>

    <div
      v-for="worker in workers"
      :key="worker._id"
      class="flex items-center justify-between p-2 bg-gray-700 rounded mb-2 w-full"
    >
      <WorkerStatus :uri="worker.uri" class="mr-1" />

      <input
        type="checkbox"
        class="h-5 w-5 cursor-pointer mr-1"
        :checked="worker.doPolling"
        @change="setPolling($event, worker)"
      />

      <div v-if="editingId !== worker._id" class="p-1 w-full">
        {{ worker.uri }}
      </div>
      <input
        v-else
        v-model="editingWorkerUri"
        class="p-1 bg-gray-600 rounded text-white focus:outline-none w-full"
        @keyup.enter="editWorker(worker)"
      />

      <div class="flex gap-2 ml-2">
        <button>
          <a :href="worker + '/api/status'" target="_blank">
            <img src="@/assets/open-external.svg" alt="" class="h-6 w-6 object-contain" />
          </a>
        </button>
        <button
          v-if="editingId !== worker._id"
          class="bg-blue-500 hover:bg-blue-600 px-2 py-1 rounded text-sm"
          @click="startEdit(worker)"
        >
          Edit
        </button>
        <button
          v-else
          class="bg-green-500 hover:bg-green-600 px-2 py-1 rounded text-sm"
          @click="editWorker(worker)"
        >
          Save
        </button>
        <button
          class="bg-red-500 hover:bg-red-600 px-2 py-1 rounded text-sm"
          @click="confirmDelete(worker)"
        >
          Delete
        </button>
      </div>
    </div>

    <div class="mt-4">
      <input
        v-model="newWorkerUri"
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
          <strong>{{ workers.find((x) => x._id === deleteId)?.uri }}</strong>
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
import { computed, onMounted, ref } from 'vue';
import WorkerStatus from '@/components/WorkerStatus.vue';
import { useWorkerStore } from '@/stores/worker_store';

const workerStore = useWorkerStore();

const newWorkerUri = ref('');
const editingId = ref<string | null>(null);
const editingWorkerUri = ref('');
const showDeleteDialog = ref(false);
const deleteId = ref<string | null>(null);

onMounted(() => {
  workerStore.fetchWorkers();
});

const workers = computed(() => {
  return workerStore.sortedWorkers;
});

async function addWorker() {
  if (!newWorkerUri.value.trim()) return;
  await workerStore.addWorker(newWorkerUri.value.trim());
  newWorkerUri.value = '';
}

function startEdit(worker: Worker) {
  editingId.value = worker._id;
  editingWorkerUri.value = worker.uri;
}

function editWorker(worker: Worker) {
  if (!editingWorkerUri.value.trim()) return;
  worker.uri = editingWorkerUri.value.trim();
  workerStore.updateWorker(worker).then(() => {
    editingId.value = null;
  });
}

function confirmDelete(worker: Worker) {
  deleteId.value = worker._id;
  showDeleteDialog.value = true;
}

function deleteWorker() {
  if (deleteId.value === null) return;
  workerStore.deleteWorker(deleteId.value).then(() => {
    showDeleteDialog.value = false;
    deleteId.value = null;
  });
}

function setPolling(event: Event, worker: Worker) {
  const isChecked = (event.target as HTMLInputElement).checked;
  worker.doPolling = isChecked;
  workerStore.updateWorker(worker);
}
</script>
