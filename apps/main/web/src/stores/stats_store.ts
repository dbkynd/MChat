import type { CalendarEventExternal } from '@schedule-x/calendar';
import { defineStore } from 'pinia';
import api from '@/plugins/axios';

export const useStatsStore = defineStore('stats', {
  state: () => ({
    stats: [] as SyncStats[],
  }),
  getters: {
    sortedStats(state): SyncStats[] {
      return state.stats.sort((a, b) => {
        return a.date.valueOf() - b.date.valueOf();
      });
    },
    asEvents(state): CalendarEventExternal[] {
      return state.stats.map((stat) => ({
        id: stat._id,
        start: stat.date.toISOString(),
        end: stat.date.toISOString(),
        title: `Sync ${stat.channel}`,
        allDay: true,
      }));
    },
  },
  actions: {
    async fetchStats(channel: string, startDate: Date, endDate: Date) {
      return api
        .get<SyncStats[]>('/stats', { params: { channel, startDate, endDate } })
        .then(({ data }) => {
          this.stats = data;
        });
    },
  },
});
