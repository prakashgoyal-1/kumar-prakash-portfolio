import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import "./SkillChip.css";

const MAX_LEVEL = 5;

function levelDots(level) {
  return "●".repeat(level) + "○".repeat(MAX_LEVEL - level);
}

export default function SkillChip({ skill, onEdit, onDelete }) {
  const showActions = !!onEdit || !!onDelete;

  return (
    <Box className="skill-chip-wrapper">
      <Chip
        label={
          <span>
            {skill.name}{" "}
            <span
              className="skill-chip__dots"
              aria-label={`level ${skill.level} of ${MAX_LEVEL}`}
            >
              {levelDots(skill.level)}
            </span>
          </span>
        }
        variant="outlined"
        className="skill-chip"
      />
      {showActions && (
        <Box className="skill-chip__actions">
          {onEdit && (
            <Tooltip title="Edit skill">
              <IconButton size="small" onClick={() => onEdit(skill)}>
                <EditIcon fontSize="inherit" />
              </IconButton>
            </Tooltip>
          )}
          {onDelete && (
            <Tooltip title="Delete skill">
              <IconButton size="small" onClick={() => onDelete(skill.id)}>
                <DeleteIcon fontSize="inherit" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      )}
    </Box>
  );
}
