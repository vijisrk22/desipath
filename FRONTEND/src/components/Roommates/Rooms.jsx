import { Pagination } from "@mui/material";
import RoomCard from "./RoomCard";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../Loader";
import { fetchRooms } from "../../store/RoommatesSlice";
import SortBy from "../SortBy";

function Rooms() {
  // backend API endpoint /api/rooms
  // State for events
  const dispatch = useDispatch();
  const { loading, error, rooms } = useSelector((state) => state.roommates);
  const roomsPerPage = 9;
  const [page, setPage] = useState(1);
  const [sortOption, setSortOption] = useState("");
  // Set rooms on mount
  useEffect(() => {
    dispatch(fetchRooms());
  }, [dispatch]);

  console.log(rooms);
  const getSortedRooms = () => {
    const roomsCopy = [...rooms];

    switch (sortOption) {
      case "price-asc":
        return roomsCopy.sort((a, b) => a.rent - b.rent);
      case "price-desc":
        return roomsCopy.sort((a, b) => b.rent - a.rent);
      case "name-asc":
        return roomsCopy.sort((a, b) =>
          a.location_city.localeCompare(b.location_city)
        );
      case "name-desc":
        return roomsCopy.sort((a, b) =>
          b.location_city.localeCompare(a.location_city)
        );
      default:
        return roomsCopy;
    }
  };

  const sortedRooms = getSortedRooms();
  const numsOfPage = Math.ceil(sortedRooms.length / roomsPerPage);
  const startIndex = (page - 1) * roomsPerPage;
  const displayedRooms = sortedRooms.slice(
    startIndex,
    startIndex + roomsPerPage
  );

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="px-[7%] mt-20">
      <div className=" mb-6  flex justify-between items-center">
        <div className="text-[#007185] text-[40px] font-medium font-dmsans">
          Rooms
        </div>
        <SortBy
          sortOption={sortOption}
          setSortOption={(value) => {
            setSortOption(value);
            setPage(1);
          }}
        />
      </div>

      {error && (
        <div className="text-red-500 text-lg text-center mt-4">
          {typeof error === "string" ? error : error.message}
        </div>
      )}

      <div className="flex justify-center items-center flex-wrap gap-4">
        {displayedRooms.map((room, index) => {
          return <RoomCard key={index} room={room} />;
        })}
      </div>

      <div className="max-w-screen-lg mx-auto flex justify-between gap-12 items-center my-10 px-6 py-3 bg-white">
        <div className="text-[#323232] text-sm font-normal font-dmsans">
          {page}-{numsOfPage.toString().padStart(2, "0")} of {rooms.length}{" "}
          items
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

export default Rooms;
