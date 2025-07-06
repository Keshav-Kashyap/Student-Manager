import React, { useState, useRef, useCallback } from 'react';
import { Camera, Upload, X, Crop, Check, RotateCcw } from 'lucide-react';

const PhotoUploadSection = ({ photoPreview, handlePhotoChange, removePhoto }) => {
  const [showCropper, setShowCropper] = useState(false);
  const [originalImage, setOriginalImage] = useState(null);
  const [cropData, setCropData] = useState({
    x: 0,
    y: 0,
    width: 200,
    height: 250
  });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeHandle, setResizeHandle] = useState(null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const canvasRef = useRef(null);
  const imageRef = useRef(null);

  const handleFileSelect = useCallback((event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setOriginalImage(e.target.result);
        setShowCropper(true);
        setCropData({
          x: 0,
          y: 0,
          width: 200,
          height: 250
        });
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleImageLoad = useCallback(() => {
    if (imageRef.current) {
      const img = imageRef.current;
      const containerWidth = 400;
      const containerHeight = 300;
      
      const scaleX = containerWidth / img.naturalWidth;
      const scaleY = containerHeight / img.naturalHeight;
      const scale = Math.min(scaleX, scaleY);
      
      const displayWidth = img.naturalWidth * scale;
      const displayHeight = img.naturalHeight * scale;
      
      setImageSize({ width: displayWidth, height: displayHeight });
      
      const cropWidth = Math.min(150, displayWidth - 20);
      const cropHeight = Math.min(180, displayHeight - 20);
      
      setCropData({
        x: (displayWidth - cropWidth) / 2,
        y: (displayHeight - cropHeight) / 2,
        width: cropWidth,
        height: cropHeight
      });
    }
  }, []);

  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
    const rect = e.currentTarget.parentElement.getBoundingClientRect();
    setDragStart({
      x: e.clientX - rect.left - cropData.x,
      y: e.clientY - rect.top - cropData.y
    });
  }, [cropData]);

  const handleResizeStart = useCallback((e, handle) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setResizeHandle(handle);
    const rect = e.currentTarget.parentElement.parentElement.getBoundingClientRect();
    setDragStart({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (isDragging && !isResizing) {
      const rect = e.currentTarget.getBoundingClientRect();
      const newX = e.clientX - rect.left - dragStart.x;
      const newY = e.clientY - rect.top - dragStart.y;
      
      const maxX = imageSize.width - cropData.width;
      const maxY = imageSize.height - cropData.height;
      
      setCropData(prev => ({
        ...prev,
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      }));
    } else if (isResizing && resizeHandle) {
      const rect = e.currentTarget.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      const imageLeft = (400 - imageSize.width) / 2;
      const imageTop = (300 - imageSize.height) / 2;
      
      const relativeX = mouseX - imageLeft;
      const relativeY = mouseY - imageTop;
      
      setCropData(prev => {
        let newCrop = { ...prev };
        
        switch (resizeHandle) {
          case 'se': // bottom-right
            newCrop.width = Math.max(50, Math.min(relativeX - prev.x, imageSize.width - prev.x));
            newCrop.height = Math.max(50, Math.min(relativeY - prev.y, imageSize.height - prev.y));
            break;
          case 'sw': // bottom-left
            const newWidth = Math.max(50, prev.x + prev.width - relativeX);
            const newX = Math.max(0, relativeX);
            newCrop.width = Math.min(newWidth, prev.x + prev.width);
            newCrop.x = newX;
            newCrop.height = Math.max(50, Math.min(relativeY - prev.y, imageSize.height - prev.y));
            break;
          case 'ne': // top-right
            const newHeight = Math.max(50, prev.y + prev.height - relativeY);
            const newY = Math.max(0, relativeY);
            newCrop.height = Math.min(newHeight, prev.y + prev.height);
            newCrop.y = newY;
            newCrop.width = Math.max(50, Math.min(relativeX - prev.x, imageSize.width - prev.x));
            break;
          case 'nw': // top-left
            const newWidthNW = Math.max(50, prev.x + prev.width - relativeX);
            const newHeightNW = Math.max(50, prev.y + prev.height - relativeY);
            const newXNW = Math.max(0, relativeX);
            const newYNW = Math.max(0, relativeY);
            newCrop.width = Math.min(newWidthNW, prev.x + prev.width);
            newCrop.height = Math.min(newHeightNW, prev.y + prev.height);
            newCrop.x = newXNW;
            newCrop.y = newYNW;
            break;
        }
        
        return newCrop;
      });
    }
  }, [isDragging, isResizing, resizeHandle, dragStart, imageSize, cropData.width, cropData.height]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeHandle(null);
  }, []);

  const applyCrop = useCallback(() => {
    if (!originalImage || !imageRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = imageRef.current;
    
    const scaleX = img.naturalWidth / imageSize.width;
    const scaleY = img.naturalHeight / imageSize.height;
    
    canvas.width = cropData.width;
    canvas.height = cropData.height;
    
    ctx.drawImage(
      img,
      cropData.x * scaleX,
      cropData.y * scaleY,
      cropData.width * scaleX,
      cropData.height * scaleY,
      0,
      0,
      cropData.width,
      cropData.height
    );
    
    canvas.toBlob((blob) => {
      const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.9);
      
      const fakeEvent = {
        target: {
          files: [blob]
        }
      };
      
      handlePhotoChange(fakeEvent, croppedDataUrl);
      setShowCropper(false);
      setOriginalImage(null);
    }, 'image/jpeg', 0.9);
  }, [originalImage, cropData, imageSize, handlePhotoChange]);

  const cancelCrop = useCallback(() => {
    setShowCropper(false);
    setOriginalImage(null);
  }, []);

  const resetCrop = useCallback(() => {
    const cropWidth = Math.min(150, imageSize.width - 20);
    const cropHeight = Math.min(180, imageSize.height - 20);
    
    setCropData({
      x: (imageSize.width - cropWidth) / 2,
      y: (imageSize.height - cropHeight) / 2,
      width: cropWidth,
      height: cropHeight
    });
  }, [imageSize]);

  return (
    <>
      {/* Cropping Modal */}
      {showCropper && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Crop className="text-blue-600" size={20} />
                Crop Photo
              </h3>
              <button
                onClick={cancelCrop}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mb-4">
              <div 
                className="relative mx-auto border border-gray-300 rounded-lg overflow-hidden bg-gray-100"
                style={{ width: '400px', height: '300px' }}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                <img
                  ref={imageRef}
                  src={originalImage}
                  alt="Original"
                  onLoad={handleImageLoad}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-full max-h-full object-contain"
                  style={{
                    width: imageSize.width,
                    height: imageSize.height
                  }}
                />
                
                {/* Dark overlay behind the crop area */}
                <div className="absolute inset-0 bg-black opacity-0 pointer-events-none" s />
                
                {/* Crop area with transparent background */}
                <div
                  className="absolute border-2 border-blue-400 cursor-move"
                  style={{
                    left: `calc(50% - ${imageSize.width/2}px + ${cropData.x}px)`,
                    top: `calc(50% - ${imageSize.height/2}px + ${cropData.y}px)`,
                    width: cropData.width,
                    height: cropData.height,
                    backgroundColor: 'transparent',
                    boxShadow: '0 0 0 9999px rgba(0,0,0,0.5)'
                  }}
                  onMouseDown={handleMouseDown}
                >
                  {/* Resize handles */}
                  <div 
                    className="absolute -top-2 -left-2 w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-nw-resize shadow-md"
                    onMouseDown={(e) => handleResizeStart(e, 'nw')}
                  ></div>
                  <div 
                    className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-ne-resize shadow-md"
                    onMouseDown={(e) => handleResizeStart(e, 'ne')}
                  ></div>
                  <div 
                    className="absolute -bottom-2 -left-2 w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-sw-resize shadow-md"
                    onMouseDown={(e) => handleResizeStart(e, 'sw')}
                  ></div>
                  <div 
                    className="absolute -bottom-2 -right-2 w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-se-resize shadow-md"
                    onMouseDown={(e) => handleResizeStart(e, 'se')}
                  ></div>
                  
                  {/* Center indicator */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-blue-400 rounded-full pointer-events-none"></div>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <button
                onClick={resetCrop}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <RotateCcw size={16} />
                Reset
              </button>
              
              <div className="flex gap-3">
                <button
                  onClick={cancelCrop}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={applyCrop}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Check size={16} />
                  Apply Crop
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Original PhotoUploadSection */}
      <div className="border-b border-gray-100 pb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
          <Camera className="text-blue-600" size={22} />
          Student Photo
        </h2>

        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="flex flex-col items-center">
            <div className="w-32 h-40 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center bg-gray-50 overflow-hidden">
              {photoPreview ? (
                <img src={photoPreview} alt="Student Preview" className="w-full h-full object-cover rounded-xl" />
              ) : (
                <div className="text-center">
                  <Camera className="mx-auto text-gray-400 mb-2" size={32} />
                  <p className="text-xs text-gray-500">Photo Preview</p>
                </div>
              )}
            </div>
            {photoPreview && (
              <button
                type="button"
                onClick={removePhoto}
                className="mt-2 text-red-500 hover:text-red-700 text-sm flex items-center gap-1"
              >
                <X size={14} />
                Remove
              </button>
            )}
          </div>

          <div className="flex-1 space-y-3">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Upload size={16} className="text-gray-500" />
              Upload Student Photo
            </label>

            <div className="space-y-2">
              <input 
                id="photo-upload" 
                type="file" 
                accept="image/*" 
                onChange={handleFileSelect} 
                className="hidden" 
              />
              <label
                htmlFor="photo-upload"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer border border-blue-200"
              >
                <Upload size={16} />
                Choose Photo
              </label>
              <p className="text-xs text-gray-500">Supported formats: JPG, PNG, GIF (Max 5MB)</p>
              <p className="text-xs text-blue-600">✨ After upload, you can crop your photo to the perfect size!</p>
            </div>
          </div>
        </div>

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </>
  );
};

export default PhotoUploadSection;