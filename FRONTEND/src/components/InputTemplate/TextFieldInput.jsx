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
}) {
  return (
    <div>
      <FormControl
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          alignItems: "center",
          width: "100%",
          py: "1rem",
          gap: "1rem",
          borderBottom: "1px solid ",
          borderBottomColor: "grey.300",
        }}
      >
        <FormLabel htmlFor={name}>{text}</FormLabel>
        <Controller
          name={name}
          control={control}
          defaultValue=""
          rules={
            requiredAssertion ? { required: "This field is required" } : {}
          }
          render={({ field, fieldState }) => (
            <>
              <TextField
                {...field}
                id={name}
                type={type}
                variant="outlined"
                size="small"
                placeholder={defaultValue}
                sx={{ width: "100%" }}
                {...customProps}
              />
              {fieldState?.error && (
                <FormHelperText error>
                  {fieldState.error.message}
                </FormHelperText>
              )}
            </>
          )}
        />
      </FormControl>
    </div>
  );
}

export default TextFieldInput;
