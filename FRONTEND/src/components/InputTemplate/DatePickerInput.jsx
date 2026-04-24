import { FormControl, FormHelperText, FormLabel } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

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
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          width: "100%",
          py: "0.75rem",
          gap: "0.5rem",
        }}
      >
        <FormLabel
           sx={{ 
            color: "gray.800", 
            fontWeight: "bold", 
            fontSize: "1rem",
            fontFamily: "dmsans" 
          }}
        >
          {text}
        </FormLabel>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <div className="w-full">
            <div className="flex flex-col gap-4 w-full">
              <Controller
                name={dateFieldName1}
                control={control}
                rules={{
                  required: "This field is required", 
                }}
                render={({ field, fieldState }) => (
                  <div className="w-full">
                    <PickerComponent
                      {...field}
                      label={placeholderLab}
                      value={field.value ? dayjs(field.value) : null}
                      onChange={(newValue) => field.onChange(newValue)}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          sx: {
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "12px",
                              border: "1.5px solid #ccc",
                              transition: "border-color 0.2s",
                              "& fieldset": { border: "none" },
                              "&:hover": { borderColor: "#999" },
                              "&.Mui-focused": {
                                borderColor: "#ffa41c",
                                borderWidth: "1.5px",
                              },
                            },
                          },
                        },
                      }}
                    />
                    {fieldState?.error && (
                      <FormHelperText error sx={{ mt: 0.5 }}>
                        {fieldState.error.message}
                      </FormHelperText>
                    )}
                  </div>
                )}
              />

              {toDate && (
                <Controller
                  name={dateFieldName2}
                  control={control}
                  rules={{
                    required: "This field is required", 
                  }}
                  render={({ field, fieldState }) => (
                    <div className="w-full">
                      <PickerComponent
                        {...field}
                        label="To"
                        value={field.value ? dayjs(field.value) : null}
                        onChange={(newValue) => field.onChange(newValue)}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            sx: {
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: "12px",
                                  border: "1.5px solid #ccc",
                                  transition: "border-color 0.2s",
                                  "& fieldset": { border: "none" },
                                  "&:hover": { borderColor: "#999" },
                                  "&.Mui-focused": {
                                    borderColor: "#ffa41c",
                                    borderWidth: "1.5px",
                                  },
                                },
                            },
                          },
                        }}
                      />
                      {fieldState?.error && (
                        <FormHelperText error sx={{ mt: 0.5 }}>
                          {fieldState.error.message}
                        </FormHelperText>
                      )}
                    </div>
                  )}
                />
              )}
            </div>
          </div>
        </LocalizationProvider>
      </FormControl>
    </div>
  );
}

export default DatePickerInput;
