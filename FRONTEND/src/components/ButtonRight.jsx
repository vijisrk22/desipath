import { useNavigate } from "react-router-dom";

function ButtonRight({
  text,
  path,
  textClass = "",
  paddingClass = "",
  arrowVisible = true,
  disabled = false,
}) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (!disabled) {
      navigate(path);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`rounded-[30px] flex justify-center items-center gap-3.5 transition-all shadow-md ${
        paddingClass || "px-6 py-2 md:px-6 md:py-4"
      } ${
        disabled
          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
          : "bg-[#0857d0] text-white hover:bg-[#0746a8] cursor-pointer"
      }`}
    >
      <span
        className={`relative font-semibold font-dmsans ${
          textClass ? textClass : "text-sm sm:text-lg md:text-2xl"
        }`}
      >
        {text}
      </span>
      {arrowVisible && (
        <div className="w-8 h-8 relative overflow-hidden">
          <img
            src="/caretRight.png"
            className={`w-6 h-6 left-[4px] top-[4px] absolute ${
              disabled ? "opacity-50" : ""
            }`}
          />
        </div>
      )}
    </button>
  );
}

export default ButtonRight;
