import dayjs from "dayjs";

export function getRoomContents(formDetails, images) {
  return [
    { text: "Role",                value: formDetails.owner ? (formDetails.owner === "Yes" || formDetails.owner === true ? "Owner" : "Agent") : (formDetails.agent ? "Agent" : "Owner") },
    { text: "Address",             value: formDetails.address },
    { text: "Location(Zipcode)",   value: formDetails.location },
    { text: "Furnished",           value: formDetails.is_furnished },
    { text: "Preferred Tenants",   value: formDetails.gender_preference },
    { text: "Sharing Type",        value: formDetails.sharing_type },
    { text: "Kitchen Avl",         value: formDetails.kitchen_available },
    { text: "Car Parking Avl",     value: formDetails.car_parking_available },
    { text: "Shared Bathroom",     value: formDetails.shared_bathroom },
    { text: "Utilities Fees",      value: formDetails.utilities_included },
    { text: "Exp. Rent",           value: `${formDetails.rent} / ${formDetails.rent_frequency || "Monthly"}` },
    { text: "From Date",           value: dayjs(formDetails.available_from).format("DD-MM-YYYY") },
    { text: "To Date",             value: dayjs(formDetails.available_to).format("DD-MM-YYYY") },
    { text: "Veg/Non Veg",         value: formDetails.food_preference },
    { text: "Washer Dryer",        value: formDetails.washer_dryer },
    { text: "Additional Information", value: formDetails.description },
    { text: "Photos",              value: images },
  ];
}

