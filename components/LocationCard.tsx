
import React, { useState, useCallback, useMemo } from 'react';
import type { InventoryLocation, Item } from '../types';
import ItemCard from './ItemCard';
import { GoogleGenAI } from "@google/genai";

interface LocationCardProps {
  location: InventoryLocation;
  apiKey: string | undefined;
  searchTerm: string;
  onUpdateItem: (itemIndex: number, updatedItem: Item) => void;
}

const LabelGeneratorModal: React.FC<{ label: string; onClose: () => void }> = ({ label, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center" onClick={e => e.stopPropagation()}>
            <h3 className="text-2xl font-bold text-slate-800 mb-4">Suggested Label</h3>
            <div className="p-4 bg-yellow-100 border-2 border-dashed border-yellow-300 rounded-lg">
                <p className="text-3xl font-mono text-yellow-900">{label}</p>
            </div>
            <button
                onClick={onClose}
                className="mt-6 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors"
            >
                Close
            </button>
        </div>
    </div>
);


const LocationCard: React.FC<LocationCardProps> = ({ location, apiKey, searchTerm, onUpdateItem }) => {
    const [isGeneratingLabel, setIsGeneratingLabel] = useState(false);
    const [suggestedLabel, setSuggestedLabel] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const filteredItems = useMemo(() => {
        if (!searchTerm) {
            return location.items;
        }
        const lowercasedFilter = searchTerm.toLowerCase();
        return location.items.filter(item =>
            item.name.toLowerCase().includes(lowercasedFilter) ||
            item.category.toLowerCase().includes(lowercasedFilter)
        );
    }, [searchTerm, location.items]);

    const handleGenerateLabel = useCallback(async () => {
        if (!apiKey) {
            setError("API Key is not configured.");
            return;
        }

        setIsGeneratingLabel(true);
        setError(null);
        
        const itemsSummary = location.items.map(item => `${item.name} (x${item.quantity})`).join(', ');
        const prompt = `Based on this list of items: ${itemsSummary}. Suggest a short, clear, and concise label for a storage bin containing them. The label should be no more than 4 words.`;

        try {
            const ai = new GoogleGenAI({apiKey});
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });
            setSuggestedLabel(response.text.replace(/"/g, '')); // Remove quotes from response
        } catch (e) {
            console.error(e);
            const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
            setError(`Failed to generate label: ${errorMessage}`);
        } finally {
            setIsGeneratingLabel(false);
        }
    }, [location.items, apiKey]);

    if (searchTerm && filteredItems.length === 0) {
        return null;
    }

    return (
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 flex flex-col h-full">
            <h3 className="text-xl font-bold text-slate-800 border-b pb-3 mb-4">{location.location_suggestion}</h3>
            <div className="flex-grow space-y-3 pr-2 -mr-2 overflow-y-auto" style={{maxHeight: '300px'}}>
                {location.items.map((item, index) => {
                    if (!filteredItems.includes(item)) {
                        return null;
                    }
                    return (
                        <ItemCard 
                            key={index} 
                            item={item}
                            onUpdate={(updatedItem) => onUpdateItem(index, updatedItem)} 
                        />
                    );
                })}
            </div>
            <div className="mt-6 pt-4 border-t">
                <button
                    onClick={handleGenerateLabel}
                    disabled={isGeneratingLabel}
                    className="w-full flex justify-center items-center px-4 py-2 bg-teal-500 text-white font-semibold rounded-lg shadow-md hover:bg-teal-600 disabled:bg-slate-400 transition-colors"
                >
                    {isGeneratingLabel ? 'Generating...' : 'Generate Bin Label'}
                </button>
                {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
            </div>
            {suggestedLabel && <LabelGeneratorModal label={suggestedLabel} onClose={() => setSuggestedLabel(null)} />}
        </div>
    );
};

export default LocationCard;
