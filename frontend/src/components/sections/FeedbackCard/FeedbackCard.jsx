import { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Link from "@mui/material/Link";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import StarRating from "../../ui/StarRating/StarRating";
import { formatDate } from "../../../utils/helpers";
import "./FeedbackCard.css";

const MESSAGE_CLAMP_LINES = 4;

export default function FeedbackCard({ feedback, onApprove, onReject }) {
  const [expanded, setExpanded] = useState(false);
  const showAdminActions = !!onApprove || !!onReject;

  // Determine if attachment is an image (show thumbnail) or other (show link)
  const isImageAttachment = feedback.attachment_url
    ? /\.(png|jpe?g|gif|webp)(\?|$)/i.test(feedback.attachment_url)
    : false;

  return (
    <Card className="feedback-card" variant="outlined">
      <CardContent>
        {/* ── Header: name + date + status chip ─────────────────────── */}
        <Box className="feedback-card__header">
          <Box>
            <Typography variant="subtitle1" fontWeight={600}>
              {feedback.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formatDate(feedback.created_at)}
            </Typography>
          </Box>

          <Stack direction="row" spacing={1} alignItems="center">
            {showAdminActions && (
              <Chip
                label={feedback.status}
                size="small"
                color={
                  feedback.status === "approved"
                    ? "success"
                    : feedback.status === "rejected"
                      ? "error"
                      : "default"
                }
                variant="outlined"
              />
            )}
            <StarRating value={feedback.rating} readOnly size="small" />
          </Stack>
        </Box>

        {/* ── Message with line-clamp + show more toggle ─────────────── */}
        <Box sx={{ mt: 1.5 }}>
          <Typography
            variant="body2"
            className={`feedback-card__message ${
              !expanded ? "feedback-card__message--clamped" : ""
            }`}
          >
            {feedback.message}
          </Typography>

          {/* Only show toggle if message overflows — CSS clamp handles visual,
              we check character count as a proxy for overflow likelihood */}
          {feedback.message.length > 200 && (
            <Button
              size="small"
              sx={{ pl: 0, mt: 0.5, fontSize: "0.75rem" }}
              onClick={() => setExpanded((prev) => !prev)}
            >
              {expanded ? "Show less" : "Show more"}
            </Button>
          )}
        </Box>

        {/* ── Attachment ──────────────────────────────────────────────── */}
        {feedback.attachment_url && (
          <Box sx={{ mt: 1.5 }}>
            {isImageAttachment ? (
              <Box
                component="a"
                href={feedback.attachment_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Box
                  component="img"
                  src={feedback.attachment_url}
                  alt="Feedback attachment"
                  className="feedback-card__thumbnail"
                />
              </Box>
            ) : (
              <Link
                href={feedback.attachment_url}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}
                variant="body2"
              >
                <AttachFileIcon fontSize="small" />
                View attachment
              </Link>
            )}
          </Box>
        )}

        {/* ── Admin moderation controls ───────────────────────────────── */}
        {showAdminActions && feedback.status === "pending" && (
          <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
            {onApprove && (
              <Button
                size="small"
                variant="outlined"
                color="success"
                startIcon={<CheckCircleIcon fontSize="small" />}
                onClick={() => onApprove(feedback.id)}
              >
                Approve
              </Button>
            )}
            {onReject && (
              <Button
                size="small"
                variant="outlined"
                color="error"
                startIcon={<CancelIcon fontSize="small" />}
                onClick={() => onReject(feedback.id)}
              >
                Reject
              </Button>
            )}
          </Stack>
        )}

        {/* Already moderated — show read-only label instead of action buttons */}
        {showAdminActions && feedback.status !== "pending" && (
          <Typography
            variant="caption"
            color={
              feedback.status === "approved" ? "success.main" : "error.main"
            }
            sx={{ mt: 1.5, display: "block" }}
          >
            {feedback.status === "approved" ? "✓ Approved" : "✕ Rejected"}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
