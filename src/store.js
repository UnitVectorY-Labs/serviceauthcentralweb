// store.js
import { createStore } from 'vuex';

export default createStore({
  state() {
    return {
      token: null,
    };
  },
  getters: {
    isTokenSet: (state) => state.token !== null,
  },
  mutations: {
    setToken(state, newToken) {
      state.token = newToken;
    },
    clearToken(state) {
      state.token = null;
    }
  },
  actions: {
    signIn({ commit }, token) {
      // Here, you might want to authenticate the user first
      commit('setToken', token);
    },
    signOut({ commit }) {
      commit('clearToken');
    }
  }
});
