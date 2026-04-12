import TwoRadioInput from "../InputTemplate/TwoRadioInput";
import ThreeRadioInput from "../InputTemplate/ThreeRadioInput";

import { useForm } from "react-hook-form";
import PhotoUpload from "../InputTemplate/PhotoUpload";
import DescriptionInput from "../InputTemplate/DescriptionInput";
import TextFieldInput from "../InputTemplate/TextFieldInput";
import ReviewHousePost from "./ReviewHousePost";
import { useState } from "react";
import CheckBoxInput from "../InputTemplate/CheckBoxInput";
import LocationAutocompleteInput from "../InputTemplate/LocationAutocompleteInput";
function PostHouseForm() {
  const {
    handleSubmit,
    control,
    register,
    setValue,
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
          images={images}
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
        
        <LocationAutocompleteInput control={control} setValue={setValue} />
        
        <TextFieldInput
          name="contact_no"
          defaultValue="Text"
          control={control}
          text="Contact Number"
          rules={{
            pattern: {
              value: /^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/,
              message: "Invalid US Phone Number",
            },
          }}
        />

        <CheckBoxInput
          text="Flooring"
          options={flooringOptions}
          register={register}
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
        <button type="submit" className="mt-4 w-full px-10 py-5 bg-[#ffa41c] rounded-[28px] text-center  text-gray-800 text-base font-semibold font-dmsans hover:bg-[#e8931a] transition-colors">
          Review Post
        </button>
      </form>
    </div>
  );
}

export default PostHouseForm;
