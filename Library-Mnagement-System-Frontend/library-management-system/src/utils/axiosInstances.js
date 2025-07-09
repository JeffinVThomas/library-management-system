
//NOT USED CAN BE USED IN FUTURE
//********************************

// src/utils/axiosInstance.js
import axios from "axios";

// ✅ Create the instance
const axiosInstance = axios.create({
  baseURL: "http://localhost:8080",
});

// ✅ Attach Authorization header if token exists
axiosInstance.interceptors.request.use(function (config) {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
