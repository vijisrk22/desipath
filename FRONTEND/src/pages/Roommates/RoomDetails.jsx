import { RiShareForwardLine } from "react-icons/ri";
import { RiHeart3Line } from "react-icons/ri";
import DisplayPath from "../../components/DisplayPath";
import ReviewPostContent from "../../components/Roommates/ReviewPostContent";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import SmsOutlinedIcon from "@mui/icons-material/SmsOutlined";
import { getRoomContents } from "./DisplayRoomDetail";
import api from "../../utils/api";
import { getFullImageUrl } from "../../utils/imageHelper";

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
    const defaultMsg = `I am interested in your Ad Roommate listing at ${roomDetails.location_city}, ${roomDetails.location_state} ${roomDetails.location_zipcode}`;

    try {
      navigate(
        `/inbox?adType=roommate&adId=${
          roomDetails.id
        }&chatPartnerInfo=${encodeURIComponent(
          JSON.stringify(chatPartnerInfo)
        )}&initialMessage=${encodeURIComponent(defaultMsg)}`
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
    <div className="mx-4 md:mx-20 my-6 md:my-10 font-dmsans">
      <DisplayPath
        paths={paths}
        color="[#667479]"
        additionalStyles={"leading-tight mb-4"}
      />
      {roomDetails.photos?.length > 0 && (
        <div className="h-[250px] md:h-[476px] my-5 flex justify-center items-center shadow-sm rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
          <div className="w-full h-full">
            <ImageScroller images={roomDetails.photos.map(img => getFullImageUrl(img))} />
          </div>
        </div>
      )}
      <div className="flex flex-wrap justify-center gap-4">
        {roomDetails.photos?.map((img, indx) => (
          <div key={indx} className="flex justify-center">
            <img
              className="w-[150px] h-[150px] rounded-xl border-[3px] border-[#0857d0] object-cover shadow-sm transition-transform hover:scale-105"
              src={getFullImageUrl(img)}
              alt={`Property Photo ${indx + 1}`}
            />
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row items-start justify-between gap-8 mt-10">
        <div className="flex-1 w-full">
          <div className="text-[#0857d0] text-[28px] md:text-[38px] font-bold font-dmsans leading-tight mb-2">
            {roomDetails?.rent
              ? `$${Number(roomDetails.rent).toLocaleString("en-US")}`
              : "Loading..."}
          </div>
          <div className="text-gray-800 text-[20px] md:text-[26px] font-bold font-dmsans mb-1">
            {roomDetails?.roomType || "Single Room"}
          </div>
          <div className="text-gray-400 text-[18px] md:text-[22px] font-bold font-dmsans mb-6">
            {roomDetails?.owner ? "Owner" : (roomDetails?.agent ? "Agent" : "Owner")} - {roomDetails?.poster_name}
          </div>
          <ReviewPostContent contents={contents} type="displayDetails" />
        </div>

        <div className="flex flex-col gap-4 w-full lg:min-w-[240px] lg:w-auto">
          <div className="cursor-pointer px-7 py-4 bg-[#ffa41c] rounded-[57px] inline-flex justify-center items-center gap-2.5 shadow-md hover:bg-[#e8931a] transition-all">
            <PhoneOutlinedIcon />
            <div className=" text-gray-800 text-base font-bold font-dmsans">
              Contact
            </div>
          </div>

          <button
            onClick={handleClick}
            disabled={Number(roomDetails?.poster_id) === Number(user?.id)}
            className={`w-full px-7 py-4 rounded-[57px] inline-flex justify-center items-center gap-2.5 border-2 border-[#0857d0] bg-white text-[#0857d0] hover:bg-blue-50 transition-all shadow-sm ${
              Number(roomDetails?.poster_id) === Number(user?.id) 
                ? "opacity-50 cursor-not-allowed border-gray-300 text-gray-400" 
                : ""
            }`}
          >
            <SmsOutlinedIcon color={Number(roomDetails?.poster_id) === Number(user?.id) ? "disabled" : "primary"} />
            <div className="text-base font-bold font-dmsans">
              Chat with Owner
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default RoomDetails;
