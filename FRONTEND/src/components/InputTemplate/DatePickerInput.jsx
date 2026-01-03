import { FormControl, FormHelperText, FormLabel } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Controller } from "react-hook-form";

function DatePickerInput({
  text,
  control,
  toDate = true,
  includeTime = false,
  placeholderLab = "From",
  dateFieldName1 = "fromDate",
  dateFieldName2 = "toDate",
}) {
  const PickerComponent = includeTime ? DateTimePicker : DatePicker;
  return (
    <div>
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
        <FormLabel>{text}</FormLabel>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer
            components={
              toDate ? ["DatePicker1", "DatePicker2"] : ["DatePicker1"]
            }
            sx={{ my: "1rem" }}
          >
            <div className="flex flex-col gap-4 w-full">
              <Controller
                name={dateFieldName1}
                control={control}
                rules={{
                  required: "This field is required", // Add the required rule
                }}
                render={({ field, fieldState }) => (
                  <>
                    <PickerComponent
                      {...field}
                      label={placeholderLab}
                      value={field.value || null}
                      onChange={(newValue) => field.onChange(newValue)}
                    />
                    {fieldState?.error && (
                      <FormHelperText error>
                        {fieldState.error.message}
                      </FormHelperText>
                    )}
                  </>
                )}
              />

              {toDate && (
                <Controller
                  name={dateFieldName2}
                  control={control}
                  rules={{
                    required: "This field is required", // Add the required rule
                  }}
                  render={({ field, fieldState }) => (
                    <>
                      <PickerComponent
                        {...field}
                        label="To"
                        value={field.value || null}
                        onChange={(newValue) => field.onChange(newValue)}
                      />
                      {fieldState?.error && (
                        <FormHelperText error>
                          {fieldState.error.message}
                        </FormHelperText>
                      )}
                    </>
                  )}
                />
              )}
            </div>
          </DemoContainer>
        </LocalizationProvider>
      </FormControl>
    </div>
  );
}

export default DatePickerInput;
