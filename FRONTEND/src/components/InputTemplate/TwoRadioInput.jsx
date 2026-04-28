import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  FormHelperText,
} from "@mui/material";
import { Controller } from "react-hook-form";

function TwoRadioInput({ name, text, op1 = "Yes", op2 = "No", control, defaultValue }) {
  return (
    <FormControl
      fullWidth
      sx={{
        py: "0.5rem",
        borderBottom: "1px solid",
        borderBottomColor: "grey.100",
        mb: 2,
      }}
    >
      <FormLabel 
        sx={{ 
          fontSize: "0.875rem", 
          fontWeight: 600, 
          color: "grey.800",
          mb: 1.5,
          fontFamily: "DM Sans, sans-serif"
        }}
      >
        {text}
      </FormLabel>
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue || op1}        rules={{
          required: "This field is required", 
        }}
        render={({ field, fieldState }) => (
          <>
            <RadioGroup row {...field}>
              <FormControlLabel
                value={op1}
                control={
                  <Radio 
                    size="small" 
                    sx={{
                      color: "#ffa41c",
                      "&.Mui-checked": {
                        color: "#ffa41c",
                      },
                    }}
                  />
                }
                label={<span className="text-sm font-dmsans text-gray-700">{op1}</span>}
              />
              <FormControlLabel
                value={op2}
                control={
                  <Radio 
                    size="small" 
                    sx={{
                      color: "#ffa41c",
                      "&.Mui-checked": {
                        color: "#ffa41c",
                      },
                    }}
                  />
                }
                label={<span className="text-sm font-dmsans text-gray-700">{op2}</span>}
              />
            </RadioGroup>
            {fieldState?.error && (
              <FormHelperText error>
                {fieldState.error.message}
              </FormHelperText>
            )}
          </>
        )}
      />
    </FormControl>
  );
}

export default TwoRadioInput;
