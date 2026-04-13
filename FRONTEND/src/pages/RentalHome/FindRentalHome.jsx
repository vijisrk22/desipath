import Footer from "../../components/Footer/Footer";
import ServiceTopBar from "../../components/ServiceTopBar";

import RentalHomesList from "../../components/RentalHome/RentalHomesList";
import ActiveSearchFilters from "../../components/RentalHome/ActiveSearchFilters";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { resetSearchState } from "../../store/RentalHomesSlice";

function FindRentalHome() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(resetSearchState());
  }, [dispatch]);

  const inputs = ["location", "type"];
  const paths = [
    { text: "Home", eP: "/" },
    { text: "Rental Home", eP: "/services/rentalHomes" },
    { text: "Find Rental Home", eP: "/services/rentalHomes/findRentalHome" },
  ];
  return (
    <div className="bg-[#f3f5f7]">
      <ServiceTopBar inputs={inputs} title="Rent a Home" paths={paths} />
      <div className="flex flex-col-reverse md:flex-row justify-between items-start md:items-center px-[7%] pt-6">
        <ActiveSearchFilters />
        <a
          href="/services/rentalHomes/postRentalHome"
          className="px-6 py-2.5 bg-[#ffa41c] hover:bg-[#ff9900] transition-colors rounded-[57px] text-gray-800 text-base font-bold font-dmsans whitespace-nowrap self-end md:self-auto mb-4 md:mb-0 shadow-sm"
        >
          Post Rental Home
        </a>
      </div>
      <RentalHomesList />
      <Footer bgColor="bg-white" />
    </div>
  );
}

export default FindRentalHome;
