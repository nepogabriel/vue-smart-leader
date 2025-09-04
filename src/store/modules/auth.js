import api from '@/services/api';

export default {
  namespaced: true,
  state: {
    token: localStorage.getItem('token') || null
  },
  getters: {
    token: state => state.token,
    isAuth: state => !!state.token
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token;
      token ? localStorage.setItem('token', token) : localStorage.removeItem('token');
    }
  },
  actions: {
    async logout({ commit }) {
      // await api.post('/logout');
      commit('SET_TOKEN', null);
    }
  }
};
