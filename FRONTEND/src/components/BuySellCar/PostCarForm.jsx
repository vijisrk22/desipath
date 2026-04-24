import { useForm } from "react-hook-form";
import PhotoUpload from "../InputTemplate/PhotoUpload";
import DescriptionInput from "../InputTemplate/DescriptionInput";
import TextFieldInput from "../InputTemplate/TextFieldInput";
import ReviewCarPost from "./ReviewCarPost";
import { useState, useEffect } from "react";
import LocationAutocompleteInput from "../InputTemplate/LocationAutocompleteInput";
import SelectInput from "../InputTemplate/SelectInput";
import CarMakeModelInput from "../InputTemplate/CarMakeModelInput";
import { useDispatch, useSelector } from "react-redux";
import { getCarAttributes } from "../../store/CarsSlice";
import {
  FormControl, FormLabel, RadioGroup, FormControlLabel,
  Radio, FormHelperText,
} from "@mui/material";
import { Controller } from "react-hook-form";

import { useParams } from "react-router-dom";
import api from "../../utils/api";

function PostCarForm() {
  const { action, carId } = useParams();
  const isEdit = action === "edit";
  const dispatch = useDispatch();
  const { car_attributes } = useSelector((state) => state.cars);

  const {
    handleSubmit, control, watch, setValue, reset,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const [reviewSession, setReviewSession] = useState(false);
  const [formDetails, setFormDetails] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(getCarAttributes());
  }, [dispatch]);

  useEffect(() => {
    if (isEdit && carId) {
      setLoading(true);
      api.get(`/api/cars/${carId}`)
        .then(res => {
          const data = res.data;
          
          if (data.location_city || data.location_state || data.location_zipcode) {
            data.location = `${data.location_city || ""}, ${data.location_state || ""}, ${data.location_zipcode || ""}`.trim().replace(/^,|,$/g, "");
          }

          reset(data);
          
          if (data.pictures) {
            try {
              const parsed = typeof data.pictures === 'string' ? JSON.parse(data.pictures) : data.pictures;
              setImages(Array.isArray(parsed) ? parsed : []);
            } catch (e) {
              console.error("Failed to parse images:", e);
              setImages([]);
            }
          } else {
            setImages([]);
          }
        })
        .catch(err => console.error("Error fetching car for edit:", err))
        .finally(() => setLoading(false));
    }
  }, [isEdit, carId, reset]);

  const onSubmit = (data) => {
    console.log("Form Data:", data);
    setFormDetails({ ...data, id: carId });
    setReviewSession(true);
  };

  const years = Array.from(
    { length: new Date().getFullYear() - 1995 + 1 },
    (_, i) => 1995 + i
  ).reverse();

  const RadioGroupField = ({ name, label, options, required = true }) => (
    <FormControl
      sx={{
        display: "grid", gridTemplateColumns: "1fr 1fr",
        alignItems: "center", width: "100%", py: "1rem", gap: "1rem",
        borderBottom: "1px solid", borderBottomColor: "grey.300",
      }}
    >
      <FormLabel>{label}</FormLabel>
      <Controller
        name={name}
        control={control}
        defaultValue=""
        rules={required ? { required: "Please select an option" } : {}}
        render={({ field, fieldState }) => (
          <>
            <RadioGroup row {...field}>
              {options.map((opt) => (
                <FormControlLabel
                  key={opt.value}
                  value={String(opt.value)}
                  control={<Radio size="small" />}
                  label={opt.label}
                />
              ))}
            </RadioGroup>
            {fieldState?.error && (
              <FormHelperText error sx={{ gridColumn: "2" }}>
                {fieldState.error.message}
              </FormHelperText>
            )}
          </>
        )}
      />
    </FormControl>
  );

  return (
    <div className="px-6 py-4 md:py-6 w-[90%] relative rounded-tr-2xl rounded-b-2xl bg-white flex flex-col gap-y-4">
      {reviewSession && (
        <ReviewCarPost
          open={reviewSession}
          onClose={() => setReviewSession(false)}
          formDetails={formDetails}
          images={images}
          carAttributes={car_attributes}
        />
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-screen-md mx-auto w-full">
        {/* Make + Model with Others fallback */}
        <CarMakeModelInput control={control} watch={watch} setValue={setValue} />

        {/* Year */}
        <SelectInput name="year" control={control} label="Year" data={years} />

        {/* Fuel Type from master table */}
        <RadioGroupField
          name="fuel_type_id"
          label="Fuel Type"
          options={car_attributes.fuel_types.map((f) => ({ value: f.id, label: f.name }))}
        />

        {/* Miles Driven */}
        <TextFieldInput name="miles" defaultValue="e.g. 25000" control={control} text="Miles Driven" type="number" />

        {/* Transmission from master table */}
        <RadioGroupField
          name="transmission_id"
          label="Transmission"
          options={car_attributes.transmissions.map((t) => ({ value: t.id, label: t.name }))}
        />

        {/* Location */}
        <LocationAutocompleteInput control={control} setValue={setValue} />

        {/* Car Condition from master table */}
        <RadioGroupField
          name="condition_id"
          label="Car Condition"
          options={car_attributes.conditions.map((c) => ({ value: c.id, label: c.name }))}
        />

        {/* Price */}
        <TextFieldInput name="price" defaultValue="e.g. 15000" control={control} text="Price ($)" type="number" />

        {/* Description */}
        <DescriptionInput name="description" control={control} />

        {/* Owner Name */}
        <TextFieldInput name="seller_name" defaultValue="Your full name" control={control} text="Owner Name" />

        {/* Owner Contact */}
        <TextFieldInput
          name="owner_contact"
          defaultValue="e.g. 555-123-4567"
          control={control}
          text="Owner Contact"
          rules={{
            pattern: {
              value: /^\(?\d{3}\)?[-.\\s]?\d{3}[-.\\s]?\d{4}$/,
              message: "Invalid US Phone Number",
            },
          }}
        />

        {/* Photos */}
        <PhotoUpload images={images} setImages={setImages} />

        {/* Error summary */}
        {Object.keys(errors).length > 0 && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            <p className="font-semibold mb-1">Please fill in all required fields:</p>
            <ul className="list-disc list-inside space-y-1">
              {Object.entries(errors).map(([field, err]) => (
                <li key={field}>
                  <span className="capitalize">{field.replace(/_/g, " ")}</span>: {err?.message || "Required"}
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
        <button
          type="submit"
          className="mt-4 w-full px-10 py-5 bg-[#ffa41c] rounded-[28px] text-center text-gray-800 text-base font-semibold font-dmsans hover:bg-[#e8931a] transition-colors"
        >
          {isEdit ? 'Review Changes' : 'Review Post'}
        </button>
      </form>
    </div>
  );
}

export default PostCarForm;
