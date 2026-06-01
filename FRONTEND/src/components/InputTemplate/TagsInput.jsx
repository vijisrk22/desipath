import { useState } from "react";
import {
  Box,
  Chip,
  TextField,
  Typography,
} from "@mui/material";
import { Controller } from "react-hook-form";

function TagsInput({ name, text, control }) {
  const [inputValue, setInputValue] = useState("");

  return (
    <Box sx={{ py: 2, borderBottom: "1px solid", borderBottomColor: "grey.200" }}>
      <Typography 
        variant="subtitle2" 
        sx={{ 
          color: "grey.800", 
          fontWeight: 600, 
          fontFamily: "'DM Sans', sans-serif",
          mb: 1
        }}
      >
        {text}
      </Typography>
      
      <Controller
        name={name}
        control={control}
        defaultValue={[]}
        render={({ field }) => {
          const handleKeyDown = (event) => {
            if (event.key === "Enter" && inputValue.trim()) {
              event.preventDefault();
              if (!field.value.includes(inputValue.trim())) {
                field.onChange([...field.value, inputValue.trim()]);
              }
              setInputValue("");
            }
          };

          const handleDelete = (tagToDelete) => {
            field.onChange(field.value.filter((tag) => tag !== tagToDelete));
          };

          return (
            <Box>
              <Box className="flex flex-wrap gap-2 mb-3">
                {field.value.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    onDelete={() => handleDelete(tag)}
                    sx={{
                      backgroundColor: "#ffa41c22",
                      color: "#ffa41c",
                      borderColor: "#ffa41c",
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: 600,
                      borderRadius: "8px",
                      "& .MuiChip-deleteIcon": {
                        color: "#ffa41c",
                        "&:hover": { color: "#e8931a" }
                      }
                    }}
                    variant="outlined"
                  />
                ))}
              </Box>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                placeholder="Type tag and press Enter"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    fontFamily: "'DM Sans', sans-serif",
                    backgroundColor: "grey.50"
                  }
                }}
              />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                Press Enter to add temporary tags (e.g. #bollywood, #concert)
              </Typography>
            </Box>
          );
        }}
      />
    </Box>
  );
}

export default TagsInput;
