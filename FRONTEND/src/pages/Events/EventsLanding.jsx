import { useParams } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import ServiceHeroSection from "../../components/ServiceHeroSection";
import FindEvent from "./FindEvent";
import PostConfirmation from "../PostConfirmation";
import PostEvent from "./PostEvent";
import Footer from "../../components/Footer/Footer";
import EventDetails from "./EventDetails";

function EventsLanding() {
  const { action, eventId } = useParams();
  const pageDetails = {
    path1: "findEvent",
    path2: "postEvent",
    description1: "Find local Indian events, concerts and gatherings",
    description2: "Organizing an event? Post it here to reach the community",
    buttonText1: "Find Events",
    buttonText2: "Post An Event",
  };

  return (
    <div className="flex flex-col min-h-screen overflow-y-auto ">
      <Navbar />
      {action === undefined ? (
        <>
          <div className="bg-[#f0f8ff] flex-1">
            <ServiceHeroSection
              pageDetails={pageDetails}
              bgImg="/img/events/eventsHero.png"
              orangeArrow={true}
            />
          </div>
          <Footer bgColor="bg-white" />
        </>
      ) : (action === "findEvent" && !eventId) ? (
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
