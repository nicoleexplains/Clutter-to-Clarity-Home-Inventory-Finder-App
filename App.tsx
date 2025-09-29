
import React, { useState, useCallback } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import type { InventoryLocation } from './types';
import { inventoryResponseSchema } from './constants';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import InventoryDisplay from './components/InventoryDisplay';
import Loader from './components/Loader';
import { fileToGenerativePart } from './utils/fileUtils';

const App: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryLocation[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string | undefined>(process.env.API_KEY);

  const handleAnalyzeImage = useCallback(async () => {
    if (!selectedFile) {
      setError("Please select an image first.");
      return;
    }

    if (!apiKey) {
      setError("API_KEY environment variable not set.");
      return;
    }
    
    setIsLoading(true);
    setError(null);

    try {
      const ai = new GoogleGenAI(apiKey);
      const imagePart = await fileToGenerativePart(selectedFile);

      const textPart = {
        text: `
          Analyze this image of a storage space. Identify every item, its quantity, and assign it a category (e.g., Clothing, Food, Electronics, Tools, Office Supplies, etc.). 
          Also, suggest a descriptive name for this storage location (e.g., "Kitchen Pantry - Top Shelf", "Office Drawer - Left").
          Return the response as a single JSON object.
        `,
      };

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [imagePart, textPart] },
        config: {
          responseMimeType: "application/json",
          responseSchema: inventoryResponseSchema,
        }
      });

      const parsedInventory = JSON.parse(response.text);
      setInventory(prev => [...prev, parsedInventory]);
      setSelectedFile(null); // Clear selection after analysis
    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
      setError(`Failed to analyze image. ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, [selectedFile, apiKey]);


  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-700 mb-2">Upload a Photo of Your Storage Space</h2>
          <p className="text-slate-500 mb-6">Let AI turn your clutter into a clear, searchable inventory.</p>
          
          <ImageUploader
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
            onAnalyze={handleAnalyzeImage}
            isLoading={isLoading}
          />

          {error && (
            <div className="mt-6 p-4 bg-red-100 text-red-700 border border-red-200 rounded-lg">
              <strong>Error:</strong> {error}
            </div>
          )}
        </div>

        {isLoading && !inventory.length && (
           <div className="mt-8 text-center">
             <Loader />
             <p className="text-slate-500 mt-4 text-lg">Analyzing your space... please wait.</p>
           </div>
        )}
        
        {inventory.length > 0 && (
          <div className="mt-12">
            <InventoryDisplay inventory={inventory} apiKey={apiKey} />
          </div>
        )}

        {!isLoading && inventory.length === 0 && (
            <div className="text-center mt-12 p-8 bg-white rounded-2xl shadow-lg border border-slate-200 max-w-4xl mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <h3 className="mt-4 text-xl font-semibold text-slate-700">Your inventory is empty</h3>
                <p className="mt-2 text-slate-500">Upload an image to start cataloging your items.</p>
            </div>
        )}

      </main>
    </div>
  );
};

export default App;
