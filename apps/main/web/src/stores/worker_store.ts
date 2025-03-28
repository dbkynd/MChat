import { defineStore } from 'pinia';
import api from '@/plugins/axios';

export const useWorkerStore = defineStore('workers', {
  state: () => ({
    workers: [] as Worker[],
  }),
  getters: {
    sortedWorkers(state): Worker[] {
      return state.workers.sort((a, b) => {
        return a.uri.localeCompare(b.uri);
      });
    },
  },
  actions: {
    async fetchWorkers() {
      return api.get<Worker[]>('/workers').then(({ data }) => {
        this.workers = data;
      });
    },
    async addWorker(uri: string) {
      return api.post<Worker>('/workers', { uri }).then(({ data }) => {
        this.workers.push(data);
      });
    },
    async deleteWorker(id: string) {
      return api.delete(`/workers/${id}`).then(() => {
        const index = this.workers.findIndex((worker) => worker._id === id);
        this.workers.splice(index, 1);
      });
    },
    async updateWorker(worker: Worker) {
      return api.put<Worker>('/workers', worker).then(({ data }) => {
        const index = this.workers.findIndex((w) => w._id === worker._id);
        this.workers[index] = data;
      });
    },
  },
});
