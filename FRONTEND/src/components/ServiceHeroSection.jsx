import { useSelector } from "react-redux";
import HeadingAndButton from "./HeadingAndButton";

function ServiceHeroSection({ pageDetails, bgImg, orangeArrow = false }) {
  return (
    <div
      className={`flex flex-wrap-reverse justify-between items-center py-8 px-[7%] w-full`}
    >
      <div
        className={`flex flex-col gap-4 text-start ${bgImg ? "flex-1 max-w-lg" : ""
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
        <div className="md:bg-transparent flex justify-center">
          <img
            src={bgImg}
            className="h-[250px] md:h-[350px] lg:h-[400px] xl:h-[450px] w-auto object-contain"
            alt="Hero Service"
          />
        </div>
      ) : (
        <div className="">
          <img
            src="/servicesHeroImg.jpg"
            className="h-[250px] md:h-[350px] lg:h-[400px] xl:h-auto w-auto"
          />
        </div>
      )}
    </div>
  );
}

export default ServiceHeroSection;
