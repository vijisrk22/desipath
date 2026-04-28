import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Checkbox,
  FormGroup,
} from "@mui/material";
import { Controller } from "react-hook-form";

function NCheckboxInput({ name, text, options, control }) {
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
          mb: 1
        }}
      >
        {text}
      </FormLabel>
      <Controller
        name={name}
        defaultValue={[]}
        control={control}
        rules={{
          required: "Select at least one option",
        }}
        render={({ field, fieldState }) => {
          const handleChange = (value) => {
            const currentValues = field.value || [];
            const newValues = currentValues.includes(value)
              ? currentValues.filter((v) => v !== value)
              : [...currentValues, value];
            field.onChange(newValues);
          };

          return (
            <div className="w-full">
              <FormGroup row>
                {options.map((option) => (
                  <FormControlLabel
                    key={option.value}
                    control={
                      <Checkbox
                        checked={field.value?.includes(option.value)}
                        onChange={() => handleChange(option.value)}
                        sx={{
                          color: "#ffa41c",
                          "&.Mui-checked": {
                            color: "#ffa41c",
                          },
                        }}
                      />
                    }
                    label={
                      <span style={{ 
                        fontFamily: "'DM Sans', sans-serif", 
                        fontSize: "0.9rem", 
                        color: "grey.700" 
                      }}>
                        {option.label}
                      </span>
                    }
                    sx={{ marginRight: 4 }}
                  />
                ))}
              </FormGroup>
              {fieldState?.error && (
                <FormHelperText error sx={{ mt: 1 }}>{fieldState.error.message}</FormHelperText>
              )}
            </div>
          );
        }}
      />
    </FormControl>
  );
}

export default NCheckboxInput;
