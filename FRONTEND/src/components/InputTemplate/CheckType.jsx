import React from "react";
import { Checkbox, FormControlLabel } from "@mui/material";

function CheckType({ name, value, register, selected = false }) {
  return (
    <label className="">
      {/* MUI Checkbox with react-hook-form */}
      <FormControlLabel
        control={<Checkbox {...register(name)} defaultChecked={selected} />}
        label={
          <>
            <span>{value}</span>
          </>
        }
      />
    </label>
  );
}

export default CheckType;
