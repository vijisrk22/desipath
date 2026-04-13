import SearchFieldInput from "../SearchFieldInput";

function EventsHeader({ paths }) {
  const defaultPaths = [
    { text: "Home", eP: "/" },
    { text: "Events", eP: "/services/events" },
    { text: "Find Event", eP: "/services/events/findEvent" },
  ];

  const breadcrumbs = paths || defaultPaths;

  return (
    <div className="bg-sky-50 px-[7%] pb-14">
      {/*Events Header path and search bar  */}
      <DisplayPath
        paths={breadcrumbs}
        color="gray-500"
        additionalStyles="leading-tight"
      />

      {/*Standardized Search Bar*/}
      <div className="mt-10 max-w-7xl mx-auto">
        <SearchFieldInput 
          inputs={["location", "eventType"]} 
          title="Find an Event" 
        />
      </div>
    </div>
  );
}

export default EventsHeader;
