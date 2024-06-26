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

export const register = async (data) => {
  const res = await api.post("/api/user/register/", data);
  return res.data;
};

export const getClasses = async () => {
  const res = await api.get("/api/class/");
  return res.data;
};

export const getCoursesForAClass = async () => {
  const res = await api.get("/api/class/courses/");
  return res.data;
};

export const getAuthenticatedUserDetails = async () => {
  const res = await api.get("/api/userprofile/");
  return res.data;
};

export const getLogbookEntries = async (course_id) => {
  const res = await api.get(`/api/courses/${course_id}/logbook-entries/`);
  return res.data;
};

export const createLogbookEntry = async ({ course_id, formData }) => {
  const res = await api.post(
    `/api/courses/${course_id}/logbook-entries/`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return res.data;
};

export const getTeachers = async () => {
  const res = await api.get("/api/teacher/");
  return res.data;
};

export const createTeacherCourseHours = async ({ course_id, data }) => {
  const res = await api.post(`/api/teacher-course-hour/${course_id}/`, data);
  return res.data;
};

export const getTeacherCourseHours = async (course_id) => {
  const res = await api.get(`/api/teacher-course-hour/${course_id}/`);
  return res.data;
};
