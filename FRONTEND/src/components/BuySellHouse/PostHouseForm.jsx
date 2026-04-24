import TwoRadioInput from "../InputTemplate/TwoRadioInput";
import ThreeRadioInput from "../InputTemplate/ThreeRadioInput";

import { useForm } from "react-hook-form";
import PhotoUpload from "../InputTemplate/PhotoUpload";
import DescriptionInput from "../InputTemplate/DescriptionInput";
import TextFieldInput from "../InputTemplate/TextFieldInput";
import ReviewHousePost from "./ReviewHousePost";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../utils/api";
import CheckBoxInput from "../InputTemplate/CheckBoxInput";
import LocationAutocompleteInput from "../InputTemplate/LocationAutocompleteInput";

function PostHouseForm() {
  const { action, houseId } = useParams();
  const isEdit = action === "edit";

  const {
    handleSubmit,
    control,
    register,
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
    if (isEdit && houseId) {
      setLoading(true);
      api.get(`/api/homes/${houseId}`)
        .then(res => {
          const data = res.data;
          
          // Map backend fields to form fields
          const mappedData = {
            ...data,
            role: data.user_type,
            builtArea: data.built_area,
            lotSize: data.lot_size,
            hoaFees: data.hoa_fees,
            yearBuilt: data.year_built,
            numBedrooms: data.bedroom_total,
            halfBathrooms: data.half_bathroom_total,
            basementSize: data.basement_size,
            basement: data.basement_status === "Semi finished" ? "Semi Finished" : data.basement_status,
            laundryInHouse: data.laundry_in_house ? "Yes" : "No",
            numOfLevels: data.home_level,
            kitchenGraniteTop: data.kitchen_granite_countertop ? "Yes" : "No",
            firePlace: data.fireplace_count > 0 ? "Yes" : "No",
          };

          // Handle location string for Autocomplete
          if (data.location_city || data.location_state || data.location_zipcode) {
            mappedData.location = `${data.location_city || ""}, ${data.location_state || ""}, ${data.location_zipcode || ""}`.trim().replace(/^,|,$/g, "");
          }

          // Handle home type mapping
          if (data.home_type === "Condominum") mappedData.type = "Condominium";
          else if (data.home_type === "Single family") mappedData.type = "Single Family";
          else if (data.home_type === "Town home") mappedData.type = "Town House";
          else mappedData.type = data.home_type;

          // Handle flooring options (Array to Object)
          if (Array.isArray(data.flooring)) {
            const floorOpts = {};
            const revLabels = { "Wood": "wood", "Vinyl": "vinyl", "Carpet": "carpet", "Ceramic Tile": "ceramicTile" };
            data.flooring.forEach(f => {
              if (revLabels[f]) floorOpts[revLabels[f]] = true;
            });
            mappedData.flooringOptions = floorOpts;
          }

          reset(mappedData);
          
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
        .catch(err => console.error("Error fetching house for edit:", err))
        .finally(() => setLoading(false));
    }
  }, [isEdit, houseId, reset]);

  const onSubmit = (data) => {
    if (Object.keys(errors).length === 0) {
      console.log(data);
      setFormDetails({ ...data, id: houseId });
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
        {loading && (
          <div className="absolute inset-0 bg-white/60 z-50 flex items-center justify-center rounded-2xl">
            <div className="w-10 h-10 border-4 border-[#ffa41c] border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        <button type="submit" className="mt-4 w-full px-10 py-5 bg-[#ffa41c] rounded-[28px] text-center  text-gray-800 text-base font-semibold font-dmsans hover:bg-[#e8931a] transition-colors">
          {isEdit ? 'Review Changes' : 'Review Post'}
        </button>
      </form>
    </div>
  );
}

export default PostHouseForm;
