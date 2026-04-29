function SearchButton({
  handleClick,
  textVisible = true,
  paddingClass = "px-4 py-2 md:px-7 md:py-3",
  imageClass = "size-5",
}) {
  return (
    <button
      type="submit"
      className={`bg-[#0857d0] rounded-full justify-start items-center gap-2.5 inline-flex hover:bg-[#0746a8] transition-colors ${paddingClass} `}
    >
      <img src="/search.svg" className={`${imageClass} brightness-0 invert`} />
      {textVisible && (
        <div className="text-center text-white text-[14px] lg:text-[16px] font-semibold font-dmsans">
          Go
        </div>
      )}
    </button>
  );
}
export default SearchButton;
