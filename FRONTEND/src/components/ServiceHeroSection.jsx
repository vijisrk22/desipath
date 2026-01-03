import { useSelector } from "react-redux";
import HeadingAndButton from "./HeadingAndButton";

function ServiceHeroSection({ pageDetails, bgImg }) {
  return (
    <div
      className={`flex flex-wrap-reverse justify-center sm:items-center ${
        bgImg ? "sm:justify-between" : "sm:justify-around py-16"
      } px-4`}
    >
      <div
        className={`flex flex-col gap-[30px] m-4 text-center sm:text-start ${
          bgImg ? "flex-1 max-w-md mx-auto " : ""
        }`}
      >
        <HeadingAndButton
          description={pageDetails.description1}
          buttonText={pageDetails.buttonText1}
          path={pageDetails.path1}
        />

        <HeadingAndButton
          description={pageDetails.description2}
          buttonText={pageDetails.buttonText2}
          path={pageDetails.path2}
        />
      </div>

      {bgImg ? (
        <div className="bg-black md:bg-transparent">
          <img src={bgImg} className="w-auto h-auto" />
        </div>
      ) : (
        <div className="">
          <img
            src="/servicesHeroImg.jpg"
            className="h-[350px] md:h-[500px] lg:h-[550px] xl:h-auto w-auto"
          />
        </div>
      )}
    </div>
  );
}

export default ServiceHeroSection;
