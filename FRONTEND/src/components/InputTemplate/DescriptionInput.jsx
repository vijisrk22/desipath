import TextField from "@mui/material/TextField";
import { Controller } from "react-hook-form";

function DescriptionInput({ name, control }) {
  return (
    <div className="py-2">
      <div className="text-gray-800 text-lg font-bold font-dmsans mb-2">
        Description
      </div>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            variant="outlined"
            placeholder="Property description..."
            multiline
            rows={5}
            fullWidth
            sx={{ 
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
            }}
          />
        )}
      />
    </div>
  );
}

export default DescriptionInput;
