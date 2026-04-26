import { getFullImageUrl } from "../../utils/imageHelper";

function ReviewPostContent({ contents, type = "reviewPost" }) {
  return (
    <div className="mx-4 my-4">
      {contents?.map((content, index) => (
        <div
          key={index}
          className="grid grid-cols-2 gap-4 border-b border-b-gray-300 py-2 "
        >
          <div className="text-gray-500 text-base font-medium font-dmsans">
            {content.text}
          </div>
          {content.text != "Photos" ? (
            <div className=" text-gray-800 text-[17px] font-medium font-dmsans leading-tight ">
              {content.value}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
              {content.value.map((image, index) => (
                <div key={index} className="relative aspect-square w-full">
                  <img
                    src={
                      image instanceof File 
                        ? URL.createObjectURL(image)
                        : getFullImageUrl(image)
                    }
                    alt="Uploaded"
                    className="w-full h-full object-cover rounded-lg shadow-md transition-opacity hover:opacity-90"
                    onLoad={(e) => {
                      if (image instanceof File) URL.revokeObjectURL(e.target.src);
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default ReviewPostContent;
