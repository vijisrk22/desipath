import { RiShareForwardLine } from "react-icons/ri";
import { RiHeart3Line } from "react-icons/ri";
import DisplayPath from "../../components/DisplayPath";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import SmsOutlinedIcon from "@mui/icons-material/SmsOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

import { useEffect, useState } from "react";
import { fetchRoomById } from "../../store/RoommatesSlice";
import Loader from "../../components/Loader";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getFullImageUrl } from "../../utils/imageHelper";
import ImageScroller from "../../components/ImageScroller";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Menu, MenuItem } from "@mui/material";

function RoomDetails() {
  const paths = [
    { text: "Home", eP: "/" },
    { text: "Rooms", eP: "/services/roommates/findRoom" },
  ];

  const navigate = useNavigate();

  const { action, roomId: roomIdParam } = useParams();
  const rawId = roomIdParam || action;
  const roomId = rawId ? rawId.split('-')[0] : null;

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { loading, error, roomDetails } = useSelector(
    (state) => state.roommates
  );

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
      navigator.clipboard.writeText(url);
      alert("Link copied! You can paste it in your Instagram story or bio.");
    }
  };

  useEffect(() => {
    dispatch(fetchRoomById(roomId));
  }, [dispatch, roomId]);

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
      chatPartnerId: roomDetails.poster_id,
      chatPartnerName: roomDetails.poster_name,
      chatPartnerLocation: `${roomDetails.location_state || ""}, ${roomDetails.location_city || ""}, ${roomDetails.location_zipcode || ""}`,
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

  // If there's an error fetching data
  if (error) {
    return (
      <div className="text-red-500 p-10 font-bold text-base">
        Error loading room details: {typeof error === 'object' ? error.message || 'Unknown error' : error}
      </div>
    );
  }

  // Make sure roomDetails is available before accessing it
  if (!roomDetails) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-6 md:my-10 font-dmsans">
        <div className="text-gray-500 text-sm">
          Room details are not available at the moment.
        </div>
      </div>
    );
  }

  const formatBoolOrValue = (value) => {
    if (value === true || value === "Yes" || value === "yes" || value === 1 || value === "1") return "Yes";
    if (value === false || value === "No" || value === "no" || value === 0 || value === "0") return "No";
    return value || "No";
  };

  const formatUtilities = (value) => {
    if (value === true || value === "Yes" || value === "yes" || value === 1 || value === "1" || String(value).toLowerCase() === "included") return "Included";
    return "Not Included";
  };

  // Group Details for Premium Layout
  const roomFeatures = [
    { label: "Room Type", value: roomDetails.roomType || "Single Room" },
    { label: "Sharing Type", value: roomDetails.sharing_type || "Private Room" },
    { label: "Furnished", value: roomDetails.is_furnished ? "Furnished" : "Unfurnished" },
    { label: "Preferred Gender", value: roomDetails.gender_preference || "Any" },
    { label: "Veg/Non-Veg", value: roomDetails.food_preference || "Any" },
  ];

  const amenities = [
    { label: "Kitchen Access", value: formatBoolOrValue(roomDetails.kitchen_available) },
    { label: "Shared Bathroom", value: formatBoolOrValue(roomDetails.shared_bathroom) },
    { label: "Washer/Dryer", value: formatBoolOrValue(roomDetails.washer_dryer) },
    { label: "Car Parking", value: formatBoolOrValue(roomDetails.car_parking_available) },
  ];

  const termsList = [
    { label: "Available From", value: roomDetails.available_from ? new Date(roomDetails.available_from).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' }) : "Immediate" },
    { label: "Available To", value: roomDetails.available_to ? new Date(roomDetails.available_to).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' }) : "Flexible" },
    { label: "Utilities", value: formatUtilities(roomDetails.utilities_included) },
    { label: "Listed By", value: `${roomDetails.poster_name} (${roomDetails.owner ? "Owner" : (roomDetails.agent ? "Agent" : "Owner")})` },
  ];

  const imgs = Array.isArray(roomDetails?.photos) ? roomDetails.photos : [];

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
            <button onClick={() => setShowPhotos(true)} className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-sm px-6 py-2 rounded-full font-bold shadow-md hover:bg-white transition-colors border border-gray-200 z-10 text-xs">
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
                <div className="text-gray-900 text-[32px] md:text-[38px] font-bold font-dmsans tracking-tight">
                  {roomDetails?.rent
                    ? `$${parseFloat(roomDetails.rent).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
                    : "Contact for Rent"}
                  <span className="text-lg md:text-xl font-normal text-gray-500"> / {roomDetails?.rent_frequency || "Monthly"}</span>
                </div>
                <div className="text-gray-700 text-base md:text-lg font-semibold flex gap-4 md:gap-6 mt-2 md:mt-0 flex-wrap items-center">
                  <span>{roomDetails?.roomType || "Single Room"}</span>
                  <span className="text-gray-300">|</span>
                  <span>{roomDetails?.sharing_type || "Private Room"}</span>
                  <span className="text-gray-300">|</span>
                  <span>Pref: {roomDetails?.gender_preference || "Any"}</span>
                </div>
              </div>
              <div className="text-gray-500 text-base md:text-lg font-dmsans mt-2">
                {roomDetails?.address ? `${roomDetails.address}, ` : ""}{roomDetails?.location_city}, {roomDetails?.location_state} {roomDetails?.location_zipcode}
              </div>
              <div className="flex items-center gap-3 mt-4">
                 <span className="px-2.5 py-0.5 bg-green-100 text-green-800 rounded-full text-xs font-semibold tracking-wide uppercase">{roomDetails?.status || "Active"}</span>
                 <span className="text-gray-500 text-xs font-medium bg-gray-100 px-2.5 py-0.5 rounded-full">{roomDetails?.owner ? "Owner Listing" : (roomDetails?.agent ? "Agent Listing" : "Owner Listing")}</span>
              </div>
            </div>

            {/* Description Section */}
            <div className="mb-10">
              <h2 className="text-xl font-bold mb-4">About this roommate listing</h2>
              <p className="text-gray-700 leading-relaxed text-base bg-gray-50 p-5 rounded-2xl whitespace-pre-line">
                {roomDetails?.description || "No description provided."}
              </p>
            </div>

            {/* Premium Details Grid */}
            <div className="mb-10">
              <h2 className="text-xl font-bold mb-6">Facts and features</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                
                {/* Room Features */}
                <div>
                  <h3 className="text-lg font-bold mb-3 flex items-center gap-2 text-gray-800 border-b pb-2">
                    <InfoOutlinedIcon fontSize="small" /> Room details
                  </h3>
                  <ul className="space-y-3">
                    {roomFeatures.map((item, idx) => (
                      <li key={idx} className="flex justify-between text-sm">
                        <span className="text-gray-500">{item.label}</span>
                        <span className="font-medium text-gray-900">{item.value}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Amenities */}
                <div>
                  <h3 className="text-lg font-bold mb-3 flex items-center gap-2 text-gray-800 border-b pb-2">
                    <CheckCircleOutlineIcon fontSize="small" /> Amenities
                  </h3>
                  <ul className="space-y-3">
                    {amenities.map((item, idx) => (
                      <li key={idx} className="flex justify-between text-sm">
                        <span className="text-gray-500">{item.label}</span>
                        <span className="font-medium text-gray-900">{item.value}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Terms and Listing details */}
                <div>
                  <h3 className="text-lg font-bold mb-3 flex items-center gap-2 text-gray-800 border-b pb-2">
                    <InfoOutlinedIcon fontSize="small" /> Terms & Info
                  </h3>
                  <ul className="space-y-3">
                    {termsList.map((item, idx) => (
                      <li key={idx} className="flex justify-between text-sm">
                        <span className="text-gray-500">{item.label}</span>
                        <span className="font-medium text-gray-900">{item.value}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Sticky Sidebar */}
          <div className="w-full lg:w-[360px] flex-shrink-0 lg:sticky lg:top-28 self-start">
            <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 p-6 md:p-8 flex flex-col gap-5">
              
              <div className="flex items-center gap-4 mb-2 pb-6 border-b border-gray-100">
                <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-lg">
                  {roomDetails?.poster_name?.charAt(0) || "U"}
                </div>
                <div>
                  <div className="font-bold text-base">{roomDetails?.poster_name || "Unknown User"}</div>
                  <div className="text-xs text-gray-500">{roomDetails?.owner ? "Owner" : (roomDetails?.agent ? "Agent" : "Owner")}</div>
                </div>
              </div>

              <div className="flex gap-4 w-full">
                <button
                  onClick={(e) => setAnchorEl(e.currentTarget)}
                  className="flex-1 px-3 py-3 rounded-[12px] inline-flex justify-center items-center gap-1.5 border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-all font-semibold font-dmsans text-sm"
                >
                  <RiShareForwardLine size={18} />
                  Share
                </button>
                <button className="flex-1 px-3 py-3 rounded-[12px] inline-flex justify-center items-center gap-1.5 border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-all font-semibold font-dmsans text-sm">
                   <RiHeart3Line size={18} />
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
                  <MenuItem onClick={() => handleShare("copy")} className="font-dmsans text-sm">
                    Copy Link
                  </MenuItem>
                  <MenuItem onClick={() => handleShare("facebook")} className="font-dmsans text-sm">
                    Facebook
                  </MenuItem>
                  <MenuItem onClick={() => handleShare("instagram")} className="font-dmsans text-sm">
                    Instagram
                  </MenuItem>
                </Menu>
              </div>

              <button 
                onClick={handleContactClick} 
                className="w-full py-3.5 bg-[#1565D8] hover:bg-[#1152b3] text-white rounded-[12px] inline-flex justify-center items-center gap-2 shadow-md transition-all text-sm font-semibold font-dmsans"
              >
                <PhoneOutlinedIcon fontSize="small" />
                Contact Poster
              </button>

              <button
                onClick={handleMessageClick}
                disabled={Number(roomDetails?.poster_id) === Number(user?.id)}
                className={`w-full py-3.5 rounded-[12px] inline-flex justify-center items-center gap-2 border border-[#1565D8] bg-white text-[#1565D8] hover:bg-blue-50 transition-all shadow-sm text-sm font-semibold font-dmsans ${Number(roomDetails?.poster_id) === Number(user?.id) ? "opacity-50 cursor-not-allowed border-gray-300 text-gray-400" : ""
                  }`}
              >
                <SmsOutlinedIcon fontSize="small" />
                Message Poster
              </button>

              <p className="text-[11px] text-center text-gray-400 mt-2">
                By clicking Contact Poster, you agree to our Terms of Use and Privacy Policy.
              </p>

            </div>
          </div>

          {/* Contact Modal */}
          <Dialog open={openContact} onClose={() => setOpenContact(false)} fullWidth maxWidth="xs">
            <DialogTitle className="font-bold text-center pt-6 text-lg">Contact Poster</DialogTitle>
            <DialogContent>
              <div className="py-6 text-center">
                <p className="text-sm text-gray-500 mb-2">Phone Number</p>
                <div className="text-2xl font-bold text-[#1565D8]">
                  {roomDetails?.phone_no || "Not Available"}
                </div>
              </div>
            </DialogContent>
            <DialogActions className="p-4 pb-6">
              <Button onClick={() => setOpenContact(false)} variant="contained" className="bg-[#1565D8] w-full py-3 rounded-xl font-bold text-sm">
                Close
              </Button>
            </DialogActions>
          </Dialog>

        </div>
      </div>
    </div>
  );
}

export default RoomDetails;
