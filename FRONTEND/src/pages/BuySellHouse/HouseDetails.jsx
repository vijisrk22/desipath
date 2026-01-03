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
import { useParams } from "react-router-dom";

function HouseDetails() {
  const paths = [
    { text: "Home", eP: "/" },
    { text: "Houses", eP: "/services/houses/buyHouse" },
  ];

  const { houseId } = useParams();
  const imgs = Array(7).fill("/img/houses/house1.png");

  const dispatch = useDispatch();
  const { loading, error, houseDetails } = useSelector((state) => state.houses);

  // Fetch house details when the component mounts
  useEffect(() => {
    dispatch(fetchHouseById(houseId)); // Assume r ID 1 for now
  }, [dispatch]);

  // If loading, show loader
  if (loading) {
    return <Loader />;
  }

  // If there's an error fetching data
  if (error) {
    return <div className="text-red-500">Error loading house details.</div>;
  }

  // Make sure houseDetails is available before accessing it
  if (!houseDetails) {
    return (
      <div className="mx-20 my-10">
        <div className="text-gray-500">
          House details are not available at the moment.
        </div>
      </div>
    );
  }

  // Safe to access houseDetails now
  const formattedDetails = Object.entries(houseDetails?.details || {}).map(
    ([key, value]) => ({
      text: key,
      value,
    })
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
      <div className="h-[476px] my-5 flex justify-center items-center ">
        <img
          className="self-stretch rounded-[10px]"
          src={imgs[0]}
          alt="House Image"
        />
      </div>
      <div className="flex flex-wrap justify-center gap-4">
        {imgs.map((img, indx) => (
          <div key={indx} className="flex justify-center">
            <img
              className="w-[150px] h-[150px] rounded-md border-[3px] border-[#2e61b1]"
              src={img}
              alt={`Image ${indx}`}
            />
          </div>
        ))}
      </div>

      <div className="flex items-start justify-between gap-3 mt-5">
        <div>
          <div className="text-[#0857d0] text-[38px] font-bold font-dmsans leading-loose">
            {houseDetails?.price
              ? `${houseDetails.price.toLocaleString()}`
              : "Loading..."}
          </div>
          <div className="text-gray-800 text-[26px] font-bold font-dmsans">
            {houseDetails?.details?.["Type"] || "Loading..."}
          </div>
          <ReviewPostContent contents={formattedDetails} />
        </div>

        <div className="flex flex-col gap-3">
          <div className="mt-3 px-7 py-3 bg-[#ffa41c] rounded-[57px] inline-flex justify-center items-center gap-2.5">
            <PhoneOutlinedIcon />
            <div className=" text-gray-800 text-base font-bold font-dmsans">
              Contact
            </div>
          </div>

          <div className="px-5 py-2.5 rounded-[57px] inline-flex justify-center items-center gap-2.5">
            <SmsOutlinedIcon color="primary" />
            <div className="justify-end text-[#ffa41c] text-base font-bold font-dmsans">
              Chat with Owner
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HouseDetails;
