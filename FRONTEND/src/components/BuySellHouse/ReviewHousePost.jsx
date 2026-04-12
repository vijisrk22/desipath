import { Box, Button, Modal } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ReviewPostContent from "./ReviewPostContent";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../Loader";
import { postHouse } from "../../store/HousesSlice";
import { convertImagesToBase64 } from "../../utils/helper";

function ReviewHousePost({ open, onClose, formDetails, images }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.houses);
  const { user } = useSelector((state) => state.user);

  const contents = [
    {
      text: "You Are an",
      value: formDetails.role,
    },
    {
      text: "Type",
      value: formDetails.type,
    },
    {
      text: "Built Area",
      value: formDetails.builtArea,
    },
    {
      text: "Lot Size",
      value: formDetails.lotSize,
    },
    {
      text: "Hoa Fees If Any",
      value: formDetails.hoaFees,
    },
    {
      text: "Year Built",
      value: formDetails.yearBuilt,
    },
    {
      text: "Bedroom Total",
      value: formDetails.numBedrooms,
    },
    {
      text: "Half Bathroom Total",
      value: formDetails.halfBathrooms,
    },
    {
      text: "Basement Size",
      value: formDetails.basementSize,
    },
    {
      text: "Basement",
      value: formDetails.basement,
    },
    {
      text: "Laundry In House",
      value: formDetails.laundryInHouse,
    },
    {
      text: "Level",
      value: formDetails.numOfLevels,
    },
    {
      text: "Kitchen Granite Top",
      value: formDetails.kitchenGraniteTop,
    },
    {
      text: "Fireplace",
      value: formDetails.firePlace,
    },
    {
      text: "Flooring",
      value: Object.keys(formDetails.flooringOptions) // Get the keys
        .filter((option) => formDetails.flooringOptions[option] === true) // Keep only those with value true
        .join(" "), // Join the keys with a space
    },
    {
      text: "Additional Information",
      value: formDetails.description,
    },
    {
      text: "Photos",
      value: "",
    },
  ];

  const handleSubmit = async () => {
    const formFields = {};
    
    formFields["user_type"] = formDetails.role;

    let homeTypeMapped = formDetails.type;
    if (homeTypeMapped === "Condominium") homeTypeMapped = "Condominum";
    if (homeTypeMapped === "Single Family") homeTypeMapped = "Single family";
    if (homeTypeMapped === "Town House") homeTypeMapped = "Town home";
    formFields["home_type"] = homeTypeMapped;

    if (formDetails.price) formFields["price"] = parseFloat(formDetails.price);
    
    if (formDetails.builtArea) formFields["built_area"] = parseFloat(formDetails.builtArea);
    if (formDetails.lotSize) formFields["lot_size"] = parseFloat(formDetails.lotSize);
    if (formDetails.hoaFees) formFields["hoa_fees"] = parseFloat(formDetails.hoaFees);
    if (formDetails.yearBuilt) formFields["year_built"] = parseInt(formDetails.yearBuilt, 10);
    if (formDetails.numBedrooms) formFields["bedroom_total"] = parseInt(formDetails.numBedrooms, 10);
    if (formDetails.halfBathrooms) formFields["half_bathroom_total"] = parseInt(formDetails.halfBathrooms, 10);
    if (formDetails.basementSize) formFields["basement_size"] = parseFloat(formDetails.basementSize);
    
    if (formDetails.basement) {
      let basementMapped = formDetails.basement;
      if (basementMapped === "Semi Finished") basementMapped = "Semi finished";
      formFields["basement_status"] = basementMapped;
    }
    
    if (formDetails.laundryInHouse) formFields["laundry_in_house"] = formDetails.laundryInHouse === "Yes";
    if (formDetails.numOfLevels) formFields["home_level"] = parseInt(formDetails.numOfLevels, 10);
    if (formDetails.kitchenGraniteTop) formFields["kitchen_granite_countertop"] = formDetails.kitchenGraniteTop === "Yes";
    if (formDetails.firePlace) formFields["fireplace_count"] = formDetails.firePlace === "Yes" ? 1 : 0;
    
    if (formDetails.location) {
      const locParts = formDetails.location.split(",");
      formFields["location_city"] = locParts[0]?.trim();
      formFields["location_state"] = locParts[1]?.trim();
      formFields["location_zipcode"] = locParts[2]?.trim();
    }

    if (formDetails.flooringOptions) {
        const floorLabels = {
            wood: "Wood",
            vinyl: "Vinyl",
            carpet: "Carpet",
            ceramicTile: "Ceramic Tile"
        };
        formFields["flooring"] = Object.keys(formDetails.flooringOptions)
            .filter((k) => formDetails.flooringOptions[k])
            .map(k => floorLabels[k]);
    }
    
    formFields["description"] = formDetails.description;

    if (user) {
        formFields["seller_id"] = user.id;
        formFields["seller_name"] = user.name;
    }

    try {
      if (images && images.length > 0) {
           formFields["images"] = await convertImagesToBase64(images);
      } else {
           formFields["images"] = [];
      }

      console.log("Submitting house:", formFields);
      const result = await dispatch(postHouse(formFields)).unwrap(); 
      console.log("Post successful:", result);
      navigate("/services/houses");
    } catch (err) {
      console.error("Failed to post house:", err);
      onClose();
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          maxWidth: 600,
          width: "100%",
          maxHeight: "90vh", // Set a max height for the modal
          overflowY: "auto",
        }}
      >
        <div className="flex justify-between items-center">
          <div className="justify-center text-[#007185] text-[22px] font-bold font-dmsans">
            Review Your Listing And Submit
          </div>
          <Button onClick={onClose}>
            <EditIcon color="primary" variant="outline" />
          </Button>
        </div>
        <div className="text-[#0857d0] text-[38px] font-bold font-dmsans leading-loose">
          {formDetails.price
            ? parseFloat(formDetails.price).toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })
            : "$0.00"}
        </div>
        <div className=" text-gray-800 text-[26px] font-bold font-dmsans">
          {formDetails.type}
        </div>

        <ReviewPostContent contents={contents} />
        <div className="mx-auto mt-10 max-w-20">
          <button
            onClick={handleSubmit}
            className="px-5 py-3 bg-[#ffa41c] rounded-xl text-gray-800 text-center text-base font-medium font-dmsans"
          >
            Post
          </button>
        </div>
      </Box>
    </Modal>
  );
}

export default ReviewHousePost;
