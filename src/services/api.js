import axios from "axios";
import store from "@/store";

const apiUrl = process.env.VUE_APP_API_URL;

const api = axios.create({
  baseURL: apiUrl,
});

api.interceptors.request.use(
  function (config) {
    const token = store.getters["auth/token"];

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (error) {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;
      await store.dispatch("auth/logout");
    }

    return Promise.reject(error);
  }
);

export default api;
