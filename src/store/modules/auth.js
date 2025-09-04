import Cookies from "js-cookie";
import api from '@/services/api';

export default {
  namespaced: true,
  state: {
    token: Cookies.get('token') || null,
    user: null
  },
  getters: {
    token: state => state.token,
    isAuth: state => !!state.token,
    user: state => state.user
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token;
      if (token) {
        Cookies.set('token', token, { expires: 7, secure: true, sameSite: 'Strict' });
      } else {
        Cookies.remove('token');
      }
    },
    SET_USER(state, user) {
      state.user = user;
    }
  },
  actions: {
    async fetchUser({ commit }) {
      try {
        const { data } = await api.get('/me');
        commit('SET_USER', data);
      } catch (e) {
        console.error('Erro ao buscar usuário:', e);
        commit('SET_USER', null);
      }
    },
    async logout({ commit }) {
      // await api.post('/logout');
      commit('SET_TOKEN', null);
    }
  }
};
