import { getTopics } from '../services/readhub';
const defaultPageSize = 20;
export default {
  state: {
    topics: [],
    readIds: [],
    loading: false,
    viewingId: null,
  },
  reducers: {
    updateTopics(state, payload) {
      let { data, lastCursor } = payload;
      state.topics = state.topics.length && lastCursor ? state.topics.concat(data) : data;
    },
    markRead(state, payload) {
      if (!state.readIds.includes(payload)) {
        state.readIds.push(payload);
      }
    },
    updateViewingId(state, payload) {
      state.viewingId = payload;
    },
    toggleLoading(state, payload) {
      state.loading = payload;
    }
  },
  effects: {
    async fetchTopics(payload = {}, rootState) {
      let {
        readhub: {
          topics,
          loading,
        }
      } = rootState;
      if (loading) return;
      this.toggleLoading(true);
      let lastCursor = '';
      if (topics.length) {
        lastCursor = topics[topics.length - 1].order;
      }
      payload.lastCursor = lastCursor;
      if (!payload.pageSize) {
        payload.pageSize = defaultPageSize;
      }
      let response = await getTopics(payload) || [];
      this.updateTopics({ data: response.data, lastCursor });
      this.toggleLoading(false);
    },
  },
}