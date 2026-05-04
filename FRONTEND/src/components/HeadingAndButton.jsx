import ButtonRight from "./ButtonRight";

function HeadingAndButton({ description, buttonText, path, disable = false, orangeArrow = false }) {
  return (
    <div className="flex-grow w-full">
      <div className="py-2 flex flex-col justify-center items-center lg:items-start gap-3">
        <div className="max-w-[300px] md:max-w-[400px] text-gray-800 text-lg sm:text-[18px] md:text-[20px] lg:text-[22px] font-medium font-dmsans leading-tight text-center lg:text-start">
          {description}
        </div>
        <div className="flex justify-center lg:justify-start w-full">
          <ButtonRight 
            text={buttonText} 
            path={path} 
            disabled={disable} 
            paddingClass="px-5 py-2"
            textClass="text-sm md:text-base font-bold"
            orangeArrow={orangeArrow}
          />
        </div>
      </div>
    </div>
  );
}

export default HeadingAndButton;
