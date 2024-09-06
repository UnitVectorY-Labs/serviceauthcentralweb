/*
 * Copyright 2024 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License
 * is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing permissions and limitations under
 * the License.
 *
 * @author Jared Hatfield (UnitVectorY Labs)
 */
import { createStore } from 'vuex';
import { jwtDecode } from 'jwt-decode';

export default createStore({
  state() {
    return {
      token: null,
    };
  },
  getters: {
    isTokenSet: state => state.token !== null,
    tokenExpiration: state => {
      if (!state.token) return null;
      const decoded = jwtDecode(state.token);
      return decoded.exp;
    },
    tokenDescription: state => {
      if (!state.token) return null;
      const decoded = jwtDecode(state.token);
      return decoded.description;
    },
    canWrite: state => {
      if (!state.token) return false;
      const decoded = jwtDecode(state.token);
      return decoded.scope && decoded.scope.includes('Admin');
    },
  },
  mutations: {
    setToken(state, newToken) {
      state.token = newToken;
    },
    clearToken(state) {
      state.token = null;
    },
  },
  actions: {
    signIn({ commit }, token) {
      // Here, you might want to authenticate the user first
      commit('setToken', token);
    },
    signOut({ commit }) {
      commit('clearToken');
    },
  },
});
