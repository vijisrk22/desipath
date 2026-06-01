import {
  FormControl,
  FormHelperText,
  FormLabel,
  Chip,
  Box,
  TextField,
} from "@mui/material";
import { Controller } from "react-hook-form";

const ageChips = [
  { label: "All Ages", value: "0" },
  { label: "13+", value: "13" },
  { label: "18+", value: "18" },
  { label: "21+", value: "21" },
  { label: "Custom Age", value: "custom" },
];

function AgeLimitInput({ name, text, control }) {
  return (
    <FormControl
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        width: "100%",
        py: "1rem",
        borderBottom: "1px solid",
        borderBottomColor: "grey.200",
      }}
    >
      <FormLabel 
        id={name}
        sx={{
          color: "grey.800",
          fontWeight: 600,
          fontSize: "0.875rem",
          fontFamily: "'DM Sans', sans-serif",
          mb: 2
        }}
      >
        {text}
      </FormLabel>
      <Controller
        name={name}
        defaultValue="18"
        control={control}
        render={({ field, fieldState }) => {
          const isCustomSelected = field.value === "custom" || !ageChips.some(c => c.value === field.value && c.value !== "custom");
          
          return (
            <Box className="w-full space-y-4">
              <Box className="flex flex-wrap gap-2">
                {ageChips.map((chip) => (
                  <Chip
                    key={chip.value}
                    label={chip.label}
                    onClick={() => field.onChange(chip.value)}
                    variant={(field.value === chip.value || (chip.value === "custom" && isCustomSelected && !ageChips.some(c => c.value === field.value && c.value !== "custom"))) ? "filled" : "outlined"}
                    sx={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: 600,
                      borderRadius: "8px",
                      px: 1,
                      py: 2,
                      borderColor: (field.value === chip.value || (chip.value === "custom" && isCustomSelected && !ageChips.some(c => c.value === field.value && c.value !== "custom"))) ? "#ffa41c" : "grey.300",
                      backgroundColor: (field.value === chip.value || (chip.value === "custom" && isCustomSelected && !ageChips.some(c => c.value === field.value && c.value !== "custom"))) ? "#ffa41c" : "transparent",
                      color: (field.value === chip.value || (chip.value === "custom" && isCustomSelected && !ageChips.some(c => c.value === field.value && c.value !== "custom"))) ? "white" : "grey.700",
                      "&:hover": {
                        backgroundColor: (field.value === chip.value || (chip.value === "custom" && isCustomSelected)) ? "#e8931a" : "grey.50",
                      }
                    }}
                  />
                ))}
              </Box>
              
              {isCustomSelected && (
                <Box className="flex items-center gap-3 mt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  <span className="text-sm font-medium text-gray-500 font-dmsans italic">Enter custom age:</span>
                  <TextField
                    type="text"
                    variant="outlined"
                    size="small"
                    placeholder="e.g. 12-35"
                    autoFocus
                    value={field.value === "custom" ? "" : field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    sx={{
                      width: "140px",
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                        fontFamily: "'DM Sans', sans-serif",
                      }
                    }}
                  />
                </Box>
              )}

              {fieldState?.error && (
                <FormHelperText error sx={{ mt: 1 }}>{fieldState.error.message}</FormHelperText>
              )}
            </Box>
          );
        }}
      />
    </FormControl>
  );
}

export default AgeLimitInput;
