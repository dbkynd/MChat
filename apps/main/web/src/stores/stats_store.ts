import { defineStore } from 'pinia';
import api from '@/plugins/axios';

export const useStatsStore = defineStore('stats', {
  state: () => ({
    stats: [] as SyncStats[],
    manualResults: {} as SyncStats,
  }),
  getters: {},
  actions: {
    async fetchStats(channel: string, startDate: Date, endDate: Date) {
      return api
        .get<SyncStatsRange>('/stats', { params: { channel, startDate, endDate } })
        .then(({ data }) => {
          this.stats = data.data.map((stat) => ({
            ...stat,
            date: new Date(stat.date),
            createdAt: new Date(stat.createdAt),
          }));
        });
    },
    async fetchManualResults(channel: string, date: string) {
      return api.post<SyncStats>(`/sync`, { channel, date }).then(({ data }) => {
        this.manualResults = data;
      });
    },
  },
});
