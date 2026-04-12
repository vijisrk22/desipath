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
  const dispatch = useDispatch();
  const { loading, error, houseDetails } = useSelector((state) => state.houses);
  const [selectedImg, setSelectedImg] = useState(null);

  // Fetch house details when the component mounts
  useEffect(() => {
    dispatch(fetchHouseById(houseId));
  }, [dispatch, houseId]);

  // Handle images initialization
  const imgs = (houseDetails?.images && houseDetails.images.length > 0) 
    ? (typeof houseDetails.images === 'string' ? JSON.parse(houseDetails.images) : houseDetails.images)
    : ["/house-placeholder.png"];

  useEffect(() => {
    if (imgs.length > 0 && !selectedImg) {
      setSelectedImg(imgs[0]);
    }
  }, [imgs, selectedImg]);

  // If loading, show loader
  if (loading) {
    return <Loader />;
  }

  // If there's an error fetching data
  if (error) {
    return <div className="text-red-500 p-10">Error loading house details: {error}</div>;
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

  // Manually map labels to flat fields
  const detailMappings = [
    { label: "You Are an", key: "user_type" },
    { label: "Type", key: "home_type" },
    { label: "Built Area", key: "built_area" },
    { label: "Lot Size", key: "lot_size" },
    { label: "Hoa Fees If Any", key: "hoa_fees" },
    { label: "Year Built", key: "year_built" },
    { label: "Bedroom Total", key: "bedroom_total" },
    { label: "Half Bathroom Total", key: "half_bathroom_total" },
    { label: "Basement Size", key: "basement_size" },
    { label: "Basement", key: "basement_status" },
    { label: "Laundry In House", key: "laundry_in_house", isBool: true },
    { label: "Level", key: "home_level" },
    { label: "Kitchen Granite Top", key: "kitchen_granite_countertop", isBool: true },
    { label: "Fireplace", key: "fireplace_count" },
    { label: "Flooring", key: "flooring" },
    { label: "Location", value: houseDetails.location_city ? `${houseDetails.location_city}, ${houseDetails.location_state} ${houseDetails.location_zipcode}` : "N/A" },
    { label: "Additional Information", key: "description" },
  ];

  const formattedDetails = detailMappings.map(item => {
    let value = item.value || houseDetails[item.key];
    if (item.isBool) {
      value = value ? "Yes" : "No";
    }
    return {
      text: item.label,
      value: value || "N/A"
    };
  });

  return (
    <div className=" mx-20 my-10">
      <div className="flex justify-between items-center text-sm">
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
      <div className="h-[476px] my-5 flex justify-center items-center overflow-hidden rounded-[10px]">
        <img
          className="h-full w-auto object-contain rounded-[10px]"
          src={selectedImg || imgs[0]}
          alt="House Image"
        />
      </div>
      <div className="flex flex-wrap justify-center gap-4">
        {imgs.map((img, indx) => (
          <div key={indx} className="flex justify-center cursor-pointer" onClick={() => setSelectedImg(img)}>
            <img
              className={`w-[120px] h-[100px] object-cover rounded-md border-[3px] ${selectedImg === img ? 'border-[#ffa41c]' : 'border-gray-200'}`}
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
              ? `$${parseFloat(houseDetails.price).toLocaleString()}`
              : "Contact for Price"}
          </div>
          <div className="text-gray-800 text-[26px] font-bold font-dmsans mb-4">
            {houseDetails?.home_type || "Property"}
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
