import BeCompanionForm from "../../components/TravelCompanion/BeCompanionForm";
import FindAndSearchTraveler from "../../components/TravelCompanion/FindAndSearchTraveler";
import CompanionPageWrapper from "../../components/TravelCompanion/CompanionPageWrapper";

function BeCompanion() {
  return (
    <CompanionPageWrapper
      paths={[
        { text: "Home", eP: "/" },
        { text: "Travel Companion", eP: "/services/travelCompanion" },
        {
          text: "I am a Travel Companion willing to Help",
          eP: "/services/travelCompanion/besCompanion",
        },
      ]}
      heading="Are you a travel companion, interested to help some Traveler"
      description={
        <>
          Be a Travel companion and help some one who needs help while
          Traveling.
          <br />
          By being a Travel companion, you would receive Travel Champion Badge
          in your profile from Desipath <br />
        </>
      }
      tabLabels={[
        "Post My Travel Details",
        "Search For Travelers and Show your interest",
      ]}
      tabComponents={[<BeCompanionForm />, <FindAndSearchTraveler />]}
    />
  );
}

export default BeCompanion;
