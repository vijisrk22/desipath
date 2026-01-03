import { RiShareForwardLine } from "react-icons/ri";
import { RiHeart3Line } from "react-icons/ri";
import DisplayPath from "../../components/DisplayPath";
import ReviewPostContent from "../../components/BuySellCar/ReviewPostContent";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import SmsOutlinedIcon from "@mui/icons-material/SmsOutlined";

import { useEffect } from "react";
import { fetchCarById } from "../../store/CarsSlice";
import Loader from "../../components/Loader";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import { getCarContents } from "./DisplayCarDetail";
import api from "../../utils/api";
import ImageScroller from "../../components/ImageScroller";

function CarDetails() {
  const paths = [
    { text: "Home", eP: "/" },
    { text: "Buy/Sell Cars", eP: "/services/cars/buyCar" },
  ];

  const { carId } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const { loading, error, carDetails } = useSelector((state) => state.cars);

  // Fetch house details when the component mounts
  useEffect(() => {
    dispatch(fetchCarById(carId));
  }, [dispatch]);

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
    const chatPartnerInfo = {
      chatPartnerId: carDetails.seller_id,
      chatPartnerName: carDetails.seller_name,
      chatPartnerLocation: carDetails.location,
    };

    try {
      navigate(
        `/chat?adType=car&adId=${
          carDetails.id
        }&chatPartnerInfo=${encodeURIComponent(
          JSON.stringify(chatPartnerInfo)
        )}`
      );
    } catch (err) {
      console.log(err);
    }
  };

  const contents = getCarContents(
    carDetails,
    carDetails?.pictures ? carDetails?.pictures : []
  );

  console.log("Car Details: ", carDetails);

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
      {carDetails.pictures?.length > 0 && (
        <div className="my-4">
          <ImageScroller images={carDetails.pictures} />
        </div>
      )}
      <div className="flex flex-wrap justify-center gap-4">
        {carDetails.pictures?.map((img, indx) => (
          <div key={indx} className="flex justify-center">
            <img
              className="w-[150px] h-[150px] rounded-md border-[3px] border-[#2e61b1]"
              src={`${api.defaults.baseURL}/${img}`}
              alt={`Image ${indx}`}
            />
          </div>
        ))}
      </div>

      <div className="flex items-start justify-between gap-3 mt-5">
        <div>
          <div className="text-[#0857d0] text-[38px] font-bold font-dmsans leading-loose">
            {carDetails?.price
              ? `$${Number(carDetails.price).toLocaleString("en-US")}`
              : "Loading..."}
          </div>
          <div className="text-gray-800 text-[26px] font-bold font-dmsans">
            {carDetails?.model} - {carDetails?.year}
          </div>
          <div className="text-gray-400 text-[26px] font-bold font-dmsans">
            Owner - {carDetails?.seller_name}
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
            disabled={carDetails.seller_id === user.id}
            className={`px-5 py-2.5 rounded-[57px] inline-flex justify-center items-center gap-2.5 ${
              carDetails.seller_id === user.id ? "cursor-not-allowed" : ""
            }`}
          >
            <SmsOutlinedIcon color="primary" />
            <div
              className={`justify-end text-[#ffa41c] text-base font-bold font-dmsans`}
            >
              Chat with Owner
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default CarDetails;
