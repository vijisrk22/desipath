import { Box, Button, Modal } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { convertImagesToBase64 } from "../../utils/helper";
import { useForm } from "react-hook-form";
import TextFieldInput from "../InputTemplate/TextFieldInput";
import PhotoUpload from "../InputTemplate/PhotoUpload";
import DescriptionInput from "../InputTemplate/DescriptionInput";
import { useEffect, useState } from "react";
import LocationAutocompleteInput from "../InputTemplate/LocationAutocompleteInput";
import dayjs from "dayjs";
import FourRadioInput from "../InputTemplate/FourRadioInput";
import TwoRadioInput from "../InputTemplate/TwoRadioInput";
import DatePickerInput from "../InputTemplate/DatePickerInput";
import SelectInput from "../InputTemplate/SelectInput";
import CheckBoxInput from "../InputTemplate/CheckBoxInput";

function EditRentalHomePostModal({ open, onClose, formDetails, editFunc }) {
  const bedroomValues = Array.from({ length: 4 }, (_, index) => index + 1);
  const bathroomValues = Array.from({ length: 4 }, (_, index) => index + 1);
  const amenitiesOptions = [
    { name: "amenities.Gym", label: "Gym" },
    { name: "amenities.Club House", label: "Club House" },
    { name: "amenities.Swimming Pool", label: "Swimming Pool" },
  ];

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState(
    formDetails?.images ? formDetails?.images : []
  );
  const navigate = useNavigate();

  const {
    handleSubmit,
    control,
    register,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      ...formDetails,
      available_from: dayjs(formDetails.available_from),
      location: `${formDetails.location_state},${formDetails.location_city},${formDetails.location_zipcode}`,
      pets: formDetails.pets ? "Yes" : "No",
      bedrooms: Number(formDetails.bhk.split(" ")[0]),
      bathrooms: Number(formDetails.bhk.split(" ")[2]),
      description: formDetails.description || "",
    },
  });

  const onSubmit = async (data) => {
    const formFields = {};
    let bhk = "";

    setLoading(true);
    // Add regular form data (text, boolean, integer, etc.)
    for (const key in data) {
      if (key === "images") continue; // Skip images field
      if (key === "bedrooms") {
        bhk = data[key] + " Bed ";
      } else if (key === "bathrooms") {
        bhk += data[key] + " Bath";
      } else {
        if (key === "location") {
          const splitLocation = data[key].split(",");
          formFields["location_state"] = splitLocation[0];
          formFields["location_city"] = splitLocation[1];
          formFields["location_zipcode"] = splitLocation[2];
        } else {
          if (key === "accommodates") {
            formFields[key] = parseInt(formDetails[key], 10);
          } else {
            if (data[key] === "Yes" || data[key] === "No") {
              formFields[key] = data[key] === "Yes" ? true : false;
            } else {
              if (key === "available_from") {
                formFields[key] = dayjs(data.available_from).format(
                  "DD-MM-YYYY"
                );
              } else {
                if (key === "deposit_rent" || key === "area") {
                  formFields[key] = parseFloat(data[key]);
                } else {
                  if (key === "amenities") {
                    formFields[key] = Object.keys(data.amenities).filter(
                      (key) =>
                        data.amenities[key] &&
                        amenitiesOptions.some((option) => option.label === key)
                    );
                  } else formFields[key] = data[key];
                }
              }
            }
          }
        }
      }
    }

    formFields["owner_id"] = user.id;
    formFields["owner_name"] = user.name;

    formFields["bhk"] = bhk;

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
        editFunc({ rentalHomeId: formDetails.id, rentalHomeData: formFields })
      ).unwrap();

      // Handle success after post
      console.log("Edit successful:", result);
      setLoading(false);
      navigate("/services/rentalHomes/postConfirmation");
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
          {/* PropertyType */}
          <FourRadioInput
            text="Property Type"
            name="property_type"
            op1="Condo"
            op2="Single family Home"
            op3="Apartment"
            op4="Basement Apartment"
            control={control}
          />
          {/*From Date */}
          <DatePickerInput
            text="Available From"
            dateFieldName1="available_from"
            control={control}
            toDate={false}
          />
          {/* Area */}
          <TextFieldInput
            name="area"
            defaultValue="Text"
            control={control}
            text="Area"
          />

          {/*deposit/rent  */}
          <TextFieldInput
            name="deposit_rent"
            control={control}
            text="Deposit/Rent"
          />
          {/* Bedrooms */}
          <SelectInput
            name="bedrooms"
            label="BHK"
            control={control}
            data={bedroomValues}
          />
          {/* Bathrooms */}
          <SelectInput
            name="bathrooms"
            label="Bathrooms"
            control={control}
            data={bathroomValues}
          />
          {/* Address */}
          <TextFieldInput
            name="address"
            defaultValue="Street Address"
            control={control}
            text="Address"
          />
          {/* Location */}
          <LocationAutocompleteInput control={control} setValue={setValue} />

          <TextFieldInput
            name="community_name"
            defaultValue="Text"
            control={control}
            text="Community Name"
          />

          {/* Amenities */}
          <CheckBoxInput
            text="Amenities"
            options={amenitiesOptions}
            register={register}
            selected={formDetails.amenities}
          />

          {/* Pets */}
          <TwoRadioInput name="pets" text="Pets" control={control} />
          {/* Accommodates */}
          <TextFieldInput
            name="accommodates"
            defaultValue="Text"
            control={control}
            text="Accommodates"
          />
          {/* Smoking */}
          <TwoRadioInput
            name="smoking"
            text="Smoking"
            op1="Ok"
            op2="Not okay"
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

export default EditRentalHomePostModal;
