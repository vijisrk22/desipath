import { useSelector } from "react-redux";
import HeadingAndButton from "./HeadingAndButton";

function ServiceHeroSection({ pageDetails, bgImg, orangeArrow = false }) {
  return (
    <div
      className={`flex flex-wrap-reverse justify-between items-center py-8 px-[7%] w-full`}
    >
      <div
        className={`flex flex-col gap-4 text-center lg:text-start w-full lg:w-auto items-center lg:items-start ${bgImg ? "flex-1 max-w-lg" : ""
          }`}
      >
        <HeadingAndButton
          description={pageDetails?.description1}
          buttonText={pageDetails?.buttonText1}
          path={pageDetails?.path1}
          orangeArrow={orangeArrow}
        />

        <HeadingAndButton
          description={pageDetails?.description2}
          buttonText={pageDetails?.buttonText2}
          path={pageDetails?.path2}
          orangeArrow={orangeArrow}
        />
      </div>

      {bgImg ? (
        <div className="md:bg-transparent flex justify-center w-full lg:w-auto mb-6 lg:mb-0">
          <img
            src={bgImg}
            className="h-[200px] md:h-[280px] lg:h-[320px] xl:h-[380px] w-auto object-contain rounded-2xl shadow-md"
            alt="Hero Service"
          />
        </div>
      ) : (
        <div className="flex justify-center w-full lg:w-auto mb-6 lg:mb-0">
          <img
            src="/servicesHeroImg.jpg"
            className="h-[200px] md:h-[280px] lg:h-[320px] xl:h-[380px] w-auto object-contain rounded-2xl shadow-md"
            alt="Hero Service"
          />
        </div>
      )}
    </div>
  );
}

export default ServiceHeroSection;
