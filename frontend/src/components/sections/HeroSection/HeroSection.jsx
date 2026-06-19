import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import DownloadIcon from "@mui/icons-material/Download";
import "./HeroSection.css";

export default function HeroSection({
  name = null,
  title = null,
  tagline = null,
  photoUrl = null,
}) {
  const navigate = useNavigate();

  const displayName = name || "Welcome to my Portfolio";
  const displayTitle = title || "Full Stack Developer";
  const displayTagline =
    tagline ||
    "I build scalable web applications and intelligent systems. Explore my work below.";

  return (
    <Box className="hero-section fade-in">
      <Box className="hero-section__content">
        {/* Avatar — only if photoUrl is set */}
        {photoUrl && (
          <Avatar
            src={photoUrl}
            alt={displayName}
            className="hero-section__avatar"
          />
        )}

        <Typography
          variant="h1"
          className="hero-section__heading"
          component="h1"
        >
          {name ? (
            <>
              Hi, I'm{" "}
              <Box component="span" className="hero-section__name-highlight">
                {name}
              </Box>
            </>
          ) : (
            displayName
          )}
        </Typography>

        <Typography
          variant="h4"
          className="hero-section__title"
          color="text.secondary"
        >
          {displayTitle}
        </Typography>

        <Typography
          variant="body1"
          className="hero-section__tagline"
          color="text.secondary"
        >
          {displayTagline}
        </Typography>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          className="hero-section__cta"
        >
          <Button
            variant="contained"
            size="large"
            startIcon={<FolderOpenIcon />}
            onClick={() => navigate("/projects")}
          >
            View Projects
          </Button>
          <Button
            variant="outlined"
            size="large"
            startIcon={<DownloadIcon />}
            onClick={() => navigate("/resume")}
          >
            Download Resume
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
