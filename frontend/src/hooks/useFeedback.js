import { useState, useEffect, useCallback } from "react";
import * as feedbackApi from "../api/feedback.api";
import { useAuth } from "./useAuth";
import { useUIStore } from "../store/uiStore";

export function useFeedback() {
  const { isAdmin } = useAuth();
  const showToast = useUIStore((s) => s.showToast);

  const [approved, setApproved] = useState([]);
  const [all, setAll] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // ── Load approved feedback (public) ────────────────────────────────────
  const loadApproved = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await feedbackApi.listApprovedFeedback({ limit: 50 });
      setApproved(res.items);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to load feedback");
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Load all feedback (admin only) ─────────────────────────────────────
  const loadAll = useCallback(async () => {
    if (!isAdmin) return;
    try {
      const res = await feedbackApi.listAllFeedback({ limit: 100 });
      setAll(res.items);
    } catch (err) {
      console.error("Failed to load all feedback:", err);
    }
  }, [isAdmin]);

  useEffect(() => {
    loadApproved();
  }, [loadApproved]);

  useEffect(() => {
    if (isAdmin) loadAll();
  }, [isAdmin, loadAll]);

  // ── Submit (public) ─────────────────────────────────────────────────────
  const submit = useCallback(
    async (data, attachment = null) => {
      setSubmitting(true);
      try {
        await feedbackApi.submitFeedback(data, attachment);
        showToast(
          "Thank you! Your feedback will appear after review.",
          "success",
        );
        return true;
      } catch (err) {
        showToast(
          err.response?.data?.detail || "Failed to submit feedback",
          "error",
        );
        return false;
      } finally {
        setSubmitting(false);
      }
    },
    [showToast],
  );

  // ── Approve (admin) ─────────────────────────────────────────────────────
  const approve = useCallback(
    async (id) => {
      try {
        const updated = await feedbackApi.updateFeedbackStatus(id, "approved");
        setAll((prev) => prev.map((f) => (f.id === id ? updated : f)));
        setApproved((prev) => {
          const exists = prev.find((f) => f.id === id);
          return exists
            ? prev.map((f) => (f.id === id ? updated : f))
            : [...prev, updated];
        });
        showToast("Feedback approved", "success");
        return true;
      } catch (err) {
        showToast(err.response?.data?.detail || "Failed to approve", "error");
        return false;
      }
    },
    [showToast],
  );

  // ── Reject (admin) ──────────────────────────────────────────────────────
  const reject = useCallback(
    async (id) => {
      try {
        const updated = await feedbackApi.updateFeedbackStatus(id, "rejected");
        setAll((prev) => prev.map((f) => (f.id === id ? updated : f)));
        setApproved((prev) => prev.filter((f) => f.id !== id));
        showToast("Feedback rejected", "success");
        return true;
      } catch (err) {
        showToast(err.response?.data?.detail || "Failed to reject", "error");
        return false;
      }
    },
    [showToast],
  );

  return {
    approved,
    all,
    loading,
    submitting,
    error,
    submit,
    approve,
    reject,
  };
}
