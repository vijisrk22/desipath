import { useParams } from "react-router-dom";
import Footer from "../../components/Footer/Footer";
import Navbar from "../../components/Navbar/Navbar";
import ServiceHeroSection from "../../components/ServiceHeroSection";

import FindAstrology from "./FindAstrology";
import PostAstrology from "./PostAstrology";
import PostConfirmation from "../PostConfirmation";

function AstrologyAds() {
  const { action } = useParams();

  const pageDetails = {
    path1: "findAstrologer",
    path2: "postAstrologer",
    description1: "Find Authentic Astrologers in your area",
    description2: "Are you an Astrologer? Post an Ad",
    buttonText1: "Find Astrologers",
    buttonText2: "Post Astrology Ad",
  };

  return (
    <div className="flex flex-col min-h-screen overflow-y-auto">
      <Navbar />

      {action === undefined && (
        <>
          <div className="flex-grow bg-[#f0f8ff]">
            <ServiceHeroSection
              pageDetails={pageDetails}
              bgImg={"/img/cars/backgroundCarImg.png"} /* Fallback image */
            />
          </div>
          <div className="bg-[#f0f8ff]">
            <Footer newsletter={"block"} />
          </div>
        </>
      )}

      {action === "findAstrologer" && <FindAstrology />}
      {action === "postAstrologer" && <PostAstrology />}
      {action === "postConfirmation" && (
        <PostConfirmation 
          redirectTo="/services/astrologyAds/findAstrologer" 
          message="Thanks for using Desipath. Your astrology ad is live!" 
        />
      )}
    </div>
  );
}

export default AstrologyAds;
