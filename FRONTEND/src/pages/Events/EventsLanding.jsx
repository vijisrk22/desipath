import { useParams } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import ServiceHeroSection from "../../components/ServiceHeroSection";
import FindEvent from "./FindEvent";
import PostConfirmation from "../PostConfirmation";
import PostEvent from "./PostEvent";
import Footer from "../../components/Footer/Footer";

function EventsLanding() {
  const { action } = useParams();
  const pageDetails = {
    path1: "findEvent",
    path2: "postEvent",
    description1: "Search for an event in your area",
    description2: "Post an event in your area",
    buttonText1: "Find Event",
    buttonText2: "Post An Event",
  };
  return (
    <div className="flex flex-col min-h-screen overflow-y-auto ">
      <Navbar />
      {action === undefined && (
        <FindEvent
          paths={[
            { text: "Home", eP: "/" },
            { text: "Events", eP: "/services/events" },
          ]}
        />
      )}

      {action === "findEvent" && <FindEvent />}
      {action === "postEvent" && <PostEvent />}
      {action === "postConfirmation" && <PostConfirmation />}
    </div>
  );
}

export default EventsLanding;
