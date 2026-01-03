import FavoriteIcon from "@mui/icons-material/Favorite";

function LikeButton({ setIsFavorited, isFavorited }) {
  return (
    <button
      onClick={() => setIsFavorited(!isFavorited)}
      className="absolute bottom-3 right-4  flex items-center justify-center bg-white/40 p-2 rounded-full shadow-md"
    >
      {isFavorited ? (
        <FavoriteIcon
          sx={{ width: "1.5rem", height: "1.5rem", color: "red" }}
        />
      ) : (
        <img
          src={isFavorited ? "/heartFilled.svg" : "/heart.svg"}
          alt="heart"
          className="w-6 h-6"
        />
      )}
    </button>
  );
}

export default LikeButton;
