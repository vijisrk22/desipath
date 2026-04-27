import { Box, Button, Modal, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ReviewPostContent from "./ReviewPostContent";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../Loader";
import { updateHouse, postHouse } from "../../store/HousesSlice";
import { convertImagesToBase64 } from "../../utils/helper";
import { useState } from "react";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

function ReviewHousePost({ open, onClose, formDetails, images, isEdit }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.houses);
  const { user } = useSelector((state) => state.user);
  const [isSuccess, setIsSuccess] = useState(false);

  const contents = [
    { text: "You Are an", value: formDetails.role },
    ...(formDetails.role === "Agent" ? [{ text: "Company Name", value: formDetails.company_name }] : []),
    { text: "Type", value: formDetails.type },
    { text: "Price per Sq.ft", value: formDetails.pricePerSqft },
    { text: "Built Area", value: formDetails.builtArea },
    { text: "Lot Size", value: formDetails.lotSize },
    { text: "Total Parking Spaces", value: formDetails.totalParking },
    { text: "Attached Garage", value: formDetails.attachedGarage },
    { text: "HOA Fees If Any", value: formDetails.hoaFees },
    { text: "Year Built", value: formDetails.yearBuilt },
    { text: "Total Number Of Bed Rooms", value: formDetails.numBedrooms },
    { text: "Total Bathrooms", value: formDetails.totalBathrooms },
    { text: "Full Bathrooms", value: formDetails.fullBathrooms },
    { text: "Total Number Of Half Bathrooms", value: formDetails.halfBathrooms },
    { text: "Basement Size", value: formDetails.basementSize },
    { text: "Basement", value: formDetails.basement },
    { text: "Laundry In House", value: formDetails.laundryInHouse },
    { text: "Pool", value: formDetails.pool },
    { text: "Community Pool", value: formDetails.communityPool },
    { text: "Solar Setup", value: formDetails.solarSetup },
    { text: "Total Number Of Levels", value: formDetails.numOfLevels },
    { text: "Kitchen Granite Top", value: formDetails.kitchenGraniteTop },
    { text: "Fireplace", value: formDetails.firePlace },
    { text: "Annual Tax Amount", value: formDetails.annualTax },
    { text: "Address", value: formDetails.address },
    { text: "Location", value: formDetails.location },
    {
      text: "Flooring",
      value: Object.keys(formDetails.flooringOptions || {})
        .filter((option) => formDetails.flooringOptions[option] === true)
        .join(" "),
    },
    { text: "Additional Information", value: formDetails.description },
    { text: "Photos", value: "" },
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
    if (formDetails.pricePerSqft) formFields["price_per_sqft"] = parseFloat(formDetails.pricePerSqft);
    if (formDetails.annualTax) formFields["annual_tax_amount"] = parseFloat(formDetails.annualTax);
    
    if (formDetails.builtArea) formFields["built_area"] = parseFloat(formDetails.builtArea);
    if (formDetails.lotSize) formFields["lot_size"] = parseFloat(formDetails.lotSize);
    if (formDetails.totalParking) formFields["total_parking_spaces"] = parseInt(formDetails.totalParking, 10);
    if (formDetails.attachedGarage) formFields["attached_garage"] = formDetails.attachedGarage === "Yes";
    if (formDetails.hoaFees) formFields["hoa_fees"] = parseFloat(formDetails.hoaFees);
    if (formDetails.yearBuilt) formFields["year_built"] = parseInt(formDetails.yearBuilt, 10);
    if (formDetails.numBedrooms) formFields["bedroom_total"] = parseInt(formDetails.numBedrooms, 10);
    if (formDetails.fullBathrooms) formFields["full_bathroom_total"] = parseInt(formDetails.fullBathrooms, 10);
    if (formDetails.halfBathrooms) formFields["half_bathroom_total"] = parseInt(formDetails.halfBathrooms, 10);
    if (formDetails.totalBathrooms) formFields["total_bathroom_total"] = parseInt(formDetails.totalBathrooms, 10);
    if (formDetails.basementSize) formFields["basement_size"] = parseFloat(formDetails.basementSize);
    
    if (formDetails.basement) {
      let basementMapped = formDetails.basement;
      if (basementMapped === "Semi Finished") basementMapped = "Semi finished";
      formFields["basement_status"] = basementMapped;
    }
    
    if (formDetails.laundryInHouse) formFields["laundry_in_house"] = formDetails.laundryInHouse === "Yes";
    if (formDetails.pool) formFields["pool"] = formDetails.pool === "Yes";
    if (formDetails.communityPool) formFields["community_pool"] = formDetails.communityPool === "Yes";
    if (formDetails.solarSetup) formFields["solar_setup"] = formDetails.solarSetup === "Yes";
    if (formDetails.numOfLevels) formFields["home_level"] = parseInt(formDetails.numOfLevels, 10);
    if (formDetails.kitchenGraniteTop) formFields["kitchen_granite_countertop"] = formDetails.kitchenGraniteTop === "Yes";
    if (formDetails.firePlace) formFields["fireplace_count"] = formDetails.firePlace === "Yes" ? 1 : 0;
    
    if (formDetails.address) formFields["address"] = formDetails.address;
    if (formDetails.role === "Agent" && formDetails.company_name) formFields["company_name"] = formDetails.company_name;
    
    if (formDetails.location && typeof formDetails.location === "string") {
      const locParts = formDetails.location.split(",");
      formFields["location_city"] = locParts[0]?.trim() || "";
      formFields["location_state"] = locParts[1]?.trim() || "";
      formFields["location_zipcode"] = locParts[2]?.trim() || "";
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
      const newImages = images.filter(img => typeof img !== 'string');
      const base64Images = await convertImagesToBase64(newImages);
      formFields["images"] = base64Images;
      formFields["existing_images"] = images.filter(img => typeof img === 'string');

      if (isEdit) {
        await dispatch(updateHouse({ houseId: formDetails.id, houseData: formFields })).unwrap();
      } else {
        await dispatch(postHouse(formFields)).unwrap(); 
      }
      
      setIsSuccess(true);
      setTimeout(() => {
        navigate("/services/houses/buyHouse");
      }, 2500);
    } catch (err) {
      console.error("Failed to post house:", err);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Modal open={open} onClose={isSuccess ? undefined : onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          borderRadius: 4,
          boxShadow: 24,
          p: 4,
          maxWidth: 600,
          width: "90%",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-10 text-center animate-in fade-in duration-500">
            <CheckCircleOutlineIcon sx={{ fontSize: 100, color: "#4caf50", mb: 2 }} />
            <Typography variant="h4" sx={{ fontWeight: "bold", color: "#007185", mb: 1 }}>
              Success!
            </Typography>
            <Typography variant="body1" sx={{ color: "#555", mb: 3 }}>
              Your house listing has been {isEdit ? 'updated' : 'posted'} successfully.
            </Typography>
            <Typography variant="body2" sx={{ color: "#888" }}>
              Redirecting you to the listings...
            </Typography>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <div className="text-[#007185] text-[22px] font-bold font-dmsans">
                {isEdit ? "Update Your Listing" : "Review Your Listing And Submit"}
              </div>
              <Button onClick={onClose}>
                <EditIcon color="primary" />
              </Button>
            </div>
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
                {typeof error === 'string' ? error : JSON.stringify(error)}
              </div>
            )}
            <div className="text-[#0857d0] text-[38px] font-bold font-dmsans leading-tight mb-2">
              {formDetails.price
                ? parseFloat(formDetails.price).toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })
                : "$0.00"}
            </div>
            <div className="text-gray-800 text-[24px] font-bold font-dmsans mb-6">
              {formDetails.type}
            </div>

            <ReviewPostContent contents={contents} />
            
            <div className="mt-8 flex justify-center">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full max-w-xs px-8 py-4 bg-[#ffa41c] rounded-2xl text-gray-800 text-lg font-bold font-dmsans hover:bg-[#ff9400] transition-colors shadow-lg active:scale-95 disabled:opacity-50"
              >
                {isEdit ? 'Update Now' : 'Post Now'}
              </button>
            </div>
          </>
        )}
      </Box>
    </Modal>
  );
}

export default ReviewHousePost;
