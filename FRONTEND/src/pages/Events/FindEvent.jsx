import Footer from "../../components/Footer/Footer";
import Navbar from "../../components/Navbar/Navbar";
import EventsHeader from "../../components/Events/EventsHeader";
import EventsBody from "../../components/Events/EventsBody";
import EventsSidebarFilter from "../../components/Events/EventsSidebarFilter";

function FindEvent({ paths }) {
  return (
    <div className="bg-[#f3f5f7] min-h-screen">
      <EventsHeader paths={paths} />
      
      {/* Content wrapper with sidebar and main body */}
      <div className="px-[7%] pt-4 pb-16 flex flex-col md:flex-row gap-8 items-start">
        {/* Left Sidebar Filters */}
        <EventsSidebarFilter />

        {/* Right Main Body */}
        <div className="flex-1 w-full">
          <EventsBody />
        </div>
      </div>
      
      <Footer bgColor="bg-white" />
    </div>
  );
}

export default FindEvent;
