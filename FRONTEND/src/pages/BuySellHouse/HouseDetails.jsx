import { RiShareForwardLine } from "react-icons/ri";
import { RiHeart3Line } from "react-icons/ri";
import DisplayPath from "../../components/DisplayPath";
import ReviewPostContent from "../../components/BuySellHouse/ReviewPostContent";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import SmsOutlinedIcon from "@mui/icons-material/SmsOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

import { useEffect, useState } from "react";
import { fetchHouseById } from "../../store/HousesSlice";
import Loader from "../../components/Loader";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { getFullImageUrl } from "../../utils/imageHelper";
import ImageScroller from "../../components/ImageScroller";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Menu, MenuItem } from "@mui/material";

function HouseDetails() {
  const paths = [
    { text: "Home", eP: "/" },
    { text: "Buy Home", eP: "/services/BuyHome/find" },
  ];

  const navigate = useNavigate();
  const { action, houseId: houseIdParam } = useParams();
  const rawId = houseIdParam || action;
  const parts = rawId ? rawId.split('-') : [];
  const houseId = parts.length > 0 ? parts[parts.length - 1] : null;
  
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { loading, error, houseDetails } = useSelector((state) => state.houses);
  
  const [openContact, setOpenContact] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showPhotos, setShowPhotos] = useState(false);

  const handleShare = (platform) => {
    const url = window.location.href;
    setAnchorEl(null);

    if (platform === "copy") {
      navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    } else if (platform === "facebook") {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank");
    } else if (platform === "instagram") {
      // Instagram doesn't have a direct share URL for web links like this, so we prompt to copy.
      navigator.clipboard.writeText(url);
      alert("Link copied! You can paste it in your Instagram story or bio.");
    }
  };

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
      const defaultMsg = `I am interested in your Ad Buy/Sell Home at ${houseDetails.location_city}, ${houseDetails.location_state} ${houseDetails.location_zipcode}`;

      navigate(
        `/inbox?adType=buysellhome&adId=${houseDetails.id
        }&chatPartnerInfo=${encodeURIComponent(
          JSON.stringify(chatPartnerInfo)
        )}&initialMessage=${encodeURIComponent(defaultMsg)}`
      );
    } catch (err) {
      console.log(err);
    }
  };

  // If there's an error fetching data
  if (error) {
    return (
      <div className="text-red-500 p-10 font-bold">
        Error loading house details: {typeof error === 'object' ? error.message || 'Unknown error' : error}
      </div>
    );
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

  // Group Details for Premium Layout
  const mainFeatures = [
    { label: "Type", value: houseDetails.home_type },
    { label: "Year Built", value: houseDetails.year_built },
    { label: "Heating/Cooling", value: houseDetails.solar_setup ? "Solar" : "Standard" },
    { label: "Parking", value: `${houseDetails.total_parking_spaces || 0} Spaces` },
    { label: "Lot Size", value: houseDetails.lot_size ? `${houseDetails.lot_size} sqft` : "N/A" },
    { label: "Price/Sqft", value: houseDetails.price_per_sqft ? `$${houseDetails.price_per_sqft}` : "N/A" },
  ];

  const interiorDetails = [
    { label: "Bedrooms", value: houseDetails.bedroom_total },
    { label: "Bathrooms", value: `${houseDetails.total_bathroom_total} (Full: ${houseDetails.full_bathroom_total}, Half: ${houseDetails.half_bathroom_total})` },
    { label: "Basement", value: houseDetails.basement_status },
    { label: "Flooring", value: houseDetails.flooring },
    { label: "Fireplace", value: houseDetails.fireplace_count > 0 ? "Yes" : "No" },
    { label: "Laundry", value: houseDetails.laundry_in_house ? "In Unit" : "No" },
    { label: "Kitchen", value: houseDetails.kitchen_granite_countertop ? "Granite Counters" : "Standard" },
  ];

  const exteriorDetails = [
    { label: "Home Level", value: houseDetails.home_level ? `${houseDetails.home_level} Story` : "N/A" },
    { label: "Attached Garage", value: houseDetails.attached_garage ? "Yes" : "No" },
    { label: "Pool", value: houseDetails.pool ? "Private Pool" : "No" },
    { label: "Community Pool", value: houseDetails.community_pool ? "Yes" : "No" },
    { label: "Under Construction", value: houseDetails.under_construction ? "Yes" : "No" },
  ];

  const financialDetails = [
    { label: "HOA Fees", value: houseDetails.hoa_fees ? `$${houseDetails.hoa_fees}/mo` : "None" },
    { label: "Annual Taxes", value: houseDetails.annual_tax_amount ? `$${houseDetails.annual_tax_amount}` : "N/A" },
  ];

  return (
    <div className="bg-white min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 font-dmsans">
        <DisplayPath
          paths={paths}
          color="[#667479]"
          additionalStyles={"leading-tight mb-2"}
        />

        {/* Desktop Photo Mosaic */}
        {imgs.length > 0 && imgs[0] !== "/homesSmpl.png" && (
          <div className="hidden lg:grid grid-cols-4 grid-rows-2 gap-2 h-[500px] mt-4 mb-10 rounded-2xl overflow-hidden relative">
            <div className="col-span-3 row-span-2 relative cursor-pointer overflow-hidden group" onClick={() => setShowPhotos(true)}>
              <img src={getFullImageUrl(imgs[0])} alt="Main" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
            {imgs.length > 1 ? (
              <div className="col-span-1 row-span-1 relative cursor-pointer overflow-hidden group" onClick={() => setShowPhotos(true)}>
                <img src={getFullImageUrl(imgs[1])} alt="Sub 1" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
            ) : (
              <div className="col-span-1 row-span-1 bg-gray-100" />
            )}
            {imgs.length > 2 ? (
              <div className="col-span-1 row-span-1 relative cursor-pointer overflow-hidden group" onClick={() => setShowPhotos(true)}>
                <img src={getFullImageUrl(imgs[2])} alt="Sub 2" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
            ) : (
              <div className="col-span-1 row-span-1 bg-gray-100" />
            )}
            {/* View All Photos Button */}
            <button onClick={() => setShowPhotos(true)} className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-sm px-6 py-2 rounded-full font-bold shadow-md hover:bg-white transition-colors border border-gray-200 z-10">
              View all {imgs.length} photos
            </button>
          </div>
        )}

        {/* Full Screen Photo Viewer Modal */}
        <Dialog 
          open={showPhotos} 
          onClose={() => setShowPhotos(false)} 
          maxWidth="lg" 
          fullWidth
          PaperProps={{ sx: { height: '80vh', borderRadius: 3, overflow: 'hidden', backgroundColor: 'black' } }}
        >
          <div className="relative w-full h-full flex flex-col bg-black">
            <div className="absolute top-4 right-4 z-50">
               <button onClick={() => setShowPhotos(false)} className="bg-black/50 text-white rounded-full p-2 hover:bg-black/80 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
               </button>
            </div>
            <div className="w-full h-full p-4">
               <ImageScroller images={imgs} autoAdvance={false} />
            </div>
          </div>
        </Dialog>

        {/* Mobile/Tablet Photo Scroller */}
        {imgs.length > 0 && imgs[0] !== "/homesSmpl.png" && (
          <div className="lg:hidden aspect-[4/3] md:aspect-[16/9] max-h-[400px] my-5 flex justify-center items-center shadow-sm rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
            <div className="w-full h-full">
              <ImageScroller images={imgs} />
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row items-start justify-between gap-12 mt-6 lg:mt-10">
          
          {/* LEFT COLUMN: Main Content */}
          <div className="w-full lg:flex-1">
            
            {/* High-Priority Header */}
            <div className="flex flex-col gap-2 mb-8 border-b border-gray-200 pb-8">
              <div className="flex flex-col md:flex-row md:items-baseline md:gap-6">
                <div className="text-gray-900 text-[40px] md:text-[48px] font-bold font-dmsans tracking-tight">
                  {houseDetails?.price
                    ? `$${parseFloat(houseDetails.price).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
                    : "Contact for Price"}
                </div>
                <div className="text-gray-700 text-xl md:text-2xl font-bold flex gap-4 md:gap-6 mt-2 md:mt-0">
                  <span>{houseDetails?.bedroom_total || "-"} <span className="font-normal text-gray-500 text-base md:text-lg">bds</span></span>
                  <span className="text-gray-300">|</span>
                  <span>{houseDetails?.total_bathroom_total || "-"} <span className="font-normal text-gray-500 text-base md:text-lg">ba</span></span>
                  <span className="text-gray-300">|</span>
                  <span>{houseDetails?.built_area || "-"} <span className="font-normal text-gray-500 text-base md:text-lg">sqft</span></span>
                </div>
              </div>
              <div className="text-gray-600 text-lg md:text-xl font-dmsans mt-2">
                {houseDetails?.address}, {houseDetails?.location_city}, {houseDetails?.location_state} {houseDetails?.location_zipcode}
              </div>
              <div className="flex items-center gap-3 mt-4">
                 <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-bold tracking-wide uppercase">{houseDetails?.status || "Active"}</span>
                 <span className="text-gray-500 text-sm font-medium bg-gray-100 px-3 py-1 rounded-full">{houseDetails?.home_type}</span>
              </div>
            </div>

            {/* Description Section */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold mb-4">About this home</h2>
              <p className="text-gray-700 leading-relaxed text-lg bg-gray-50 p-6 rounded-2xl">
                {houseDetails?.description || "No description provided."}
              </p>
            </div>

            {/* Premium Details Grid */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold mb-6">Facts and features</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                
                {/* Interior Details */}
                <div>
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800 border-b pb-2">
                    <InfoOutlinedIcon fontSize="small" /> Interior details
                  </h3>
                  <ul className="space-y-3">
                    {interiorDetails.map((item, idx) => (
                      <li key={idx} className="flex justify-between text-base">
                        <span className="text-gray-500">{item.label}</span>
                        <span className="font-medium text-gray-900">{item.value}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Exterior Details */}
                <div>
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800 border-b pb-2">
                    <CheckCircleOutlineIcon fontSize="small" /> Property details
                  </h3>
                  <ul className="space-y-3">
                    {exteriorDetails.map((item, idx) => (
                      <li key={idx} className="flex justify-between text-base">
                        <span className="text-gray-500">{item.label}</span>
                        <span className="font-medium text-gray-900">{item.value}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Financial Details */}
                <div>
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800 border-b pb-2">
                    <InfoOutlinedIcon fontSize="small" /> Financial details
                  </h3>
                  <ul className="space-y-3">
                    {financialDetails.map((item, idx) => (
                      <li key={idx} className="flex justify-between text-base">
                        <span className="text-gray-500">{item.label}</span>
                        <span className="font-medium text-gray-900">{item.value}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Listing Details */}
                <div>
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800 border-b pb-2">
                    <CheckCircleOutlineIcon fontSize="small" /> Listing details
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex justify-between text-base">
                        <span className="text-gray-500">Listed by</span>
                        <span className="font-medium text-gray-900">{houseDetails?.seller_name} ({houseDetails?.user_type})</span>
                    </li>
                    <li className="flex justify-between text-base">
                        <span className="text-gray-500">Company Name</span>
                        <span className="font-medium text-gray-900">{houseDetails?.company_name || "N/A"}</span>
                    </li>
                  </ul>
                </div>

              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Sticky Sidebar */}
          <div className="w-full lg:w-[360px] flex-shrink-0 lg:sticky lg:top-28 self-start">
            <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 p-6 md:p-8 flex flex-col gap-5">
              
              <div className="flex items-center gap-4 mb-2 pb-6 border-b border-gray-100">
                <div className="w-14 h-14 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-xl">
                  {houseDetails?.seller_name?.charAt(0) || "U"}
                </div>
                <div>
                  <div className="font-bold text-lg">{houseDetails?.seller_name || "Unknown Agent"}</div>
                  <div className="text-sm text-gray-500">{houseDetails?.company_name || houseDetails?.user_type}</div>
                </div>
              </div>

              <div className="flex gap-4 w-full">
                <button
                  onClick={(e) => setAnchorEl(e.currentTarget)}
                  className="flex-1 px-4 py-3.5 rounded-[12px] inline-flex justify-center items-center gap-2 border-2 border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-all font-bold font-dmsans"
                >
                  <RiShareForwardLine size={20} />
                  Share
                </button>
                <button className="flex-1 px-4 py-3.5 rounded-[12px] inline-flex justify-center items-center gap-2 border-2 border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-all font-bold font-dmsans">
                   <RiHeart3Line size={20} />
                   Save
                </button>
                
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={() => setAnchorEl(null)}
                  PaperProps={{
                    elevation: 3,
                    sx: { mt: 1, borderRadius: 2, minWidth: 150 },
                  }}
                >
                  <MenuItem onClick={() => handleShare("copy")} className="font-dmsans">
                    Copy Link
                  </MenuItem>
                  <MenuItem onClick={() => handleShare("facebook")} className="font-dmsans">
                    Facebook
                  </MenuItem>
                  <MenuItem onClick={() => handleShare("instagram")} className="font-dmsans">
                    Instagram
                  </MenuItem>
                </Menu>
              </div>

              <button 
                onClick={handleContactClick} 
                className="w-full py-4 bg-[#1565D8] hover:bg-[#1152b3] text-white rounded-[12px] inline-flex justify-center items-center gap-2 shadow-md transition-all"
              >
                <PhoneOutlinedIcon fontSize="small" />
                <div className="text-base font-bold font-dmsans">
                  Contact Seller
                </div>
              </button>

              <button
                onClick={handleMessageClick}
                disabled={Number(houseDetails?.seller_id) === Number(user?.id)}
                className={`w-full py-4 rounded-[12px] inline-flex justify-center items-center gap-2 border-2 border-[#1565D8] bg-white text-[#1565D8] hover:bg-blue-50 transition-all shadow-sm ${Number(houseDetails?.seller_id) === Number(user?.id) ? "opacity-50 cursor-not-allowed border-gray-300 text-gray-400" : ""
                  }`}
              >
                <SmsOutlinedIcon fontSize="small" />
                <div className="text-base font-bold font-dmsans">
                  Message Seller
                </div>
              </button>

              <p className="text-xs text-center text-gray-400 mt-2">
                By clicking Contact Seller, you agree to our Terms of Use and Privacy Policy.
              </p>

            </div>
          </div>

          {/* Contact Modal */}
          <Dialog open={openContact} onClose={() => setOpenContact(false)} fullWidth maxWidth="xs">
            <DialogTitle className="font-bold text-center pt-6">Contact Seller</DialogTitle>
            <DialogContent>
              <div className="py-6 text-center">
                <p className="text-gray-500 mb-2">Phone Number</p>
                <div className="text-3xl font-bold text-[#1565D8]">
                  {houseDetails?.phone_no || "Not Available"}
                </div>
              </div>
            </DialogContent>
            <DialogActions className="p-4 pb-6">
              <Button onClick={() => setOpenContact(false)} variant="contained" className="bg-[#1565D8] w-full py-3 rounded-xl font-bold">
                Close
              </Button>
            </DialogActions>
          </Dialog>

        </div>
      </div>
    </div>
  );
}

export default HouseDetails;
