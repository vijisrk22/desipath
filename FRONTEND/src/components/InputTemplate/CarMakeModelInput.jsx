import SelectInput from "./SelectInput";
import {
  getCarMake,
  getCarModel,
  clearCarMake,
  clearCarModel,
} from "../../store/CarsSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

function CarMakeModelInput({ control, watch, setValue, type = "" }) {
  const make = watch("make");

  const dispatch = useDispatch();
  const { loading, error, car_make, car_model } = useSelector(
    (state) => state.cars
  );

  useEffect(() => {
    dispatch(getCarMake()).unwrap();
  }, [dispatch]);

  useEffect(() => {
    setValue("model", ""); // Reset Car Model
    dispatch(clearCarModel());
    if (make && make.trim() !== "") {
      dispatch(getCarModel(make)).unwrap();
    }
  }, [dispatch, make]);

  return (
    <div>
      {error && (
        <div className="bg-red-100 text-red-800 p-3 mb-4 rounded">{error}</div>
      )}

      {type === "search" ? (
        <div className="flex gap-4">
          <FormControl fullWidth>
            <InputLabel id="car-make-label">Make</InputLabel>
            <Select
              labelId="car-make-label"
              id="car-make-select"
              value={watch("make") || ""}
              label="Make"
              onChange={(e) => setValue("make", e.target.value)}
            >
              {car_make?.map((val, index) => (
                <MenuItem key={index} value={val}>
                  {val}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="car-model-label">Model</InputLabel>
            <Select
              labelId="car-model-label"
              id="car-model-select"
              value={watch("model") || ""}
              label="Model"
              onChange={(e) => setValue("model", e.target.value)}
            >
              {car_model?.map((val, index) => (
                <MenuItem key={index} value={val.model}>
                  {val.model}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      ) : (
        <>
          {car_make.length > 0 && (
            <SelectInput
              name="make"
              control={control}
              label="Car Make"
              data={car_make}
            />
          )}

          {car_model.length > 0 && (
            <SelectInput
              name="model"
              control={control}
              label="Car Model"
              data={car_model.map((item) => item.model)}
            />
          )}
        </>
      )}
    </div>
  );
}

export default CarMakeModelInput;
