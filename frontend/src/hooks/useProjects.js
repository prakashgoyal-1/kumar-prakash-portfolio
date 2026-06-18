import { useState, useEffect, useCallback } from "react";
import * as projectsApi from "../api/projects.api";
import { useUIStore } from "../store/uiStore";

const PAGE_SIZE = 20;

export function useProjects() {
  const [projects, setProjects] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [techFilter, setTechFilterState] = useState(null);
  const [offset, setOffset] = useState(0);

  const showToast = useUIStore((s) => s.showToast);

  // ── Load (replace) — used on mount and whenever techFilter changes ─────────
  const load = useCallback(async (tech, currentOffset = 0) => {
    setLoading(true);
    setError(null);
    try {
      const res = await projectsApi.listProjects({
        tech,
        limit: PAGE_SIZE,
        offset: currentOffset,
      });
      if (currentOffset === 0) {
        setProjects(res.items);
      } else {
        setProjects((prev) => [...prev, ...res.items]);
      }
      setTotal(res.total);
      setOffset(currentOffset);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to load projects");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(techFilter, 0);
  }, [techFilter, load]);

  // ── Filter ───────────────────────────────────────────────────────────────
  const setTechFilter = useCallback((tech) => {
    setTechFilterState((prev) => (prev === tech ? null : tech));
  }, []);

  // ── Pagination ───────────────────────────────────────────────────────────
  const loadMore = useCallback(() => {
    if (!loading && projects.length < total) {
      load(techFilter, offset + PAGE_SIZE);
    }
  }, [load, loading, projects.length, total, offset, techFilter]);

  const hasMore = projects.length < total;

  // ── Admin CRUD ───────────────────────────────────────────────────────────
  const createProject = useCallback(
    async (data) => {
      try {
        const created = await projectsApi.createProject(data);
        setProjects((prev) => [created, ...prev]);
        setTotal((t) => t + 1);
        showToast("Project added", "success");
        return true;
      } catch (err) {
        showToast(
          err.response?.data?.detail || "Failed to add project",
          "error",
        );
        return false;
      }
    },
    [showToast],
  );

  const updateProject = useCallback(
    async (id, data) => {
      try {
        const updated = await projectsApi.updateProject(id, data);
        setProjects((prev) => prev.map((p) => (p.id === id ? updated : p)));
        showToast("Project updated", "success");
        return true;
      } catch (err) {
        showToast(
          err.response?.data?.detail || "Failed to update project",
          "error",
        );
        return false;
      }
    },
    [showToast],
  );

  const deleteProject = useCallback(
    async (id) => {
      try {
        await projectsApi.deleteProject(id);
        setProjects((prev) => prev.filter((p) => p.id !== id));
        setTotal((t) => t - 1);
        showToast("Project deleted", "success");
        return true;
      } catch (err) {
        showToast(
          err.response?.data?.detail || "Failed to delete project",
          "error",
        );
        return false;
      }
    },
    [showToast],
  );

  return {
    projects,
    total,
    loading,
    error,
    techFilter,
    setTechFilter,
    loadMore,
    hasMore,
    createProject,
    updateProject,
    deleteProject,
  };
}
