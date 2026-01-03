function ReviewPostContent({ contents }) {
  return (
    <div className="mx-4 my-4">
      {contents.map((content, index) => (
        <div
          key={index}
          className="grid grid-cols-2 gap-4 border-b border-b-gray-300 py-2 "
        >
          <div className="text-gray-500 text-base font-medium font-dmsans">
            {content.text}
          </div>
          <div className=" text-gray-800 text-[17px] font-medium font-dmsans leading-tight ">
            {content.value}
          </div>
        </div>
      ))}
    </div>
  );
}

export default ReviewPostContent;
