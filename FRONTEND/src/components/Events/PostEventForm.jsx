import NRadioInput from "../InputTemplate/NRadioInput";
import DatePickerInput from "../InputTemplate/DatePickerInput";
import { useForm } from "react-hook-form";
import PhotoUpload from "../InputTemplate/PhotoUpload";
import DescriptionInput from "../InputTemplate/DescriptionInput";
import TextFieldInput from "../InputTemplate/TextFieldInput";
import ReviewEventPost from "./ReviewEventPost";
import { useState } from "react";

function PostEventForm() {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const [reviewSession, setReviewSession] = useState(false);
  const [formDetails, setFormDetails] = useState(null);
  const [coverImages, setCoverImages] = useState([]);
  const [posterImages, setPosterImages] = useState([]);

  const onSubmit = (data) => {
    if (Object.keys(errors).length === 0) {
      // Only show review if no errors
      console.log("Submitting data:", data);
      const finalData = { ...data, coverImages, posterImages };
      console.log("Final data for review:", finalData);
      setFormDetails(finalData);
      setReviewSession(true);
      console.log("Set review session to true");
    } else {
      console.log("Form contains errors", errors);
    }
  };

  const languageOptions = [
    { label: "Tamil", value: "tamil" },
    { label: "English", value: "english" },
    { label: "Telugu", value: "telugu" },
    { label: "Malayalam", value: "malayalam" },
    { label: "Hindi", value: "hindi" },
    { label: "Kannada", value: "kannada" },
    { label: "Punjabi", value: "punjabi" },
  ];

  const eventTypeOptions = [
    { label: "Music", value: "music" },
    { label: "Diwali", value: "diwali" },
    { label: "Dance", value: "dance" },
    { label: "Bollywood", value: "bollywood" },
    { label: "Cultural", value: "cultural" },
    { label: "Standup Comedy", value: "standup" },
  ];

  return (
    <div className="px-6 py-4 md:py-6 w-[90%] relative rounded-tr-2xl rounded-b-2xl bg-white flex flex-col gap-y-4">
      {reviewSession && (
        <ReviewEventPost
          open={reviewSession}
          onClose={() => setReviewSession(false)}
          formDetails={formDetails}
        />
      )}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-screen-md mx-auto w-full"
      >
        <TextFieldInput name="eventName" control={control} text="Event Name" />

        <TextFieldInput name="address" control={control} text="Address" />

        <TextFieldInput
          name="stateCityZipcode"
          control={control}
          text="State/City/Zipcode"
        />

        <TextFieldInput name="ticketPrice" control={control} text="Ticket Cost" />

        {/* Date and Time */}
        <DatePickerInput
          text="Date and time of the event"
          control={control}
          toDate={false}
          includeTime={true}
        />

        <NRadioInput
          name="language"
          text="Language specific"
          control={control}
          options={languageOptions}
        />

        <NRadioInput
          name="eventType"
          text="Event type"
          control={control}
          options={eventTypeOptions}
        />

        <div className="flex flex-col md:flex-row gap-6 w-full mt-4">
          <div className="flex-1">
            <PhotoUpload
              images={coverImages}
              setImages={setCoverImages}
              title="Upload cover image"
            />
          </div>
          <div className="flex-1">
            <PhotoUpload
              images={posterImages}
              setImages={setPosterImages}
              title="Upload poster"
            />
          </div>
        </div>

        <DescriptionInput name="description" control={control} />

        <button className="mt-8 w-full px-10 py-4 bg-[#ffa41c] rounded-[10px] text-center text-gray-800 text-lg font-semibold font-dmsans">
          Review Post
        </button>
      </form>
    </div>
  );
}

export default PostEventForm;
