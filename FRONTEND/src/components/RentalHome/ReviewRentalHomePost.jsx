import { Box, Button, Modal } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ReviewPostContent from "./ReviewPostContent";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../Loader";
import { updateRentalHome, postRentalHome } from "../../store/RentalHomesSlice";
import dayjs from "dayjs";
import { getRentalHomeContents } from "../../pages/RentalHome/DisplayRentalHomeDetail";
import { convertImagesToBase64 } from "../../utils/helper";

export default function ReviewRentalHomePost({ open, onClose, formDetails, images }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.rentalHomes);
  const { user } = useSelector((state) => state.user);
  
  const contents = getRentalHomeContents(formDetails || {}, images || []);
  const isEdit = !!formDetails?.id;

  const handleSubmit = async () => {
    if (!formDetails) return;

    // Build the payload explicitly to avoid sending unwanted fields (like created_at)
    // 1. Core Fields
    // 1. Core Fields (Using strict booleans as confirmed by backend)
    const formFields = {
      property_type: formDetails.property_type,
      available_from: (formDetails.available_from && dayjs(formDetails.available_from).isValid()) 
        ? dayjs(formDetails.available_from).format("YYYY-MM-DD") 
        : null,
      area: parseFloat(formDetails.area) || 0,
      deposit_rent: parseFloat(formDetails.deposit_rent) || 0,
      bedrooms: parseInt(formDetails.bedrooms, 10) || 1,
      bathrooms: parseInt(formDetails.bathrooms, 10) || 1,
      accommodates: parseInt(formDetails.accommodates, 10) || 1,
      address: formDetails.address || "",
      location: formDetails.location || "",
      community_name: formDetails.community_name || "",
      contact_no: formDetails.contact_no || "",
      description: formDetails.description || "",
      pets: formDetails.pets === "Yes" || formDetails.pets === true, // Literal boolean
      smoking: (formDetails.smoking === "Ok" || formDetails.smoking === true) ? "Ok" : "Not okay",
      bhk: `${formDetails.bedrooms || 1} Bed ${formDetails.bathrooms || 1} Bath`,
      owner_id: user?.id,
      owner_name: user?.name,
      user_id: user?.id,
    };

    // 2. Location Parts
    if (formDetails.location && typeof formDetails.location === "string") {
      const locParts = formDetails.location.split(",");
      formFields["location_city"] = locParts[0]?.trim() || "";
      formFields["location_state"] = locParts[1]?.trim() || "";
      formFields["location_zipcode"] = locParts[2]?.trim() || "";
    }

    // 3. Amenities (Restored)
    if (Array.isArray(formDetails.amenities)) {
      formFields["amenities"] = formDetails.amenities;
    } else if (typeof formDetails.amenities === "object") {
      formFields["amenities"] = Object.keys(formDetails.amenities).filter(k => formDetails.amenities[k]);
    } else {
      formFields["amenities"] = [];
    }

    try {
      const newFiles = (images || []).filter(img => img instanceof File);
      const base64Images = await convertImagesToBase64(newFiles);
      const existingUrls = (images || []).filter(img => typeof img === 'string');
      
      // CRITICAL: Backend reads $request->newPhotos and $request->existingPhotos
      // Line 513 in RentalHomesController.php: if ($request->has('newPhotos') ...)
      formFields["newPhotos"] = base64Images;       // new File objects converted to base64
      formFields["existingPhotos"] = existingUrls;  // already-stored URL strings

      if (isEdit) {
        await dispatch(updateRentalHome({ rentalHomeId: formDetails.id, rentalHomeData: formFields })).unwrap();
      } else {
        await dispatch(postRentalHome(formFields)).unwrap();
      }

      navigate("/services/rentalhomes/findRentalHome");
    } catch (err) {
      console.error("Submission failed:", err);
      let errorMsg = "Unknown error";
      if (typeof err === 'string') {
        errorMsg = err;
      } else if (err && typeof err === 'object') {
        if (err.errors) {
          errorMsg = Object.entries(err.errors)
            .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(", ") : msgs}`)
            .join("\n");
        } else {
          errorMsg = err.message || err.error || JSON.stringify(err);
        }
      }
      alert("Submission Error:\n" + errorMsg);
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
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <div className="flex justify-between items-center">
          <div className="justify-center text-[#007185] text-[22px] font-bold font-dmsans">
            {isEdit ? "Update Your Listing" : "Review Your Listing And Submit"}
          </div>
          <Button onClick={onClose}>
            <EditIcon color="primary" />
          </Button>
        </div>
        <div className="text-[#0857d0] text-[38px] font-bold font-dmsans leading-loose">
          {formDetails?.deposit_rent
            ? parseFloat(formDetails.deposit_rent).toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })
            : "$0.00"}
        </div>
        <div className=" text-gray-800 text-[26px] font-bold font-dmsans">
          {formDetails?.property_type}
        </div>

        <ReviewPostContent contents={contents} />
        <div className="mx-auto mt-10 max-w-20">
          <button
            onClick={handleSubmit}
            className="px-8 py-3 bg-[#ffa41c] hover:bg-[#e8931a] rounded-xl text-gray-800 text-center text-base font-bold font-dmsans transition-all shadow-md"
          >
            {isEdit ? "Update" : "Post"}
          </button>
        </div>
      </Box>
    </Modal>
  );
}


