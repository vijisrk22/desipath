import { Box, Button, Modal } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ReviewPostContent from "./ReviewPostContent";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../Loader";
import { updateCar, postCar } from "../../store/CarsSlice";
import { getCarContents } from "../../pages/BuySellCar/DisplayCarDetail";
import { convertImagesToBase64 } from "../../utils/helper";

function ReviewCarPost({ open, onClose, formDetails, images, carAttributes }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.cars);
  const { user } = useSelector((state) => state.user);
  const isEdit = !!formDetails.id;

  const contents = getCarContents(formDetails, images, carAttributes);

  const handleSubmit = async () => {
    if (!formDetails) return;

    const formFields = {
      make: formDetails.make === "Others" && formDetails.make_other ? formDetails.make_other : formDetails.make,
      model: formDetails.model === "Others" && formDetails.model_other ? formDetails.model_other : formDetails.model,
      year: parseInt(formDetails.year, 10),
      price: parseFloat(formDetails.price) || 0,
      miles: parseInt(formDetails.miles, 10) || 0,
      condition: formDetails.condition,
      fuel_type_id: formDetails.fuel_type_id,
      transmission_id: formDetails.transmission_id,
      drive_train_id: formDetails.drive_train_id,
      exterior_color_id: formDetails.exterior_color_id,
      interior_color_id: formDetails.interior_color_id,
      body_style_id: formDetails.body_style_id,
      title_status_id: formDetails.title_status_id,
      description: formDetails.description || "",
      seller_id: user?.id,
    };

    // Location
    if (formDetails.location && typeof formDetails.location === "string") {
      const loc = formDetails.location.split(",");
      formFields["location_city"] = loc[0]?.trim() || "";
      formFields["location_state"] = loc[1]?.trim() || "";
      formFields["location_zipcode"] = loc[2]?.trim() || "";
    } else {
      formFields["location_city"] = formDetails.location_city || "";
      formFields["location_state"] = formDetails.location_state || "";
      formFields["location_zipcode"] = formDetails.location_zipcode || "";
    }

    try {
      const newImages = (images || []).filter(img => typeof img !== 'string');
      const base64Images = await convertImagesToBase64(newImages);
      formFields["pictures"] = base64Images;
      formFields["existing_pictures"] = (images || []).filter(img => typeof img === 'string');

      if (isEdit) {
        await dispatch(updateCar({ carId: formDetails.id, carData: formFields })).unwrap();
      } else {
        await dispatch(postCar(formFields)).unwrap();
      }

      console.log("Post successful");
      navigate("/services/cars/postConfirmation");
    } catch (err) {
      console.error("Failed to post car:", err);
      onClose();
    }
  };

  if (loading) return <Loader />;

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)", bgcolor: "background.paper",
          borderRadius: 2, boxShadow: 24, p: 4,
          maxWidth: 600, width: "100%", maxHeight: "90vh", overflowY: "auto",
        }}
      >
        <div className="flex justify-between items-center">
          <div className="justify-center text-[#007185] text-[22px] font-bold font-dmsans">
            {isEdit ? "Update Your Post" : "Review Your Post And Submit"}
          </div>
          <Button onClick={onClose}>
            <EditIcon color="primary" variant="outline" />
          </Button>
        </div>
        <div className="text-[#0857d0] text-[38px] font-bold font-dmsans leading-loose">
          {formDetails.price
            ? parseFloat(formDetails.price).toLocaleString("en-US", { style: "currency", currency: "USD" })
            : "$0.00"}
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

export default ReviewCarPost;
