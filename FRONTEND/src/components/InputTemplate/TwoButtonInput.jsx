import { Button, FormControl, FormHelperText, FormLabel } from "@mui/material";
import { Controller } from "react-hook-form";

function TwoButtonInput({ name, text, control, op1 = "Yes", op2 = "No" }) {
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
        <FormLabel 
          sx={{ 
            fontSize: "0.875rem", 
            fontWeight: 600, 
            color: "grey.800",
            fontFamily: "DM Sans, sans-serif"
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
            <>
              <div {...field}>
                <Button
                  variant={field.value === op1 ? "outlined" : "text"}
                  onClick={() => field.onChange(op1)}
                  sx={{
                    mr: "0.5rem",
                    borderRadius: "0.75rem",
                    p: "0.5rem 1rem",
                    color: "black",
                    fontSize: "0.875rem",
                    textTransform: "none",
                    borderColor: field.value === op1 ? "#ffa41c" : "transparent",
                    "&:hover": {
                      borderColor: "#ffa41c",
                      backgroundColor: "rgba(255, 164, 28, 0.04)"
                    }
                  }}
                >
                  {op1}
                </Button>
                <Button
                  variant={field.value === op2 ? "outlined" : "text"}
                  onClick={() => field.onChange(op2)}
                  sx={{
                    mr: "0.5rem",
                    borderRadius: "0.75rem",
                    p: "0.5rem 1rem",
                    color: "black",
                    fontSize: "0.875rem",
                    textTransform: "none",
                    borderColor: field.value === op2 ? "#ffa41c" : "transparent",
                    "&:hover": {
                      borderColor: "#ffa41c",
                      backgroundColor: "rgba(255, 164, 28, 0.04)"
                    }
                  }}
                >
                  {op2}
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
