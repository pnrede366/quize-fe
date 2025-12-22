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
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

const createAPI = (basePath) => ({
  get: async (path = "", config = {}) => {
    const response = await api.get(`${basePath}${path}`, config);
    return response.data;
  },
  post: async (path = "", data = {}, config = {}) => {
    const response = await api.post(`${basePath}${path}`, data, config);
    return response.data;
  },
  put: async (path = "", data = {}, config = {}) => {
    const response = await api.put(`${basePath}${path}`, data, config);
    return response.data;
  },
  delete: async (path = "", config = {}) => {
    const response = await api.delete(`${basePath}${path}`, config);
    return response.data;
  },
  patch: async (path = "", data = {}, config = {}) => {
    const response = await api.patch(`${basePath}${path}`, data, config);
    return response.data;
  },
});

export const authAPI = createAPI("/auth");

authAPI.signup = async (data) => authAPI.post("/signup", data);
authAPI.sendOTP = async (email) => authAPI.post("/send-otp", { email });
authAPI.verifyOTP = async (email, otp) => authAPI.post("/verify-otp", { email, otp });
authAPI.googleAuth = async (credential) => authAPI.post("/google", { credential });

export const quizAPI = createAPI("/quizzes");

quizAPI.generate = async (topic, difficulty) => 
  quizAPI.post("/generate", { topic, difficulty });
quizAPI.generateQuiz = quizAPI.generate; // Backward compatibility
quizAPI.getAll = async () => quizAPI.get();
quizAPI.getAllQuizzes = quizAPI.getAll; // Backward compatibility
quizAPI.getById = async (id) => quizAPI.get(`/${id}`);
quizAPI.getQuizById = quizAPI.getById; // Backward compatibility
quizAPI.submit = async (quizId, answers) => 
  quizAPI.post(`/${quizId}/submit`, { answers });
quizAPI.submitQuizAnswer = quizAPI.submit; // Backward compatibility
quizAPI.remove = async (id) => quizAPI.delete(`/${id}`);
quizAPI.deleteQuiz = quizAPI.remove; // Backward compatibility

export const userAPI = createAPI("/user");

userAPI.getProfile = async () => userAPI.get("/profile");
userAPI.getStats = async () => userAPI.get("/stats");
userAPI.getUserStats = userAPI.getStats; // Backward compatibility
userAPI.getLeaderboard = async () => userAPI.get("/leaderboard");
userAPI.getQuizHistory = async () => userAPI.get("/quiz-history");
userAPI.getGeneratedQuizzes = async () => userAPI.get("/generated-quizzes");
userAPI.getQuizResult = async (quizId) => userAPI.get(`/quiz-result/${quizId}`);

export const categoryAPI = createAPI("/categories");

categoryAPI.getAll = async () => categoryAPI.get();
categoryAPI.getAllCategories = categoryAPI.getAll; // Backward compatibility
categoryAPI.getById = async (id) => categoryAPI.get(`/${id}`);
categoryAPI.getCategoryById = categoryAPI.getById; // Backward compatibility
categoryAPI.getQuizzes = async (categoryId) => 
  categoryAPI.get(`/${categoryId}/quizzes`);
categoryAPI.getQuizzesByCategory = categoryAPI.getQuizzes; // Backward compatibility

export const paymentAPI = createAPI("/payment");

paymentAPI.initiate = async (plan) => paymentAPI.post("/initiate", { plan });
paymentAPI.verify = async (orderId, paymentData) => 
  paymentAPI.post("/verify", { orderId, ...paymentData });
paymentAPI.verifyById = async (orderId) => 
  paymentAPI.get(`/verify/${orderId}`);

export const testPaymentAPI = createAPI("/test-payment");

testPaymentAPI.simulateSuccess = async (orderId, plan) => 
  testPaymentAPI.post("/simulate-success", { orderId, plan });

export default api;

