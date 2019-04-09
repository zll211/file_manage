export const stompModule = {
  namespaced: true,
  state: {
    client: null,
    isConnected: false,
    moveFileProgress: null,
    scanSliceProgress: null,
    relateJSONProgress: null,
  },
  mutations: {
    setClient(state, client) {
      state.client = client;
    },
    setConnected(state, status) {
      state.isConnected = status;
    },
    setMoveFileProgress(state, info) {
      state.moveFileProgress = info;
    },
    setScanSliceProgress(state, info) {
      state.scanSliceProgress = info;
    },
    setRelateJSONProgress(state, info) {
      state.relateJSONProgress = info;
    }
  },

  getters: {}
};
