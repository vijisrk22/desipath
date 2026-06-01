import React, { useState, useRef, useEffect } from 'react';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { IoClose, IoCropOutline, IoCheckmark } from 'react-icons/io5';
import { getCroppedImg } from '../../utils/cropImage';

export default function ImageCropModal({ imageSrc, onCropComplete, onCancel }) {
  const [crop, setCrop] = useState();
  const [aspect, setAspect] = useState(4 / 5);
  const imgRef = useRef(null);

  function onImageLoad(e) {
    const { width, height } = e.currentTarget;
    const initialCrop = centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 90,
        },
        aspect,
        width,
        height
      ),
      width,
      height
    );
    setCrop(initialCrop);
  }

  useEffect(() => {
    if (imgRef.current && aspect) {
      const { width, height } = imgRef.current;
      const newCrop = centerCrop(
        makeAspectCrop(
          {
            unit: '%',
            width: 90,
          },
          aspect,
          width,
          height
        ),
        width,
        height
      );
      setCrop(newCrop);
    }
  }, [aspect]);

  const handleSave = async () => {
    if (imgRef.current && crop.width && crop.height) {
      try {
        const croppedBase64 = await getCroppedImg(imgRef.current, crop, 'cropped.jpg');
        onCropComplete(croppedBase64);
      } catch (e) {
        console.error('Error cropping image', e);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onCancel} />
      
      <div className="relative bg-white rounded-3xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <IoCropOutline size={22} className="text-blue-600" />
            <h3 className="text-lg font-bold text-gray-900">Crop Image</h3>
          </div>
          <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <IoClose size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-6 flex flex-col items-center bg-gray-50">
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            aspect={aspect}
            className="max-h-[60vh]"
          >
            <img
              ref={imgRef}
              src={imageSrc}
              alt="Crop target"
              onLoad={onImageLoad}
              style={{ maxWidth: '100%', maxHeight: '60vh' }}
            />
          </ReactCrop>
          
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button 
              onClick={() => setAspect(4/5)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${aspect === 4/5 ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-gray-600 border border-gray-200'}`}
            >
              Portrait (4:5)
            </button>
            <button 
              onClick={() => setAspect(1)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${aspect === 1 ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-gray-600 border border-gray-200'}`}
            >
              Square (1:1)
            </button>
            <button 
              onClick={() => setAspect(16/9)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${aspect === 16/9 ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-gray-600 border border-gray-200'}`}
            >
              Landscape (16:9)
            </button>
            <button 
              onClick={() => setAspect(undefined)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${aspect === undefined ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-gray-600 border border-gray-200'}`}
            >
              Free
            </button>
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 flex gap-3">
          <button 
            onClick={onCancel}
            className="flex-1 py-4 font-bold text-gray-500 hover:text-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="flex-[2] py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-xl shadow-blue-200 flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5"
          >
            <IoCheckmark size={20} />
            Apply Crop
          </button>
        </div>
      </div>
    </div>
  );
}
