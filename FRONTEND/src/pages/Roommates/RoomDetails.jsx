import { RiShareForwardLine } from "react-icons/ri";
import { RiHeart3Line } from "react-icons/ri";
import DisplayPath from "../../components/DisplayPath";
import ReviewPostContent from "../../components/Roommates/ReviewPostContent";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import SmsOutlinedIcon from "@mui/icons-material/SmsOutlined";
import { getRoomContents } from "./DisplayRoomDetail";
import api from "../../utils/api";

import { useEffect } from "react";
import { fetchRoomById } from "../../store/RoommatesSlice";
import Loader from "../../components/Loader";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import ShareButton from "../../components/ShareButton";
import ImageScroller from "../../components/ImageScroller";

function RoomDetails() {
  const paths = [
    { text: "Home", eP: "/" },
    { text: "Rooms", eP: "/services/roommates/findRoom" },
  ];

  const navigate = useNavigate();

  const { action, roomId: roomIdParam } = useParams();
  const roomId = roomIdParam || action;

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { loading, error, roomDetails } = useSelector(
    (state) => state.roommates
  );

  useEffect(() => {
    dispatch(fetchRoomById(roomId));
  }, [dispatch, roomId]);

  // If loading, show loader
  if (loading) {
    return <Loader />;
  }

  const handleClick = () => {
    if (!user) {
      navigate("/login", { state: { from: { pathname: window.location.pathname } } });
      return;
    }

    const chatPartnerInfo = {
      chatPartnerId: roomDetails.poster_id,
      chatPartnerName: roomDetails.poster_name,
      chatPartnerLocation: `${roomDetails.location_state}, ${roomDetails.location_city}, ${roomDetails.location_zipcode}`,
    };
    console.log("Chat Partner Info:", chatPartnerInfo);
    try {
      navigate(
        `/inbox?adType=roommate&adId=${
          roomDetails.id
        }&chatPartnerInfo=${encodeURIComponent(
          JSON.stringify(chatPartnerInfo)
        )}`
      );
    } catch (err) {
      console.log(err);
    }
  };

  console.log(roomDetails);

  // If there's an error fetching data
  if (error) {
    return <div className="text-red-500">Error loading room details.</div>;
  }

  // Make sure roomDetails is available before accessing it
  if (!roomDetails) {
    return (
      <div className="mx-20 my-10">
        <div className="text-gray-500">
          Room details are not available at the moment.
        </div>
      </div>
    );
  }

  // Safe to access roomDetails now
  const formattedDetails = Object.entries(roomDetails || {})
    .filter(([key]) => key !== "photos")
    .reduce((acc, [key, value]) => {
      if (key === "photos") return acc;

      // 2) Handle location_* fields
      if (
        ["location_city", "location_state", "location_zipcode"].includes(key)
      ) {
        // initialize or append to acc.location
        const part = value ?? "";
        acc.location = acc.location ? `${acc.location}, ${part}` : part;
        return acc;
      }

      // 3) All other fields: boolean → "Yes"/"No", else keep value
      acc[key] = typeof value === "boolean" ? (value ? "Yes" : "No") : value;

      return acc;
    }, {});

  const contents = getRoomContents(
    formattedDetails,
    roomDetails?.photos ? roomDetails?.photos : []
  );

  console.log("Room Details:", roomDetails);
  return (
    <div className="mx-20 my-10">
      <DisplayPath
        paths={paths}
        color="[#667479]"
        additionalStyles={"leading-tight mb-4"}
      />
      {roomDetails.photos?.length > 0 && (
        <div className="h-[476px] my-5 flex justify-center items-center shadow-sm rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
          <div className="w-full h-full">
            <ImageScroller images={roomDetails.photos.map(img => (img.startsWith('http') ? img : `https://desipathapi.azurewebsites.net/${img}`))} />
          </div>
        </div>
      )}
      <div className="flex flex-wrap justify-center gap-4">
        {roomDetails.photos?.map((img, indx) => (
          <div key={indx} className="flex justify-center">
            <img
              className="w-[150px] h-[150px] rounded-xl border-[3px] border-[#0857d0] object-cover shadow-sm transition-transform hover:scale-105"
              src={img.startsWith('http') ? img : `https://desipathapi.azurewebsites.net/${img}`}
              alt={`Property Photo ${indx + 1}`}
            />
          </div>
        ))}
      </div>

      <div className="flex items-start justify-between gap-3 mt-5">
        <div>
          <div className="text-[#0857d0] text-[38px] font-bold font-dmsans leading-loose">
            {roomDetails?.rent
              ? `$${Number(roomDetails.rent).toLocaleString("en-US")}`
              : "Loading..."}
          </div>
          <div className="text-gray-800 text-[26px] font-bold font-dmsans">
            {roomDetails?.roomType || "Single Room"}
          </div>
          <div className="text-gray-400 text-[26px] font-bold font-dmsans">
            Owner - {roomDetails?.poster_name}
          </div>
          <ReviewPostContent contents={contents} type="displayDetails" />
        </div>

        <div className="flex flex-col gap-3">
          <div className="mt-3 px-7 py-3 bg-[#ffa41c] rounded-[57px] inline-flex justify-center items-center gap-2.5">
            <PhoneOutlinedIcon />
            <div className=" text-gray-800 text-base font-bold font-dmsans">
              Contact
            </div>
          </div>

          <button
            onClick={handleClick}
            disabled={roomDetails?.poster_id === user?.id}
            className={`px-5 py-2.5 rounded-[57px] inline-flex justify-center items-center gap-2.5 ${
              roomDetails?.poster_id === user?.id ? "cursor-not-allowed" : ""
            }`}
          >
            <SmsOutlinedIcon color="primary" />
            <div className="justify-end text-[#ffa41c] text-base font-bold font-dmsans">
              Chat with Owner
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default RoomDetails;
