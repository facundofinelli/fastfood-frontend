import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// Interceptor de respuestas
api.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    // Cast a AxiosError
    const err = error as { response?: { status: number; data: unknown } };

    if (err.response) {
      const { status, data } = err.response;
      if (status === 401) window.location.href = "/login";
      if (status === 403) window.location.href = "/";
      if ([404, 422].includes(status)) console.error("Error:", data);
    }

    return Promise.reject(err);
  }
);

const apiService = {
  get: async <T = unknown>(url: string, params?: Record<string, unknown>): Promise<T> => {
    const res = await api.get<T>(url, { params });
    return res.data;
  },

  post: async <T = unknown>(url: string, body?: Record<string, unknown>): Promise<T> => {
    const res = await api.post<T>(url, body);
    return res.data;
  },

  put: async <T = unknown>(url: string, body?: Record<string, unknown>): Promise<T> => {
    const res = await api.put<T>(url, body);
    return res.data;
  },

  patch: async <T = unknown>(url: string, body?: Record<string, unknown>): Promise<T> => {
    const res = await api.patch<T>(url, body);
    return res.data;
  },

  delete: async <T = unknown>(url: string): Promise<T> => {
    const res = await api.delete<T>(url);
    return res.data;
  },
};

export default apiService;
