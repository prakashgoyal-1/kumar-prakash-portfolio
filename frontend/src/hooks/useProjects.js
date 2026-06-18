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
  const [techTags, setTechTags] = useState([]);

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

  // Fetch ALL projects once (unfiltered, high limit) just to derive the
  // stable tag list — independent of whatever filter/pagination is active
  // for the displayed project grid. No new backend endpoint required.
  useEffect(() => {
    projectsApi
      .listProjects({ limit: 100, offset: 0 }) // no `tech` param = unfiltered
      .then((res) => {
        const set = new Set();
        res.items.forEach((p) =>
          (p.tech_stack || []).forEach((t) => set.add(t)),
        );
        setTechTags(Array.from(set).sort());
      })
      .catch(() => {
        // Fail silently — chip row just won't render
      });
  }, []); // run once on mount only

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
    techTags,
    createProject,
    updateProject,
    deleteProject,
  };
}
