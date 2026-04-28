
export function getCarContents(formDetails, images, carAttributes) {
  const attrs = carAttributes || { fuel_types: [], transmissions: [], conditions: [] };

  const getFuelName = (id) => attrs.fuel_types.find((f) => String(f.id) === String(id))?.name || id || "-";
  const getTransName = (id) => attrs.transmissions.find((t) => String(t.id) === String(id))?.name || id || "-";
  const getCondName  = (id) => attrs.conditions.find((c) => String(c.id) === String(id))?.name || id || "-";

  const isDealer = String(formDetails.is_dealer) === "true";

  const contents = [
    { text: "Car Make",      value: formDetails.make_other || formDetails.make },
    { text: "Car Model",     value: formDetails.model_other || formDetails.model },
    { text: "Year",          value: formDetails.year },
    { text: "Fuel Type",     value: formDetails.fuel_type_name || getFuelName(formDetails.fuel_type_id) },
    { text: "Miles Driven",  value: formDetails.miles ? `${Number(formDetails.miles).toLocaleString()} mi` : "-" },
    {text: "Transmission",  value: formDetails.transmission_name || getTransName(formDetails.transmission_id)},
    {text: "Drive Type",    value: formDetails.drive_type},
    {text: "MPG",           value: formDetails.mpg},
    {text: "VIN",           value: formDetails.vin},
    {text: "Condition",     value: formDetails.condition_name || getCondName(formDetails.condition_id)},
    {text: "Location",      value: formDetails.location},
    {text: "Other Features", value: Array.isArray(formDetails.features) ? formDetails.features.join(", ") : "-"},
    {text: "Description",   value: formDetails.description},
  ];

  if (isDealer) {
    contents.push(
      { text: "Seller Type",    value: "Dealer" },
      { text: "Dealer Name",    value: formDetails.dealer_name },
      { text: "Contact Person", value: formDetails.dealer_contact_person },
      { text: "Contact Number", value: formDetails.dealer_contact_number },
      { text: "Email",          value: formDetails.dealer_email },
      { text: "Zipcode",        value: formDetails.dealer_zipcode }
    );
  } else {
    contents.push(
      { text: "Seller Type",    value: "Private Owner" },
      { text: "Owner Name",     value: formDetails.owner_name },
      { text: "Owner Contact",  value: formDetails.owner_contact_number }
    );
  }

  contents.push({ text: "Photos", value: images });
  return contents;
}
