import { useSelector } from "react-redux";
import HeadingAndButton from "./HeadingAndButton";

function ServiceHeroSection({ pageDetails, bgImg, orangeArrow = false }) {
  return (
    <div
      className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-[60px] max-w-[1400px] mx-auto py-8 px-[7%] lg:py-[60px] lg:px-[80px] w-full"
    >
      <div
        className="flex-1 max-w-[500px] w-full flex flex-col gap-[40px] text-center lg:text-start items-center lg:items-start"
      >
        <HeadingAndButton
          description={pageDetails?.description1}
          buttonText={pageDetails?.buttonText1}
          path={pageDetails?.path1}
          orangeArrow={orangeArrow}
          variant="h1"
        />

        <HeadingAndButton
          description={pageDetails?.description2}
          buttonText={pageDetails?.buttonText2}
          path={pageDetails?.path2}
          orangeArrow={orangeArrow}
          variant="h1"
        />
      </div>

      <div className="flex-[1.2] flex justify-center w-full lg:w-auto mt-6 lg:mt-0">
        <img
          src={bgImg || "/servicesHeroImg.jpg"}
          className="w-full max-w-[700px] h-auto rounded-[24px] object-cover block shadow-md"
          alt="Hero Service"
        />
      </div>
    </div>
  );
}

export default ServiceHeroSection;
