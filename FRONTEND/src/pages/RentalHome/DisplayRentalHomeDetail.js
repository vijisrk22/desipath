
import dayjs from "dayjs";
export function getRentalHomeContents(formDetails, images, mode="post") {
  return [
    { text: "Property Type",                  value: formDetails.property_type },
    { text: "Available From",                 value: dayjs(formDetails.fromDate).format("DD-MM-YYYY")},
    { text: "Area",                           value: `${formDetails.area} m²` },
    { text: "BHK",                            value: mode === "post" ? formDetails.bedrooms: formDetails.bhk.split(" ")[0]  },
    { text: "Bathrooms",                      value:  mode === "post" ? formDetails.bathrooms: formDetails.bhk.split(" ")[2]  },
    { text: "Address",                        value: formDetails.address },
    { text: "Location",                       value: formDetails?.location ? `${formDetails.location.split(",")[0]}, ${formDetails.location.split(",")[1]}, ${formDetails.location.split(",")[2]}` : `${formDetails.location_city}, ${formDetails.location_state}, ${formDetails.location_zipcode}` },
    { text: "Community Name",                 value: formDetails.community_name },
    { text: "Amenities",                      value: mode === "post" ? Object.keys(formDetails.amenities).filter((key) => formDetails.amenities[key]).join(", ") : formDetails.amenities.join(", ")},
    { text: "Pets",                           value: String(formDetails.pets)},
    { text: "Accommodates",                   value: formDetails.accommodates },
    { text: "Smoking",                        value: formDetails.smoking, },
    { text: "Additional Information",         value: formDetails.description },
    { text: "Photos",                         value: images },
  ];
}
