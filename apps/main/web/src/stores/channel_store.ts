import { defineStore } from 'pinia';
import api from '@/plugins/axios';

export const useChannelStore = defineStore('channels', {
  state: () => ({
    channels: [] as ChannelDoc[],
  }),
  getters: {
    sortedChannels(state): ChannelDoc[] {
      return state.channels.sort((a, b) => {
        return a.name.localeCompare(b.name);
      });
    },
  },
  actions: {
    async fetchChannels() {
      return api.get<ChannelDoc[]>('/channels').then(({ data }) => {
        this.channels = data;
      });
    },
    async addChannel(name: string) {
      return api.post<ChannelDoc>('/channels', { name }).then(({ data }) => {
        this.channels.push(data);
      });
    },
    async deleteChannel(id: string) {
      return api.delete(`/channels/${id}`).then(() => {
        const index = this.channels.findIndex((channel) => channel.id === id);
        this.channels.splice(index, 1);
      });
    },
    async updateChannel(channel: ChannelDoc) {
      return api.put<ChannelDoc>('/channels', channel).then(({ data }) => {
        const index = this.channels.findIndex((c) => c._id === channel._id);
        this.channels[index] = data;
      });
    },
  },
});
