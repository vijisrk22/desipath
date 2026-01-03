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

import { useState } from "react";
import LocationAutocompleteInput from "../InputTemplate/LocationAutocompleteInput";

function PostRentalHomeForm() {
  const bedroomValues = Array.from({ length: 4 }, (_, index) => index + 1);
  const bathroomValues = Array.from({ length: 4 }, (_, index) => index + 1);
  const {
    handleSubmit,
    control,
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      location_state: "",
      location_city: "",
      location_zipcode: "",
    },
  });

  const [reviewSession, setReviewSession] = useState(false);
  const [formDetails, setFormDetails] = useState(null);
  const [images, setImages] = useState([]);

  const onSubmit = (data) => {
    if (Object.keys(errors).length === 0) {
      // Only show review if no errors
      console.log("Form Data:", data);
      setFormDetails(data);
      setReviewSession(true);
    } else {
      console.log("Form contains errors", errors);
    }
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
          defaultValue="Text"
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
        <button className="mt-4 w-full px-10 py-5 bg-[#ffa41c] rounded-[28px] text-center  text-gray-800 text-base font-semibold font-dmsans">
          Review Post
        </button>
      </form>
    </div>
  );
}

export default PostRentalHomeForm;
