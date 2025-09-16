import axios from "axios";


const axiosInstance = axios.create({
  baseURL: "/api",
});

// Hydrate default header on initial load
const bootToken = localStorage.getItem("token");
if (bootToken) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${bootToken}`;
}

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
