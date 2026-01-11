import Footer from "../../components/Footer/Footer";
import ServiceTopBar from "../../components/ServiceTopBar";

import RentalHomesList from "../../components/RentalHome/RentalHomesList";
import ActiveSearchFilters from "../../components/RentalHome/ActiveSearchFilters";

function FindRentalHome() {
  const inputs = ["location", "type"];
  const paths = [
    { text: "Home", eP: "/" },
    { text: "Rental Home", eP: "/services/rentalHomes" },
    { text: "Find Rental Home", eP: "/services/rentalHomes/findRentalHome" },
  ];
  return (
    <div className="bg-[#f3f5f7]">
      <ServiceTopBar inputs={inputs} title="Rent a Home" paths={paths} />
      <div className="flex justify-end px-20 pt-5">
        <a
          href="/services/rentalHomes/postRentalHome"
          className="px-5 py-2.5 bg-[#ffa41c] rounded-[57px] text-gray-800 text-base font-bold font-dmsans"
        >
          Post Rental Home
        </a>
      </div>
      <ActiveSearchFilters />
      <RentalHomesList />
      <Footer bgColor="bg-white" />
    </div>
  );
}

export default FindRentalHome;
