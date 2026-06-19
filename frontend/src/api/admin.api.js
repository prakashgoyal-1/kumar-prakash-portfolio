import client from "./client";

/**
 * Fetch aggregated admin statistics.
 * Requires admin JWT — handled by axios interceptor.
 */
export const getAdminStats = () =>
  client.get("/api/admin/stats").then((r) => r.data);
