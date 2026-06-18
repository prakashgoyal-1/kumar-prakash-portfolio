import client from "./client";

/**
 * List projects with optional tech filter and pagination.
 * @param {{ tech?: string, limit?: number, offset?: number }} params
 */
export const listProjects = ({ tech, limit = 20, offset = 0 } = {}) => {
  const params = { limit, offset };
  if (tech) params.tech = tech;
  return client.get("/api/projects", { params }).then((r) => r.data);
};

export const getProject = (id) =>
  client.get(`/api/projects/${id}`).then((r) => r.data);

export const createProject = (data) =>
  client.post("/api/projects", data).then((r) => r.data);

export const updateProject = (id, data) =>
  client.put(`/api/projects/${id}`, data).then((r) => r.data);

export const deleteProject = (id) =>
  client.delete(`/api/projects/${id}`).then((r) => r.data);
