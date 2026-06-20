import client from "./client";

/**
 * Fetch the currently active resume (public endpoint).
 * Returns either { id, version, uploaded_at, download_url } or
 * { message: "No resume uploaded yet" }.
 */
export const getCurrentResume = () =>
  client.get("/api/resume").then((r) => r.data);

/**
 * Upload a new resume version (admin only). Multipart form upload.
 * @param {File} file
 */
export const uploadResume = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return client
    .post("/api/resume", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((r) => r.data);
};

/**
 * Fetch full resume version history (admin only).
 */
export const getResumeHistory = () =>
  client.get("/api/resume/history").then((r) => r.data);
