import { Box, Button, Modal } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { convertImagesToBase64 } from "../../utils/helper";
import { useForm } from "react-hook-form";
import TextFieldInput from "../InputTemplate/TextFieldInput";
import PhotoUpload from "../InputTemplate/PhotoUpload";
import DescriptionInput from "../InputTemplate/DescriptionInput";
import { useState } from "react";
import LocationAutocompleteInput from "../InputTemplate/LocationAutocompleteInput";

function EditCarPostModal({ open, onClose, formDetails, editFunc }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState(
    formDetails?.pictures ? formDetails?.pictures : []
  ); // Initialize with the first image from formDetails
  const navigate = useNavigate();

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      ...formDetails,
    },
  });

  const onSubmit = async (data) => {
    const formFields = {};
    setLoading(true);
    // Add regular form data (text, boolean, integer, etc.)
    for (const key in data) {
      if (key === "pictures") continue; // Skip pictures field
      formFields[key] = data[key];
    }

    console.log("Form Fields:", formFields);

    formFields["seller_id"] = user.id;
    formFields["seller_name"] = user.name;

    try {
      // Filter out images that are not File instances
      const newImages = images.filter((img) => img instanceof File);
      const existingImages = images.filter((img) => typeof img === "string");
      // Convert images to base64
      const base64Images = await convertImagesToBase64(newImages);

      // Add base64 images to the formFields object
      formFields["newPhotos"] = base64Images;
      formFields["existingPhotos"] = existingImages;

      console.log(formFields);
      // Dispatch the postCar action with formFields as the payload
      const result = await dispatch(
        editFunc({ carId: formDetails.id, carData: formFields })
      ).unwrap();

      // Handle success after post
      console.log("Edit successful:", result);
      setLoading(false);
      navigate("/services/cars/postConfirmation");
    } catch (error) {
      setLoading(false);
      console.error("Failed to post listing:", error);
      onClose();
    }
  };

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
            Edit Your Listing And Submit
          </div>
          <Button onClick={onClose}>
            <CloseIcon color="primary" variant="outline" />
          </Button>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="max-w-screen-md mx-auto w-full"
        >
          {/* Car Make */}
          <TextFieldInput name="make" control={control} text="Car Make" />
          {/*Car Model  */}
          <TextFieldInput name="model" control={control} text="Car Model" />
          {/* Location */}
          <LocationAutocompleteInput
            control={control}
            setValue={setValue}
            defaultLocation={formDetails?.location}
          />

          {/* Year */}
          <TextFieldInput name="year" control={control} text="Year" />
          {/* Variant */}
          <TextFieldInput name="variant" control={control} text="Variant" />

          {/* Price */}
          <TextFieldInput name="price" control={control} text="Price" />

          {/* Miles */}
          <TextFieldInput name="miles" control={control} text="Miles" />

          <PhotoUpload images={images} setImages={setImages} />
          <DescriptionInput name="description" control={control} />

          <div className="mx-auto mt-10 max-w-20">
            <button
              disabled={loading}
              className="px-5 py-3 bg-[#ffa41c] rounded-xl text-gray-800 text-center text-base font-medium font-dmsans"
            >
              Confirm
            </button>
          </div>
        </form>
      </Box>
    </Modal>
  );
}

export default EditCarPostModal;
