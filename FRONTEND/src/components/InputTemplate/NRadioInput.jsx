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
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        alignItems: "center",
        width: "100%",
        gap: "1rem",
        borderBottom: "1px solid",
        borderBottomColor: "grey.300",
      }}
    >
      <FormLabel id={name}>{text}</FormLabel>
      <Controller
        name={name}
        defaultValue={options[0]?.value || ""}
        control={control}
        rules={{
          required: "This field is required",
        }}
        render={({ field, fieldState }) => (
          <>
            <RadioGroup row {...field}>
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
              <FormHelperText error>{fieldState.error.message}</FormHelperText>
            )}
          </>
        )}
      />
    </FormControl>
  );
}

export default NRadioInput;
