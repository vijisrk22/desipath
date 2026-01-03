import TwoRadioInput from "../InputTemplate/TwoRadioInput";
import ThreeRadioInput from "../InputTemplate/ThreeRadioInput";

import { useForm } from "react-hook-form";
import TextFieldInput from "../InputTemplate/TextFieldInput";
import ReviewCompanionPost from "./ReviewCompanionPost";
import { useState } from "react";
import CheckBoxInput from "../InputTemplate/CheckBoxInput";
import DatePickerInput from "../InputTemplate/DatePickerInput";

function FindCompanionForm() {
  const {
    handleSubmit,
    control,
    register,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      travelDateConfirmed: "Yes", // or "Yes", depending on your default
    },
  });
  const [reviewSession, setReviewSession] = useState(false);
  const [formDetails, setFormDetails] = useState(null);

  const travelDateConfirmed = watch("travelDateConfirmed");

  const onSubmit = (data) => {
    if (Object.keys(errors).length === 0) {
      // Only show review if no errors
      console.log(data);

      if (data.travelDateConfirmed === "No") {
        data.fromDate = null;
      }
      // Add travellers_who before saving
      data.travellers_who = "findcomp"; // or any value you need (string/array/etc.)

      setFormDetails(data);
      setReviewSession(true);
    } else {
      console.log("Form contains errors", errors);
    }
  };

  const travelerLanguageOptions = [
    { name: "travelerLanguageOptions.tamil", label: "Tamil" },
    { name: "travelerLanguageOptions.telugu", label: "Telugu" },
    { name: "travelerLanguageOptions.hindi", label: "Hindi" },
    { name: "travelerLanguageOptions.malayalam", label: "Malayalam" },
    { name: "travelerLanguageOptions.bengali", label: "Bengali" },
    { name: "travelerLanguageOptions.kannada", label: "Kannada" },
    { name: "travelerLanguageOptions.english", label: "English" },
  ];

  return (
    <div className="px-6 py-4 md:py-6 w-[90%]  relative rounded-tr-2xl rounded-b-2xl bg-white flex flex-col gap-y-4">
      {reviewSession && (
        <ReviewCompanionPost
          open={reviewSession}
          onClose={() => setReviewSession(false)}
          formDetails={formDetails}
        />
      )}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-screen-md border border-gray-300 rounded-[30px] mx-auto w-full py-6 px-6"
      >
        {/* Traveler Who Needs Companion  */}
        <ThreeRadioInput
          text="Traveler who needs companion"
          name="traveler"
          op1="My Wife"
          op2="My Parents"
          op3="Friend"
          control={control}
        />
        {/* Traveler Age */}
        <TextFieldInput
          name="travelerAge"
          defaultValue="55"
          control={control}
          text="Traveler age"
        />
        {/* Languages Spoken By Traveler  */}
        <CheckBoxInput
          text="Language my Traveler Speaks"
          options={travelerLanguageOptions}
          register={register}
        />
        {/* Flexible with languages spoken by companion */}
        <TwoRadioInput
          name="languageFlexibility"
          text="I am flexible if my travel companion speaks any language"
          control={control}
        />
        {/* Travel date confirmed */}
        <TwoRadioInput
          name="travelDateConfirmed"
          text="Travel Date Confirmed"
          control={control}
        />
        {travelDateConfirmed === "Yes" && (
          <DatePickerInput
            text="If Yes, Provide travel date"
            control={control}
            toDate={false}
            placeholderLab="Date"
          />
        )}

        {/* From City, Country */}
        <TextFieldInput
          name="departFrom"
          defaultValue="City, Country"
          control={control}
          text="From"
        />

        {/* To City, Country */}
        <TextFieldInput
          name="destinationTo"
          defaultValue="City, Country"
          control={control}
          text="To"
        />

        {/* Gift Travel Companion  */}
        <ThreeRadioInput
          text="Gift Companion with amazon gift card"
          name="giftCompanion"
          op1="$50"
          op2="$100"
          op3="$0"
          control={control}
        />

        <button className="mt-4 w-full px-10 py-5 bg-[#ffa41c] rounded-[28px] text-center  text-gray-800 text-base font-semibold font-dmsans">
          Review Post
        </button>
      </form>
    </div>
  );
}

export default FindCompanionForm;
