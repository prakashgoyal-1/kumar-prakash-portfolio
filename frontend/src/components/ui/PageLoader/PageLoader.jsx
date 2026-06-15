import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import "./PageLoader.css";

export default function PageLoader() {
  return (
    <Box className="page-loader">
      <CircularProgress size={48} thickness={4} />
    </Box>
  );
}
