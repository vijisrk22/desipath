import { FormControl, FormHelperText, FormLabel } from "@mui/material";
import TextField from "@mui/material/TextField";
import { Controller } from "react-hook-form";

function TextFieldInput({
  name,
  control,
  defaultValue = "",
  text,
  customProps,
  type = "text",
  requiredAssertion = true,
  rules = {},
}) {
  return (
    <div>
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
          htmlFor={name}
          sx={{ 
            color: "#374151", 
            fontWeight: 600, 
            fontSize: "0.875rem",
            mb: 0.5,
            fontFamily: "DM Sans, sans-serif" 
          }}
        >
          {text}
        </FormLabel>
        <Controller
          name={name}
          control={control}
          defaultValue=""
          rules={{
            ...(requiredAssertion ? { required: "This field is required" } : {}),
            ...rules,
          }}
          render={({ field, fieldState }) => (
            <div className="w-full">
              <TextField
                {...field}
                value={field.value || ""}
                id={name}
                type={type}
                variant="outlined"
                size="medium"
                placeholder={defaultValue}
                sx={{ 
                  width: "100%",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    border: "1.5px solid #e5e7eb",
                    backgroundColor: "#f9fafb",
                    fontSize: "0.875rem",
                    fontFamily: "DM Sans, sans-serif",
                    transition: "border-color 0.2s",
                    "& fieldset": {
                      border: "none",
                    },
                    "&:hover": {
                      borderColor: "#ffa41c",
                    },
                    "&.Mui-focused": {
                      borderColor: "#ffa41c",
                      borderWidth: "1.5px",
                    },
                  },
                }}
                {...customProps}
              />
              {fieldState?.error && (
                <FormHelperText error sx={{ mt: 0.5 }}>
                  {fieldState.error.message}
                </FormHelperText>
              )}
            </div>
          )}
        />
      </FormControl>
    </div>
  );
}

export default TextFieldInput;
