// import axios from 'axios'

// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_URL ?? 'https://admin-moderator-backend-staging.up.railway.app/api',
//   headers: { 'Content-Type': 'application/json' },
// })

// export type LoginPayload = {
//   userId: string
//   password: string
// }

// export async function login(payload: LoginPayload) {
//   const { data } = await api.post('/auth/login', payload)
//   return data
// }

import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://admin-moderator-backend-staging.up.railway.app/api",
  timeout: 10000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log("Unauthorized - redirect to login");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;