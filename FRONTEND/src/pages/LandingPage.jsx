import Banner from "../components/Banner";
import Chat from "../components/Chat/Chat";
import Events from "../components/Events";
import Footer from "../components/Footer/Footer";
import Homes from "../components/Homes";
import Navbar from "../components/Navbar/Navbar";
import SearchAndFilter from "../components/SearchAndFilter";
import Services from "../components/Services";

function LandingPage() {
  return (
    <div>
      <Navbar />

      <div className="flex justify-center">
        <SearchAndFilter />
      </div>
      <div className="px-[7%] lg:px-[108px]">
        <div className="mt-[50px] pb-[30px]">
          <Services />
        </div>
        <div className="mt-[50px] pb-[30px]">
          <Events />
        </div>
        <div className="mt-[50px] pb-[30px]">
          <Homes />
        </div>
      </div>

      <div className="mt-[50px]">
        <Banner />
      </div>

      <div className="mt-[81px]">
        <Footer newsletter={"block"} />
      </div>
    </div>
  );
}

export default LandingPage;
