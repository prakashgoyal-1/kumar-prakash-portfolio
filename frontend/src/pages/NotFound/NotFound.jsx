import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import HomeIcon from "@mui/icons-material/Home";
import "./NotFound.css";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <Box className="not-found">
      <Typography variant="h1" className="not-found__code">
        404
      </Typography>
      <Typography variant="h5" color="text.secondary" sx={{ mb: 3 }}>
        Page Not Found
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        The page you're looking for doesn't exist or has been moved.
      </Typography>
      <Button
        variant="contained"
        startIcon={<HomeIcon />}
        onClick={() => navigate("/")}
        size="large"
      >
        Go Home
      </Button>
    </Box>
  );
}
