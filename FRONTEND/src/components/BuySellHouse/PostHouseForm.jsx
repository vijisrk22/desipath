import TwoRadioInput from "../InputTemplate/TwoRadioInput";
import ThreeRadioInput from "../InputTemplate/ThreeRadioInput";

import { useForm } from "react-hook-form";
import PhotoUpload from "../InputTemplate/PhotoUpload";
import DescriptionInput from "../InputTemplate/DescriptionInput";
import TextFieldInput from "../InputTemplate/TextFieldInput";
import ReviewHousePost from "./ReviewHousePost";
import { useState } from "react";
import CheckBoxInput from "../InputTemplate/CheckBoxInput";

function PostHouseForm() {
  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
  } = useForm();
  const [reviewSession, setReviewSession] = useState(false);
  const [formDetails, setFormDetails] = useState(null);

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

  const flooringOptions = [
    { name: "flooringOptions.wood", label: "Wood" },
    { name: "flooringOptions.vinyl", label: "Vinyl" },
    { name: "flooringOptions.carpet", label: "Carpet" },
    { name: "flooringOptions.ceramicTile", label: "Ceramic Tile" },
  ];

  return (
    <div className="px-6 py-4 md:py-6 w-[90%] relative rounded-tr-2xl rounded-b-2xl bg-white flex flex-col gap-y-4">
      {reviewSession && (
        <ReviewHousePost
          open={reviewSession}
          onClose={() => setReviewSession(false)}
          formDetails={formDetails}
        />
      )}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-screen-md mx-auto w-full"
      >
        <TwoRadioInput
          name="role"
          text="You Are An"
          op1="Agent"
          op2="Owner"
          control={control}
        />
        <ThreeRadioInput
          text="Type"
          name="type"
          op1="Condominium"
          op2="Single Family"
          op3="Town House"
          control={control}
        />
        <TextFieldInput
          name="price"
          defaultValue="22000"
          control={control}
          text="Price"
        />
        <TextFieldInput
          name="builtArea"
          defaultValue="Text"
          control={control}
          text="Built Area"
        />
        <TextFieldInput
          name="lotSize"
          defaultValue="Text"
          control={control}
          text="Lot Size"
        />
        <TextFieldInput
          name="hoaFees"
          defaultValue="Text"
          control={control}
          text="HOA Fees If Any"
        />
        <TextFieldInput
          name="yearBuilt"
          defaultValue="Text"
          control={control}
          text="Year Built"
        />
        <TextFieldInput
          name="numBedrooms"
          defaultValue="Text"
          control={control}
          text="Total Num. Of Bed Rooms"
        />
        <TextFieldInput
          name="halfBathrooms"
          defaultValue="Text"
          control={control}
          text="Total Num. Of Half Bathrooms"
        />
        <TextFieldInput
          name="basementSize"
          defaultValue="Text"
          control={control}
          text="Basement Size"
        />
        <ThreeRadioInput
          text="Basement"
          name="basement"
          op1="Finished"
          op2="Unfinished"
          op3="Semi Finished"
          control={control}
        />
        <TwoRadioInput
          name="laundryInHouse"
          text="Laundry In House"
          control={control}
        />
        <TextFieldInput
          name="numOfLevels"
          defaultValue="Text"
          control={control}
          text="Total Number Of Levels"
        />
        <TwoRadioInput
          name="kitchenGraniteTop"
          text="Kitchen Granite Counter Top"
          control={control}
        />
        <TwoRadioInput name="firePlace" text="Fireplace" control={control} />

        <CheckBoxInput
          text="Flooring"
          options={flooringOptions}
          register={register}
        />
        <PhotoUpload />
        <DescriptionInput name="description" control={control} />
        <button className="mt-4 w-full px-10 py-5 bg-[#ffa41c] rounded-[28px] text-center  text-gray-800 text-base font-semibold font-dmsans">
          Review Post
        </button>
      </form>
    </div>
  );
}

export default PostHouseForm;
