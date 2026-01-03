import Footer from "../../components/Footer/Footer";
import Navbar from "../../components/Navbar/Navbar";
import EventsHeader from "../../components/Events/EventsHeader";
import EventsBody from "../../components/Events/EventsBody";

function FindEvent({ paths }) {
  const inputs = ["City", "State", "Zip Code"];

  return (
    <>
      <EventsHeader paths={paths} />
      <EventsBody />
      <Footer bgColor="bg-white" />
    </>
  );
}

export default FindEvent;
