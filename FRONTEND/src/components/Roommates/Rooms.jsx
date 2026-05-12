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
  const { loading, error, rooms = [], lastSearchQuery } = useSelector((state) => state.roommates);
  const safeRooms = Array.isArray(rooms) ? rooms : [];
  const roomsPerPage = 15;
  const [page, setPage] = useState(1);
  const [sortOption, setSortOption] = useState("created_at-desc");
  // Set rooms on mount
  useEffect(() => {
    const savedLocation = localStorage.getItem('user_location');
    if (!lastSearchQuery && !savedLocation) {
      dispatch(fetchRooms());
    }
  }, [dispatch]); // Removed lastSearchQuery to avoid redundant calls

  console.log(rooms);
  const getSortedRooms = () => {
    const roomsCopy = [...safeRooms];

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
    <div className="px-[7%] mt-6 mb-20">
      <div className="mb-8 pt-4 flex flex-col md:flex-row justify-between items-center gap-4 border-t border-gray-100/50">
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
        <div className="bg-red-100 text-red-800 p-4 mb-8 rounded-2xl text-center font-medium shadow-sm border border-red-200">
          <span className="mr-2">⚠️</span>
          {typeof error === 'object' ? (error.message || JSON.stringify(error)) : String(error || "Unknown error")}
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
          Showing {startIndex + 1}-{Math.min(startIndex + roomsPerPage, safeRooms.length)} of {safeRooms.length} items
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
              color: "#ffa41c",
              mx: "16px",
            },
          }}
        />
      </div>
    </div>
  );
}

export default Rooms;
