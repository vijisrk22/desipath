import { FormControl, FormLabel } from "@mui/material";

import CheckType from "./CheckType";

function CheckBoxInput({ text, options, register, type = "", selected = [] }) {
  return (
    <>
      {type === "search" ? (
        <FormControl sx={{ py: "1rem", width: "100%" }}>
          <FormLabel>{text}</FormLabel>
          <div className="flex gap-2 flex-wrap items-center">
            {options.map((option) => (
              <CheckType
                key={option.name}
                name={option.name}
                value={option.label}
                register={register}
                selected={selected.includes(option.label)}
              />
            ))}
          </div>
        </FormControl>
      ) : (
        <FormControl
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            alignItems: "center",
            width: "100%",
            gap: "1rem",
            borderBottom: "1px solid",
            borderBottomColor: "grey.300",
            py: "1rem",
          }}
        >
          <FormLabel>{text}</FormLabel>
          <div className="flex flex-wrap items-center gap-2">
            {options.map((option) => (
              <CheckType
                key={option.name}
                name={option.name}
                value={option.label}
                register={register}
                selected={selected.includes(option.label)}
              />
            ))}
          </div>
        </FormControl>
      )}
    </>
  );
}

export default CheckBoxInput;
