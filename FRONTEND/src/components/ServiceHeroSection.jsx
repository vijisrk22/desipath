import { useSelector } from "react-redux";
import HeadingAndButton from "./HeadingAndButton";

function ServiceHeroSection({ pageDetails, bgImg, orangeArrow = false, noImage = false }) {
  return (
    <div
      className={`flex flex-wrap-reverse justify-between items-center py-8 px-[7%] w-full`}
    >
      <div
        className={`flex flex-col gap-4 text-center lg:text-start w-full items-center lg:items-start ${
          !noImage && bgImg ? "lg:w-auto flex-1 max-w-lg" : "lg:w-full max-w-2xl mx-auto lg:mx-0"
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

      {!noImage && (
        bgImg ? (
          <div className="md:bg-transparent flex justify-center w-full lg:w-auto mb-6 lg:mb-0">
            <img
              src={bgImg}
              className="h-[250px] md:h-[350px] lg:h-[400px] xl:h-[450px] w-auto object-contain"
              alt="Hero Service"
            />
          </div>
        ) : (
          <div className="flex justify-center w-full lg:w-auto mb-6 lg:mb-0">
            <img
              src="/servicesHeroImg.jpg"
              className="h-[250px] md:h-[350px] lg:h-[400px] xl:h-auto w-auto"
              alt="Hero Service"
            />
          </div>
        )
      )}
    </div>
  );
}

export default ServiceHeroSection;
