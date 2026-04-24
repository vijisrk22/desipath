import NRadioInput from "../InputTemplate/NRadioInput";
import DatePickerInput from "../InputTemplate/DatePickerInput";
import { useForm } from "react-hook-form";
import PhotoUpload from "../InputTemplate/PhotoUpload";
import DescriptionInput from "../InputTemplate/DescriptionInput";
import TextFieldInput from "../InputTemplate/TextFieldInput";
import ReviewEventPost from "./ReviewEventPost";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../utils/api";
import LocationAutocompleteInput from "../InputTemplate/LocationAutocompleteInput";
import dayjs from "dayjs";

function PostEventForm() {
  const { action, eventId } = useParams();
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
  const [coverImages, setCoverImages] = useState([]);
  const [posterImages, setPosterImages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit && eventId) {
      setLoading(true);
      api.get(`/api/events/${eventId}`)
        .then(res => {
          const data = res.data;
          if (data.fromDate) data.fromDate = dayjs(data.fromDate);
          reset(data);
          if (data.cover_images) {
             try {
               const parsed = typeof data.cover_images === 'string' ? JSON.parse(data.cover_images) : data.cover_images;
               setCoverImages(Array.isArray(parsed) ? parsed : []);
             } catch (e) {
               console.error("Cover image parse error:", e);
               setCoverImages([]);
             }
          } else {
             setCoverImages([]);
          }
          if (data.poster_images) {
             try {
               const parsed = typeof data.poster_images === 'string' ? JSON.parse(data.poster_images) : data.poster_images;
               setPosterImages(Array.isArray(parsed) ? parsed : []);
             } catch (e) {
               console.error("Poster image parse error:", e);
               setPosterImages([]);
             }
          } else {
             setPosterImages([]);
          }
        })
        .catch(err => console.error("Error fetching event for edit:", err))
        .finally(() => setLoading(false));
    }
  }, [isEdit, eventId, reset]);

  const onSubmit = (data) => {
    if (Object.keys(errors).length === 0) {
      console.log("Submitting data:", data);
      const finalData = { ...data, coverImages, posterImages, id: eventId };
      console.log("Final data for review:", finalData);
      setFormDetails(finalData);
      setReviewSession(true);
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

        {/* Location Autocomplete */}
        <LocationAutocompleteInput control={control} setValue={setValue} />

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

        {loading && (
          <div className="absolute inset-0 bg-white/60 z-50 flex items-center justify-center rounded-2xl">
            <div className="w-10 h-10 border-4 border-[#ffa41c] border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        <button className="mt-8 w-full px-10 py-4 bg-[#ffa41c] rounded-[10px] text-center text-gray-800 text-lg font-semibold font-dmsans hover:bg-[#e8931a] transition-colors">
          {isEdit ? 'Review Changes' : 'Review Post'}
        </button>
      </form>
    </div>
  );
}

export default PostEventForm;
