import client from "./client";

// ── About (singleton) ────────────────────────────────────────────────────────

export const getAbout = () => client.get("/api/about").then((r) => r.data);

export const updateAbout = (data) =>
  client.put("/api/about", data).then((r) => r.data);

// ── Skills ────────────────────────────────────────────────────────────────────

export const listSkills = () =>
  client.get("/api/about/skills").then((r) => r.data);

export const createSkill = (data) =>
  client.post("/api/about/skills", data).then((r) => r.data);

export const updateSkill = (id, data) =>
  client.put(`/api/about/skills/${id}`, data).then((r) => r.data);

export const deleteSkill = (id) =>
  client.delete(`/api/about/skills/${id}`).then((r) => r.data);

// ── Certifications ────────────────────────────────────────────────────────────

export const listCertifications = () =>
  client.get("/api/about/certifications").then((r) => r.data);

export const createCertification = (data) =>
  client.post("/api/about/certifications", data).then((r) => r.data);

export const updateCertification = (id, data) =>
  client.put(`/api/about/certifications/${id}`, data).then((r) => r.data);

export const deleteCertification = (id) =>
  client.delete(`/api/about/certifications/${id}`).then((r) => r.data);

// ── Upload Photo ────────────────────────────────────────────────────────────

export const uploadAboutPhoto = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return client
    .post("/api/about/photo", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((r) => r.data);
};
