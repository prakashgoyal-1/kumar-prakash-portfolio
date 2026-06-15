// Shared utility functions
export const formatDate = (iso) => new Date(iso).toLocaleDateString();
export const truncate = (str, n) =>
  str.length > n ? str.slice(0, n) + "…" : str;
