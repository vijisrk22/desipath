import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  FormHelperText,
} from "@mui/material";
import { Controller } from "react-hook-form";

function TwoRadioInput({ name, text, op1 = "Yes", op2 = "No", control }) {
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
        id={name}
        sx={{ 
          color: "gray.800", 
          fontWeight: "bold", 
          fontSize: "1rem",
          fontFamily: "dmsans" 
        }}
      >
        {text}
      </FormLabel>
      <Controller
        name={name}
        control={control}
        defaultValue={op1} 
        rules={{
          required: "This field is required", 
        }}
        render={({ field, fieldState }) => (
          <div className="w-full">
            <RadioGroup row {...field}>
              <FormControlLabel
                value={op1}
                control={<Radio />}
                label={op1}
              />
              <FormControlLabel
                value={op2}
                control={<Radio />}
                label={op2}
              />
            </RadioGroup>
            {fieldState?.error && (
              <FormHelperText error sx={{ mt: 0.5 }}>
                {fieldState.error.message}
              </FormHelperText>
            )}
          </div>
        )}
      />
    </FormControl>
  );
}

export default TwoRadioInput;
