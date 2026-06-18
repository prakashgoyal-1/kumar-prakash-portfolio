import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import "./Footer.css";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <Box
      component="footer"
      className="footer"
      sx={{
        py: 3,
        px: 2,
        mt: "auto",
        backgroundColor: "background.paper",
        borderTop: "1px solid",
        borderColor: "divider",
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: "center",
        justifyContent: "space-between",
        gap: 1,
      }}
    >
      <Typography variant="body2" color="text.secondary">
        © {year} Kumar Prakash. All rights reserved.
      </Typography>

      <Box sx={{ display: "flex", gap: 0.5 }}>
        <Tooltip title="GitHub">
          <IconButton
            component="a"
            href="https://github.com/prakashgoyal-1"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            size="small"
            color="inherit"
          >
            <GitHubIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="LinkedIn">
          <IconButton
            component="a"
            href="https://www.linkedin.com/in/prakashgoyal1/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            size="small"
            color="inherit"
          >
            <LinkedInIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
}
