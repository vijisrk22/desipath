import { Pagination, LinearProgress } from "@mui/material";
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
  const { loading, error, cars, lastSearchQuery } = useSelector((state) => state.cars);

  const carsPerPage = 15;
  const [page, setPage] = useState(1);
  const startIndex = (page - 1) * carsPerPage;

  const [sortOption, setSortOption] = useState("created_at-desc");
  const getSortedCars = () => {
    const carsCopy = [...cars];

    switch (sortOption) {
      case "price-asc":
        return carsCopy.sort((a, b) => a.price - b.price);
      case "price-desc":
        return carsCopy.sort((a, b) => b.price - a.price);
      case "created_at-desc":
        return carsCopy.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      default:
        return carsCopy.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
  };

  const sortedCars = getSortedCars();
  const numsOfPage = Math.ceil(sortedCars.length / carsPerPage);
  const displayedCars = sortedCars.slice(startIndex, startIndex + carsPerPage);

  // Set rooms on mount
  useEffect(() => {
    // Only fetch all cars if there is no active search query 
    // and no saved location that triggers auto-search in SearchFieldInput
    const savedLocation = localStorage.getItem('user_location');
    if (!lastSearchQuery && !savedLocation) {
      dispatch(fetchCars());
    }
  }, [dispatch, lastSearchQuery]);

  // if (loading) {
  //   return <Loader />;
  // }
  return (
    <div className="px-[7%] mt-20 mb-20 relative">
      {loading && (
        <div className="absolute top-[-20px] left-0 right-0 z-50">
          <LinearProgress sx={{ backgroundColor: '#f3f5f7', '& .MuiLinearProgress-bar': { backgroundColor: '#ffa41c' } }} />
        </div>
      )}
      <div className="mb-6 pt-10 flex flex-col md:flex-row justify-between items-center gap-4 border-t border-gray-100/50">
        <ActiveCarSearchFilters />
        <div className="ml-auto">
          <SortBy
            sortOption={sortOption}
            type="cars"
            setSortOption={(value) => {
              setSortOption(value);
              setPage(1);
            }}
          />
        </div>
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
