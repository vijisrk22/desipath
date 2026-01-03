import { useForm } from "react-hook-form";
import PhotoUpload from "../InputTemplate/PhotoUpload";
import DescriptionInput from "../InputTemplate/DescriptionInput";
import TextFieldInput from "../InputTemplate/TextFieldInput";
import ReviewCarPost from "./ReviewCarPost";

import { useState } from "react";
import LocationAutocompleteInput from "../InputTemplate/LocationAutocompleteInput";
import SelectInput from "../InputTemplate/SelectInput";
import CarMakeModelInput from "../InputTemplate/CarMakeModelInput";

function PostCarForm() {
  const {
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  const [reviewSession, setReviewSession] = useState(false);
  const [formDetails, setFormDetails] = useState(null);
  const [images, setImages] = useState([]);

  const onSubmit = (data) => {
    if (Object.keys(errors).length === 0) {
      // Only show review if no errors
      console.log(data);
      setFormDetails(data);
      setReviewSession(true);
    } else {
      console.log("Form contains errors", errors);
    }
  };

  return (
    <div className="px-6 py-4 md:py-6 w-[90%] relative rounded-tr-2xl rounded-b-2xl bg-white flex flex-col gap-y-4">
      {reviewSession && (
        <ReviewCarPost
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
        {/* Car Make */}
        <CarMakeModelInput
          control={control}
          watch={watch}
          setValue={setValue}
        />

        {/* Year */}
        <SelectInput
          name="year"
          control={control}
          label="Year"
          data={Array.from(
            { length: new Date().getFullYear() - 1995 + 1 },
            (_, i) => 1995 + i
          )}
        />

        {/* Variant */}
        <TextFieldInput
          name="variant"
          defaultValue="Text"
          control={control}
          text="Variant"
        />

        {/* Price */}
        <TextFieldInput
          name="price"
          defaultValue="Text"
          control={control}
          text="Price"
        />

        {/* Miles */}
        <TextFieldInput
          name="miles"
          defaultValue="Text"
          control={control}
          text="Miles"
        />

        {/* Location */}
        <LocationAutocompleteInput control={control} setValue={setValue} />

        <PhotoUpload images={images} setImages={setImages} />
        <DescriptionInput name="description" control={control} />
        <button className="mt-4 w-full px-10 py-5 bg-[#ffa41c] rounded-[28px] text-center  text-gray-800 text-base font-semibold font-dmsans">
          Review Post
        </button>
      </form>
    </div>
  );
}

export default PostCarForm;
