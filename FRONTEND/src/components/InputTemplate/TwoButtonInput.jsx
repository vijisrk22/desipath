import { Button, FormControl, FormHelperText, FormLabel } from "@mui/material";
import { Controller } from "react-hook-form";

function TwoButtonInput({ name, text, control }) {
  return (
    <>
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
        <FormLabel>{text}</FormLabel>

        <Controller
          name={name}
          control={control}
          defaultValue={"Yes"}
          rules={{
            required: "This field is required", // Add the required rule
          }}
          render={({ field, fieldState }) => (
            <>
              <div {...field}>
                <Button
                  variant={field.value === "Yes" ? "outlined" : "text"}
                  onClick={() => field.onChange("Yes")}
                  sx={{
                    mr: "1rem",
                    borderRadius: "0.75rem",
                    p: "0.5rem",
                    color: "black",
                  }}
                >
                  Yes
                </Button>
                <Button
                  variant={field.value === "No" ? "outlined" : "text"}
                  onClick={() => field.onChange("No")}
                  sx={{
                    mr: "1rem",
                    borderRadius: "0.75rem",
                    p: "0.5rem",
                    color: "black",
                  }}
                >
                  No
                </Button>
              </div>
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

export default TwoButtonInput;
