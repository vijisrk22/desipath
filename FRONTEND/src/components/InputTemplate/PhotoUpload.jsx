import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloseIcon from "@mui/icons-material/Close"; // Import CloseIcon
import { getFullImageUrl } from "../../utils/imageHelper";
import { useState } from "react";
import { IoCropOutline } from "react-icons/io5";
import ImageCropModal from "../ImageCrop/ImageCropModal";

function PhotoUpload({ images, setImages, title = "Upload Photos (Max 10)" }) {
  const [croppingIndex, setCroppingIndex] = useState(null);

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

  const handleCropComplete = (croppedBase64) => {
    setImages((prev) => {
      const newList = [...prev];
      newList[croppingIndex] = croppedBase64;
      return newList;
    });
    setCroppingIndex(null);
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
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 w-full">
        {images.map((image, index) => {
          const isFile = image instanceof File;
          const imageUrl = isFile
            ? URL.createObjectURL(image)
            : getFullImageUrl(image);
          return (
            <div key={index} className="relative group aspect-square">
              <img
                src={imageUrl}
                alt="Uploaded"
                className="w-full h-full object-contain bg-gray-50 rounded-lg shadow-md border border-gray-100"
              />
              
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 rounded-lg">
                <button
                  type="button"
                  onClick={() => setCroppingIndex(index)}
                  className="p-1.5 bg-white text-blue-600 rounded-full shadow-lg transform hover:scale-110 transition-transform"
                >
                  <IoCropOutline size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="p-1.5 bg-white text-red-500 rounded-full shadow-lg transform hover:scale-110 transition-transform"
                >
                  <CloseIcon fontSize="small" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {croppingIndex !== null && (
        <ImageCropModal 
          imageSrc={images[croppingIndex] instanceof File ? URL.createObjectURL(images[croppingIndex]) : getFullImageUrl(images[croppingIndex])}
          onCropComplete={handleCropComplete}
          onCancel={() => setCroppingIndex(null)}
        />
      )}
    </div>
  );
}

export default PhotoUpload;
