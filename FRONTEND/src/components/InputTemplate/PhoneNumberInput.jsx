import {
  FormControl,
  FormLabel,
  MenuItem,
  Select,
  TextField,
  FormHelperText,
  Box,
} from "@mui/material";
import { Controller } from "react-hook-form";

const countryCodes = [
  { code: "US", label: "+1" },
  { code: "IN", label: "+91" },
  { code: "GB", label: "+44" },
  { code: "AU", label: "+61" },
  { code: "JP", label: "+81" },
  // Add more as needed
];

function PhoneNumberInput({ control, defaultCode = "", defaultNumber = "" }) {
  return (
    <FormControl fullWidth sx={{ py: "1rem" }}>
      <FormLabel>Phone Number</FormLabel>

      <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
        {/* Country Code Dropdown */}
        <Controller
          name="country_code"
          control={control}
          defaultValue={defaultCode}
          render={({ field, fieldState }) => (
            <FormControl sx={{ minWidth: 120 }}>
              <Select {...field} size="small">
                {countryCodes.map((item) => (
                  <MenuItem key={item.code} value={item.code}>
                    {item.label} ({item.code})
                  </MenuItem>
                ))}
              </Select>
              {fieldState?.error && (
                <FormHelperText error>
                  {fieldState.error.message}
                </FormHelperText>
              )}
            </FormControl>
          )}
        />

        {/* Phone Number Text Field */}
        <Controller
          name="phone_number"
          control={control}
          defaultValue={defaultNumber}
          render={({ field, fieldState }) => (
            <Box sx={{ flex: 1 }}>
              <TextField
                {...field}
                placeholder="Phone Number"
                size="small"
                fullWidth
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            </Box>
          )}
        />
      </Box>
    </FormControl>
  );
}

export default PhoneNumberInput;
