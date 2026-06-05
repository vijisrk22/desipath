import ButtonRight from "./ButtonRight";

function HeadingAndButton({ description, buttonText, path, disable = false, orangeArrow = false, variant = "p" }) {
  const isH1 = variant === "h1";
  return (
    <div className="flex-grow w-full">
      <div className="flex flex-col justify-center items-center lg:items-start">
        {isH1 ? (
           <h1 className="text-[16px] md:text-[20px] leading-[1.2] mb-[20px] text-gray-800 font-medium font-dmsans text-center lg:text-start">
             {description}
           </h1>
        ) : (
           <p className="text-[20px] md:text-[24px] leading-[1.5] mb-[20px] text-gray-800 font-medium font-dmsans text-center lg:text-start">
             {description}
           </p>
        )}
        <div className="flex justify-center lg:justify-start w-full">
          <ButtonRight 
            text={buttonText} 
            path={path} 
            disabled={disable} 
            paddingClass="py-[18px] px-[30px] w-fit min-w-[280px] !rounded-[40px]"
            textClass="text-[18px] font-bold"
            orangeArrow={orangeArrow}
          />
        </div>
      </div>
    </div>
  );
}

export default HeadingAndButton;
