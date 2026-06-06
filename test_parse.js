const loc = "08540 ";
const parts = loc.split(",").map(s => s.trim());
let city = "", state = "", zipcode = "";

if (parts.length >= 3) {
  city = parts[0];
  state = parts[1];
  zipcode = parts[2];
} else if (parts.length === 2) {
  city = parts[0];
  state = parts[1];
} else {
  const singlePart = parts[0] || "";
  if (/^\d{5}(-\d{4})?$/.test(singlePart)) {
    zipcode = singlePart;
  } else {
    city = singlePart;
  }
}

console.log({ city, state, zipcode });
