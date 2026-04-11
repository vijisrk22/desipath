import { useParams } from "react-router-dom";
import Footer from "../../components/Footer/Footer";
import Navbar from "../../components/Navbar/Navbar";
import ServiceHeroSection from "../../components/ServiceHeroSection";

import FindClasses from "./FindClasses";
import PostClass from "./PostClass";
import PostConfirmation from "../PostConfirmation";

function ClassesForKids() {
  const { action } = useParams();

  const pageDetails = {
    path1: "findClasses",
    path2: "postClass",
    description1: "Find the Best Classes For Kids",
    description2: "Post a Class or Workshop for Kids",
    buttonText1: "Find Classes",
    buttonText2: "Post a Class",
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

      {action === "findClasses" && <FindClasses />}
      {action === "postClass" && <PostClass />}
      {action === "postConfirmation" && (
        <PostConfirmation 
          redirectTo="/services/classesForKids/findClasses" 
          message="Thanks for using Desipath. Your class is live!" 
        />
      )}
    </div>
  );
}

export default ClassesForKids;
