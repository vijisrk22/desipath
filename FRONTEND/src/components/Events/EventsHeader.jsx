import DisplayPath from "../DisplayPath";

function EventsHeader({ paths }) {
  const defaultPaths = [
    { text: "Home", eP: "/" },
    { text: "Events", eP: "/services/events" },
    { text: "Find Event", eP: "/services/events/findEvent" },
  ];

  const breadcrumbs = paths || defaultPaths;

  return (
    <div className="bg-sky-50 px-[7%] pb-8 pt-4">
      {/*Events Header path */}
      <DisplayPath
        paths={breadcrumbs}
        color="gray-500"
        additionalStyles="leading-tight mb-2"
      />
    </div>
  );
}

export default EventsHeader;
