// frontend/src/components/sections/ProjectCard/ProjectCard.jsx
import { useState } from "react";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActionArea from "@mui/material/CardActionArea";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import GitHubIcon from "@mui/icons-material/GitHub";
import LaunchIcon from "@mui/icons-material/Launch";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import "./ProjectCard.css";

function getInitials(title) {
  return title
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

const MAX_VISIBLE_TECHS = 4;

export default function ProjectCard({ project, onEdit, onDelete }) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const showAdminActions = !!onEdit || !!onDelete;
  const visibleTechs = (project.tech_stack || []).slice(0, MAX_VISIBLE_TECHS);
  const extraTechCount = (project.tech_stack || []).length - MAX_VISIBLE_TECHS;

  return (
    <>
      <Card className="project-card" variant="outlined">
        <CardActionArea
          onClick={() => setDetailsOpen(true)}
          className="project-card__action-area"
        >
          <Box className="project-card__media-zone">
            {project.image_url ? (
              <CardMedia
                component="img"
                className="project-card__media"
                image={project.image_url}
                alt={project.title}
              />
            ) : (
              <Box className="project-card__placeholder">
                <Typography variant="h4" className="project-card__initials">
                  {getInitials(project.title)}
                </Typography>
              </Box>
            )}
          </Box>

          <CardContent className="project-card__content">
            <Typography
              variant="h6"
              fontWeight={700}
              className="project-card__title"
            >
              {project.title}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              className="project-card__description"
            >
              {project.description || ""}
            </Typography>

            <Stack
              direction="row"
              spacing={0.5}
              className="project-card__tech-row"
            >
              {visibleTechs.map((tech) => (
                <Chip key={tech} label={tech} size="small" variant="outlined" />
              ))}
              {extraTechCount > 0 && (
                <Chip
                  label={`+${extraTechCount}`}
                  size="small"
                  variant="outlined"
                />
              )}
            </Stack>
          </CardContent>
        </CardActionArea>

        {/* ── Footer strip: links on left, admin actions on right ────────── */}
        <Box className="project-card__links-row">
          <Stack direction="row" spacing={0.5}>
            {project.repo_url && (
              <Tooltip title="View repository">
                <IconButton
                  size="small"
                  component="a"
                  href={project.repo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  <GitHubIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            {project.live_url && (
              <Tooltip title="View live demo">
                <IconButton
                  size="small"
                  component="a"
                  href={project.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  <LaunchIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Stack>

          {showAdminActions && (
            <Stack
              direction="row"
              spacing={0.5}
              className="project-card__admin-actions"
            >
              {onEdit && (
                <Tooltip title="Edit project">
                  <IconButton size="small" onClick={() => onEdit(project)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
              {onDelete && (
                <Tooltip title="Delete project">
                  <IconButton size="small" onClick={() => onDelete(project.id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
            </Stack>
          )}
        </Box>
      </Card>

      <Dialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>{project.title}</DialogTitle>
        <DialogContent>
          {project.image_url && (
            <Box
              component="img"
              src={project.image_url}
              alt={project.title}
              sx={{ width: "100%", borderRadius: 1, mb: 2 }}
            />
          )}
          <Typography variant="body1" sx={{ mb: 2, whiteSpace: "pre-line" }}>
            {project.description}
          </Typography>
          <Stack
            direction="row"
            spacing={0.75}
            flexWrap="wrap"
            useFlexGap
            sx={{ mb: 2 }}
          >
            {(project.tech_stack || []).map((tech) => (
              <Chip key={tech} label={tech} size="small" />
            ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          {project.repo_url && (
            <Button
              startIcon={<GitHubIcon />}
              href={project.repo_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Repository
            </Button>
          )}
          {project.live_url && (
            <Button
              startIcon={<LaunchIcon />}
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Live Demo
            </Button>
          )}
          <Button onClick={() => setDetailsOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
