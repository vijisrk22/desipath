import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { Controller } from "react-hook-form";

function NRadioInput({ name, text, options, control }) {
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
        defaultValue={options[0]?.value || ""}
        control={control}
        rules={{
          required: "This field is required",
        }}
        render={({ field, fieldState }) => (
          <div className="w-full">
            <RadioGroup 
              row 
              {...field}
              sx={{
                "& .MuiFormControlLabel-root": {
                  marginRight: 4,
                  "& .MuiTypography-root": {
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "0.9rem",
                    color: "grey.700"
                  }
                },
                "& .MuiRadio-root": {
                  color: "#ffa41c",
                  "&.Mui-checked": {
                    color: "#ffa41c",
                  }
                }
              }}
            >
              {options.map((option) => (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  control={<Radio />}
                  label={option.label}
                />
              ))}
            </RadioGroup>
            {fieldState?.error && (
              <FormHelperText error sx={{ mt: 1 }}>{fieldState.error.message}</FormHelperText>
            )}
          </div>
        )}
      />
    </FormControl>
  );
}

export default NRadioInput;
