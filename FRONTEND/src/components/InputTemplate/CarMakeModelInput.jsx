import SelectInput from "./SelectInput";
import TextFieldInput from "./TextFieldInput";
import {
  getCarMake, getCarModel, clearCarMake, clearCarModel,
} from "../../store/CarsSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

function CarMakeModelInput({ control, watch, setValue, type = "", onlyMake = false, onlyModel = false }) {
  const make = watch("make");
  const model = watch("model");

  const dispatch = useDispatch();
  const { loading, error, car_make, car_model } = useSelector((state) => state.cars);

  useEffect(() => {
    dispatch(getCarMake()).unwrap();
  }, [dispatch]);

  useEffect(() => {
    if (!onlyModel) {
       setValue("model", "");
       setValue("model_other", "");
       dispatch(clearCarModel());
    }
    if (make && make !== "Others" && make.trim() !== "") {
      dispatch(getCarModel(make)).unwrap();
    }
  }, [dispatch, make, onlyModel]);

  const makeOptions = [...(car_make?.map((m) => (typeof m === 'object' ? m.make : m)) || []), "Others"];
  const modelOptions = [...(car_model?.map((m) => (typeof m === 'object' ? m.model : m)) || []), "Others"];
  const showMakeOther = make === "Others";
  const showModelOther = model === "Others";

  if (type === "search") {
    return (
      <>
        {(onlyMake || (!onlyMake && !onlyModel)) && (
          <FormControl fullWidth size="small">
            <InputLabel id="car-make-label">Make</InputLabel>
            <Select
              labelId="car-make-label"
              value={watch("make") || ""}
              label="Make"
              onChange={(e) => setValue("make", e.target.value)}
              sx={{ borderRadius: '12px' }}
            >
              {makeOptions.map((val, i) => (
                <MenuItem key={i} value={val}>{val}</MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        
        {(onlyModel || (!onlyMake && !onlyModel)) && (
          <FormControl fullWidth size="small">
            <InputLabel id="car-model-label">Model</InputLabel>
            <Select
              labelId="car-model-label"
              value={watch("model") || ""}
              label="Model"
              onChange={(e) => setValue("model", e.target.value)}
              sx={{ borderRadius: '12px' }}
            >
              {modelOptions.map((val, i) => (
                <MenuItem key={i} value={val}>{val}</MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </>
    );
  }

  return (
    <div>
      {error && (
        <div className="bg-red-100 text-red-800 p-3 mb-4 rounded">
          {typeof error === "object" ? error.message || error.error || JSON.stringify(error) : error}
        </div>
      )}

      {/* Make dropdown */}
      {car_make.length > 0 && (
        <SelectInput
          name="make"
          control={control}
          label="Car Make"
          data={makeOptions}
        />
      )}
      {/* Free-text if "Others" selected for make */}
      {showMakeOther && (
        <TextFieldInput
          name="make_other"
          defaultValue="Type your car make"
          control={control}
          text="Specify Make"
        />
      )}

      {/* Model dropdown — only if make is selected and not Others */}
      {!showMakeOther && car_model.length > 0 && (
        <SelectInput
          name="model"
          control={control}
          label="Car Model"
          data={modelOptions}
        />
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
