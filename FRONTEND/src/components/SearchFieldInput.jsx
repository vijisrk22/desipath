import { useForm } from "react-hook-form";
import LocationAutocompleteInput from "./InputTemplate/LocationAutocompleteInput";
import MinimumDistanceSlider from "./PriceRangeSlider";
import SearchButton from "./SearchButton";

import { searchRoom } from "../store/RoommatesSlice";
import { searchCar } from "../store/CarsSlice";
import { searchRentalHome } from "../store/RentalHomesSlice";

import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import CarMakeModelInput from "./InputTemplate/CarMakeModelInput";
import CheckBoxInput from "./InputTemplate/CheckBoxInput";

function SearchFieldInput({ inputs, title }) {
  const dispatch = useDispatch();
  const [priceRange, setPriceRange] = useState([1000, 10000]);

  useEffect(() => {
    setPriceRange([
      1000,
      title === "Find a Room"
        ? 10000
        : title === "Buy a Car"
          ? 100000
          : title === "Rent a Home"
            ? 15000
            : 10000,
    ]);
  }, []);

  async function onSubmit(data) {
    if (title === "Find a Room") {
      const searchQuery = {
        city: data?.location ? data?.location.split(",")[0].trim() : "",
        state: data?.location ? data?.location.split(",")[1].trim() : "",
        zipcode: data?.location ? data?.location.split(",")[2].trim() : "",
        priceMin: priceRange[0],
        priceMax: priceRange[1],
      };
      try {
        console.log("Sending searchQuery:", searchQuery);
        await dispatch(searchRoom(searchQuery)).unwrap();
      } catch (err) {
        console.error("Search failed:", err);
      }
    } else if (title === "Buy a Car") {
      const searchQuery = {
        location: data?.location ? data?.location : "",
        carMake: data?.make ? data?.make : "",
        carModel: data?.model ? data?.model : "",
        priceMin: priceRange[0],
        priceMax: priceRange[1],
      };
      try {
        console.log("Sending searchQuery:", searchQuery);
        await dispatch(searchCar(searchQuery)).unwrap();
      } catch (err) {
        console.error("Search failed:", err);
      }
    } else if (title === "Rent a Home") {
      const searchQuery = {
        city: data?.location ? data?.location.split(",")[0].trim() : "",
        state: data?.location ? data?.location.split(",")[1].trim() : "",
        zipcode: data?.location ? data?.location.split(",")[2].trim() : "",
        rentalHomeType: data?.rentalHomeType
          ? Object.entries(data.rentalHomeType)
            .filter(([_, value]) => value)
            .map(([key]) => key)
          : [],
        priceMin: priceRange[0],
        priceMax: priceRange[1],
      };
      try {
        console.log("Sending searchQuery:", searchQuery);
        await dispatch(searchRentalHome(searchQuery)).unwrap();
      } catch (err) {
        console.error("Search failed:", err);
      }
    }
  }
  const {
    handleSubmit,
    control,
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  return (
    <form
      method="POST"
      onSubmit={handleSubmit(onSubmit)}
      className="px-6 py-4 md:py-6 w-[90%] relative rounded-tr-2xl rounded-b-2xl bg-white flex flex-col gap-y-4  md:flex-row md:gap-12  md:items-center md:justify-around "
    >
      <div className="lg:min-w-[400px] xl:min-w-[600px] flex items-center justify-between gap-12 flex-1 flex-wrap">
        {inputs.map((input, index) => (
          <div key={index} className="flex-1">
            {input === "location" ? (
              <LocationAutocompleteInput
                key={index}
                control={control}
                setValue={setValue}
                type="search"
              />
            ) : input === "makeAndModel" ? (
              <CarMakeModelInput
                key={index}
                control={control}
                watch={watch}
                setValue={setValue}
                type="search"
              />
            ) : input === "type" ? (
              <CheckBoxInput
                text="Type"
                options={[
                  { name: "rentalHomeType.Condo", label: "Condominium" },
                  {
                    name: "rentalHomeType.Single family Home",
                    label: "Single Family ",
                  },
                  { name: "rentalHomeType.Apartment", label: "Apartment" },
                  {
                    name: "rentalHomeType.Basement Apartment",
                    label: "Basement Apartment",
                  },
                ]}
                register={register}
                type="search"
              />
            ) : null}
          </div>
        ))}
      </div>
      <div className="flex gap-4 md:gap-6">
        <div className="w-full lg:min-w-[300px] xl:w-[400px]">
          <MinimumDistanceSlider
            value={priceRange}
            onChange={setPriceRange}
            minRange={priceRange[0]}
            maxRange={priceRange[1]}
          />
        </div>

        <SearchButton
          textVisible={false}
          paddingClass={"rounded-full px-4 py-2 md:px-7 md:py-3"}
          imageClass={"w-6 h-6 md:w-8 md:h-8"}
        />
      </div>
    </form>
  );
}

export default SearchFieldInput;
