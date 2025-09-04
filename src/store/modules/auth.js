import Cookies from "js-cookie";

export default {
  namespaced: true,
  state: {
    token: Cookies.get('token') || null
  },
  getters: {
    token: state => state.token,
    isAuth: state => !!state.token
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token;
      if (token) {
        Cookies.set('token', token, { expires: 7, secure: true, sameSite: 'Strict' });
      } else {
        Cookies.remove('token');
      }
    }
  },
  actions: {
    async logout({ commit }) {
      // await api.post('/logout');
      commit('SET_TOKEN', null);
    }
  }
};
