import { Pagination } from "@mui/material";
import CarCard from "./CarCard";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../Loader";
import SortBy from "../SortBy";

import { fetchCars } from "../../store/CarsSlice";
import ActiveCarSearchFilters from "./ActiveCarSearchFilters";

function Cars() {
  // backend API endpoint /api/rooms
  // State for events
  const dispatch = useDispatch();
  const { loading, error, cars } = useSelector((state) => state.cars);

  const carsPerPage = 9;
  const [page, setPage] = useState(1);
  const startIndex = (page - 1) * carsPerPage;

  const [sortOption, setSortOption] = useState("");
  const getSortedCars = () => {
    const carsCopy = [...cars];

    switch (sortOption) {
      case "price-asc":
        return carsCopy.sort((a, b) => a.price - b.price);
      case "price-desc":
        return carsCopy.sort((a, b) => b.price - a.price);
      case "name-asc":
        return carsCopy.sort((a, b) => a.make.localeCompare(b.make));
      case "name-desc":
        return carsCopy.sort((a, b) => b.make.localeCompare(a.make));
      default:
        return carsCopy;
    }
  };

  const sortedCars = getSortedCars();
  const numsOfPage = Math.ceil(sortedCars.length / carsPerPage);
  const displayedCars = sortedCars.slice(startIndex, startIndex + carsPerPage);

  // Set rooms on mount
  useEffect(() => {
    dispatch(fetchCars());
  }, [dispatch]);

  // if (loading) {
  //   return <Loader />;
  // }
  return (
    <div className="px-[7%] mt-12 mb-20">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <ActiveCarSearchFilters />
        <SortBy
          sortOption={sortOption}
          setSortOption={(value) => {
            setSortOption(value);
            setPage(1);
          }}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8 justify-items-center">
        {displayedCars.length > 0 ? (
          displayedCars.map((car, index) => (
            <CarCard key={index} car={car} />
          ))
        ) : (
          <div className="col-span-full py-20 text-center text-gray-500 text-xl font-medium">
            No vehicles found matching your criteria.
          </div>
        )}
      </div>

      <div className="mx-auto flex flex-col md:flex-row justify-between gap-6 items-center mt-16 px-8 py-6 bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="text-[#323232] text-sm font-medium font-dmsans">
          Showing {startIndex + 1}-{Math.min(startIndex + carsPerPage, cars.length)} of {cars.length} vehicles
        </div>
        <Pagination
          count={numsOfPage}
          size="large"
          variant="outlined"
          shape="rounded"
          onChange={(event, value) => setPage(value)}
          showFirstButton
          showLastButton
          sx={{
            "& .MuiPaginationItem-page": {
              mx: "12px", // Adds spacing between page numbers
            },
            "& .MuiPaginationItem-page.Mui-selected": {
              backgroundColor: "#ffa41c", // Sets the background color for the selected page
              color: "white", // Ensures text is visible
            },
            "& .MuiPaginationItem-ellipsis": {
              color: "#ffa41c", // Sets color for ellipsis (...)
              fontWeight: "bold",
            },
            "& .MuiPaginationItem-previousNext, & .MuiPaginationItem-firstLast":
              {
                color: "#ffa41",
                mx: "16px",
              },
          }}
        />
      </div>
    </div>
  );
}

export default Cars;
