import axios, { AxiosInstance } from "axios";

const axiosInstance: AxiosInstance = axios.create({
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

//export const token = localStorage.getItem("jwtToken");


axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("jwtToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;