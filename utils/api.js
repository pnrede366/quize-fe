import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && error.response?.data?.requiresLogin) {
      // Token is invalid - redirect to login
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  signup: async (data) => {
    const response = await api.post("/auth/signup", data);
    return response.data;
  },

  sendOTP: async (email) => {
    const response = await api.post("/auth/send-otp", { email });
    return response.data;
  },

  verifyOTP: async (email, otp) => {
    const response = await api.post("/auth/verify-otp", { email, otp });
    return response.data;
  },
};

export const quizAPI = {
  generateQuiz: async (topic, difficulty) => {
    const response = await api.post("/quizzes/generate", {
      topic,
      difficulty,
    });
    return response.data;
  },

  getAllQuizzes: async () => {
    const response = await api.get("/quizzes");
    return response.data;
  },

  getQuizById: async (id) => {
    const response = await api.get(`/quizzes/${id}`);
    return response.data;
  },

  submitQuizAnswer: async (quizId, answers) => {
    const response = await api.post(`/quizzes/${quizId}/submit`, { answers });
    return response.data;
  },

  deleteQuiz: async (id) => {
    const response = await api.delete(`/quizzes/${id}`);
    return response.data;
  },
};

export const userAPI = {
  getProfile: async () => {
    const response = await api.get("/user/profile");
    return response.data;
  },

  getLeaderboard: async () => {
    const response = await api.get("/user/leaderboard");
    return response.data;
  },

  getUserStats: async () => {
    const response = await api.get("/user/stats");
    return response.data;
  },

  getQuizHistory: async () => {
    const response = await api.get("/user/quiz-history");
    return response.data;
  },

  getGeneratedQuizzes: async () => {
    const response = await api.get("/user/generated-quizzes");
    return response.data;
  },
};

export const categoryAPI = {
  getAllCategories: async () => {
    const response = await api.get("/categories");
    return response.data;
  },

  getCategoryById: async (id) => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },

  getQuizzesByCategory: async (categoryId) => {
    const response = await api.get(`/categories/${categoryId}/quizzes`);
    return response.data;
  },
};

export default api;

