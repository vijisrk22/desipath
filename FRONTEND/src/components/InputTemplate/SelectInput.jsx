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
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        alignItems: "center",
        width: "100%",
        gap: "1rem",
        borderBottom: "1px solid ",
        borderBottomColor: "grey.300",
        py: "1rem",
      }}
    >
      <FormLabel>{label}</FormLabel>

      <FormControl fullWidth>
        <InputLabel id={label}>{label}</InputLabel>
        <Controller
          name={name}
          control={control}
          rules={{
            required: "This field is required", // Add the required rule
          }}
          render={({ field, fieldState }) => (
            <>
              <Select
                labelId="demo-select-small-label"
                id="demo-select-small"
                value={field.value ?? ""}
                label={label}
                onChange={(e) => field.onChange(e.target.value)}
              >
                {data?.map((val, index) => (
                  <MenuItem key={index} value={val}>
                    {val}
                  </MenuItem>
                ))}
              </Select>
              {fieldState?.error && (
                <FormHelperText error>
                  {fieldState.error.message}
                </FormHelperText>
              )}
            </>
          )}
        />
      </FormControl>
    </FormControl>
  );
}
