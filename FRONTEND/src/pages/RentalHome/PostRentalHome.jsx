import Footer from "../../components/Footer/Footer";
import ServiceTopBar from "../../components/ServiceTopBar";

function PostRentalHome() {
  const paths = [
    { text: "Home", eP: "/" },
    { text: "Rental Home", eP: "/services/rentalHomes" },
    { text: "Post a Rental Home", eP: "/services/rentalHomes/postRentalHome" },
  ];

  return (
    <div className="bg-[#f3f5f7]">
      <div className="mb-20  h-auto">
        <ServiceTopBar
          title="Post Rental Home"
          paths={paths}
          form="rentalHome"
        />
      </div>
      <Footer bgColor="bg-white" />
    </div>
  );
}

export default PostRentalHome;
