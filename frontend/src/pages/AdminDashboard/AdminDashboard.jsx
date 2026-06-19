import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Skeleton from "@mui/material/Skeleton";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

// Stat icons
import FolderSpecialIcon from "@mui/icons-material/FolderSpecial";
import FeedbackIcon from "@mui/icons-material/Feedback";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import StarIcon from "@mui/icons-material/Star";
import DescriptionIcon from "@mui/icons-material/Description";
import BuildIcon from "@mui/icons-material/Build";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import RefreshIcon from "@mui/icons-material/Refresh";

// Quick action icons
import AddBoxIcon from "@mui/icons-material/AddBox";
import RateReviewIcon from "@mui/icons-material/RateReview";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import PersonIcon from "@mui/icons-material/Person";

import AdminGuard from "../../components/layout/AdminGuard/AdminGuard";
import { getAdminStats } from "../../api/admin.api";
import { useAuth } from "../../hooks/useAuth";
import "./AdminDashboard.css";

// ── Stat card config ──────────────────────────────────────────────────────────
const buildStatCards = (stats) => [
  {
    label: "Total Projects",
    value: stats.total_projects,
    icon: <FolderSpecialIcon />,
    color: "#2563EB",
  },
  {
    label: "Total Feedback",
    value: stats.total_feedback,
    icon: <FeedbackIcon />,
    color: "#7C3AED",
  },
  {
    label: "Pending Feedback",
    value: stats.pending_feedback_count,
    icon: <PendingActionsIcon />,
    color: stats.pending_feedback_count > 0 ? "#D97706" : "#16A34A",
  },
  {
    label: "Average Rating",
    value:
      stats.average_rating !== null && stats.average_rating !== undefined
        ? `${stats.average_rating} / 5`
        : "No data",
    icon: <StarIcon />,
    color: "#F59E0B",
  },
  {
    label: "Resume Version",
    value:
      stats.resume_current_version !== null &&
      stats.resume_current_version !== undefined
        ? `v${stats.resume_current_version}`
        : "Not uploaded",
    icon: <DescriptionIcon />,
    color: "#0891B2",
  },
  {
    label: "Total Skills",
    value: stats.total_skills,
    icon: <BuildIcon />,
    color: "#059669",
  },
  {
    label: "Certifications",
    value: stats.total_certifications,
    icon: <WorkspacePremiumIcon />,
    color: "#DC2626",
  },
];

// ── Quick action config ───────────────────────────────────────────────────────
const QUICK_ACTIONS = [
  {
    label: "Manage Projects",
    to: "/projects",
    icon: <AddBoxIcon />,
    color: "primary",
  },
  {
    label: "Moderate Feedback",
    to: "/feedback",
    icon: <RateReviewIcon />,
    color: "secondary",
  },
  {
    label: "Upload Resume",
    to: "/resume",
    icon: <UploadFileIcon />,
    color: "primary",
  },
  {
    label: "Edit About",
    to: "/about",
    icon: <PersonIcon />,
    color: "secondary",
  },
];

function StatCard({ label, value, icon, color }) {
  return (
    <Card variant="outlined" className="admin-stat-card">
      <CardContent className="admin-stat-card__content">
        <Box
          className="admin-stat-card__icon-wrap"
          sx={{ backgroundColor: `${color}18` }}
        >
          <Box sx={{ color }}>{icon}</Box>
        </Box>
        <Box sx={{ mt: 2 }}>
          <Typography variant="h4" fontWeight={700} sx={{ lineHeight: 1.2 }}>
            {value}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {label}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

function StatCardSkeleton() {
  return (
    <Card variant="outlined" className="admin-stat-card">
      <CardContent className="admin-stat-card__content">
        <Skeleton variant="circular" width={44} height={44} />
        <Box sx={{ mt: 2 }}>
          <Skeleton variant="text" height={44} width="50%" />
          <Skeleton variant="text" height={20} width="70%" />
        </Box>
      </CardContent>
    </Card>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastRefreshed, setLastRefreshed] = useState(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAdminStats();
      setStats(data);
      setLastRefreshed(new Date());
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to load stats");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const formatRefreshTime = (date) =>
    date
      ? date.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      : "—";

  const statCards = stats ? buildStatCards(stats) : [];

  return (
    <AdminGuard>
      <Container maxWidth="lg" className="admin-dashboard">
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <Box className="admin-dashboard__header">
          <Box>
            <Typography variant="h4" fontWeight={700}>
              Welcome, {user?.full_name || "Admin"} 👋
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Last refreshed: {formatRefreshTime(lastRefreshed)}
            </Typography>
          </Box>
          <Tooltip title="Refresh stats">
            <IconButton
              onClick={fetchStats}
              disabled={loading}
              aria-label="refresh stats"
              size="large"
            >
              <RefreshIcon
                className={loading ? "admin-dashboard__refresh-spin" : ""}
              />
            </IconButton>
          </Tooltip>
        </Box>

        {/* ── Error state ─────────────────────────────────────────────────── */}
        {error && (
          <Typography color="error" sx={{ mb: 3 }}>
            {error}
          </Typography>
        )}

        {/* ── Stat cards grid ─────────────────────────────────────────────── */}
        <Grid container spacing={3} sx={{ mb: 5 }}>
          {loading
            ? Array.from({ length: 7 }).map((_, i) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
                  <StatCardSkeleton />
                </Grid>
              ))
            : statCards.map((card) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={card.label}>
                  <StatCard {...card} />
                </Grid>
              ))}
        </Grid>

        <Divider sx={{ mb: 4 }} />

        {/* ── Quick actions ────────────────────────────────────────────────── */}
        <Typography variant="h5" fontWeight={600} sx={{ mb: 2.5 }}>
          Quick Actions
        </Typography>
        <Stack
          direction="row"
          spacing={2}
          flexWrap="wrap"
          useFlexGap
          className="admin-dashboard__quick-actions"
        >
          {QUICK_ACTIONS.map(({ label, to, icon, color }) => (
            <Button
              key={to}
              variant="outlined"
              color={color}
              startIcon={icon}
              onClick={() => navigate(to)}
              className="admin-dashboard__action-btn"
            >
              {label}
            </Button>
          ))}
        </Stack>
      </Container>
    </AdminGuard>
  );
}
