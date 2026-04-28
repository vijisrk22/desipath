import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { IconButton } from "@mui/material";

function LikeButton({ setIsFavorited, isFavorited }) {
  return (
    <IconButton 
      onClick={(e) => {
        e.stopPropagation();
        setIsFavorited(!isFavorited);
      }}
      size="small"
      sx={{ 
        color: isFavorited ? "red" : "#007185",
        backgroundColor: "transparent",
        "&:hover": { backgroundColor: "rgba(0,113,133,0.05)" }
      }}
    >
      {isFavorited ? (
        <FavoriteIcon fontSize="medium" />
      ) : (
        <FavoriteBorderIcon fontSize="medium" />
      )}
    </IconButton>
  );
}

export default LikeButton;
