import SelectInput from "./SelectInput";
import TextFieldInput from "./TextFieldInput";
import {
  getCarMake, getCarModel, clearCarMake, clearCarModel,
} from "../../store/CarsSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { Controller } from "react-hook-form";

function CarMakeModelInput({ control, watch, setValue, type = "", onlyMake = false, onlyModel = false }) {
  const make = watch("make");
  const model = watch("model");

  const dispatch = useDispatch();
  const { loading, error, car_make, car_model } = useSelector((state) => state.cars);

  const makeName = typeof make === 'object' ? (make?.make || make?.name) : make;
  const modelName = typeof model === 'object' ? (model?.model || model?.name) : model;

  const showMakeOther = makeName === "Others";
  const showModelOther = modelName === "Others";

  useEffect(() => {
    dispatch(getCarMake()).unwrap();
  }, [dispatch]);

  useEffect(() => {
    if (!onlyModel) {
       setValue("model", "");
       setValue("model_other", "");
       dispatch(clearCarModel());
    }
    if (makeName && makeName !== "Others" && String(makeName).trim() !== "") {
      dispatch(getCarModel(makeName)).unwrap();
    }
  }, [dispatch, makeName, onlyModel, setValue]);

  const isMakeLoading = loading && (!car_make || car_make.length === 0);
  const isModelLoading = loading && (!car_model || car_model.length === 0) && makeName && makeName !== "Others";

  const makeOptions = (car_make && car_make.length > 0)
    ? [...car_make.map((m) => (typeof m === 'object' ? (m.make || m.name) : m)), "Others"]
    : (loading ? [] : ["Others"]);

  const modelOptions = (car_model && car_model.length > 0)
    ? [...car_model.map((m) => (typeof m === 'object' ? (m.model || m.name) : m)), "Others"]
    : (isModelLoading ? [] : (makeName && makeName !== "Others" ? ["Others"] : []));

  if (type === "search") {
    return (
      <div className="flex gap-3">
        {(onlyMake || (!onlyMake && !onlyModel)) && (
          <Autocomplete
            fullWidth
            size="small"
            options={makeOptions}
            loading={isMakeLoading}
            value={watch("make") || ""}
            getOptionLabel={(option) => {
              if (typeof option === 'object') {
                return option.make || option.name || JSON.stringify(option);
              }
              return String(option || "");
            }}
            onChange={(event, newValue) => {
              setValue("make", newValue);
            }}
            renderInput={(params) => (
              <TextField 
                {...params} 
                label="Make" 
                placeholder={isMakeLoading ? "Loading..." : ""}
                sx={{ 
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                  }
                }} 
              />
            )}
          />
        )}
        
        {(onlyModel || (!onlyMake && !onlyModel)) && (
          <Autocomplete
            fullWidth
            size="small"
            options={modelOptions}
            loading={isModelLoading}
            value={watch("model") || ""}
            getOptionLabel={(option) => {
              if (typeof option === 'object') {
                return option.model || option.name || JSON.stringify(option);
              }
              return String(option || "");
            }}
            onChange={(event, newValue) => {
              setValue("model", newValue);
            }}
            disabled={!make || make === "Others"}
            renderInput={(params) => (
              <TextField 
                {...params} 
                label="Model" 
                placeholder={isModelLoading ? "Loading..." : ""}
                sx={{ 
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                  }
                }} 
              />
            )}
          />
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {error && (
        <div className="bg-red-100 text-red-800 p-3 mb-2 rounded-xl text-sm">
          {typeof error === "object" ? error.message || error.error || JSON.stringify(error) : error}
        </div>
      )}

      {/* Make AutoComplete */}
      <div className="flex flex-col gap-1.5">
        <label className="text-gray-700 text-sm font-semibold font-dmsans ml-1">Car Make</label>
        <Controller
          name="make"
          control={control}
          rules={{ required: "Car Make is required" }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <>
              <Autocomplete
                options={makeOptions}
                loading={isMakeLoading}
                getOptionLabel={(option) => {
                  if (typeof option === 'object') {
                    return option.make || option.name || JSON.stringify(option);
                  }
                  return String(option || "");
                }}
                value={value || null}
                onChange={(_, newValue) => onChange(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder={isMakeLoading ? "Loading..." : "Search or select make"}
                    error={!!error}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                        backgroundColor: "#f9fafb",
                        fontSize: "0.875rem",
                        fontFamily: "DM Sans, sans-serif",
                        "& fieldset": { borderColor: "#e5e7eb" },
                        "&:hover fieldset": { borderColor: "#ffa41c" },
                        "&.Mui-focused fieldset": { borderColor: "#ffa41c" },
                      },
                      "& .MuiInputBase-input": {
                        fontSize: "0.875rem",
                        fontFamily: "DM Sans, sans-serif"
                      }
                    }}
                  />
                )}
              />
              {error && <span className="text-red-500 text-xs mt-1 ml-1">{error.message}</span>}
            </>
          )}
        />
      </div>

      {/* Free-text if "Others" selected for make */}
      {showMakeOther && (
        <TextFieldInput
          name="make_other"
          defaultValue="Type your car make"
          control={control}
          text="Specify Make"
        />
      )}

      {/* Model AutoComplete */}
      {!showMakeOther && (
        <div className="flex flex-col gap-1.5">
          <label className="text-gray-700 text-sm font-semibold font-dmsans ml-1">Car Model</label>
          <Controller
            name="model"
            control={control}
            rules={{ required: !showMakeOther ? "Car Model is required" : false }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <>
                <Autocomplete
                  options={modelOptions}
                  loading={isModelLoading}
                  getOptionLabel={(option) => {
                    if (typeof option === 'object') {
                      return option.model || option.name || JSON.stringify(option);
                    }
                    return String(option || "");
                  }}
                  value={value || null}
                  onChange={(_, newValue) => onChange(newValue)}
                  disabled={!make || make === "Others"}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder={isModelLoading ? "Loading..." : (!make ? "Select make first" : "Search or select model")}
                      error={!!error}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "12px",
                          backgroundColor: "#f9fafb",
                          "& fieldset": { borderColor: "#e5e7eb" },
                          "&:hover fieldset": { borderColor: "#ffa41c" },
                          "&.Mui-focused fieldset": { borderColor: "#ffa41c" },
                        },
                      }}
                    />
                  )}
                />
                {error && <span className="text-red-500 text-xs mt-1 ml-1">{error.message}</span>}
              </>
            )}
          />
        </div>
      )}

      {/* Free-text if "Others" selected for model OR if make is Others */}
      {(showMakeOther || showModelOther) && (
        <TextFieldInput
          name="model_other"
          defaultValue="Type your car model"
          control={control}
          text="Specify Model"
        />
      )}
    </div>
  );
}

export default CarMakeModelInput;
