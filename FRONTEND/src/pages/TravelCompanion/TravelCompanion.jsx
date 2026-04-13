import { useLocation, useParams } from "react-router-dom";
import Footer from "../../components/Footer/Footer";
import Navbar from "../../components/Navbar/Navbar";

import PostConfirmation from "../PostConfirmation";
import FindCompanion from "./FindCompanion";
import BeCompanion from "./BeCompanion";
import CompanionCard from "../../components/TravelCompanion/CompanionCard";

function TravelCompanion() {
  const { action } = useParams();
  const location = useLocation();
  return (
    <div className="flex flex-col min-h-screen overflow-y-auto ">
      <Navbar />

      {action === undefined && (
        <>
          {" "}
          <div className="flex-grow bg-[#f3f5f7] pb-20">
            <div className="bg-[#007185] text-white px-[7%] py-20 mb-12">
              <h1 className="text-4xl md:text-6xl font-extrabold font-dmsans mb-6">
                Travel Companion
              </h1>
              <p className="max-w-3xl text-lg md:text-xl font-medium opacity-90 leading-relaxed">
                Find the perfect travel companion for your spouse or parents. 
                Whether you're looking for assistance on a long flight or want to offer 
                your help as a regular traveler, Desipath connects you with the community.
              </p>
            </div>

            <div className="px-[7%] grid grid-cols-1 md:grid-cols-2 gap-10">
              <CompanionCard
                text="I am looking for a travel companion for my spouse/ parent"
                path={`${location.pathname}/findCompanion`}
              />
              <CompanionCard
                text="I am a traveller, i would like to be a travel companion for any one"
                path={`${location.pathname}/beCompanion`}
              />
            </div>
          </div>
          <div>
            <Footer newsletter={"block"} />
          </div>
        </>
      )}

      {action === "findCompanion" && <FindCompanion />}
      {action === "beCompanion" && <BeCompanion />}
      {action === "postConfirmation" && (
        <PostConfirmation 
          redirectTo="/services/travelCompanion/findCompanion" 
          message="Thanks for using Desipath. Your travel companion ad is live!" 
        />
      )}
    </div>
  );
}

export default TravelCompanion;
