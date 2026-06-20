import { useState, useRef, useCallback } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import "./FileDropzone.css";

export default function FileDropzone({
  onFileSelect,
  accept = "application/pdf",
  label = "Drag and drop a file here, or click to browse",
  maxSizeMB = 10,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState(null);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const validateAndSelect = useCallback(
    (file) => {
      if (!file) return;

      setError(null);

      const maxBytes = maxSizeMB * 1024 * 1024;
      if (file.size > maxBytes) {
        setError(`File too large. Max ${maxSizeMB}MB.`);
        setSelectedFileName(null);
        return;
      }

      setSelectedFileName(file.name);
      onFileSelect(file);
    },
    [maxSizeMB, onFileSelect],
  );

  const handleInputChange = (e) => {
    const file = e.target.files?.[0];
    validateAndSelect(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    validateAndSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <Box>
      <Box
        className={`file-dropzone ${isDragging ? "file-dropzone--dragging" : ""}`}
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        role="button"
        tabIndex={0}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleInputChange}
          className="file-dropzone__input"
        />

        {selectedFileName ? (
          <>
            <InsertDriveFileIcon className="file-dropzone__icon" />
            <Typography variant="body2" fontWeight={600}>
              {selectedFileName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Click to choose a different file
            </Typography>
          </>
        ) : (
          <>
            <UploadFileIcon className="file-dropzone__icon" />
            <Typography variant="body2" color="text.secondary">
              {label}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Max {maxSizeMB}MB
            </Typography>
          </>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mt: 1.5 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
}
