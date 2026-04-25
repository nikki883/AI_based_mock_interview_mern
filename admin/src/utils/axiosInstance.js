// src/utils/axiosInstance.js
import axios from "axios";

const adminToken = localStorage.getItem("adminToken");

const instance = axios.create({
  baseURL: "http://localhost:5000",  // change only if backend is on another port
  headers: {
    Authorization: adminToken ? `Bearer ${adminToken}` : "",
  },
});

// Update token automatically when it changes
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
