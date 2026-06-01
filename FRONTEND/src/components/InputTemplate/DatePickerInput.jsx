import { FormControl, FormHelperText, FormLabel } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
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
    <div className="w-full mb-4">
      <div className="flex flex-col gap-2">
        <FormLabel
           sx={{ 
            color: "grey.800", 
            fontWeight: 600, 
            fontSize: "0.875rem",
            fontFamily: "'DM Sans', sans-serif" 
          }}
        >
          {text}
        </FormLabel>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <div className="w-full">
            <div className="flex flex-col sm:flex-row gap-4 w-full items-start">
              {/* Primary Input: Date (or DateTime if single) */}
              <Controller
                name={dateFieldName1}
                control={control}
                rules={{
                  required: "This field is required", 
                }}
                render={({ field, fieldState }) => (
                  <div className="w-full sm:flex-1">
                    <div className="text-gray-400 text-[10px] font-bold mb-1 ml-1 uppercase tracking-widest font-dmsans">
                      {toDate ? placeholderLab : (includeTime ? "Select Date" : placeholderLab)}
                    </div>
                    {includeTime && !toDate ? (
                      <DatePicker
                        {...field}
                        value={field.value ? dayjs(field.value) : null}
                        onChange={(newValue) => field.onChange(newValue)}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            sx: {
                              "& .MuiOutlinedInput-root": {
                                borderRadius: "12px",
                                border: "1.5px solid #ccc",
                                transition: "all 0.2s ease",
                                backgroundColor: "white",
                                "& fieldset": { border: "none" },
                                "&:hover": { borderColor: "#666" },
                                "&.Mui-focused": {
                                  borderColor: "#ffa41c",
                                  boxShadow: "0 0 0 2px rgba(255, 164, 28, 0.1)",
                                },
                                "& input": {
                                  padding: "12px 14px",
                                  fontSize: "0.95rem",
                                  fontFamily: "'DM Sans', sans-serif"
                                }
                              },
                            },
                          },
                        }}
                      />
                    ) : (
                      <PickerComponent
                        {...field}
                        value={field.value ? dayjs(field.value) : null}
                        onChange={(newValue) => field.onChange(newValue)}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            sx: {
                              "& .MuiOutlinedInput-root": {
                                borderRadius: "12px",
                                border: "1.5px solid #ccc",
                                transition: "all 0.2s ease",
                                backgroundColor: "white",
                                "& fieldset": { border: "none" },
                                "&:hover": { borderColor: "#666" },
                                "&.Mui-focused": {
                                  borderColor: "#ffa41c",
                                  boxShadow: "0 0 0 2px rgba(255, 164, 28, 0.1)",
                                },
                                "& input": {
                                  padding: "12px 14px",
                                  fontSize: "0.95rem",
                                  fontFamily: "'DM Sans', sans-serif"
                                }
                              },
                            },
                          },
                        }}
                      />
                    )}
                    {fieldState?.error && (
                      <FormHelperText error sx={{ mt: 0.5 }}>
                        {fieldState.error.message}
                      </FormHelperText>
                    )}
                  </div>
                )}
              />

              {/* Secondary Input: "To" Date OR separate "Time" component */}
              {(toDate || (includeTime && !toDate)) && (
                <Controller
                  name={toDate ? dateFieldName2 : dateFieldName1}
                  control={control}
                  rules={{
                    required: "This field is required", 
                  }}
                  render={({ field, fieldState }) => (
                    <div className="w-full sm:flex-1">
                      <div className="text-gray-400 text-[10px] font-bold mb-1 ml-1 uppercase tracking-widest font-dmsans">
                        {toDate ? "To" : "Select Time"}
                      </div>
                      {includeTime && !toDate ? (
                        <TimePicker
                          {...field}
                          value={field.value ? dayjs(field.value) : null}
                          onChange={(newValue) => field.onChange(newValue)}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              sx: {
                                  "& .MuiOutlinedInput-root": {
                                    borderRadius: "12px",
                                    border: "1.5px solid #ccc",
                                    transition: "all 0.2s ease",
                                    backgroundColor: "white",
                                    "& fieldset": { border: "none" },
                                    "&:hover": { borderColor: "#666" },
                                    "&.Mui-focused": {
                                      borderColor: "#ffa41c",
                                      boxShadow: "0 0 0 2px rgba(255, 164, 28, 0.1)",
                                    },
                                    "& input": {
                                      padding: "12px 14px",
                                      fontSize: "0.95rem",
                                      fontFamily: "'DM Sans', sans-serif"
                                    }
                                  },
                              },
                            },
                          }}
                        />
                      ) : (
                        <PickerComponent
                          {...field}
                          value={field.value ? dayjs(field.value) : null}
                          onChange={(newValue) => field.onChange(newValue)}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              sx: {
                                  "& .MuiOutlinedInput-root": {
                                    borderRadius: "12px",
                                    border: "1.5px solid #ccc",
                                    transition: "all 0.2s ease",
                                    backgroundColor: "white",
                                    "& fieldset": { border: "none" },
                                    "&:hover": { borderColor: "#666" },
                                    "&.Mui-focused": {
                                      borderColor: "#ffa41c",
                                      boxShadow: "0 0 0 2px rgba(255, 164, 28, 0.1)",
                                    },
                                    "& input": {
                                      padding: "12px 14px",
                                      fontSize: "0.95rem",
                                      fontFamily: "'DM Sans', sans-serif"
                                    }
                                  },
                              },
                            },
                          }}
                        />
                      )}
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
      </div>
    </div>
  );
}

export default DatePickerInput;
