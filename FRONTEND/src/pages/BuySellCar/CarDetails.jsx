import { RiShareForwardLine } from "react-icons/ri";
import { RiHeart3Line } from "react-icons/ri";
import DisplayPath from "../../components/DisplayPath";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import SmsOutlinedIcon from "@mui/icons-material/SmsOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

import { useEffect, useState } from "react";
import { fetchCarById, getCarAttributes } from "../../store/CarsSlice";
import Loader from "../../components/Loader";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Menu, MenuItem } from "@mui/material";

import ImageScroller from "../../components/ImageScroller";
import { getFullImageUrl } from "../../utils/imageHelper";

function CarDetails() {
  const paths = [
    { text: "Home", eP: "/" },
    { text: "Buy/Sell Cars", eP: "/services/cars/buyCar" },
  ];

  const navigate = useNavigate();
  const { action, carId: carIdParam } = useParams();
  const rawId = carIdParam || action;
  const carId = rawId ? rawId.split('-')[0] : null;

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { loading, error, carDetails, car_attributes } = useSelector((state) => state.cars);

  const [openContact, setOpenContact] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showPhotos, setShowPhotos] = useState(false);

  useEffect(() => {
    dispatch(fetchCarById(carId));
    dispatch(getCarAttributes());
  }, [dispatch, carId]);

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

  const handleMessageClick = () => {
    if (!user) {
      navigate("/login", { state: { from: { pathname: window.location.pathname } } });
      return;
    }

    const chatPartnerInfo = {
      chatPartnerId: carDetails.seller_id,
      chatPartnerName: carDetails.seller_name,
      chatPartnerLocation: carDetails.location,
    };

    const defaultMsg = `I am interested in your Ad Car: ${carDetails.year} ${getMakeName(carDetails.make)} ${getModelName(carDetails.model)}`;

    try {
      navigate(
        `/inbox?adType=car&adId=${
          carDetails.id
        }&chatPartnerInfo=${encodeURIComponent(
          JSON.stringify(chatPartnerInfo)
        )}&initialMessage=${encodeURIComponent(defaultMsg)}`
      );
    } catch (err) {
      console.log(err);
    }
  };

  // If loading, show loader
  if (loading) {
    return <Loader />;
  }

  // If there's an error fetching data
  if (error) {
    return (
      <div className="text-red-500 p-10 font-bold">
        Error loading car details: {typeof error === 'object' ? error.message || 'Unknown error' : error}
      </div>
    );
  }

  // Make sure carDetails is available
  if (!carDetails) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-6 md:my-10">
        <div className="text-gray-500">
          Car details are not available at the moment.
        </div>
      </div>
    );
  }

  // Safely parse pictures
  let imgs = [];
  try {
    const rawImages = carDetails?.pictures;
    if (rawImages) {
      const parsed = typeof rawImages === 'string' ? JSON.parse(rawImages) : rawImages;
      imgs = Array.isArray(parsed) ? parsed : [parsed];
    }
  } catch (e) {
    console.error("Error parsing car images:", e);
  }

  // Helpers for make/model
  const getMakeName = (makeVal) => {
    if (!makeVal) return "";
    if (typeof makeVal === 'object') {
      return makeVal.make || makeVal.name || "";
    }
    return String(makeVal);
  };

  const getModelName = (modelVal) => {
    if (!modelVal) return "";
    if (typeof modelVal === 'object') {
      return modelVal.model || modelVal.name || "";
    }
    return String(modelVal);
  };

  const getFuelName = (id) => car_attributes?.fuel_types?.find((f) => String(f.id) === String(id))?.name || id || "-";
  const getTransName = (id) => car_attributes?.transmissions?.find((t) => String(t.id) === String(id))?.name || id || "-";
  const getCondName  = (id) => car_attributes?.conditions?.find((c) => String(c.id) === String(id))?.name || id || "-";

  // Group Details for Premium Layout
  const vehicleDetails = [
    { label: "Make", value: getMakeName(carDetails.make_other || carDetails.make) },
    { label: "Model", value: getModelName(carDetails.model_other || carDetails.model) },
    { label: "Year", value: carDetails.year || "N/A" },
    { label: "Miles Driven", value: carDetails.miles ? `${Number(carDetails.miles).toLocaleString()} mi` : "-" },
    { label: "Condition", value: carDetails.condition_name || getCondName(carDetails.condition_id) },
  ];

  const engineSpecs = [
    { label: "Fuel Type", value: carDetails.fuel_type_name || getFuelName(carDetails.fuel_type_id) },
    { label: "Transmission", value: carDetails.transmission_name || getTransName(carDetails.transmission_id) },
    { label: "Drive Type", value: carDetails.drive_type || "N/A" },
    { label: "MPG", value: carDetails.mpg || "N/A" },
    { label: "VIN", value: carDetails.vin || "N/A" },
  ];

  const sellerDetails = carDetails.is_dealer ? [
    { label: "Seller Type", value: "Dealer" },
    { label: "Dealer Name", value: carDetails.dealer_name },
    { label: "Contact Person", value: carDetails.dealer_contact_person },
    { label: "Zipcode", value: carDetails.dealer_zipcode },
  ] : [
    { label: "Seller Type", value: "Private Owner" },
    { label: "Owner Name", value: carDetails.owner_name || carDetails.seller_name },
  ];

  const featuresList = Array.isArray(carDetails.features) 
    ? carDetails.features 
    : (typeof carDetails.features === 'string' 
        ? carDetails.features.split(',').map(s => s.trim()).filter(Boolean) 
        : []);

  return (
    <div className="bg-white min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 font-dmsans">
        <DisplayPath
          paths={paths}
          color="[#667479]"
          additionalStyles={"leading-tight mb-2"}
        />

        {/* Desktop Photo Mosaic */}
        {imgs.length > 0 && (
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
               <ImageScroller images={imgs.map(img => getFullImageUrl(img))} autoAdvance={false} />
            </div>
          </div>
        </Dialog>

        {/* Mobile/Tablet Photo Scroller */}
        {imgs.length > 0 && (
          <div className="lg:hidden aspect-[4/3] md:aspect-[16/9] max-h-[400px] my-5 flex justify-center items-center shadow-sm rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
            <div className="w-full h-full">
              <ImageScroller images={imgs.map(img => getFullImageUrl(img))} />
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
                  {carDetails?.price
                    ? `$${parseFloat(carDetails.price).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
                    : "Contact for Price"}
                </div>
                <div className="text-gray-700 text-xl md:text-2xl font-bold flex gap-4 md:gap-6 mt-2 md:mt-0">
                  <span>{carDetails?.year || "-"}</span>
                  <span className="text-gray-300">|</span>
                  <span>{carDetails?.miles ? `${Number(carDetails.miles).toLocaleString()} mi` : "-"}</span>
                  <span className="text-gray-300">|</span>
                  <span>{carDetails?.transmission_name || getTransName(carDetails.transmission_id)}</span>
                </div>
              </div>
              <div className="text-gray-600 text-lg md:text-xl font-dmsans mt-2">
                {getMakeName(carDetails.make_other || carDetails.make)} {getModelName(carDetails.model_other || carDetails.model)}
              </div>
              <div className="text-gray-500 font-medium flex items-center gap-1.5 mt-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>
                  {carDetails?.location_city 
                    ? `${carDetails.location_city}, ${carDetails.location_state} ${carDetails.location_zipcode || ""}`
                    : carDetails?.location || "Location not provided"}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-4">
                 <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-bold tracking-wide uppercase">{carDetails?.status || "Active"}</span>
                 <span className="text-gray-500 text-sm font-medium bg-gray-100 px-3 py-1 rounded-full">
                    {carDetails?.is_dealer ? "Dealer Listing" : "Private Seller"}
                 </span>
              </div>
            </div>

            {/* Description Section */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold mb-4">Seller description</h2>
              <p className="text-gray-700 leading-relaxed text-lg bg-gray-50 p-6 rounded-2xl">
                {carDetails?.description || "No description provided."}
              </p>
            </div>

            {/* Premium Details Grid */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold mb-6">Vehicle specification</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                
                {/* Vehicle Details */}
                <div>
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800 border-b pb-2">
                    <InfoOutlinedIcon fontSize="small" /> Vehicle details
                  </h3>
                  <ul className="space-y-3">
                    {vehicleDetails.map((item, idx) => (
                      <li key={idx} className="flex justify-between text-base">
                        <span className="text-gray-500">{item.label}</span>
                        <span className="font-medium text-gray-900">{item.value}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Specs Details */}
                <div>
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800 border-b pb-2">
                    <CheckCircleOutlineIcon fontSize="small" /> Engine & Specs
                  </h3>
                  <ul className="space-y-3">
                    {engineSpecs.map((item, idx) => (
                      <li key={idx} className="flex justify-between text-base">
                        <span className="text-gray-500">{item.label}</span>
                        <span className="font-medium text-gray-900">{item.value}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Features */}
                {featuresList.length > 0 && (
                  <div className="col-span-1 md:col-span-2">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800 border-b pb-2">
                      <CheckCircleOutlineIcon fontSize="small" /> Features & Options
                    </h3>
                    <div className="flex flex-wrap gap-2.5">
                      {featuresList.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-gray-700 bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-100">
                          <span className="text-green-500 font-bold">✓</span>
                          <span className="font-medium text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Listing Details */}
                <div className="col-span-1 md:col-span-2">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800 border-b pb-2">
                    <CheckCircleOutlineIcon fontSize="small" /> Seller information
                  </h3>
                  <ul className="space-y-3 max-w-md">
                    {sellerDetails.map((item, idx) => (
                      <li key={idx} className="flex justify-between text-base">
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
                <div className="w-14 h-14 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-xl">
                  {carDetails?.is_dealer 
                    ? carDetails?.dealer_name?.charAt(0) 
                    : (carDetails?.owner_name || carDetails?.seller_name)?.charAt(0) || "U"}
                </div>
                <div>
                  <div className="font-bold text-lg">
                    {carDetails?.is_dealer 
                      ? carDetails?.dealer_name 
                      : (carDetails?.owner_name || carDetails?.seller_name || "Unknown Seller")}
                  </div>
                  <div className="text-sm text-gray-500">
                    {carDetails?.is_dealer ? "Dealer" : "Private Seller"}
                  </div>
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
                onClick={() => setOpenContact(true)} 
                className="w-full py-4 bg-[#1565D8] hover:bg-[#1152b3] text-white rounded-[12px] inline-flex justify-center items-center gap-2 shadow-md transition-all"
              >
                <PhoneOutlinedIcon fontSize="small" />
                <div className="text-base font-bold font-dmsans">
                  Contact Seller
                </div>
              </button>

              <button
                onClick={handleMessageClick}
                disabled={Number(carDetails?.seller_id) === Number(user?.id)}
                className={`w-full py-4 rounded-[12px] inline-flex justify-center items-center gap-2 border-2 border-[#1565D8] bg-white text-[#1565D8] hover:bg-blue-50 transition-all shadow-sm ${Number(carDetails?.seller_id) === Number(user?.id) ? "opacity-50 cursor-not-allowed border-gray-300 text-gray-400" : ""
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
            <DialogContent dividers>
              <div className="py-4 text-center">
                <div className="flex flex-col gap-4">
                  {carDetails?.is_dealer ? (
                    <>
                      <div className="flex flex-col">
                        <span className="text-gray-500 text-sm">Dealer Name</span>
                        <span className="text-xl font-bold text-[#0857d0]">{carDetails?.dealer_name}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-gray-500 text-sm">Contact Person</span>
                        <span className="text-lg font-semibold">{carDetails?.dealer_contact_person}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-gray-500 text-sm">Phone</span>
                        <div className="text-3xl font-bold text-[#1565D8] mt-1">
                          {carDetails?.dealer_contact_number || "Not Available"}
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-gray-500 text-sm">Email</span>
                        <span className="text-md text-gray-700">{carDetails?.dealer_email || "Not Available"}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex flex-col">
                        <span className="text-gray-500 text-sm">Owner Name</span>
                        <span className="text-xl font-bold text-[#0857d0]">{carDetails?.owner_name || carDetails?.seller_name}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-gray-500 text-sm">Phone Number</span>
                        <div className="text-3xl font-bold text-[#1565D8] mt-1">
                          {carDetails?.owner_contact_number || carDetails?.owner_contact || "Not Available"}
                        </div>
                      </div>
                    </>
                  )}
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

export default CarDetails;
