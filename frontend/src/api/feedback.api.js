import client from "./client";

/**
 * Submit feedback (public). Sends as multipart/form-data to support
 * optional file attachment alongside text fields.
 * @param {{ name, email, message, rating }} data
 * @param {File|null} attachment
 */
export const submitFeedback = (data, attachment = null) => {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("email", data.email);
  formData.append("message", data.message);
  formData.append("rating", String(data.rating));
  if (attachment) formData.append("attachment", attachment);
  return client
    .post("/api/feedback", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((r) => r.data);
};

/** Fetch approved feedback (public, paginated). */
export const listApprovedFeedback = ({ limit = 20, offset = 0 } = {}) =>
  client
    .get("/api/feedback", { params: { limit, offset } })
    .then((r) => r.data);

/** Fetch ALL feedback (admin only, paginated). */
export const listAllFeedback = ({ limit = 50, offset = 0 } = {}) =>
  client
    .get("/api/feedback/all", { params: { limit, offset } })
    .then((r) => r.data);

/** Approve or reject a feedback item (admin only). */
export const updateFeedbackStatus = (id, status) =>
  client.patch(`/api/feedback/${id}/status`, { status }).then((r) => r.data);
