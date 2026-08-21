import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://health-bridge-project-2.onrender.com/api";
const AI_API_BASE_URL = import.meta.env.VITE_AI_API_BASE_URL || "https://health-bridge-project-1.onrender.com";

export const api = axios.create({ baseURL: API_BASE_URL });
export const aiApi = axios.create({ baseURL: AI_API_BASE_URL });

// Attach the JWT to every request against the main API once it exists.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("healthbridge_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If the token is rejected or expired, drop it so the app falls back to logged-out state.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("healthbridge_token");
      localStorage.removeItem("healthbridge_user");
    }
    return Promise.reject(error);
  }
);

export const getErrorMessage = (error, fallback = "Something went wrong. Please try again.") =>
  error?.response?.data?.message || error?.response?.data?.detail || error?.message || fallback;
