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
      className={`rounded-[30px] flex justify-center items-center gap-3.5 transition-all ${
        paddingClass || "px-6 py-2 md:px-6 md:py-4"
      } ${
        disabled
          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
          : "bg-[#ffa41c] text-gray-800 hover:brightness-110 cursor-pointer"
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
