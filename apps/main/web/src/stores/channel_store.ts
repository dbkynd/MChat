import { defineStore } from 'pinia';
import api from '@/plugins/axios';

export const useChannelStore = defineStore('channels', {
  state: () => ({
    channels: [] as Channel[],
  }),
  getters: {
    sortedChannels(state): Channel[] {
      return state.channels.sort((a, b) => {
        return a.name.localeCompare(b.name);
      });
    },
  },
  actions: {
    async fetchChannels() {
      return api.get<Channel[]>('/channels').then(({ data }) => {
        this.channels = data;
      });
    },
    async addChannel(name: string) {
      return api.post<Channel>('/channels', { name }).then(({ data }) => {
        this.channels.push(data);
      });
    },
    async deleteChannel(id: string) {
      return api.delete(`/channels/${id}`).then(() => {
        const index = this.channels.findIndex((channel) => channel._id.toString() === id);
        this.channels.splice(index, 1);
      });
    },
    async updateChannel(channel: Channel) {
      return api.put<Channel>('/channels', channel).then(({ data }) => {
        const index = this.channels.findIndex((c) => c._id === channel._id);
        this.channels[index] = data;
      });
    },
  },
});
