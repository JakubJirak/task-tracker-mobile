import axiosClient from "@/utils/axios";
import { getToken, setToken } from "./TokenService";

export async function login(
  email: string,
  password: string,
  device_name: string,
) {
  const { data } = await axiosClient.post("/mobile/login", {
    email,
    password,
    device_name,
  });

  await setToken(data.token);
  return data;
}

export async function logout() {
  const token = await getToken();

  if (!token) {
    return;
  }

  await axiosClient.post("/mobile/logout", {});

  await setToken(null);
}

export async function loadUser() {
  const token = await getToken();

  if (!token) {
    return null;
  }

  const { data: user } = await axiosClient.get("/user");
  return user;
}
