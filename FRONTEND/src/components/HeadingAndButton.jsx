import ButtonRight from "./ButtonRight";

function HeadingAndButton({ description, buttonText, path, disable = false }) {
  return (
    <div className="flex-grow">
      <div className="p-3 flex flex-col justify-center items-center lg:items-start gap-5 ">
        <div className="max-w-[380px] md:max-w-[500px] text-gray-800 text-xl sm:text-[22px] md:text-[25px] lg:text-[29px] font-medium font-dmsans">
          {description}
        </div>
        <div>
          <ButtonRight text={buttonText} path={path} disabled={disable} />
        </div>
      </div>
    </div>
  );
}

export default HeadingAndButton;
