import { useParams } from "react-router-dom";
import Footer from "../../components/Footer/Footer";
import Navbar from "../../components/Navbar/Navbar";
import ServiceHeroSection from "../../components/ServiceHeroSection";

import FindRoom from "./FindRoom";
import PostRoom from "./PostRoom";
import PostConfirmation from "../PostConfirmation";
import RoomDetails from "./RoomDetails";

function Roommates() {
  const { action } = useParams();

  const pageDetails = {
    path1: "findRoom",
    path2: "postRoom",
    description1: "Search a room or share accommodation in your area",
    description2: "Search for a room mate, share your home/room and make money",
    buttonText1: "Find A Room",
    buttonText2: "Post An Add/Share My Room",
  };

  const showNavbar =
    action === undefined ||
    action === "findRoom" ||
    action === "postRoom" ||
    action === "postConfirmation";

  return (
    <div className="flex flex-col min-h-screen overflow-y-auto ">
      {showNavbar && <Navbar />}

      {action === undefined ? (
        <>
          {" "}
          <div className="flex-grow bg-[#f0f8ff]">
            <ServiceHeroSection pageDetails={pageDetails} />
          </div>
          <div className="bg-[#f0f8ff]">
            <Footer newsletter={"block"} />
          </div>
        </>
      ) : action === "findRoom" ? (
        <FindRoom />
      ) : action === "postRoom" ? (
        <PostRoom />
      ) : action === "postConfirmation" ? (
        <PostConfirmation />
      ) : (
        <RoomDetails />
      )}
    </div>
  );
}

export default Roommates;
