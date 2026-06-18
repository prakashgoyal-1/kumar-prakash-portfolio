import { useState, useMemo } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Skeleton from "@mui/material/Skeleton";
import Fab from "@mui/material/Fab";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import AddIcon from "@mui/icons-material/Add";

import { useProjects } from "../../hooks/useProjects";
import { useAuth } from "../../hooks/useAuth";
import ProjectCard from "../../components/sections/ProjectCard/ProjectCard";
import "./Projects.css";

const EMPTY_FORM = {
  title: "",
  description: "",
  tech_stack: "", // comma-separated in the form, split on submit
  image_url: "",
  repo_url: "",
  live_url: "",
  featured: false,
};

export default function Projects() {
  const { isAdmin } = useAuth();
  const {
    projects,
    loading,
    error,
    techFilter,
    setTechFilter,
    loadMore,
    hasMore,
    createProject,
    updateProject,
    deleteProject,
  } = useProjects();

  // ── Derive the set of all distinct tech tags across loaded projects ────────
  const allTechs = useMemo(() => {
    const set = new Set();
    projects.forEach((p) => (p.tech_stack || []).forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [projects]);

  // ── Dialog state ─────────────────────────────────────────────────────────
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const openAdd = () => {
    setEditingProject(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  };

  const openEdit = (project) => {
    setEditingProject(project);
    setForm({
      title: project.title,
      description: project.description || "",
      tech_stack: (project.tech_stack || []).join(", "),
      image_url: project.image_url || "",
      repo_url: project.repo_url || "",
      live_url: project.live_url || "",
      featured: project.featured,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    const payload = {
      title: form.title,
      description: form.description,
      tech_stack: form.tech_stack
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      image_url: form.image_url || null,
      repo_url: form.repo_url || null,
      live_url: form.live_url || null,
      featured: form.featured,
    };
    const ok = editingProject
      ? await updateProject(editingProject.id, payload)
      : await createProject(payload);
    if (ok) setDialogOpen(false);
  };

  return (
    <Container maxWidth="lg" className="projects-page">
      <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
        Projects
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        A selection of things I've built.
      </Typography>

      {/* ── Tech filter chips ─────────────────────────────────────────── */}
      {allTechs.length > 0 && (
        <Stack
          direction="row"
          spacing={1}
          flexWrap="wrap"
          useFlexGap
          sx={{ mb: 3 }}
        >
          {allTechs.map((tech) => (
            <Chip
              key={tech}
              label={tech}
              clickable
              color={techFilter === tech ? "primary" : "default"}
              variant={techFilter === tech ? "filled" : "outlined"}
              onClick={() => setTechFilter(tech)}
            />
          ))}
        </Stack>
      )}

      {/* ── Error state ──────────────────────────────────────────────── */}
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {/* ── Loading skeleton grid ───────────────────────────────────── */}
      {/* {loading && projects.length === 0 ? (
        <Grid container spacing={3}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Box className="project-skeleton-card">
                <Skeleton variant="rectangular" height={140} />
                <Box sx={{ p: 2 }}>
                  <Skeleton variant="text" height={28} width="70%" />
                  <Skeleton variant="text" height={20} />
                  <Skeleton variant="text" height={20} width="85%" />
                  <Skeleton
                    variant="rounded"
                    height={28}
                    width="60%"
                    sx={{ mt: 1 }}
                  />
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      ) : projects.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No projects yet.
          </Typography>
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {projects.map((project) => (
              <Grid item xs={12} sm={6} md={4} key={project.id}>
                <ProjectCard
                  project={project}
                  onEdit={isAdmin ? openEdit : undefined}
                  onDelete={isAdmin ? deleteProject : undefined}
                />
              </Grid>
            ))}
          </Grid>

          {hasMore && (
            <Box sx={{ textAlign: "center", mt: 4 }}>
              <Button variant="outlined" onClick={loadMore} disabled={loading}>
                {loading ? "Loading..." : "Load More"}
              </Button>
            </Box>
          )}
        </>
      )} */}
      {loading && projects.length === 0 ? (
        <Box className="projects-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <Box key={i} className="project-skeleton-card">
              <Skeleton variant="rectangular" height={140} />
              <Box sx={{ p: 2 }}>
                <Skeleton variant="text" height={28} width="70%" />
                <Skeleton variant="text" height={20} />
                <Skeleton variant="text" height={20} width="85%" />
                <Skeleton
                  variant="rounded"
                  height={28}
                  width="60%"
                  sx={{ mt: 1 }}
                />
              </Box>
            </Box>
          ))}
        </Box>
      ) : projects.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No projects yet.
          </Typography>
        </Box>
      ) : (
        <>
          <Box className="projects-grid">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onEdit={isAdmin ? openEdit : undefined}
                onDelete={isAdmin ? deleteProject : undefined}
              />
            ))}
          </Box>

          {hasMore && (
            <Box sx={{ textAlign: "center", mt: 4 }}>
              <Button variant="outlined" onClick={loadMore} disabled={loading}>
                {loading ? "Loading..." : "Load More"}
              </Button>
            </Box>
          )}
        </>
      )}

      {/* ── Admin: Add Project FAB ──────────────────────────────────── */}
      {isAdmin && (
        <Fab
          color="primary"
          aria-label="add project"
          onClick={openAdd}
          sx={{ position: "fixed", bottom: 24, right: 24 }}
        >
          <AddIcon />
        </Fab>
      )}

      {/* ── Add/Edit dialog ─────────────────────────────────────────── */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {editingProject ? "Edit Project" : "Add Project"}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Title"
              fullWidth
              value={form.title}
              onChange={(e) =>
                setForm((f) => ({ ...f, title: e.target.value }))
              }
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              minRows={3}
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
            />
            <TextField
              label="Tech Stack (comma-separated)"
              fullWidth
              placeholder="React, FastAPI, PostgreSQL"
              value={form.tech_stack}
              onChange={(e) =>
                setForm((f) => ({ ...f, tech_stack: e.target.value }))
              }
            />
            <TextField
              label="Image URL"
              fullWidth
              value={form.image_url}
              onChange={(e) =>
                setForm((f) => ({ ...f, image_url: e.target.value }))
              }
            />
            <TextField
              label="Repository URL"
              fullWidth
              value={form.repo_url}
              onChange={(e) =>
                setForm((f) => ({ ...f, repo_url: e.target.value }))
              }
            />
            <TextField
              label="Live Demo URL"
              fullWidth
              value={form.live_url}
              onChange={(e) =>
                setForm((f) => ({ ...f, live_url: e.target.value }))
              }
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={form.featured}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, featured: e.target.checked }))
                  }
                />
              }
              label="Featured project"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
