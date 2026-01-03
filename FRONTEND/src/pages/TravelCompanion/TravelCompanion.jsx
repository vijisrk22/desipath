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
          <div className="flex-grow px-[7%] py-16 min-h-screen ">
            <div className="text-blue-700 text-5xl font-bold font-dmsans">
              Travel companion
            </div>
            <div className="mt-4 text-gray-500 text-2xl font-medium font-dmsans leading-9">
              Find the Travel companion for your spouse/parent who is travelling
              to USA / from USA. <br />
              Travel companion is a regular Traveller who is interested to help
              any one travelling to USA /from USA. <br />
              Some Travel companion may request an amazon gift card to keep them
              motivated for spending time and helping.
            </div>

            <div className="flex flex-wrap justify-start gap-x-40 gap-y-10 my-14">
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
      {action === "postConfirmation" && <PostConfirmation />}
    </div>
  );
}

export default TravelCompanion;
