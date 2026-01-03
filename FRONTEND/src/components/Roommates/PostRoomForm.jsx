import TwoRadioInput from "../InputTemplate/TwoRadioInput";
import TwoButtonInput from "../InputTemplate/TwoButtonInput";
import DatePickerInput from "../InputTemplate/DatePickerInput";
import ThreeRadioInput from "../InputTemplate/ThreeRadioInput";

import { useForm } from "react-hook-form";
import PhotoUpload from "../InputTemplate/PhotoUpload";
import DescriptionInput from "../InputTemplate/DescriptionInput";
import TextFieldInput from "../InputTemplate/TextFieldInput";
import ReviewPost from "./ReviewPost";
import { useState } from "react";
import LocationAutocompleteInput from "../InputTemplate/LocationAutocompleteInput";

function PostRoomForm() {
  const {
    handleSubmit,
    control,
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
        <ReviewPost
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

        <TextFieldInput
          name="rent"
          defaultValue="1500"
          control={control}
          text="Expected Rent"
        />

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

        <button className="mt-4 w-full px-10 py-5 bg-[#ffa41c] rounded-[28px] text-center  text-gray-800 text-base font-semibold font-dmsans">
          Review Post
        </button>
      </form>
    </div>
  );
}

export default PostRoomForm;
