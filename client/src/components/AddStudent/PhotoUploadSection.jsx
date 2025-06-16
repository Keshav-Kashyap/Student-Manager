import React from 'react';
import { Camera, Upload, X } from 'lucide-react';

const PhotoUploadSection = ({ photoPreview, handlePhotoChange, removePhoto }) => (
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
          <input id="photo-upload" type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
          <label
            htmlFor="photo-upload"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer border border-blue-200"
          >
            <Upload size={16} />
            Choose Photo
          </label>
          <p className="text-xs text-gray-500">Supported formats: JPG, PNG, GIF (Max 5MB)</p>
        </div>
      </div>
    </div>
  </div>
);

export default PhotoUploadSection;
