import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { FormHelperText, FormLabel } from "@mui/material";
import { Controller } from "react-hook-form";

export default function SelectInput({
  name,
  control,
  label = "Expected Rent",
  data,
}) {
  return (
    <FormControl
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        width: "100%",
        py: "0.75rem",
        gap: "0.5rem",
      }}
    >
      <FormLabel 
        sx={{ 
          color: "gray.800", 
          fontWeight: "bold", 
          fontSize: "1rem",
          fontFamily: "dmsans" 
        }}
      >
        {label}
      </FormLabel>

      <div className="w-full">
        <Controller
          name={name}
          control={control}
          rules={{
            required: "This field is required", 
          }}
          render={({ field, fieldState }) => (
            <>
              <Select
                {...field}
                labelId={label}
                id={name}
                value={field.value ?? ""}
                fullWidth
                sx={{ 
                  borderRadius: "12px",
                  border: "1.5px solid #ccc",
                  transition: "border-color 0.2s",
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: "none",
                  },
                  "&:hover": {
                    borderColor: "#999",
                  },
                  "&.Mui-focused": {
                    borderColor: "#ffa41c",
                    borderWidth: "1.5px",
                  },
                }}
              >
                {data?.map((val, index) => (
                  <MenuItem key={index} value={val}>
                    {val}
                  </MenuItem>
                ))}
              </Select>
              {fieldState?.error && (
                <FormHelperText error sx={{ mt: 0.5 }}>
                  {fieldState.error.message}
                </FormHelperText>
              )}
            </>
          )}
        />
      </div>
    </FormControl>
  );
}
