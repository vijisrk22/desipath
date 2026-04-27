import { RiShareForwardLine } from "react-icons/ri";
import { RiHeart3Line } from "react-icons/ri";
import DisplayPath from "../../components/DisplayPath";
import ReviewPostContent from "../../components/BuySellHouse/ReviewPostContent";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import SmsOutlinedIcon from "@mui/icons-material/SmsOutlined";

import { useEffect, useState } from "react";
import { fetchHouseById } from "../../store/HousesSlice";
import Loader from "../../components/Loader";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { getFullImageUrl } from "../../utils/imageHelper";
import ImageScroller from "../../components/ImageScroller";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";

function HouseDetails() {
  const paths = [
    { text: "Home", eP: "/" },
    { text: "Houses", eP: "/services/houses/buyHouse" },
  ];

  const navigate = useNavigate();
  const { action, houseId: houseIdParam } = useParams();
  const houseId = houseIdParam || action;
  
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { loading, error, houseDetails } = useSelector((state) => state.houses);
  
  const [openContact, setOpenContact] = useState(false);

  // Fetch house details when the component mounts
  useEffect(() => {
    dispatch(fetchHouseById(houseId));
  }, [dispatch, houseId]);

  // Safely parse images
  let imgs = [];
  try {
    const rawImages = houseDetails?.images;
    if (rawImages) {
      const parsed = typeof rawImages === 'string' ? JSON.parse(rawImages) : rawImages;
      imgs = Array.isArray(parsed) ? parsed : [parsed];
    }
  } catch (e) {
    console.error("Error parsing house images:", e);
  }

  // If loading, show loader
  if (loading) {
    return <Loader />;
  }

  const handleContactClick = () => {
    setOpenContact(true);
  };

  const handleMessageClick = () => {
    if (!user) {
      navigate("/login", { state: { from: { pathname: window.location.pathname } } });
      return;
    }

    const chatPartnerInfo = {
      chatPartnerId: houseDetails.seller_id,
      chatPartnerName: houseDetails.seller_name,
      chatPartnerLocation: `${houseDetails.location_state}, ${houseDetails.location_city}, ${houseDetails.location_zipcode}`,
    };

    try {
      navigate(
        `/inbox?adType=house&adId=${houseDetails.id
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
    return <div className="text-red-500 p-10">Error loading house details: {error}</div>;
  }

  // Make sure houseDetails is available before accessing it
  if (!houseDetails) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-6 md:my-10">
        <div className="text-gray-500">
          House details are not available at the moment.
        </div>
      </div>
    );
  }

  // Manually map labels to flat fields
  const detailMappings = [
    { label: "You Are an", key: "user_type" },
    { label: "Company Name", key: "company_name" },
    { label: "Type", key: "home_type" },
    { label: "Price per Sq.ft", key: "price_per_sqft" },
    { label: "Built Area", key: "built_area" },
    { label: "Lot Size", key: "lot_size" },
    { label: "Total Parking Spaces", key: "total_parking_spaces" },
    { label: "Attached Garage", key: "attached_garage", isBool: true },
    { label: "HOA Fees If Any", key: "hoa_fees" },
    { label: "Year Built", key: "year_built" },
    { label: "Total Number Of Bed Rooms", key: "bedroom_total" },
    { label: "Total Bathrooms", key: "total_bathroom_total" },
    { label: "Full Bathrooms", key: "full_bathroom_total" },
    { label: "Total Number Of Half Bathrooms", key: "half_bathroom_total" },
    { label: "Basement Size", key: "basement_size" },
    { label: "Basement", key: "basement_status" },
    { label: "Laundry In House", key: "laundry_in_house", isBool: true },
    { label: "Pool", key: "pool", isBool: true },
    { label: "Community Pool", key: "community_pool", isBool: true },
    { label: "Total Number Of Levels", key: "home_level" },
    { label: "Kitchen Granite Top", key: "kitchen_granite_countertop", isBool: true },
    { label: "Solar Setup", key: "solar_setup", isBool: true },
    { label: "Fireplace", key: "fireplace_count" },
    { label: "Annual Tax Amount", key: "annual_tax_amount" },
    { label: "Flooring", key: "flooring" },
    { label: "Address", key: "address" },
    { label: "Location", value: houseDetails.location_city ? `${houseDetails.location_city}, ${houseDetails.location_state} ${houseDetails.location_zipcode}` : "N/A" },
    { label: "Additional Information", key: "description" },
  ];

  const formattedDetails = detailMappings
    .map(item => {
      let value = item.value || houseDetails[item.key];
      if (item.isBool) {
        value = value ? "Yes" : "No";
      }
      // Remove decimals for all numeric fields as requested
      if (typeof value === 'number' || (typeof value === 'string' && !isNaN(value) && value.includes('.'))) {
        value = Math.round(parseFloat(value)).toString();
      }
      return {
        text: item.label,
        value: value
      };
    })
    .filter(item => item.value && item.value !== "N/A");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-6 md:my-10 font-dmsans">
      <DisplayPath
        paths={paths}
        color="[#667479]"
        additionalStyles={"leading-tight mb-4"}
      />
      
      {imgs.length > 0 && imgs[0] !== "/homesSmpl.png" && (
        <div className="aspect-[4/3] md:aspect-[16/9] max-h-[300px] md:max-h-[550px] my-5 flex justify-center items-center shadow-sm rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
          <div className="w-full h-full">
            <ImageScroller images={imgs} />
          </div>
        </div>
      )}

      {imgs.length > 0 && imgs[0] !== "/homesSmpl.png" && (
        <div className="flex flex-wrap justify-start gap-2 md:gap-4 overflow-x-auto pb-2">
          {imgs.map((img, indx) => (
            <div key={indx} className="shrink-0">
              <img
                className="w-20 h-20 md:w-32 md:h-32 rounded-xl border-2 border-gray-100 object-cover shadow-sm transition-transform hover:scale-105"
                src={getFullImageUrl(img)}
                alt={`Property Image ${indx + 1}`}
              />
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col lg:flex-row items-start justify-between gap-8 mt-10">
        <div className="w-full lg:flex-1">
          <div className="text-[#0857d0] text-[32px] md:text-[38px] font-bold font-dmsans leading-tight mb-2">
            {houseDetails?.price
              ? `$${parseFloat(houseDetails.price).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
              : "Contact for Price"}
          </div>
          <div className="text-gray-800 text-[22px] md:text-[26px] font-bold font-dmsans">
            {houseDetails?.home_type || "Property"}
          </div>
          <div className="text-gray-400 text-[18px] md:text-[22px] font-bold font-dmsans mb-6">
            Listed by {houseDetails?.seller_name} ({houseDetails?.user_type})
          </div>
          <div className="overflow-x-auto w-full">
            <ReviewPostContent contents={formattedDetails} />
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
            <DialogTitle className="font-bold">Contact Seller</DialogTitle>
            <DialogContent dividers>
              <div className="py-4 text-center">
                <p className="text-gray-500 mb-2">Phone Number</p>
                <div className="text-2xl font-bold text-[#0857d0]">
                  {houseDetails?.phone_no || "Not Available"}
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
            onClick={handleMessageClick}
            disabled={houseDetails?.seller_id === user?.id}
            className={`w-full px-7 py-4 rounded-[57px] inline-flex justify-center items-center gap-2.5 border-2 border-[#0857d0] bg-white text-[#0857d0] hover:bg-blue-50 transition-all shadow-sm ${houseDetails?.seller_id === user?.id ? "opacity-50 cursor-not-allowed border-gray-300 text-gray-400" : ""
              }`}
          >
            <SmsOutlinedIcon color={houseDetails?.seller_id === user?.id ? "disabled" : "primary"} />
            <div className="text-base font-bold font-dmsans">
              Message Seller
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default HouseDetails;
