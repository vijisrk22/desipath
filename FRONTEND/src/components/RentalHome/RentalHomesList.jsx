import { Pagination } from "@mui/material";
import RentalHomeCard from "./RentalHomeCard";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../Loader";
import SortBy from "../SortBy";

import { fetchRentalHomes } from "../../store/RentalHomesSlice";

function RentalHomesList() {
  // backend API endpoint /api/rooms
  // State for events
  const dispatch = useDispatch();
  const { loading, error, rentalHomes } = useSelector(
    (state) => state.rentalHomes
  );
  const roomsPerPage = 9;
  const [page, setPage] = useState(1);
  const startIndex = (page - 1) * roomsPerPage;

  console.log(rentalHomes);

  const [sortOption, setSortOption] = useState("");
  const getSortedRentalHomes = () => {
    const rentalHomesCopy = [...rentalHomes];

    switch (sortOption) {
      case "price-asc":
        return rentalHomesCopy.sort((a, b) => a.deposit_rent - b.deposit_rent);
      case "price-desc":
        return rentalHomesCopy.sort((a, b) => b.deposit_rent - a.deposit_rent);
      case "name-asc":
        return rentalHomesCopy.sort((a, b) =>
          a.address.localCompare(b.address)
        );
      case "name-desc":
        return rentalHomesCopy.sort((a, b) =>
          a.address.localCompare(b.address)
        );
      default:
        return rentalHomesCopy;
    }
  };

  const sortedRentalHomes = getSortedRentalHomes();
  const numsOfPage = Math.ceil(rentalHomes.length / roomsPerPage);
  const displayedRooms = sortedRentalHomes.slice(
    startIndex,
    startIndex + roomsPerPage
  );

  // Set rentalHomes on mount
  useEffect(() => {
    dispatch(fetchRentalHomes());
  }, [dispatch]);

  if (loading) {
    return <Loader />;
  }
  return (
    <div className="px-[7%] mt-20">
      <div className=" mb-6  flex justify-between items-center">
        <div className="text-[#007185] text-[40px] font-medium font-dmsans">
          Home
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
        {displayedRooms.map((rentalHome, index) => {
          return <RentalHomeCard key={index} rentalHome={rentalHome} />;
        })}
      </div>

      <div className="max-w-screen-lg mx-auto flex justify-between gap-12 items-center my-10 px-6 py-3 bg-white">
        <div className="text-[#323232] text-sm font-normal font-dmsans">
          {page}-{numsOfPage.toString().padStart(2, "0")} of{" "}
          {rentalHomes.length} items
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

export default RentalHomesList;
