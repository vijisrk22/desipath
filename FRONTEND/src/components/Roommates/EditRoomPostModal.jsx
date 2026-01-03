import { Box, Button, Modal } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import { convertImagesToBase64 } from "../../utils/helper";
import { useForm } from "react-hook-form";
import TwoRadioInput from "../InputTemplate/TwoRadioInput";
import LocationAutocompleteInput from "../InputTemplate/LocationAutocompleteInput";
import TwoButtonInput from "../InputTemplate/TwoButtonInput";
import DatePickerInput from "../InputTemplate/DatePickerInput";
import TextFieldInput from "../InputTemplate/TextFieldInput";
import ThreeRadioInput from "../InputTemplate/ThreeRadioInput";
import PhotoUpload from "../InputTemplate/PhotoUpload";
import DescriptionInput from "../InputTemplate/DescriptionInput";
import { useState } from "react";

function EditRoomPostModal({ open, onClose, formDetails, editFunc }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState(
    formDetails?.photos ? formDetails?.photos : []
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
      available_from: dayjs(formDetails.available_from),
      available_to: dayjs(formDetails.available_to),
      location: `${formDetails.location_state},${formDetails.location_city},${formDetails.location_zipcode}`,
      kitchen_available: formDetails.kitchen_available ? "Yes" : "No",
      shared_bathroom: formDetails.shared_bathroom ? "Yes" : "No",
      utilities_included: formDetails.utilities_included ? "Yes" : "No",
      car_parking_available: formDetails.car_parking_available ? "Yes" : "No",
      washer_dryer: formDetails.washer_dryer ? "Yes" : "No",
      owner: formDetails.owner ? "Yes" : "No",
      agent: formDetails.agent ? "Yes" : "No",
    },
  });

  const onSubmit = async (data) => {
    const formFields = {};
    setLoading(true);
    // Add regular form data (text, boolean, integer, etc.)
    for (const key in data) {
      if (key === "photos") continue; // Skip photos field
      if (key === "location") {
        const splitLocation = data[key].split(",");
        formFields["location_state"] = splitLocation[0];
        formFields["location_city"] = splitLocation[1];
        formFields["location_zipcode"] = splitLocation[2];
      } else {
        if (data[key] === "Yes" || data[key] === "No") {
          formFields[key] = data[key] === "Yes" ? true : false;
        } else {
          if (key === "available_from") {
            formFields[key] = dayjs(data.available_from).format("DD-MM-YYYY");
          } else if (key === "available_to") {
            formFields[key] = dayjs(data.available_to).format("DD-MM-YYYY");
          } else {
            if (key === "rent") {
              formFields[key] = parseInt(data[key].replace(/[^0-9.]/g, ""));
            } else {
              formFields[key] = data[key];
            }
          }
        }
      }
    }

    console.log("Form Fields:", formFields);

    // Add rent frequency and poster id
    formFields["rent_frequency"] = "Monthly";
    formFields["poster_id"] = user.id;
    formFields["poster_name"] = user.name;

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
      // Dispatch the postRoom action with formFields as the payload
      const result = await dispatch(
        editFunc({ roomId: formDetails.id, roomData: formFields })
      ).unwrap();

      // Handle success after post
      console.log("Edit successful:", result);
      setLoading(false);
      navigate("/services/roommates/postConfirmation");
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
          <TwoRadioInput
            name="owner"
            text="Are you the owner"
            control={control}
          />
          <TwoRadioInput
            name="agent"
            text="Are you the agent"
            control={control}
          />

          <LocationAutocompleteInput control={control} setValue={setValue} />

          <TwoRadioInput
            name="sharing_type"
            text="Sharing Type"
            op1="Separate Room"
            op2="Share the room with other person"
            control={control}
          />

          <TwoButtonInput
            text="Kitchen Available"
            name="kitchen_available"
            control={control}
          />

          <TwoButtonInput
            text="Shared Bathroom"
            name="shared_bathroom"
            control={control}
          />
          <TwoButtonInput
            text="Utilities Fees Included"
            name="utilities_included"
            control={control}
          />
          {/* <Test /> */}
          <DatePickerInput
            text="Available Date"
            control={control}
            dateFieldName1="available_from"
            dateFieldName2="available_to"
          />

          <TextFieldInput name="rent" control={control} text="Expected Rent" />

          <ThreeRadioInput
            text="Gender Preference"
            name="gender_preference"
            op1="Male"
            op2="Female"
            op3="Any"
            control={control}
          />

          <TwoButtonInput
            text="Car Parking Available"
            name="car_parking_available"
            control={control}
          />

          <ThreeRadioInput
            text="Veg/Non-Veg Preference"
            name="food_preference"
            op1="Veg"
            op2="Non Veg"
            op3="Any"
            control={control}
          />

          <TwoButtonInput
            text="Wash Dryer"
            name="washer_dryer"
            control={control}
          />

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

export default EditRoomPostModal;
