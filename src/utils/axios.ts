import { getToken } from "@/services/TokenService";
import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://192.168.1.23:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use(async (req) => {
  const token = await getToken();

  if (token) {
    req.headers["Authorization"] = `Bearer ${token}`;
  }

  return req;
});

export default axiosClient;
