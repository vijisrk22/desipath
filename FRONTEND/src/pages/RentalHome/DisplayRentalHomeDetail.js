import dayjs from "dayjs";
import { getStateCode } from "../../utils/locationHelper";

export function getRentalHomeContents(formDetails, images, mode = "post") {
  const safeLocation = formDetails?.location || "";
  const locationText = typeof safeLocation === 'string' && safeLocation.includes(",")
    ? safeLocation.split(",").slice(0, 3).join(", ")
    : `${formDetails?.location_city || ""}, ${getStateCode(formDetails?.location_state || "")}, ${formDetails?.location_zipcode || ""}`;

  return [
    { text: "Listing ID", value: formDetails?.id || "N/A" },
    { text: "Property Type", value: formDetails?.property_type || "N/A" },
    { text: "Available From", value: (formDetails?.available_from || formDetails?.fromDate) ? dayjs(formDetails.available_from || formDetails.fromDate).format("MMMM D, YYYY") : "N/A" },
    { text: "Area", value: `${Math.floor(formDetails?.area || 0)} Sqft` },
    { text: "BHK", value: mode === "post" ? (formDetails?.bedrooms || 1) : (formDetails?.bhk ? formDetails.bhk.split(" ")[0] : "1") },
    { text: "Bathrooms", value: mode === "post" ? (formDetails?.bathrooms || 1) : (formDetails?.bhk ? formDetails.bhk.split(" ")[2] : "1") },
    { text: "Address", value: formDetails?.address || "N/A" },
    { text: "Location", value: locationText },
    { text: "Community Name", value: formDetails?.community_name || "N/A" },
    { text: "Amenities", value: mode === "post" ? Object.keys(formDetails?.amenities || {}).filter((key) => formDetails.amenities[key]).join(", ") : (Array.isArray(formDetails?.amenities) ? formDetails.amenities.join(", ") : (formDetails?.amenities || "None")) },
    { text: "Pets", value: String(formDetails?.pets ?? "No") },
    { text: "Accommodates", value: formDetails?.accommodates || 1 },
    { text: "Smoking", value: formDetails?.smoking || "No", },
    { text: "Contact Number", value: formDetails?.contact_no || "N/A" },
    { text: "Additional Information", value: formDetails?.description || "No description provided." },
    { text: "Photos", value: images || [] },
  ];
}
