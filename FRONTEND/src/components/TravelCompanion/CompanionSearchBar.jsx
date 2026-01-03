import { useForm, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchFindCompanionLocation } from "../../store/TravelCompanionSlice";
import SearchButton from "../SearchButton";
import Loader from "../Loader";

function CompanionSearchBar({ onSearch }) {
  const dispatch = useDispatch();
  const { loading, error, travelers } = useSelector(
    (state) => state.travelCompanion
  );

  //Get travelCompanions on mount
  useEffect(() => {
    dispatch(fetchFindCompanionLocation());
  }, [dispatch]);

  if (loading) {
    return <Loader />;
  }

  const { handleSubmit, control, register } = useForm();

  const onSubmit = async (data) => {
    // dispatch(fetchTravelCompanions);
    await dispatch(fetchTravelCompanions(data)).unwrap();
    // onSearch(data);
  };

  const cities = [
    "Chennai",
    "New York",
    "London",
    "Tokyo",
    "Paris",
    "Hyderabad",
    "Bangalore",
    "Delhi",
    "Mumbai",
    "Dubai",
  ];

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 md:grid-cols-[25%_25%_40%_10%] items-center justify-center py-3 px-6 md:px-4 rounded-[40px] shadow gap-y-3 md:gap-y-0 w-full broder-gray-800 border"
    >
      {/* From Dropdown */}
      <div className="w-full px-1 md:border-r  h-6 ">
        <select
          {...register("from")}
          className="w-full border rounded-lg p-1 my-1 md:my-0 md:p-0 md:border-none outline-none"
        >
          <option value="">From</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      {/* To Dropdown */}
      <div className="w-full px-1 md:border-r  h-6">
        <select
          {...register("to")}
          className="w-full border rounded-lg p-1 my-1 md:my-0 md:p-0 md:border-none outline-none"
        >
          <option value="">To</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-between items-center mt-4 md:mt-0  md:grid md:grid-cols-2">
        {/* Date From Picker */}
        <div className="w-full px-2 pb-1 md:border-r h-6 flex items-center justify-center relative ">
          <Controller
            control={control}
            name="dateFrom"
            render={({ field }) => (
              <DatePicker
                placeholderText="Date From"
                selected={field.value}
                onChange={field.onChange}
                calendarIconClassName={"calendarIcon"}
                showIcon
                className="w-full outline-none"
              />
            )}
          />
        </div>

        {/* Date To Picker */}
        <div className="w-full px-2 pb-1 h-6 flex items-center justify-center relative">
          <Controller
            control={control}
            name="dateTo"
            render={({ field }) => (
              <DatePicker
                placeholderText="Date To"
                selected={field.value}
                onChange={field.onChange}
                calendarIconClassName={"calendarIcon"}
                showIcon
                className="w-full outline-none "
              />
            )}
          />
        </div>
      </div>

      {/* Search Button */}
      <div className="w-full flex items-center md:justify-end justify-center mt-4 md:mt-0 ">
        <SearchButton
          textVisible={false}
          paddingClass="px-16 py-3 md:p-4 md:px-5"
        />
      </div>
    </form>
  );
}

export default CompanionSearchBar;
