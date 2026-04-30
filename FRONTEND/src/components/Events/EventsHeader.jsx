import DisplayPath from "../DisplayPath";

function EventsHeader({ paths }) {
  const defaultPaths = [
    { text: "Home", eP: "/" },
    { text: "Events", eP: "/services/events" },
    { text: "Find Event", eP: "/services/events/findEvent" },
  ];

  const breadcrumbs = paths || defaultPaths;

  return (
    <div className="px-[7%] pt-2 pb-6 flex justify-between items-end">
      {/* Breadcrumbs — hidden on mobile */}
      <div className="hidden md:block">
        <DisplayPath
          paths={breadcrumbs}
          color="gray-500"
          additionalStyles="leading-tight"
        />
      </div>
      <a
        href="/services/events/postEvent"
        className="hidden md:inline-flex px-6 py-2.5 bg-[#ffa41c] hover:bg-[#ff9900] transition-colors rounded-[57px] text-gray-800 text-sm font-bold font-dmsans whitespace-nowrap shadow-sm mb-2"
      >
        Post An Event
      </a>
    </div>
  );
}

export default EventsHeader;
