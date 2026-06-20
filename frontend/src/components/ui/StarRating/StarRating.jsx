import { useState } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import "./StarRating.css";

const TOTAL_STARS = 5;

export default function StarRating({
  value = 0,
  onChange,
  readOnly = false,
  size = "medium",
}) {
  const [hovered, setHovered] = useState(0);

  const displayValue = !readOnly && hovered > 0 ? hovered : value;

  const handleClick = (star) => {
    if (readOnly || !onChange) return;
    onChange(star);
  };

  const handleMouseEnter = (star) => {
    if (readOnly) return;
    setHovered(star);
  };

  const handleMouseLeave = () => {
    if (readOnly) return;
    setHovered(0);
  };

  const iconSize =
    {
      small: 18,
      medium: 24,
      large: 32,
    }[size] ?? 24;

  return (
    <Box
      className={`star-rating ${readOnly ? "star-rating--readonly" : "star-rating--interactive"}`}
      role="group"
      aria-label={`Rating: ${value} out of ${TOTAL_STARS}`}
    >
      {Array.from({ length: TOTAL_STARS }, (_, i) => {
        const star = i + 1;
        const isFilled = star <= displayValue;

        if (readOnly) {
          return isFilled ? (
            <StarIcon
              key={star}
              className="star-rating__icon star-rating__icon--filled"
              sx={{ fontSize: iconSize }}
              aria-hidden="true"
            />
          ) : (
            <StarBorderIcon
              key={star}
              className="star-rating__icon star-rating__icon--empty"
              sx={{ fontSize: iconSize }}
              aria-hidden="true"
            />
          );
        }

        return (
          <IconButton
            key={star}
            size="small"
            disableRipple
            onClick={() => handleClick(star)}
            onMouseEnter={() => handleMouseEnter(star)}
            onMouseLeave={handleMouseLeave}
            aria-label={`Rate ${star} out of ${TOTAL_STARS}`}
            className="star-rating__btn"
          >
            {isFilled ? (
              <StarIcon
                className="star-rating__icon star-rating__icon--filled"
                sx={{ fontSize: iconSize }}
              />
            ) : (
              <StarBorderIcon
                className="star-rating__icon star-rating__icon--empty"
                sx={{ fontSize: iconSize }}
              />
            )}
          </IconButton>
        );
      })}
    </Box>
  );
}
