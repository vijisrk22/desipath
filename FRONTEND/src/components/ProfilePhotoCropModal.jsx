import React, { useState, useRef, useEffect } from 'react';

export default function ProfilePhotoCropModal({ isOpen, imageSrc, onCancel, onCropSave }) {
  const canvasRef = useRef(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  // HTML5 Native Cropper Logic
  useEffect(() => {
    if (!isOpen || !imageSrc || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const image = new Image();
    image.src = imageSrc;
    
    image.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const minDimension = Math.min(image.width, image.height);
      const scale = (canvas.width / minDimension) * zoom;
      
      const x = (canvas.width - image.width * scale) / 2 + pan.x;
      const y = (canvas.height - image.height * scale) / 2 + pan.y;
      
      ctx.save();
      // Only necessary if we want to visually clip to circle, but it's easier to overlay a circle div over it.
      ctx.drawImage(image, x, y, image.width * scale, image.height * scale);
      ctx.restore();
    };
  }, [isOpen, imageSrc, zoom, pan]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleSave = () => {
    if (!canvasRef.current) return;
    
    // We create a fresh 500x500 canvas to export the final cropped version
    const finalCanvas = document.createElement('canvas');
    finalCanvas.width = 500;
    finalCanvas.height = 500;
    const finalCtx = finalCanvas.getContext('2d');
    
    // Draw the active canvas into the final one
    finalCtx.drawImage(canvasRef.current, 0, 0, 500, 500);
    
    finalCanvas.toBlob((blob) => {
      onCropSave(blob);
    }, 'image/jpeg', 0.9);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl">
        <h3 className="text-xl font-bold text-gray-800 mb-4 font-dmsans">Crop Profile Photo</h3>
        
        <div className="relative w-full aspect-square bg-gray-100 rounded-xl overflow-hidden mb-4"
             onMouseDown={handleMouseDown}
             onMouseMove={handleMouseMove}
             onMouseUp={handleMouseUp}
             onMouseLeave={handleMouseUp}>
          
          <canvas 
            ref={canvasRef} 
            width={400} 
            height={400} 
            className="w-full h-full cursor-move"
          />
          
          {/* Circular Crop Overlay */}
          <div className="absolute inset-0 pointer-events-none" style={{
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
            borderRadius: '50%',
            border: '2px solid white'
          }} />
        </div>
        
        <div className="mb-6">
          <label className="text-sm font-semibold text-gray-600 block mb-2">Zoom</label>
          <input 
            type="range" 
            min="1" 
            max="3" 
            step="0.1" 
            value={zoom}
            onChange={(e) => setZoom(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
        
        <div className="flex justify-end gap-3">
          <button 
            onClick={onCancel}
            className="px-5 py-2 text-gray-600 font-semibold hover:bg-gray-100 rounded-full transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full transition-colors"
          >
            Crop & Save
          </button>
        </div>
      </div>
    </div>
  );
}
