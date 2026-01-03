import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";

import { Controller } from "react-hook-form";

function FourRadioInput({ name, text, op1, op2, op3, op4, control }) {
  return (
    <>
      {/* Owner Field */}
      <FormControl
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          alignItems: "center",
          width: "100%",
          gap: "1rem",
          borderBottom: "1px solid ",
          borderBottomColor: "grey.300",
        }}
      >
        <FormLabel id={name}>{text}</FormLabel>
        <Controller
          name={name}
          defaultValue={op1}
          control={control}
          rules={{
            required: "This field is required", // Add the required rule
          }}
          render={({ field, fieldState }) => (
            <>
              <RadioGroup row {...field}>
                <FormControlLabel value={op1} control={<Radio />} label={op1} />
                <FormControlLabel value={op2} control={<Radio />} label={op2} />
                <FormControlLabel value={op3} control={<Radio />} label={op3} />
                <FormControlLabel value={op4} control={<Radio />} label={op4} />
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
    </>
  );
}

export default FourRadioInput;
