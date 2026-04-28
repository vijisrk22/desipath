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
    handleSubmit, control, watch, setValue, reset, register,
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

          if (data.is_dealer !== undefined && data.is_dealer !== null) {
            data.is_dealer = String(data.is_dealer);
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

  const isDealer = watch("is_dealer") === "true";

  const RadioGroupField = ({ name, label, options, required = true }) => (
    <FormControl
      fullWidth
      sx={{
        py: "0.5rem",
        borderBottom: "1px solid",
        borderBottomColor: "grey.100",
        mb: 2,
      }}
    >
      <FormLabel 
        sx={{ 
          fontSize: "0.875rem", 
          fontWeight: 600, 
          color: "grey.800",
          mb: 1.5,
          fontFamily: "DM Sans, sans-serif"
        }}
      >
        {label}
      </FormLabel>
      <Controller
        name={name}
        control={control}
        defaultValue=""
        rules={required ? { required: "Please select an option" } : {}}
        render={({ field, fieldState }) => (
          <>
            <RadioGroup 
              row 
              {...field} 
              value={field.value !== undefined && field.value !== null && field.value !== "" ? String(field.value) : ""}
            >
              {options.map((opt) => (
                <FormControlLabel
                  key={opt.value}
                  value={String(opt.value)}
                  control={
                    <Radio 
                      size="small" 
                      sx={{
                        color: "#ffa41c",
                        "&.Mui-checked": {
                          color: "#ffa41c",
                        },
                      }}
                    />
                  }
                  label={<span className="text-sm font-dmsans text-gray-700">{opt.label}</span>}
                />
              ))}
            </RadioGroup>
            {fieldState?.error && (
              <FormHelperText error>
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

        {/* Drive Type */}
        <RadioGroupField
          name="drive_type"
          label="Drive Type"
          options={[
            { value: "Front-Wheel Drive (FWD)", label: "Front-Wheel Drive (FWD)" },
            { value: "Rear-Wheel Drive (RWD)", label: "Rear-Wheel Drive (RWD)" },
            { value: "All-Wheel Drive (AWD)", label: "All-Wheel Drive (AWD)" },
            { value: "Four-Wheel Drive (4WD)", label: "Four-Wheel Drive (4WD)" },
          ]}
        />

        {/* MPG + VIN */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextFieldInput name="mpg" defaultValue="e.g. 25/32" control={control} text="Miles per gallon (Optional)" requiredAssertion={false} />
          <TextFieldInput name="vin" defaultValue="e.g. 17-digit VIN" control={control} text="Vin# (Optional)" requiredAssertion={false} />
        </div>

        {/* Description */}
        <DescriptionInput name="description" control={control} />

        {/* Other Features */}
        <div className="flex flex-col gap-1.5 mb-6">
          <label className="text-gray-700 text-sm font-semibold font-dmsans ml-1">Other Features</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
            {[
              "Lane Departure Warning", "Rear View Camera", "Remote Start", 
              "Apple Car Play", "Android Auto", "Alloy Wheels", 
              "Bluetooth Technology", "GPS Navigation", "Leather Seats", 
              "Sunroof", "Moonroof"
            ].map((feature) => (
              <label key={feature} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  {...register("features")}
                  value={feature}
                  className="w-4 h-4 rounded border-gray-300 text-[#ffa41c] focus:ring-[#ffa41c] cursor-pointer"
                />
                <span className="text-sm font-dmsans text-gray-600 group-hover:text-gray-900 transition-colors">{feature}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Dealer status check */}
        <RadioGroupField
          name="is_dealer"
          label="Are you a car Dealer?"
          options={[
            { value: "true", label: "Yes" },
            { value: "false", label: "No" },
          ]}
        />

        {/* Conditional Fields based on Dealer Status */}
        {isDealer ? (
          <div className="bg-orange-50/30 p-5 rounded-2xl border border-orange-100 flex flex-col gap-4 mb-6">
            <h3 className="text-[#ffa41c] font-semibold text-sm uppercase tracking-wider mb-1 font-dmsans">Dealer Information</h3>
            <TextFieldInput name="dealer_name" defaultValue="Enter Car Dealer Name" control={control} text="Car Dealer Name" />
            <TextFieldInput name="dealer_zipcode" defaultValue="e.g. 92101" control={control} text="Car Dealer Location (Zipcode)" />
            <TextFieldInput name="dealer_contact_person" defaultValue="Enter Contact Person name" control={control} text="Car Dealer Contact Person" />
            <TextFieldInput name="dealer_contact_number" defaultValue="e.g. 555-123-4567" control={control} text="Car Dealer Contact Number" />
            <TextFieldInput name="dealer_email" defaultValue="Enter Dealer Email ID" control={control} text="Car Dealer Email ID" type="email" />
          </div>
        ) : (
          <div className="bg-gray-50/50 p-5 rounded-2xl border border-gray-100 flex flex-col gap-4 mb-6">
            <h3 className="text-gray-500 font-semibold text-sm uppercase tracking-wider mb-1 font-dmsans">Owner Information</h3>
            <TextFieldInput name="owner_name" defaultValue="Your full name" control={control} text="Owner Name" />
            <TextFieldInput
              name="owner_contact_number"
              defaultValue="e.g. 555-123-4567"
              control={control}
              text="Owner Contact Number"
              rules={{
                required: "Contact number is required",
                pattern: {
                  value: /^\(?\d{3}\)?[-.\\s]?\d{3}[-.\\s]?\d{4}$/,
                  message: "Invalid US Phone Number",
                },
              }}
            />
          </div>
        )}

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
