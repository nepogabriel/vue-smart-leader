import api from '@/services/api';

export default {
  namespaced: true,
  state: {
    token: localStorage.getItem('token') || null
  },
  getters: {
    token: s => s.token,
    isAuth: s => !!s.token
  },
  mutations: {
    SET_TOKEN(s, t) {
      s.token = t;
      t ? localStorage.setItem('token', t) : localStorage.removeItem('token');
    }
  },
  actions: {
    async login({ commit }, creds) {
      const { data } = await api.post('/login', creds);
      commit('SET_TOKEN', data.access_token);
    },
    async logout({ commit }) {
      await api.post('/logout');
      commit('SET_TOKEN', null);
    }
  }
};
