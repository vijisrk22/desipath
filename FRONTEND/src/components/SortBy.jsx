import { MenuItem, Select, FormControl, InputLabel } from "@mui/material";

function SortBy({ sortOption, setSortOption }) {
  return (
    <FormControl
      variant="outlined"
      size="small"
      sx={{
        minWidth: 160,
        backgroundColor: "white",
        "& .MuiOutlinedInput-root": {
          borderRadius: "8px",
        },
        "& .MuiSelect-select": {
          padding: "10px",
        },
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
      >
        <MenuItem value="">Sort By</MenuItem>
        <MenuItem value="price-asc">Price (Low to High)</MenuItem>
        <MenuItem value="price-desc">Price (High to Low)</MenuItem>
        <MenuItem value="name-asc">Alphabetical (A-Z)</MenuItem>
        <MenuItem value="name-desc">Alphabetical (Z-A)</MenuItem>
      </Select>
    </FormControl>
  );
}

export default SortBy;
