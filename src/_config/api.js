// apiClient.js
import axios from "axios";
import { handleResponse } from "./authService";

const BACKEND_URL = "https://loveable-backend-5qi0.onrender.com/api/v1";
// const BACKEND_URL = "http://localhost:3002/api/v1";

/**
 * Configured Axios Instance
 */
export const apiClient = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Automatically attach Bearer token
apiClient.interceptors.request.use(
  (config) => {
    const adminToken = localStorage.getItem("admin_token");
    let userToken = null;

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        userToken = JSON.parse(storedUser)?.token;
      } catch {
        // invalid JSON in localStorage
      }
    }

    const token = adminToken || userToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Format error messages
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || error.message || "Request failed";
    console.error("API Response Error:", message);
    return Promise.reject(new Error(message));
  }
);

/**
 * Admin API Endpoints
 */
export const adminApi = {
  // 1. Admin Authentication
  login: (email, password) =>
    apiClient.post("/admin_login", { email, password }),

  // 2. Users Management
  getUsers: () => apiClient.get("/admin/users"),
  toggleBlockUser: (userId) =>
    apiClient.patch(`/admin/user/${userId}/toggle-block`),

  // 3. Law & Legal Content
  addLegalVideo: (data) => apiClient.post("/admin/law/video", data),
  uploadLegalPdf: (formData) =>
    apiClient.post("/admin/law/pdf", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  getLawContent: (params = {}) => apiClient.get("/law-content", { params }),

  // 👇 Ye lines add karni hain:
  // 4. Admin Profile Management
  getProfile: () => apiClient.get("/admin/profile"),
  updateProfile: (formData) =>
    apiClient.put("/admin/profile", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
      changePassword: (data) => apiClient.put("/admin/change-password", data),

        // 5. Job & Business Opportunity Fraud Reports
  getOpportunityReports: (params = {}) => apiClient.get("/admin/opportunity-reports", { params }),
  deleteReportedPost: (postType, id) => apiClient.delete(`/admin/posts/${postType}/${id}`),


};


/**
 * Generic request helper using axios
 */
export const makeRequest = async (
  method,
  url,
  data = {},
  headers = {},
  isFile = false
) => {
  try {
    const config = {
      method: method.toLowerCase(),
      url,
      headers: {
        ...(isFile
          ? { "Content-Type": "multipart/form-data" }
          : { "Content-Type": "application/json" }),
        ...headers,
      },
    };

    if (method.toLowerCase() === "get") {
      config.params = data;
    } else {
      config.data = isFile ? data : data;
    }

    const response = await apiClient(config);
    return handleResponse(response.data);
  } catch (error) {
    const message = error.message || "Request failed";
    console.error("Request Error:", message);
    throw new Error(message);
  }
};

/**
 * Authenticated request helper
 */
export const makeRequestAuth = async (
  method,
  url,
  data = {},
  isFile = false
) => {
  return makeRequest(method, url, data, {}, isFile);
};

/**
 * File upload helper using axios
 */
export const uploadFiles = async ({
  files = [],
  endpoint = "/uploadImage",
  fieldName = "files",
  isMultiple = true,
}) => {
  if (!files.length) throw new Error("No file selected.");

  const formData = new FormData();
  if (isMultiple) {
    files.forEach((file) => {
      formData.append(fieldName, file);
    });
  } else {
    formData.append(fieldName, files[0]);
  }

  try {
    const res = await apiClient.post(endpoint, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  } catch (err) {
    const message = err.message || "Upload failed";
    console.error("Upload error:", message);
    throw new Error(message);
  }
};

export default apiClient;
