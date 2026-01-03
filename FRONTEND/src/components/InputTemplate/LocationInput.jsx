import SelectInput from "./SelectInput";
import {
  getStates,
  getCities,
  getZipcodes,
  clearCities,
  clearZipcodes,
} from "../../store/LocationSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../Loader";

function LocationInput({ control, watch, setValue }) {
  const location_state = watch("location_state");
  const location_city = watch("location_city");

  const dispatch = useDispatch();
  const { loading, error, states_data, cities_data, zipcodes_data } =
    useSelector((state) => state.location);

  useEffect(() => {
    dispatch(getStates()).unwrap();
  }, [dispatch]);

  useEffect(() => {
    setValue("location_city", ""); // Reset city
    setValue("location_zipcode", ""); // Reset zipcode
    dispatch(clearCities());
    dispatch(clearZipcodes());
    if (location_state && location_state.trim() !== "") {
      const stateId = location_state.split(" - ")[0];
      dispatch(getCities(stateId)).unwrap();
    }
  }, [dispatch, location_state]);

  useEffect(() => {
    setValue("location_zipcode", ""); // Reset zipcode
    dispatch(clearZipcodes());
    if (location_city && location_city.trim() !== "") {
      const city = location_city.split(" - ")[0];
      dispatch(getZipcodes(city)).unwrap();
    }
  }, [dispatch, location_city]);

  const states = [
    " ", // empty placeholder value
    ...Object.values(states_data).map(
      (state) => `${state.state_id} - ${state.state_name}`
    ),
  ];

  const cities = [
    " ",
    ...Object.values(cities_data).map((city) => `${city.city} - ${city.zip}`),
  ];

  const zipcodes = [" ", ...Object.values(zipcodes_data).map((zip) => zip.zip)];

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      {error && (
        <div className="bg-red-100 text-red-800 p-3 mb-4 rounded">{error}</div>
      )}
      {/*State  */}
      {states_data.length > 0 && (
        <SelectInput
          name="location_state"
          control={control}
          label="State"
          data={states}
        />
      )}

      {cities_data.length > 0 && (
        <SelectInput
          name="location_city"
          control={control}
          label="City"
          data={cities}
        />
      )}
      {zipcodes_data.length > 0 && (
        <SelectInput
          name="location_zipcode"
          control={control}
          label="Zipcode"
          data={zipcodes}
        />
      )}
    </div>
  );
}

export default LocationInput;
