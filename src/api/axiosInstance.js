import axios from "axios";

const baseURL =
  process.env.NODE_ENV === "production"
    ? "https://luckyweeky.store/api/v1"
    : "http://localhost:8080/api/v1";

const axiosInstance = axios.create({
  baseURL: baseURL,
  withCredentials: true, // 쿠키 허용
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = sessionStorage.getItem("accessToken");
    if (accessToken && config.url !== "/aB12Xz/LWyAtd") {
      // 로그인 URL 제외
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
