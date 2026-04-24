import { Box, Button, Modal } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ReviewPostContent from "./ReviewPostContent";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../Loader";
import { updateRoom, postRoom } from "../../store/RoommatesSlice";
import dayjs from "dayjs";
import { getRoomContents } from "../../pages/Roommates/DisplayRoomDetail";
import { convertImagesToBase64 } from "../../utils/helper";

function ReviewPost({ open, onClose, formDetails, images }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.roommates);
  const { user } = useSelector((state) => state.user);
  const isEdit = !!formDetails.id;

  const contents = getRoomContents(formDetails, images);

  const handleSubmit = async () => {
    if (!formDetails) return;

    const formFields = {
      property_type: formDetails.property_type,
      type: formDetails.type,
      rent: typeof formDetails.rent === 'string' ? parseInt(formDetails.rent.replace(/[^0-9]/g, ""), 10) : formDetails.rent,
      rent_frequency: "Monthly",
      available_from: formDetails.available_from ? dayjs(formDetails.available_from).format("YYYY-MM-DD") : null,
      available_to: formDetails.available_to ? dayjs(formDetails.available_to).format("YYYY-MM-DD") : null,
      description: formDetails.description || "",
      contact_no: formDetails.contact_no || "",
      poster_id: user?.id,
      poster_name: user?.name,
    };

    // Location
    if (formDetails.location && typeof formDetails.location === "string") {
      const splitLocation = formDetails.location.split(",");
      formFields["location_city"] = splitLocation[0]?.trim() || "";
      formFields["location_state"] = splitLocation[1]?.trim() || "";
      formFields["location_zipcode"] = splitLocation[2]?.trim() || "";
    } else {
      formFields["location_city"] = formDetails.location_city || "";
      formFields["location_state"] = formDetails.location_state || "";
      formFields["location_zipcode"] = formDetails.location_zipcode || "";
    }

    // Booleans
    const booleanFields = ["furnished", "util_included", "parking_included", "pet_allowed"];
    booleanFields.forEach(field => {
      if (formDetails[field] !== undefined) {
        formFields[field] = formDetails[field] === "Yes" || formDetails[field] === true;
      }
    });

    // Amenities
    if (formDetails.amenities && typeof formDetails.amenities === "object" && !Array.isArray(formDetails.amenities)) {
      formFields["amenities"] = Object.keys(formDetails.amenities).filter(k => formDetails.amenities[k]);
    } else {
      formFields["amenities"] = Array.isArray(formDetails.amenities) ? formDetails.amenities : [];
    }

    try {
      const newImages = (images || []).filter(img => typeof img !== 'string');
      const base64Images = await convertImagesToBase64(newImages);
      formFields["photos"] = base64Images;
      formFields["existing_photos"] = (images || []).filter(img => typeof img === 'string');

      if (isEdit) {
        await dispatch(updateRoom({ roomId: formDetails.id, roomData: formFields })).unwrap();
      } else {
        await dispatch(postRoom(formFields)).unwrap();
      }

      navigate("/services/roommates/postConfirmation");
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
          maxHeight: "90vh", // Set a max height for the modal
          overflowY: "auto",
        }}
      >
        <div className="flex justify-between items-center">
          <div className="justify-center text-[#007185] text-[22px] font-bold font-['DM_Sans']">
            {isEdit ? "Update Your Listing" : "Review Your Listing And Submit"}
          </div>
          <Button onClick={onClose}>
            <EditIcon color="primary" variant="outline" />
          </Button>
        </div>
        <div className="text-[#0857d0] text-[38px] font-bold font-dmsans leading-loose">
          {formDetails.rent
            ? formDetails.rent.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })
            : "$0.00"}
        </div>
        <div className=" text-gray-800 text-[26px] font-bold font-dmsans">
          Single Room
        </div>

        <ReviewPostContent contents={contents} />
        <div className="mx-auto mt-10 max-w-20">
          <button
            onClick={handleSubmit}
            className="px-5 py-3 bg-[#ffa41c] rounded-xl text-gray-800 text-center text-base font-medium font-dmsans"
          >
            {isEdit ? "Update" : "Post"}
          </button>
        </div>
      </Box>
    </Modal>
  );
}

export default ReviewPost;
