import TwoRadioInput from "../InputTemplate/TwoRadioInput";
import DatePickerInput from "../InputTemplate/DatePickerInput";
import SelectInput from "../InputTemplate/SelectInput";
import FourRadioInput from "../InputTemplate/FourRadioInput";

import { useForm } from "react-hook-form";
import PhotoUpload from "../InputTemplate/PhotoUpload";
import DescriptionInput from "../InputTemplate/DescriptionInput";
import TextFieldInput from "../InputTemplate/TextFieldInput";
import ReviewRentalHomePost from "./ReviewRentalHomePost";
import CheckBoxInput from "../InputTemplate/CheckBoxInput";
import LocationAutocompleteInput from "../InputTemplate/LocationAutocompleteInput";

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../utils/api";
import dayjs from "dayjs";

function PostRentalHomeForm() {
  const { action, homeId } = useParams();
  const isEdit = action === "edit";
  console.log("PostRentalHomeForm:", { action, homeId, isEdit });

  const bedroomValues = Array.from({ length: 4 }, (_, index) => index + 1);
  const bathroomValues = Array.from({ length: 4 }, (_, index) => index + 1);
  const {
    handleSubmit,
    control,
    register,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      location_state: "",
      location_city: "",
      location_zipcode: "",
      contact_no: "",
    },
    mode: "onChange",
  });

  const [reviewSession, setReviewSession] = useState(false);
  const [formDetails, setFormDetails] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit && homeId) {
      setLoading(true);
      api.get(`/api/rentalhomes/${homeId}`)
        .then(res => {
          const data = res.data;
          
          // 1. Handle dates
          if (data.available_from) {
            data.available_from = dayjs(data.available_from);
          }
          
          // 2. Parse BHK string (e.g. "3 Bed 2 Bath") into separate fields
          if (data.bhk) {
            const parts = data.bhk.split(" ");
            data.bedrooms = parseInt(parts[0], 10) || 1;
            data.bathrooms = parseInt(parts[2], 10) || 1;
          }
          
          // 3. Format location string for Autocomplete
          if (data.location_city || data.location_state || data.location_zipcode) {
            data.location = `${data.location_city || ""}, ${data.location_state || ""}, ${data.location_zipcode || ""}`.trim().replace(/^,|,$/g, "");
          }
          
          // 4. Convert amenities array to object format { "Gym": true, ... }
          if (Array.isArray(data.amenities)) {
            const amenitiesObj = {};
            data.amenities.forEach(amenity => {
              amenitiesObj[amenity] = true;
            });
            data.amenities = amenitiesObj;
          }

          reset(data);
          
          if (data.images) {
            try {
              const parsed = typeof data.images === 'string' ? JSON.parse(data.images) : data.images;
              setImages(Array.isArray(parsed) ? parsed : []);
            } catch (e) {
              console.error("Failed to parse images:", e);
              setImages([]);
            }
          } else {
            setImages([]);
          }
        })
        .catch(err => console.error("Error fetching listing for edit:", err))
        .finally(() => setLoading(false));
    }
  }, [isEdit, homeId, reset]);

  const onSubmit = (data) => {
    console.log("Form Data:", data);
    setFormDetails({ ...data, id: homeId }); // Include ID if editing
    setReviewSession(true);
  };

  const amenitiesOptions = [
    { name: "amenities.Gym", label: "Gym" },
    { name: "amenities.Club House", label: "Club House" },
    { name: "amenities.Swimming Pool", label: "Swimming Pool" },
  ];

  return (
    <div className="px-6 py-4 md:py-6 w-[90%] relative rounded-tr-2xl rounded-b-2xl bg-white flex flex-col gap-y-4">
      {reviewSession && (
        <ReviewRentalHomePost
          open={reviewSession}
          onClose={() => setReviewSession(false)}
          formDetails={formDetails}
          images={images}
        />
      )}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-2xl mx-auto w-full space-y-4"
      >
        <div className="bg-gray-50/50 p-4 rounded-xl">
          <FourRadioInput
            text="Property Type"
            name="property_type"
            op1="Condo"
            op2="Single family Home"
            op3="Apartment"
            op4="Basement Apartment"
            control={control}
          />
        </div>

        <DatePickerInput
          text="Available From"
          dateFieldName1="available_from"
          control={control}
          toDate={false}
        />
        <TextFieldInput
          name="area"
          defaultValue=""
          control={control}
          text="Area (sqft)"
        />
        <TextFieldInput
          name="deposit_rent"
          defaultValue=""
          control={control}
          text="Monthly Rent ($)"
        />
        <TextFieldInput
          name="accommodates"
          defaultValue=""
          control={control}
          text="Accommodates"
        />

        <SelectInput
          name="bedrooms"
          label="Bedrooms (BHK)"
          control={control}
          data={bedroomValues}
        />
        <SelectInput
          name="bathrooms"
          label="Bathrooms"
          control={control}
          data={bathroomValues}
        />

        <TextFieldInput
          name="address"
          defaultValue=""
          control={control}
          text="Street Address"
        />
        <LocationAutocompleteInput control={control} setValue={setValue} />
        <TextFieldInput
          name="community_name"
          defaultValue=""
          control={control}
          text="Community/Building Name"
        />

        <CheckBoxInput
          text="Amenities"
          options={amenitiesOptions}
          register={register}
        />
        <TwoRadioInput name="pets" text="Pets Allowed?" control={control} />

        <TextFieldInput
          name="contact_no"
          defaultValue=""
          control={control}
          text="Contact Number"
          rules={{
            pattern: {
              value: /^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/,
              message: "Invalid US Phone Number",
            },
          }}
        />
        <TwoRadioInput
          name="smoking"
          text="Smoking?"
          op1="Ok"
          op2="Not okay"
          control={control}
        />

        <PhotoUpload images={images} setImages={setImages} />
        <DescriptionInput name="description" control={control} />
        {Object.keys(errors).length > 0 && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            <p className="font-semibold mb-1">Please fill in all required fields:</p>
            <ul className="list-disc list-inside space-y-1">
              {Object.entries(errors).map(([field, err]) => (
                <li key={field}>
                  <span className="capitalize">{field.replace(/_/g, ' ')}</span>: {err?.message || 'Required'}
                </li>
              ))}
            </ul>
          </div>
        )}
        {loading && (
          <div className="absolute inset-0 bg-white/60 z-50 flex items-center justify-center rounded-2xl">
            <div className="w-10 h-10 border-4 border-[#ffa41c] border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        <button
          type="submit"
          className="mt-8 w-full py-4 bg-[#ffa41c] rounded-[12px] text-center text-gray-800 text-xl font-bold font-dmsans hover:bg-[#e8931a] transition-all shadow-lg"
        >
          {isEdit ? 'Review Changes' : 'Review Post'}
        </button>
      </form>
    </div>
  );
}

export default PostRentalHomeForm;
