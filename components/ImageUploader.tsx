
import React, { useRef, useState, useEffect } from 'react';
import Loader from './Loader';

interface ImageUploaderProps {
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
  onAnalyze: () => void;
  isLoading: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ selectedFile, setSelectedFile, onAnalyze, isLoading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (selectedFile) {
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl); // Cleanup
    } else {
      setPreviewUrl(null);
    }
  }, [selectedFile]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleSelectClick = () => {
    fileInputRef.current?.click();
  };

  const handleClear = () => {
    setSelectedFile(null);
  }

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      {!previewUrl && (
        <div 
            className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-slate-50 transition-colors"
            onClick={handleSelectClick}
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="mt-2 text-slate-600">Click to upload or drag & drop an image</p>
            <p className="text-xs text-slate-400 mt-1">PNG, JPG, WEBP up to 10MB</p>
        </div>
      )}

      {previewUrl && (
        <div className="mt-4 p-4 border border-slate-200 rounded-lg bg-slate-50">
          <img src={previewUrl} alt="Preview" className="max-h-80 w-auto mx-auto rounded-md shadow-sm" />
        </div>
      )}
      
      <div className="mt-6 flex flex-col sm:flex-row gap-4">
        <button
          onClick={onAnalyze}
          disabled={!selectedFile || isLoading}
          className="w-full sm:w-auto flex-grow flex justify-center items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all"
        >
          {isLoading ? (
              <>
                <Loader />
                <span className="ml-2">Analyzing...</span>
              </>
          ) : (
            '✨ Analyze with AI'
          )}
        </button>
        {selectedFile && (
           <button
           onClick={handleClear}
           disabled={isLoading}
           className="w-full sm:w-auto px-6 py-3 bg-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-300 disabled:opacity-50 transition-colors"
         >
           Clear
         </button>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
