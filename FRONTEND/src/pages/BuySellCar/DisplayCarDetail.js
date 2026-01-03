
export function getCarContents(formDetails, images) {
  return [
    { text: "Input Car Make",      value: formDetails.make },
    { text: "Car Model",           value: formDetails.model },
    { text: "Year",                value: formDetails.year },
    { text: "Variant",             value: formDetails.variant },
    { text: "Miles",               value: formDetails.miles },
    { text: "Location",            value: formDetails.location },
    { text: "Description",         value: formDetails.description },
    { text: "Photos",              value: images },
  ];
}
