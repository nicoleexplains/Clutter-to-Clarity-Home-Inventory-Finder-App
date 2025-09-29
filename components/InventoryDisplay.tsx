
import React, { useState, useMemo } from 'react';
import type { InventoryLocation } from '../types';
import LocationCard from './LocationCard';

interface InventoryDisplayProps {
  inventory: InventoryLocation[];
  apiKey: string | undefined;
}

const InventoryDisplay: React.FC<InventoryDisplayProps> = ({ inventory, apiKey }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredInventory = useMemo(() => {
    if (!searchTerm) return inventory;

    const lowercasedFilter = searchTerm.toLowerCase();
    
    return inventory.map(location => {
      const filteredItems = location.items.filter(item => 
        item.name.toLowerCase().includes(lowercasedFilter) ||
        item.category.toLowerCase().includes(lowercasedFilter)
      );
      // Return a new location object with only filtered items
      return { ...location, items: filteredItems };
    }).filter(location => location.items.length > 0); // Only include locations that still have items after filtering

  }, [searchTerm, inventory]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-800">Your Inventory</h2>
        <div className="mt-4 max-w-lg relative">
          <input
            type="text"
            placeholder="Search for items (e.g., 'hammer', 'tuna')..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 pl-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
          />
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
      
      {filteredInventory.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredInventory.map((location, index) => (
                <LocationCard key={`${location.location_suggestion}-${index}`} location={location} apiKey={apiKey} />
            ))}
        </div>
      ) : (
        <div className="text-center py-12 px-6 bg-white rounded-lg shadow-sm border">
            <h3 className="text-xl font-semibold text-slate-600">No results found</h3>
            <p className="text-slate-500 mt-2">Try adjusting your search term.</p>
        </div>
      )}
    </div>
  );
};

export default InventoryDisplay;
