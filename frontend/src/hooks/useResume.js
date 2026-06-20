import { useState, useEffect, useCallback } from "react";
import * as resumeApi from "../api/resume.api";
import { useAuth } from "./useAuth";
import { useUIStore } from "../store/uiStore";

export function useResume() {
  const { isAdmin } = useAuth();
  const showToast = useUIStore((s) => s.showToast);

  const [resume, setResume] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  // ── Load current resume on mount ────────────────────────────────────────
  const loadCurrent = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await resumeApi.getCurrentResume();
      // Public endpoint returns { message: "..." } when no resume exists
      setResume(data?.id ? data : null);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to load resume");
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Load history (admin only) ───────────────────────────────────────────
  const loadHistory = useCallback(async () => {
    if (!isAdmin) return;
    try {
      const data = await resumeApi.getResumeHistory();
      setHistory(data);
    } catch (err) {
      // Non-fatal — history is supplementary, don't block the page
      console.error("Failed to load resume history:", err);
    }
  }, [isAdmin]);

  useEffect(() => {
    loadCurrent();
  }, [loadCurrent]);

  useEffect(() => {
    if (isAdmin) loadHistory();
  }, [isAdmin, loadHistory]);

  // ── Upload handler (admin) ──────────────────────────────────────────────
  const upload = useCallback(
    async (file) => {
      setUploading(true);
      try {
        const newResume = await resumeApi.uploadResume(file);
        setResume(newResume);
        showToast("Resume uploaded", "success");
        await loadHistory(); // refresh history to include the new version
        return true;
      } catch (err) {
        showToast(err.response?.data?.detail || "Upload failed", "error");
        return false;
      } finally {
        setUploading(false);
      }
    },
    [showToast, loadHistory],
  );

  return {
    resume,
    history,
    loading,
    uploading,
    error,
    upload,
  };
}
