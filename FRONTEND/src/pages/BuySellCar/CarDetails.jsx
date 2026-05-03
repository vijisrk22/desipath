import { RiShareForwardLine } from "react-icons/ri";
import { RiHeart3Line } from "react-icons/ri";
import DisplayPath from "../../components/DisplayPath";
import ReviewPostContent from "../../components/BuySellCar/ReviewPostContent";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import SmsOutlinedIcon from "@mui/icons-material/SmsOutlined";

import { useEffect, useState } from "react";
import { fetchCarById, getCarAttributes } from "../../store/CarsSlice";
import Loader from "../../components/Loader";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";

import { getCarContents } from "./DisplayCarDetail";
import api from "../../utils/api";
import ImageScroller from "../../components/ImageScroller";
import { getFullImageUrl } from "../../utils/imageHelper";

function CarDetails() {
  const paths = [
    { text: "Home", eP: "/" },
    { text: "Buy/Sell Cars", eP: "/services/cars/buyCar" },
  ];

  const { action, carId: carIdParam } = useParams();
  const carId = carIdParam || action;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { loading, error, carDetails, car_attributes } = useSelector((state) => state.cars);
  const [openContact, setOpenContact] = useState(false);

  useEffect(() => {
    dispatch(fetchCarById(carId));
    dispatch(getCarAttributes());
  }, [dispatch, carId]);

  // If loading, show loader
  if (loading) {
    return <Loader />;
  }

  // If there's an error fetching data
  if (error) {
    return <div className="text-red-500">Error loading car details.</div>;
  }

  // Make sure houseDetails is available before accessing it
  if (!carDetails) {
    return (
      <div className="mx-20 my-10">
        <div className="text-gray-500">
          Car details are not available at the moment.
        </div>
      </div>
    );
  }

  const handleClick = () => {
    if (!user) {
      navigate("/login", { state: { from: { pathname: window.location.pathname } } });
      return;
    }

    const chatPartnerInfo = {
      chatPartnerId: carDetails.seller_id,
      chatPartnerName: carDetails.seller_name,
      chatPartnerLocation: carDetails.location,
    };

    const defaultMsg = `I am interested in your Ad Car: ${carDetails.year} ${carDetails.make} ${carDetails.model}`;

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

  const contents = getCarContents(carDetails, carDetails?.pictures ? carDetails?.pictures : [], car_attributes);

  console.log("Car Details: ", carDetails);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-6 md:my-10 font-dmsans text-gray-800">
      <DisplayPath
        paths={paths}
        color="[#667479]"
        additionalStyles={"leading-tight mb-4"}
      />
      {carDetails.pictures?.length > 0 && (
        <div className="aspect-[4/3] md:aspect-[16/9] max-h-[300px] md:max-h-[550px] my-5 flex justify-center items-center shadow-sm rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
          <div className="w-full h-full">
            <ImageScroller images={carDetails.pictures.map(img => getFullImageUrl(img))} />
          </div>
        </div>
      )}
      <div className="flex flex-wrap justify-start gap-2 md:gap-4 overflow-x-auto pb-2">
        {carDetails.pictures?.map((img, indx) => (
          <div key={indx} className="shrink-0">
            <img
              className="w-20 h-20 md:w-32 md:h-32 rounded-xl border-2 border-[#0857d0] object-cover shadow-sm transition-transform hover:scale-105"
              src={getFullImageUrl(img)}
              alt={`Car Image ${indx + 1}`}
            />
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row items-start justify-between gap-8 mt-10">
        <div className="w-full lg:flex-1">
          <div className="text-[#0857d0] text-[32px] md:text-[38px] font-bold font-dmsans leading-tight mb-2">
            {carDetails?.price
              ? `$${Number(carDetails.price).toLocaleString("en-US", { maximumFractionDigits: 0 })}`
              : "Loading..."}
          </div>
          <div className="text-gray-800 text-[22px] md:text-[26px] font-bold font-dmsans mb-1">
            {carDetails?.make} {carDetails?.model} - {carDetails?.year}
          </div>
          <div className="text-gray-500 font-medium flex items-center gap-1 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {carDetails?.location_city 
              ? `${carDetails.location_city}, ${carDetails.location_zipcode}, ${carDetails.location_state}`
              : carDetails?.location || "Location not provided"}
          </div>
          <div className="text-gray-400 text-[18px] md:text-[22px] font-bold font-dmsans mb-6">
            {carDetails?.is_dealer 
              ? `Dealer - ${carDetails?.dealer_name}` 
              : `Owner - ${carDetails?.owner_name || carDetails?.seller_name}`}
          </div>
          <div className="overflow-x-auto w-full">
            <ReviewPostContent contents={contents} type="display" />
          </div>
        </div>

        <div className="flex flex-col gap-4 w-full md:w-auto min-w-[240px]">
          <div
            onClick={() => setOpenContact(true)}
            className="cursor-pointer w-full px-7 py-4 bg-[#ffa41c] rounded-[57px] inline-flex justify-center items-center gap-2.5 shadow-md hover:bg-[#e8931a] transition-all"
          >
            <PhoneOutlinedIcon />
            <div className="text-gray-800 text-base font-bold font-dmsans">Contact</div>
          </div>

          <Dialog open={openContact} onClose={() => setOpenContact(false)} fullWidth maxWidth="xs">
            <DialogTitle className="font-bold">Contact {carDetails?.is_dealer ? "Dealer" : "Owner"}</DialogTitle>
            <DialogContent dividers>
              <div className="py-4 text-center">
                <div className="text-lg flex flex-col gap-3 border-none">
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
                        <span className="text-2xl font-bold text-[#0857d0]">{carDetails?.dealer_contact_number}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-gray-500 text-sm">Email</span>
                        <span className="text-md text-gray-700">{carDetails?.dealer_email}</span>
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
                        <span className="text-2xl font-bold text-[#0857d0]">{carDetails?.owner_contact_number || carDetails?.owner_contact}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </DialogContent>
            <DialogActions className="p-4">
              <Button onClick={() => setOpenContact(false)} variant="contained" className="bg-[#0857d0] w-full py-2 rounded-xl" sx={{ bgcolor: "#0857d0", color: "white", "&:hover": { bgcolor: "#0646a8" } }}>
                Close
              </Button>
            </DialogActions>
          </Dialog>

          <button
            onClick={handleClick}
            disabled={Number(carDetails?.seller_id) === Number(user?.id)}
            className={`w-full px-7 py-4 rounded-[57px] inline-flex justify-center items-center gap-2.5 border-2 border-[#0857d0] bg-white text-[#0857d0] hover:bg-blue-50 transition-all shadow-sm ${
              Number(carDetails?.seller_id) === Number(user?.id) 
                ? "opacity-50 cursor-not-allowed border-gray-300 text-gray-400" 
                : ""
            }`}
          >
            <SmsOutlinedIcon color={Number(carDetails?.seller_id) === Number(user?.id) ? "disabled" : "primary"} />
            <div className="text-base font-bold font-dmsans">
              Message {carDetails?.is_dealer ? "Dealer" : "Owner"}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default CarDetails;
