import { RiShareForwardLine } from "react-icons/ri";
import { RiHeart3Line } from "react-icons/ri";
import DisplayPath from "../../components/DisplayPath";
import ReviewPostContent from "../../components/RentalHome/ReviewPostContent";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import SmsOutlinedIcon from "@mui/icons-material/SmsOutlined";

import { useState, useEffect } from "react";
import { fetchRentalHomeById } from "../../store/RentalHomesSlice";
import Loader from "../../components/Loader";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";

import api from "../../utils/api";
import { getRentalHomeContents } from "./DisplayRentalHomeDetail";
import ImageScroller from "../../components/ImageScroller";
import { getFullImageUrl } from "../../utils/imageHelper";

function RentalHomeDetails() {
  const paths = [
    { text: "Home", eP: "/" },
    { text: "Rental Homes", eP: "/services/rentalhomes/findRentalHome" },
  ];

  const navigate = useNavigate();

  const { action, homeId } = useParams();
  const rentalHomeId = homeId || action;

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { loading, error, rentalHomeDetails } = useSelector(
    (state) => state.rentalHomes
  );

  // Fetch rental home details when the component mounts
  useEffect(() => {
    dispatch(fetchRentalHomeById(rentalHomeId));
  }, [dispatch, rentalHomeId]);

  const [openContact, setOpenContact] = useState(false);

  // If loading, show loader
  if (loading) {
    return <Loader />;
  }

  const handleContactClick = () => {
    setOpenContact(true);
  };

  const handleClick = () => {
    if (!user) {
      navigate("/login", { state: { from: { pathname: window.location.pathname } } });
      return;
    }

    const chatPartnerInfo = {
      chatPartnerId: rentalHomeDetails.owner_id,
      chatPartnerName: rentalHomeDetails.owner_name,
      chatPartnerLocation: `${rentalHomeDetails.location_state}, ${rentalHomeDetails.location_city}, ${rentalHomeDetails.location_zipcode}`,
    };

    try {
      navigate(
        `/inbox?adType=rentalhome&adId=${rentalHomeDetails.id
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
    return <div className="text-red-500">Error loading rental home details.</div>;
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-6 md:my-10 font-dmsans">
      <DisplayPath
        paths={paths}
        color="[#667479]"
        additionalStyles={"leading-tight mb-4"}
      />
      {rentalHomeDetails.images?.length > 0 && (
        <div className="aspect-[4/3] md:aspect-[16/9] max-h-[300px] md:max-h-[550px] my-5 flex justify-center items-center shadow-sm rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
          <div className="w-full h-full">
            <ImageScroller images={rentalHomeDetails.images.map(img => getFullImageUrl(img))} />
          </div>
        </div>
      )}
      <div className="flex flex-wrap justify-start gap-2 md:gap-4 overflow-x-auto pb-2">
        {rentalHomeDetails.images?.map((image, indx) => (
          <div key={indx} className="shrink-0">
            <img
              className="w-20 h-20 md:w-32 md:h-32 rounded-xl border-2 border-[#0857d0] object-cover shadow-sm transition-transform hover:scale-105"
              src={getFullImageUrl(image)}
              alt={`Property Image ${indx + 1}`}
            />
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row items-start justify-between gap-8 mt-10">
        <div className="w-full lg:flex-1">
          <div className="text-[#0857d0] text-[32px] md:text-[38px] font-bold font-dmsans leading-tight mb-2">
            {rentalHomeDetails?.deposit_rent
              ? `$${Number(rentalHomeDetails.deposit_rent).toLocaleString(
                "en-US",
                { maximumFractionDigits: 0 }
              )}`
              : "Loading..."}
          </div>
          <div className="text-gray-800 text-[22px] md:text-[26px] font-bold font-dmsans">
            {rentalHomeDetails?.property_type || "Loading..."}
          </div>
          <div className="text-gray-400 text-[18px] md:text-[22px] font-bold font-dmsans mb-6">
            Owner - {rentalHomeDetails?.owner_name}
          </div>
          <div className="overflow-x-auto w-full">
            <ReviewPostContent contents={contents} type="display" />
          </div>
        </div>

        <div className="flex flex-col gap-4 w-full md:w-auto min-w-[240px]">
          <div onClick={handleContactClick} className="cursor-pointer w-full px-7 py-4 bg-[#ffa41c] rounded-[57px] inline-flex justify-center items-center gap-2.5 shadow-md hover:bg-[#e8931a] transition-all">
            <PhoneOutlinedIcon />
            <div className=" text-gray-800 text-base font-bold font-dmsans">
              Contact
            </div>
          </div>

          <Dialog open={openContact} onClose={() => setOpenContact(false)} fullWidth maxWidth="xs">
            <DialogTitle className="font-bold">Contact Owner</DialogTitle>
            <DialogContent dividers>
              <div className="py-4 text-center">
                <p className="text-gray-500 mb-2">Phone Number</p>
                <div className="text-2xl font-bold text-[#0857d0]">
                  {rentalHomeDetails?.contact_no || "Not Available"}
                </div>
              </div>
            </DialogContent>
            <DialogActions className="p-4">
              <Button onClick={() => setOpenContact(false)} variant="contained" className="bg-[#0857d0] w-full py-2 rounded-xl">
                Close
              </Button>
            </DialogActions>
          </Dialog>

          <button
            onClick={handleClick}
            disabled={rentalHomeDetails?.owner_id === user?.id}
            className={`w-full px-7 py-4 rounded-[57px] inline-flex justify-center items-center gap-2.5 border-2 border-[#0857d0] bg-white text-[#0857d0] hover:bg-blue-50 transition-all shadow-sm ${rentalHomeDetails?.owner_id === user?.id ? "opacity-50 cursor-not-allowed border-gray-300 text-gray-400" : ""
              }`}
          >
            <SmsOutlinedIcon color={rentalHomeDetails?.owner_id === user?.id ? "disabled" : "primary"} />
            <div className="text-base font-bold font-dmsans">
              Message Owner
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default RentalHomeDetails;
