import Footer from "../../components/Footer/Footer";
import Navbar from "../../components/Navbar/Navbar";
import EventsHeader from "../../components/Events/EventsHeader";
import EventsBody from "../../components/Events/EventsBody";

function FindEvent({ paths }) {
  const inputs = ["City", "State", "Zip Code"];

  return (
    <div className="bg-[#f3f5f7]">
      <EventsHeader paths={paths} />
      <div className="flex justify-end px-[7%] pt-6">
        <a
          href="/services/events/postEvent"
          className="px-6 py-2.5 bg-[#ffa41c] hover:bg-[#ff9900] transition-colors rounded-[57px] text-gray-800 text-base font-bold font-dmsans whitespace-nowrap shadow-sm"
        >
          Post An Event
        </a>
      </div>
      <EventsBody />
      <Footer bgColor="bg-white" />
    </div>
  );
}

export default FindEvent;
