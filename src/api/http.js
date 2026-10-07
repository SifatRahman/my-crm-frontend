import axios from "axios";
import { API_BASE_URL } from "../config/api";
export const http = axios.create({
    baseURL: API_BASE_URL,
    timeout: 60000,
    headers: { Accept: "application/json" },
});
http.interceptors.request.use((c) => {
    const t = localStorage.getItem("access_token");
    if (t) c.headers.Authorization = `Bearer ${t}`;
    return c;
});
http.interceptors.response.use(
    (r) => r,
    (e) => {
        if (e.response?.status === 401) localStorage.removeItem("access_token");
        return Promise.reject(e);
    },
);
export const getApiError = (e) => {
    const d = e?.response?.data;
    if (typeof d === "string") return d;
    return d?.message || d?.error || e?.message || "Request failed";
};
