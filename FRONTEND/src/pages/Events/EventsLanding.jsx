import { useParams } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import ServiceHeroSection from "../../components/ServiceHeroSection";
import FindEvent from "./FindEvent";
import PostConfirmation from "../PostConfirmation";
import PostEvent from "./PostEvent";
import Footer from "../../components/Footer/Footer";
import EventDetails from "./EventDetails";

function EventsLanding() {
  const { action } = useParams();
  return (
    <div className="flex flex-col min-h-screen overflow-y-auto ">
      <Navbar />
      {action === undefined ? (
        <FindEvent
          paths={[
            { text: "Home", eP: "/" },
            { text: "Events", eP: "/services/events" },
          ]}
        />
      ) : action === "findEvent" ? (
        <FindEvent />
      ) : (action === "postEvent" || action === "edit") ? (
        <PostEvent />
      ) : action === "postConfirmation" ? (
        <PostConfirmation 
          redirectTo="/services/events/findEvent" 
          message="Thanks for using Desipath. Your event is live!" 
        />
      ) : (
        <EventDetails />
      )}
    </div>
  );
}

export default EventsLanding;
