import { Pagination } from "@mui/material";
import CarCard from "./CarCard";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../Loader";
import SortBy from "../SortBy";

import { fetchCars } from "../../store/CarsSlice";

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
    <div className="px-[7%] mt-20">
      <div className=" mb-6  flex justify-between items-center">
        <div className="text-[#007185] text-[40px] font-medium font-dmsans">
          Cars
        </div>
        <SortBy
          sortOption={sortOption}
          setSortOption={(value) => {
            setSortOption(value);
            setPage(1);
          }}
        />
      </div>

      <div className="flex justify-center items-center flex-wrap gap-4">
        {displayedCars.map((car, index) => {
          return <CarCard key={index} car={car} />;
        })}
      </div>

      <div className="max-w-screen-lg mx-auto flex justify-between gap-12 items-center my-10 px-6 py-3 bg-white">
        <div className="text-[#323232] text-sm font-normal font-dmsans">
          {page}-{numsOfPage.toString().padStart(2, "0")} of {cars.length} items
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
