import { defineStore } from 'pinia';

export const useChannelStore = defineStore('channels', {
  state: () => ({
    channels: [] as string[],
  }),
  getters: {
    sortedChannels(state) {
      return state.channels.sort();
    },
  },
  actions: {
    setChannels(payload: string[]) {
      this.channels = payload;
    },
  },
});
