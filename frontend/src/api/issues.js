import { api } from "./client";

export function listIssues(filters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });
  const query = params.toString();
  return api(`/issues/${query ? `?${query}` : ""}`);
}

export const getIssue = (id) => api(`/issues/${id}/`);
export const createIssue = (data) =>
  api("/issues/", { method: "POST", body: data });
export const updateIssue = (id, data) =>
  api(`/issues/${id}/`, { method: "PATCH", body: data });
export const addComment = (id, content) =>
  api(`/issues/${id}/comments/`, { method: "POST", body: { content } });
export const listTechnicians = () => api("/technicians/");
