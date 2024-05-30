import axios from "axios";
import { ACCESS_TOKEN } from "./constants";
import { jwtDecode } from "jwt-decode";
import { REFRESH_TOKEN } from "./constants";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const refreshToken = async () => {
  const refreshToken = localStorage.getItem(REFRESH_TOKEN);
  if (!refreshToken) {
    return false;
  }
  try {
    const res = await api.post("/api/token/refresh", { refresh: refreshToken });
    if (res.status === 200) {
      localStorage.setItem(ACCESS_TOKEN, res.data.access);
      return true;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const auth = async () => {
  const token = localStorage.getItem(ACCESS_TOKEN);
  if (!token) {
    return false;
  }
  const decoded = jwtDecode(token);
  const tokenExpiration = decoded.exp;
  const now = Date.now() / 1000;

  if (tokenExpiration < now) {
    const refreshed = await refreshToken();
    if (!refreshed) {
      return false;
    }
  }
  return true;
};

export const login = async (data) => {
  const res = await api.post("/api/token/", data);
  localStorage.setItem(ACCESS_TOKEN, res.data.access);
  localStorage.setItem(REFRESH_TOKEN, res.data.refresh);

  return res.data;
};

