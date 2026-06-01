import { FormControl, FormLabel } from "@mui/material";

import CheckType from "./CheckType";

function CheckBoxInput({ text, options, register, type = "", selected = [] }) {
  return (
    <>
      {type === "search" ? (
        <FormControl sx={{ py: "0.1rem", width: "100%", display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <div className="flex gap-x-4 flex-wrap items-center">
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
