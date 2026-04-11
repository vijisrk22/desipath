
export function getCarContents(formDetails, images, carAttributes) {
  const attrs = carAttributes || { fuel_types: [], transmissions: [], conditions: [] };

  const getFuelName = (id) => attrs.fuel_types.find((f) => String(f.id) === String(id))?.name || id || "-";
  const getTransName = (id) => attrs.transmissions.find((t) => String(t.id) === String(id))?.name || id || "-";
  const getCondName  = (id) => attrs.conditions.find((c) => String(c.id) === String(id))?.name || id || "-";

  return [
    { text: "Car Make",      value: formDetails.make_other || formDetails.make },
    { text: "Car Model",     value: formDetails.model_other || formDetails.model },
    { text: "Year",          value: formDetails.year },
    { text: "Fuel Type",     value: formDetails.fuel_type_name || getFuelName(formDetails.fuel_type_id) },
    { text: "Miles Driven",  value: formDetails.miles ? `${Number(formDetails.miles).toLocaleString()} mi` : "-" },
    { text: "Transmission",  value: formDetails.transmission_name || getTransName(formDetails.transmission_id) },
    { text: "Location",      value: formDetails.location },
    { text: "Condition",     value: formDetails.condition_name || getCondName(formDetails.condition_id) },
    { text: "Owner",         value: formDetails.seller_name },
    { text: "Contact",       value: formDetails.owner_contact },
    { text: "Description",   value: formDetails.description },
    { text: "Photos",        value: images },
  ];
}
