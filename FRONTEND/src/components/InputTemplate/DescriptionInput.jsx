import TextField from "@mui/material/TextField";
import { Controller } from "react-hook-form";

function DescriptionInput({ name, control, text, placeholder }) {
  return (
    <div className="py-2">
      <div className="text-[#374151] text-sm font-semibold font-dmsans mb-1.5 ml-1">
        {text || "Description"}
      </div>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            variant="outlined"
            placeholder={placeholder || "Property description..."}
            multiline
            rows={5}
            fullWidth
            sx={{ 
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                border: "1.5px solid #e5e7eb",
                backgroundColor: "#f9fafb",
                fontSize: "0.875rem",
                fontFamily: "DM Sans, sans-serif",
                transition: "border-color 0.2s",
                "& fieldset": { border: "none" },
                "&:hover": { borderColor: "#ffa41c" },
                "&.Mui-focused": {
                  borderColor: "#ffa41c",
                  borderWidth: "1.5px",
                },
              },
              "& .MuiInputBase-input": {
                fontSize: "0.875rem",
                fontFamily: "DM Sans, sans-serif"
              }
            }}
          />
        )}
      />
    </div>
  );
}

export default DescriptionInput;
