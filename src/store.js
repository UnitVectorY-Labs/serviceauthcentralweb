// store.js
import { createStore } from 'vuex';
import { jwtDecode } from 'jwt-decode';


export default createStore({
  state() {
    return {
      token: null,
    };
  },
  getters: {
    isTokenSet: (state) => state.token !== null,
    tokenExpiration: (state) => {
      if (!state.token) return null;
      const decoded = jwtDecode(state.token);
      return decoded.exp;
    }
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
