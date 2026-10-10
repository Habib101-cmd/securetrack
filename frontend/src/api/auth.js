import { api } from "./client";

export const fetchCsrf = () => api("/auth/csrf/");
export const login = (email, password) =>
  api("/auth/login/", { method: "POST", body: { email, password } });
export const logout = () => api("/auth/logout/", { method: "POST" });
export const getMe = () => api("/auth/me/");
