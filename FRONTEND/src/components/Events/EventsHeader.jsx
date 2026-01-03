import { useState } from "react";
import DisplayPath from "../DisplayPath";
import Dropdown from "../InputTemplate/Dropdown";
import SearchButton from "../SearchButton";

function EventsHeader({ paths }) {
  const defaultPaths = [
    { text: "Home", eP: "/" },
    { text: "Events", eP: "/services/events" },
    { text: "Find Event", eP: "/services/events/findEvent" },
  ];

  const breadcrumbs = paths || defaultPaths;

  const [inputValue, setInputValue] = useState("");
  const [dropdownValue, setDropdownValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Input Value:", inputValue);
    console.log("Dropdown Value:", dropdownValue);
    setInputValue("");
    setDropdownValue("");
  };
  return (
    <div className="bg-sky-50 px-[7%] pb-14">
      {/*Events Header path and search bar  */}
      <DisplayPath
        paths={breadcrumbs}
        color="gray-500"
        additionalStyles="leading-tight"
      />

      {/*Search Bar*/}
      <form
        onSubmit={handleSubmit}
        className="max-w-screen-lg mx-auto flex items-center justify-between gap-3 mt-7 bg-white px-6 py-2.5 rounded-[30px]"
      >
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Zip Code, City, State"
          className="flex-1 text-gray-800 text-base font-normal font-dmsans outline-none border-r border-slate-200"
        />
        <Dropdown
          dropdownValue={dropdownValue}
          setDropdownValue={setDropdownValue}
        />
        <SearchButton textVisible={false} paddingClass="p-3" />
      </form>
    </div>
  );
}

export default EventsHeader;
