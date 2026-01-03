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
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "1rem",
        alignItems: "center",
        width: "100%",
        borderBottom: "1px solid ",
        borderBottomColor: "grey.300",
        py: "1rem",
      }}
    >
      <FormLabel id={name}>{text}</FormLabel>
      <Controller
        name={name}
        control={control}
        defaultValue={op1} // Set default value to the first option
        rules={{
          required: "This field is required", // Add the required rule
        }}
        render={({ field, fieldState }) => (
          <>
            <RadioGroup row {...field}>
              {op1 == "Yes" && op2 == "No" ? (
                <>
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
                </>
              ) : (
                <>
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
                </>
              )}
            </RadioGroup>
            {fieldState?.error && (
              <FormHelperText error>{fieldState.error.message}</FormHelperText>
            )}
          </>
        )}
      />
    </FormControl>
  );
}

export default TwoRadioInput;
