import imageCompression from 'browser-image-compression';

export const convertImagesToBase64 = async (images) => {
  const options = {
    maxSizeMB: 0.2,         // Target size under 200 KB
    maxWidthOrHeight: 1024, // Resize if needed
    useWebWorker: true,
  };

  const compressedImages = await Promise.all(
    images.map((file) => imageCompression(file, options))
  );

  return Promise.all(
    compressedImages.map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    })
  );
};