import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloseIcon from "@mui/icons-material/Close"; // Import CloseIcon
import api from "../../utils/api";

function PhotoUpload({ images, setImages, title = "Upload Photos (Max 10)" }) {
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));
    setImages((prev) => [...prev, ...imageFiles].slice(0, 10)); // Max 10 images
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));
    setImages((prev) => [...prev, ...imageFiles].slice(0, 10));
  };

  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index)); // Remove image by index
  };

  return (
    <div className="flex flex-col items-center gap-4 mt-2 ">
      <div className="text-gray-800 text-lg w-full font-medium font-dmsans">
        {title}
      </div>

      <div
        className="w-full p-6 bg-white rounded-lg border-2 border-dashed border-[#ffa41c] flex flex-col justify-center items-center gap-3 cursor-pointer"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <CloudUploadIcon fontSize="large" color="primary" />

        <div className="flex flex-col items-center gap-2">
          <div className="flex gap-1 text-sm">
            <span className="text-gray-800 font-dmsans">
              Drag your file(s) or
            </span>
            <label className="text-[#ffa41c] font-semibold cursor-pointer font-dmsans">
              browse
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </div>
          <p className="text-sm text-[#6d6d6d] font-dmsans">
            Max 10 MB files are allowed
          </p>
        </div>
      </div>
      <div className="justify-start w-full text-[#6d6d6d] text-sm font-normal font-dmsans">
        Only support .jpg, .png, and .svg files
      </div>

      {/* Image Previews */}
      <div className="grid grid-cols-5 gap-2">
        {images.map((image, index) => {
          const isFile = image instanceof File;
          const imageUrl = isFile
            ? URL.createObjectURL(image)
            : `${api.defaults.baseURL}/${image}`;
          return (
            <div key={index} className="relative">
              <img
                src={imageUrl}
                alt="Uploaded"
                className="w-40 h-40 object-cover rounded-lg shadow-md"
              />
              <button
                onClick={() => handleRemoveImage(index)}
                className="absolute top-2 right-1 bg-black text-white rounded-full p-1"
              >
                <CloseIcon fontSize="small" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PhotoUpload;
