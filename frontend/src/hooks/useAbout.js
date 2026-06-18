import { useState, useEffect, useCallback } from "react";
import * as aboutApi from "../api/about.api";
import { useUIStore } from "../store/uiStore";

export function useAbout() {
  const [about, setAbout] = useState(null);
  const [skills, setSkills] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const showToast = useUIStore((s) => s.showToast);

  // ── Initial load ──────────────────────────────────────────────────────────
  const loadAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [aboutData, skillsData, certsData] = await Promise.all([
        aboutApi.getAbout(),
        aboutApi.listSkills(),
        aboutApi.listCertifications(),
      ]);
      setAbout(aboutData);
      setSkills(skillsData);
      setCertifications(certsData);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to load profile data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  // ── About handlers ────────────────────────────────────────────────────────
  const saveAbout = useCallback(
    async (data) => {
      try {
        const updated = await aboutApi.updateAbout(data);
        setAbout(updated);
        showToast("Profile updated", "success");
        return true;
      } catch (err) {
        showToast(err.response?.data?.detail || "Update failed", "error");
        return false;
      }
    },
    [showToast],
  );

  // ── Skill handlers ────────────────────────────────────────────────────────
  const addSkill = useCallback(
    async (data) => {
      try {
        const created = await aboutApi.createSkill(data);
        setSkills((prev) => [...prev, created]);
        showToast("Skill added", "success");
        return true;
      } catch (err) {
        showToast(err.response?.data?.detail || "Failed to add skill", "error");
        return false;
      }
    },
    [showToast],
  );

  const editSkill = useCallback(
    async (id, data) => {
      try {
        const updated = await aboutApi.updateSkill(id, data);
        setSkills((prev) => prev.map((s) => (s.id === id ? updated : s)));
        showToast("Skill updated", "success");
        return true;
      } catch (err) {
        showToast(
          err.response?.data?.detail || "Failed to update skill",
          "error",
        );
        return false;
      }
    },
    [showToast],
  );

  const removeSkill = useCallback(
    async (id) => {
      try {
        await aboutApi.deleteSkill(id);
        setSkills((prev) => prev.filter((s) => s.id !== id));
        showToast("Skill deleted", "success");
        return true;
      } catch (err) {
        showToast(
          err.response?.data?.detail || "Failed to delete skill",
          "error",
        );
        return false;
      }
    },
    [showToast],
  );

  // ── Certification handlers ───────────────────────────────────────────────
  const addCertification = useCallback(
    async (data) => {
      try {
        const created = await aboutApi.createCertification(data);
        setCertifications((prev) => [...prev, created]);
        showToast("Certification added", "success");
        return true;
      } catch (err) {
        showToast(
          err.response?.data?.detail || "Failed to add certification",
          "error",
        );
        return false;
      }
    },
    [showToast],
  );

  const editCertification = useCallback(
    async (id, data) => {
      try {
        const updated = await aboutApi.updateCertification(id, data);
        setCertifications((prev) =>
          prev.map((c) => (c.id === id ? updated : c)),
        );
        showToast("Certification updated", "success");
        return true;
      } catch (err) {
        showToast(
          err.response?.data?.detail || "Failed to update certification",
          "error",
        );
        return false;
      }
    },
    [showToast],
  );

  const removeCertification = useCallback(
    async (id) => {
      try {
        await aboutApi.deleteCertification(id);
        setCertifications((prev) => prev.filter((c) => c.id !== id));
        showToast("Certification deleted", "success");
        return true;
      } catch (err) {
        showToast(
          err.response?.data?.detail || "Failed to delete certification",
          "error",
        );
        return false;
      }
    },
    [showToast],
  );

  return {
    about,
    skills,
    certifications,
    loading,
    error,
    saveAbout,
    addSkill,
    editSkill,
    removeSkill,
    addCertification,
    editCertification,
    removeCertification,
    reload: loadAll,
  };
}
