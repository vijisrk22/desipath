import TextField from "@mui/material/TextField";
import { Controller } from "react-hook-form";

function DescriptionInput({ name, control }) {
  return (
    <div>
      <div className="self-stretch justify-center text-gray-800 text-2xl font-medium font-dmsans">
        Description
      </div>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            variant="outlined"
            placeholder="Description"
            multiline
            rows={7}
            fullWidth
          />
        )}
      />
    </div>
  );
}

export default DescriptionInput;
