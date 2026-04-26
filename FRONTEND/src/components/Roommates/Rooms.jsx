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
  const roomsPerPage = 15;
  const [page, setPage] = useState(1);
  const [sortOption, setSortOption] = useState("created_at-desc");
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
      case "created_at-desc":
        return roomsCopy.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      default:
        return roomsCopy.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
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
    <div className="px-[7%] mt-12 mb-20">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-[#007185] text-[32px] md:text-[40px] font-bold font-dmsans">
          Roommate Listings
        </div>
        <SortBy
          sortOption={sortOption}
          type="rooms"
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
        {displayedRooms.length > 0 ? (
          displayedRooms.map((room, index) => (
            <RoomCard key={index} room={room} />
          ))
        ) : (
          <div className="col-span-full py-20 text-center text-gray-500 text-xl font-medium">
            No rooms found matching your criteria.
          </div>
        )}
      </div>

      <div className="mx-auto flex flex-col md:flex-row justify-between gap-6 items-center mt-16 px-8 py-6 bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="text-[#323232] text-sm font-medium font-dmsans">
          Showing {startIndex + 1}-{Math.min(startIndex + roomsPerPage, rooms.length)} of {rooms.length} items
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
