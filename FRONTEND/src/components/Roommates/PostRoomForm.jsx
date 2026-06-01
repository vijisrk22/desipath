import TwoRadioInput from "../InputTemplate/TwoRadioInput";
import TwoButtonInput from "../InputTemplate/TwoButtonInput";
import DatePickerInput from "../InputTemplate/DatePickerInput";
import ThreeRadioInput from "../InputTemplate/ThreeRadioInput";

import { useForm } from "react-hook-form";
import PhotoUpload from "../InputTemplate/PhotoUpload";
import DescriptionInput from "../InputTemplate/DescriptionInput";
import TextFieldInput from "../InputTemplate/TextFieldInput";
import ReviewPost from "./ReviewPost";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../utils/api";
import LocationAutocompleteInput from "../InputTemplate/LocationAutocompleteInput";
import dayjs from "dayjs";

function PostRoomForm() {
  const { action, roomId } = useParams();
  const isEdit = action === "edit";

  const {
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm();
  
  const [reviewSession, setReviewSession] = useState(false);
  const [formDetails, setFormDetails] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit && roomId) {
      setLoading(true);
      api.get(`/api/roommates/${roomId}`)
        .then(res => {
          const data = res.data;
          
          if (data.available_from) data.available_from = dayjs(data.available_from);
          if (data.available_to) data.available_to = dayjs(data.available_to);
          
          if (data.location_city || data.location_state || data.location_zipcode) {
            data.location = `${data.location_city || ""}, ${data.location_state || ""}, ${data.location_zipcode || ""}`.trim().replace(/^,|,$/g, "");
          }
          
          if (Array.isArray(data.amenities)) {
            const aObj = {};
            data.amenities.forEach(a => aObj[a] = true);
            data.amenities = aObj;
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
        .catch(err => console.error("Error fetching room for edit:", err))
        .finally(() => setLoading(false));
    }
  }, [isEdit, roomId, reset]);

  const onSubmit = (data) => {
    if (Object.keys(errors).length === 0) {
      console.log(data);
      setFormDetails({ ...data, id: roomId });
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
          text="Are you Owner or Agent?"
          op1="Owner"
          op2="Agent"
          control={control}
        />

        <TextFieldInput
          name="address"
          control={control}
          text="Address"
        />

        <LocationAutocompleteInput control={control} setValue={setValue} text="Location(Zipcode)" />

        <TwoRadioInput
          name="sharing_type"
          text="Sharing Type"
          op1="Separate Room"
          op2="Share the room with other person"
          control={control}
        />

        <TwoButtonInput
          text="Room Furnished or Unfurnished"
          name="is_furnished"
          op1="Furnished"
          op2="Unfurnished"
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
        <DatePickerInput
          text="Available Date"
          control={control}
          dateFieldName1="available_from"
          dateFieldName2="available_to"
        />

        <div className="flex flex-col md:flex-row gap-4 md:items-end">
          <div className="flex-1 w-full">
            <TextFieldInput
              name="rent"
              defaultValue="1500"
              control={control}
              text="Expected Rent"
            />
          </div>
          <div className="flex-1 w-full">
            <ThreeRadioInput
              text="Payment Frequency"
              name="rent_frequency"
              op1="Monthly"
              op2="Weekly"
              op3="Daily"
              control={control}
            />
          </div>
        </div>

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

        {loading && (
          <div className="absolute inset-0 bg-white/60 z-50 flex items-center justify-center rounded-2xl">
            <div className="w-10 h-10 border-4 border-[#ffa41c] border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        <button className="mt-4 w-full px-10 py-5 bg-[#ffa41c] rounded-[28px] text-center  text-gray-800 text-base font-semibold font-dmsans hover:bg-[#e8931a] transition-colors shadow-lg">
          {isEdit ? 'Review Changes' : 'Review Post'}
        </button>
      </form>
    </div>
  );
}

export default PostRoomForm;
