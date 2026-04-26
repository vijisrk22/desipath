import { MenuItem, Select, FormControl, InputLabel } from "@mui/material";

function SortBy({ sortOption, setSortOption, type = "property" }) {
  return (
    <FormControl
      variant="outlined"
      size="small"
      sx={{
        minWidth: 180,
        backgroundColor: "white",
        "& .MuiOutlinedInput-root": {
          borderRadius: "12px",
          "&.Mui-focused fieldset": {
             borderColor: "#007185",
          }
        },
        "& .MuiInputLabel-root.Mui-focused": {
          color: "#007185",
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
        sx={{ borderRadius: "12px" }}
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
