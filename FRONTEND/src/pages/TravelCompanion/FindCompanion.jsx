import FindCompanionForm from "../../components/TravelCompanion/FindCompanionForm";
import FindAndSearchCompanion from "../../components/TravelCompanion/FindAndSearchCompanion";
import CompanionPageWrapper from "../../components/TravelCompanion/CompanionPageWrapper";

function FindCompanion() {
  return (
    <CompanionPageWrapper
      paths={[
        { text: "Home", eP: "/" },
        { text: "Travel Companion", eP: "/services/travelCompanion" },
        {
          text: "Need Travel Companion",
          eP: "/services/travelCompanion/findCompanion",
        },
      ]}
      heading="I am looking for a Travel companion for my spouse/ parent"
      description={
        <>
          Find the Travel companion for your spouse or parent who is traveling
          in the same flight.
          <br />
          <br />
          Travel companion is a regular Traveler who is interested to help
          anyone traveling to USA or from USA.
          <br />
          Some Travel companion may request an Amazon gift card to keep them
          motivated for spending time and helping.
        </>
      }
      tabLabels={[
        "Post My Details",
        "Search For Travel Companion And Send A Message",
      ]}
      tabComponents={[<FindCompanionForm />, <FindAndSearchCompanion />]}
    />
  );
}

export default FindCompanion;
