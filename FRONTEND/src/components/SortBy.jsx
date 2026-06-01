import { MenuItem, Select, FormControl, InputLabel } from "@mui/material";

function SortBy({ sortOption, setSortOption, type = "property" }) {
  return (
    <FormControl
      variant="outlined"
      size="small"
      sx={{
        minWidth: 160,
        backgroundColor: "#0857d008",
        borderRadius: "8px",
        "& .MuiOutlinedInput-root": {
          borderRadius: "8px",
          backgroundColor: "transparent",
          "& fieldset": {
            borderColor: "#0857d040",
          },
          "&:hover fieldset": {
            borderColor: "#0857d0",
          },
          "&.Mui-focused fieldset": {
             borderColor: "#0857d0",
             borderWidth: "1.5px",
          }
        },
        "& .MuiInputLabel-root": {
          fontSize: "0.9rem",
          fontWeight: "600",
          fontFamily: "DM Sans, sans-serif",
          color: "#0857d0",
        },
        "& .MuiInputLabel-root.Mui-focused": {
          color: "#0857d0",
        }
      }}
    >
      <InputLabel id="sort-by-label">Sort By</InputLabel>
      <Select
        labelId="sort-by-label"
        value={sortOption}
        label="Sort By"
        onChange={(e) => {
          setSortOption(e.target.value);
        }}
        sx={{ 
          borderRadius: "8px",
          color: "#0857d0",
          "& .MuiSelect-select": {
            fontSize: "0.9rem",
            fontWeight: "600",
            fontFamily: "DM Sans, sans-serif",
            py: "8.5px",
          },
          "& .MuiSelect-icon": {
            color: "#0857d0",
          }
        }}
      >
        <MenuItem value="created_at-desc">Newest Listing</MenuItem>
        <MenuItem value="price-asc">Price (Low to High)</MenuItem>
        <MenuItem value="price-desc">Price (High to Low)</MenuItem>
        {(type === "property" || type === "house") && (
          <MenuItem value="area-desc">Square feet</MenuItem>
        )}
      </Select>
    </FormControl>
  );
}

export default SortBy;
