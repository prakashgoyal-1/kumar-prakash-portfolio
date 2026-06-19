import { useMemo } from "react";
import { Link as RouterLink } from "react-router-dom";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Skeleton from "@mui/material/Skeleton";
import Grid from "@mui/material/Grid";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import HeroSection from "../../components/sections/HeroSection/HeroSection";
import ProjectCard from "../../components/sections/ProjectCard/ProjectCard";
import FeedbackCard from "../../components/sections/FeedbackCard/FeedbackCard";
import SkillChip from "../../components/sections/SkillChip/SkillChip";

import { useAbout } from "../../hooks/useAbout";
import { useProjects } from "../../hooks/useProjects";
import { useFeedback } from "../../hooks/useFeedback";
import { useAuth } from "../../hooks/useAuth";

import "./Home.css";

const MAX_FEATURED_PROJECTS = 3;
const MAX_FEATURED_FEEDBACK = 2;
const MAX_HOME_SKILLS = 8;

export default function Home() {
  const { about, skills, loading: aboutLoading } = useAbout();

  const { projects, loading: projectsLoading } = useProjects();

  const { approved: approvedFeedback, loading: feedbackLoading } =
    useFeedback();

  const { user } = useAuth();

  // ── Derived data ─────────────────────────────────────────────────────────
  const featuredProjects = useMemo(
    () => projects.filter((p) => p.featured).slice(0, MAX_FEATURED_PROJECTS),
    [projects],
  );

  const featuredFeedback = useMemo(
    () => approvedFeedback.slice(0, MAX_FEATURED_FEEDBACK),
    [approvedFeedback],
  );

  const homeSkills = useMemo(() => skills.slice(0, MAX_HOME_SKILLS), [skills]);

  const showFeaturedProjects = !projectsLoading && featuredProjects.length > 0;
  const showFeaturedFeedback = !feedbackLoading && featuredFeedback.length > 0;
  const showSkills = !aboutLoading && homeSkills.length > 0;

  return (
    <Box className="home-page">
      {/* ── Section 1: Hero ──────────────────────────────────────────────── */}
      {aboutLoading ? (
        <Box className="home-page__hero-skeleton">
          <Skeleton
            variant="circular"
            width={100}
            height={100}
            sx={{ mb: 2 }}
          />
          <Skeleton variant="text" height={56} width="55%" />
          <Skeleton variant="text" height={32} width="40%" />
          <Skeleton variant="text" height={24} width="65%" />
          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <Skeleton variant="rounded" height={44} width={160} />
            <Skeleton variant="rounded" height={44} width={160} />
          </Stack>
        </Box>
      ) : (
        <HeroSection
          name={about?.full_name || null}
          title={about?.title || null}
          tagline={about?.bio ? about.bio.split("\n")[0] : null}
          photoUrl={about?.photo_url || null}
        />
      )}

      {/* ── Section 2: Featured Projects ─────────────────────────────────── */}
      {projectsLoading ? (
        <Container maxWidth="lg" className="home-page__section">
          <Skeleton variant="text" height={36} width="30%" sx={{ mb: 3 }} />
          <Grid container spacing={3}>
            {Array.from({ length: 3 }).map((_, i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Skeleton variant="rounded" height={360} />
              </Grid>
            ))}
          </Grid>
        </Container>
      ) : showFeaturedProjects ? (
        <Container maxWidth="lg" className="home-page__section slide-up">
          <Box className="home-page__section-header">
            <Typography variant="h4" fontWeight={700}>
              Featured Projects
            </Typography>
            <Button
              component={RouterLink}
              to="/projects"
              endIcon={<ArrowForwardIcon />}
              color="primary"
            >
              View all
            </Button>
          </Box>

          <Box className="home-projects-grid">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </Box>
        </Container>
      ) : null}

      {/* ── Divider between sections (only if both sections shown) ─────── */}
      {showFeaturedProjects && (showSkills || showFeaturedFeedback) && (
        <Divider sx={{ my: 1 }} />
      )}

      {/* ── Section 3: Skills preview ─────────────────────────────────────── */}
      {showSkills && (
        <Container maxWidth="lg" className="home-page__section slide-up">
          <Box className="home-page__section-header">
            <Typography variant="h4" fontWeight={700}>
              My Skills
            </Typography>
            <Button
              component={RouterLink}
              to="/about"
              endIcon={<ArrowForwardIcon />}
              color="primary"
            >
              About me
            </Button>
          </Box>

          <Stack
            direction="row"
            spacing={1}
            flexWrap="wrap"
            useFlexGap
            sx={{ mt: 1 }}
          >
            {homeSkills.map((skill) => (
              <SkillChip key={skill.id} skill={skill} />
            ))}
            {skills.length > MAX_HOME_SKILLS && (
              <Button
                component={RouterLink}
                to="/about"
                size="small"
                variant="outlined"
              >
                +{skills.length - MAX_HOME_SKILLS} more
              </Button>
            )}
          </Stack>
        </Container>
      )}

      {/* ── Divider ───────────────────────────────────────────────────────── */}
      {showFeaturedFeedback && showSkills && <Divider sx={{ my: 1 }} />}

      {/* ── Section 4: Featured Feedback ─────────────────────────────────── */}
      {feedbackLoading ? null : showFeaturedFeedback ? (
        <Container maxWidth="lg" className="home-page__section slide-up">
          <Box className="home-page__section-header">
            <Typography variant="h4" fontWeight={700}>
              What people say
            </Typography>
            <Button
              component={RouterLink}
              to="/feedback"
              endIcon={<ArrowForwardIcon />}
              color="primary"
            >
              All feedback
            </Button>
          </Box>

          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            {featuredFeedback.map((f) => (
              <Grid item xs={12} sm={6} key={f.id}>
                <FeedbackCard feedback={f} />
              </Grid>
            ))}
          </Grid>
        </Container>
      ) : null}

      {/* Bottom padding */}
      <Box sx={{ pb: 6 }} />
    </Box>
  );
}
