import { RiShareForwardLine } from "react-icons/ri";
import { RiHeart3Line } from "react-icons/ri";
import DisplayPath from "../../components/DisplayPath";
import ReviewPostContent from "../../components/RentalHome/ReviewPostContent";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import SmsOutlinedIcon from "@mui/icons-material/SmsOutlined";

import { useEffect } from "react";
import { fetchRentalHomeById } from "../../store/RentalHomesSlice";
import Loader from "../../components/Loader";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import api from "../../utils/api";
import { getRentalHomeContents } from "./DisplayRentalHomeDetail";
import ImageScroller from "../../components/ImageScroller";

function RentalHomeDetails() {
  const paths = [
    { text: "Home", eP: "/" },
    { text: "Rental Homes", eP: "/services/rentalHomes/findRentalHome" },
  ];

  const navigate = useNavigate();

  const { action: rentalHomeId } = useParams();

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { loading, error, rentalHomeDetails } = useSelector(
    (state) => state.rentalHomes
  );

  // Fetch room details when the component mounts
  useEffect(() => {
    dispatch(fetchRentalHomeById(rentalHomeId));
  }, [dispatch]);

  // If loading, show loader
  if (loading) {
    return <Loader />;
  }

  const handleClick = () => {
    const chatPartnerInfo = {
      chatPartnerId: rentalHomeDetails.owner_id,
      chatPartnerName: rentalHomeDetails.owner_name,
      chatPartnerLocation: `${rentalHomeDetails.location_state}, ${rentalHomeDetails.location_city}, ${rentalHomeDetails.location_zipcode}`,
    };

    try {
      navigate(
        `/chat?adType=rentalhome&adId=${
          rentalHomeDetails.id
        }&chatPartnerInfo=${encodeURIComponent(
          JSON.stringify(chatPartnerInfo)
        )}`
      );
    } catch (err) {
      console.log(err);
    }
  };

  // If there's an error fetching data
  if (error) {
    return <div className="text-red-500">Error loading room details.</div>;
  }

  // Make sure rentalHomeDetails is available before accessing it
  if (!rentalHomeDetails) {
    return (
      <div className="mx-20 my-10">
        <div className="text-gray-500">
          Rental Home details are not available at the moment.
        </div>
      </div>
    );
  }

  console.log(rentalHomeDetails);

  // Safe to access roomDetails now
  const formattedDetails = Object.entries(rentalHomeDetails || {})
    .filter(([key]) => key !== "images")
    .reduce((acc, [key, value]) => {
      if (key === "images") return acc;

      // 3) All other fields: boolean → "Yes"/"No", else keep value
      acc[key] = typeof value === "boolean" ? (value ? "Yes" : "No") : value;

      return acc;
    }, {});

  const contents = getRentalHomeContents(
    formattedDetails,
    rentalHomeDetails?.images ? rentalHomeDetails?.images : [],
    "display"
  );

  return (
    <div className=" mx-20 my-10">
      <div className="flex justify-between items-center">
        <div className="text-[#0857d0] text-3xl font-normal font-fredoka">
          Desipath
        </div>
        <div className="flex gap-4">
          <RiShareForwardLine size={30} className="text-[#0857d0]" />
          <RiHeart3Line size={30} className="text-[#0857d0]" />
        </div>
      </div>
      <DisplayPath
        paths={paths}
        color="[#667479]"
        additionalStyles={"leading-tight"}
      />
      {rentalHomeDetails.images?.length > 0 && (
        <div className="h-[476px] my-5 flex justify-center items-center ">
          <div className="my-4">
            <ImageScroller images={rentalHomeDetails.images} />
          </div>
        </div>
      )}
      <div className="flex flex-wrap justify-center gap-4">
        {rentalHomeDetails.images?.map((image, indx) => (
          <div key={indx} className="flex justify-center">
            <img
              className="w-[150px] h-[150px] rounded-md border-[3px] border-[#2e61b1]"
              src={`${api.defaults.baseURL}/${image}`}
              alt={`Image ${indx}`}
            />
          </div>
        ))}
      </div>

      <div className="flex items-start justify-between gap-3 mt-5">
        <div>
          <div className="text-[#0857d0] text-[38px] font-bold font-dmsans leading-loose">
            {rentalHomeDetails?.deposit_rent
              ? `$${Number(rentalHomeDetails.deposit_rent).toLocaleString(
                  "en-US"
                )}`
              : "Loading..."}
          </div>
          <div className="text-gray-800 text-[26px] font-bold font-dmsans">
            {rentalHomeDetails?.property_type || "Loading..."}
          </div>
          <div className="text-gray-400 text-[26px] font-bold font-dmsans">
            Owner - {rentalHomeDetails?.owner_name}
          </div>
          <ReviewPostContent contents={contents} />
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
            disabled={rentalHomeDetails.owner_id === user.id}
            className={`px-5 py-2.5 rounded-[57px] inline-flex justify-center items-center gap-2.5 ${
              rentalHomeDetails.owner_id === user.id ? "cursor-not-allowed" : ""
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

export default RentalHomeDetails;
