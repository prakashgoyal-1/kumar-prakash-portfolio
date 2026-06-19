import { useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Skeleton from "@mui/material/Skeleton";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Grid from "@mui/material/Grid";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { useFeedback } from "../../hooks/useFeedback";
import { useAuth } from "../../hooks/useAuth";
import StarRating from "../../components/ui/StarRating/StarRating";
import FeedbackCard from "../../components/sections/FeedbackCard/FeedbackCard";
import FileDropzone from "../../components/ui/FileDropzone/FileDropzone";
import "./Feedback.css";

const EMPTY_FORM = {
  name: "",
  email: "",
  message: "",
  rating: 0,
};

export default function Feedback() {
  const { isAdmin } = useAuth();
  const { approved, all, loading, submitting, error, submit, approve, reject } =
    useFeedback();

  const [form, setForm] = useState(EMPTY_FORM);
  const [attachment, setAttachment] = useState(null);
  const [formError, setFormError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const pendingFeedback = all.filter((f) => f.status === "pending");

  // ── Form validation ──────────────────────────────────────────────────────
  const validate = () => {
    if (!form.name.trim()) return "Name is required";
    if (!form.email.trim()) return "Email is required";
    if (!/\S+@\S+\.\S+/.test(form.email)) return "Enter a valid email";
    if (!form.message.trim()) return "Message is required";
    if (form.rating < 1) return "Please select a star rating (1–5)";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      setFormError(err);
      return;
    }
    setFormError(null);
    const ok = await submit(form, attachment);
    if (ok) {
      setForm(EMPTY_FORM);
      setAttachment(null);
      setSubmitted(true);
    }
  };

  return (
    <Container maxWidth="md" className="feedback-page">
      <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
        Feedback
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Share your thoughts, suggestions, or just say hello.
      </Typography>

      {/* ── TOP: Submission form ─────────────────────────────────────────── */}
      {submitted ? (
        <Alert severity="success" sx={{ mb: 4 }}>
          Thank you! Your feedback has been submitted and will appear after
          review.{" "}
          <Button
            size="small"
            onClick={() => setSubmitted(false)}
            sx={{ ml: 1 }}
          >
            Submit another
          </Button>
        </Alert>
      ) : (
        <Box
          component="form"
          onSubmit={handleSubmit}
          className="feedback-form"
          noValidate
        >
          <Stack spacing={2.5}>
            {formError && <Alert severity="error">{formError}</Alert>}

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label="Name"
                fullWidth
                required
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                disabled={submitting}
              />
              <TextField
                label="Email"
                type="email"
                fullWidth
                required
                value={form.email}
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
                disabled={submitting}
              />
            </Stack>

            <TextField
              label="Message"
              fullWidth
              multiline
              minRows={4}
              required
              value={form.message}
              onChange={(e) =>
                setForm((f) => ({ ...f, message: e.target.value }))
              }
              disabled={submitting}
            />

            {/* Star rating — required, validated >= 1 */}
            <Box>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 0.75 }}
              >
                Rating *
              </Typography>
              <StarRating
                value={form.rating}
                onChange={(v) => setForm((f) => ({ ...f, rating: v }))}
                size="large"
              />
            </Box>

            {/* Optional attachment */}
            <Box>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 0.75 }}
              >
                Attachment (optional — PDF or image, max 5MB)
              </Typography>
              <FileDropzone
                accept="application/pdf,image/*"
                label="Drag and drop a file here, or click to browse"
                maxSizeMB={5}
                onFileSelect={setAttachment}
              />
            </Box>

            <Box>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={submitting}
                startIcon={
                  submitting ? (
                    <CircularProgress size={18} color="inherit" />
                  ) : null
                }
              >
                {submitting ? "Submitting..." : "Submit Feedback"}
              </Button>
            </Box>
          </Stack>
        </Box>
      )}

      {/* ── ADMIN: Moderation accordion ─────────────────────────────────── */}
      {isAdmin && (
        <Box sx={{ mt: 5 }}>
          <Accordion
            variant="outlined"
            defaultExpanded={pendingFeedback.length > 0}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6" fontWeight={600}>
                Moderate
                {pendingFeedback.length > 0 && (
                  <Box
                    component="span"
                    className="feedback-page__pending-badge"
                  >
                    {pendingFeedback.length} pending
                  </Box>
                )}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              {all.length === 0 ? (
                <Typography color="text.secondary">
                  No feedback submissions yet.
                </Typography>
              ) : (
                <Stack spacing={2}>
                  {all.map((f) => (
                    <FeedbackCard
                      key={f.id}
                      feedback={f}
                      onApprove={approve}
                      onReject={reject}
                    />
                  ))}
                </Stack>
              )}
            </AccordionDetails>
          </Accordion>
        </Box>
      )}

      {/* ── MIDDLE: Divider ─────────────────────────────────────────────── */}
      <Divider sx={{ my: 5 }}>
        <Typography variant="body2" color="text.secondary">
          What others say
        </Typography>
      </Divider>

      {/* ── BOTTOM: Approved feedback grid ─────────────────────────────── */}
      {loading ? (
        <Stack spacing={2}>
          {Array.from({ length: 3 }).map((_, i) => (
            <Box key={i}>
              <Skeleton variant="text" width="30%" height={24} />
              <Skeleton variant="text" width="100%" />
              <Skeleton variant="text" width="80%" />
              <Skeleton
                variant="text"
                width="50%"
                height={20}
                sx={{ mt: 0.5 }}
              />
            </Box>
          ))}
        </Stack>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : approved.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 6 }}>
          <Typography variant="h6" color="text.secondary">
            Be the first to leave feedback!
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {approved.map((f) => (
            <Grid item xs={12} sm={6} key={f.id}>
              <FeedbackCard feedback={f} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}
