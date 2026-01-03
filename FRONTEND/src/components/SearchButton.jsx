function SearchButton({
  handleClick,
  textVisible = true,
  paddingClass = "px-4 py-2 md:px-7 md:py-3",
  imageClass = "size-5",
}) {
  return (
    <button
      type="submit"
      className={`bg-[#ffa41c] rounded-full justify-start items-center gap-2.5 inline-flex ${paddingClass} `}
    >
      <img src="/search.svg" className={imageClass} />
      {textVisible && (
        <div className="text-center text-gray-800 hidden md:block md:text-[18px] lg:text-[22px] font-semibold font-dmsans">
          Search
        </div>
      )}
    </button>
  );
}
export default SearchButton;
