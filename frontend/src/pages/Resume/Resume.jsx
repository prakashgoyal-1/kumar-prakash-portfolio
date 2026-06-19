import { useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Skeleton from "@mui/material/Skeleton";
import Divider from "@mui/material/Divider";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import CircularProgress from "@mui/material/CircularProgress";
import DownloadIcon from "@mui/icons-material/Download";
import DescriptionIcon from "@mui/icons-material/Description";

import { useResume } from "../../hooks/useResume";
import { useAuth } from "../../hooks/useAuth";
import FileDropzone from "../../components/ui/FileDropzone/FileDropzone";
import { formatDate } from "../../utils/helpers";
import "./Resume.css";

export default function Resume() {
  const { isAdmin } = useAuth();
  const { resume, history, loading, uploading, error, upload } = useResume();

  const [pendingFile, setPendingFile] = useState(null);

  const handleUploadClick = async () => {
    if (!pendingFile) return;
    const ok = await upload(pendingFile);
    if (ok) setPendingFile(null);
  };

  const handleDownload = async (url, filename) => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch file");
      const blob = await response.blob();

      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  // ── Loading state ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <Container maxWidth="md" className="resume-page">
        <Skeleton variant="text" height={48} width="40%" />
        <Skeleton variant="text" height={24} width="60%" sx={{ mb: 3 }} />
        <Skeleton variant="rounded" height={56} width={220} />
      </Container>
    );
  }

  // ── Error state ───────────────────────────────────────────────────────────
  if (error) {
    return (
      <Container maxWidth="md" className="resume-page">
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" className="resume-page">
      <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
        Resume
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Download my latest resume below.
      </Typography>

      {/* ── Current resume / download ───────────────────────────────────── */}
      {!resume ? (
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          No resume available yet.
        </Typography>
      ) : (
        <Box className="resume-current-card">
          <DescriptionIcon className="resume-current-card__icon" />
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" fontWeight={600}>
              Version {resume.version}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Uploaded {formatDate(resume.uploaded_at)}
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={() =>
              handleDownload(
                resume.download_url,
                "Kumar_Prakash_FullStack_GenAI_Engineer_Resume.pdf",
              )
            }
          >
            Download Resume
          </Button>
        </Box>
      )}

      {/* ── Admin: upload + history ─────────────────────────────────────── */}
      {isAdmin && (
        <>
          <Divider sx={{ my: 4 }} />

          <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
            Upload New Version
          </Typography>

          <FileDropzone
            accept="application/pdf"
            label="Drag and drop a PDF here, or click to browse"
            maxSizeMB={10}
            onFileSelect={(file) => setPendingFile(file)}
          />

          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              disabled={!pendingFile || uploading}
              onClick={handleUploadClick}
              startIcon={
                uploading ? (
                  <CircularProgress size={18} color="inherit" />
                ) : null
              }
            >
              {uploading ? "Uploading..." : "Upload New Version"}
            </Button>
          </Box>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
            Version History
          </Typography>

          {history.length === 0 ? (
            <Typography color="text.secondary">
              No previous versions yet.
            </Typography>
          ) : (
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Version</TableCell>
                    <TableCell>Uploaded</TableCell>
                    <TableCell align="right">Download</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {history.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>v{item.version}</TableCell>
                      <TableCell>{formatDate(item.uploaded_at)}</TableCell>
                      <TableCell align="right">
                        <Tooltip title="Download this version">
                          <IconButton
                            size="small"
                            component="a"
                            href={item.download_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <DownloadIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </>
      )}
    </Container>
  );
}
