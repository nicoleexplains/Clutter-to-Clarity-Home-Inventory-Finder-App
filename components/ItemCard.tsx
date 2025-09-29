
import React, { useState, useEffect } from 'react';
import type { Item } from '../types';

interface ItemCardProps {
  item: Item;
  onUpdate: (updatedItem: Item) => void;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedItem, setEditedItem] = useState<Item>(item);

  useEffect(() => {
    setEditedItem(item);
  }, [item]);

  const handleSave = () => {
    onUpdate(editedItem);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedItem(item); // Reset changes
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedItem(prev => ({
      ...prev,
      [name]: name === 'quantity' ? parseInt(value, 10) || 0 : value,
    }));
  };

  if (isEditing) {
    return (
      <div className="bg-slate-50 p-3 rounded-lg border border-blue-300 shadow-inner">
        <div className="flex flex-col gap-2">
          <input
            type="text"
            name="name"
            value={editedItem.name}
            onChange={handleInputChange}
            className="w-full p-1 border border-slate-300 rounded-md text-sm font-semibold"
            placeholder="Item Name"
            aria-label="Item Name"
          />
          <div className="flex gap-2">
            <input
              type="number"
              name="quantity"
              value={editedItem.quantity}
              onChange={handleInputChange}
              className="w-1/3 p-1 border border-slate-300 rounded-md text-sm"
              placeholder="Qty"
              aria-label="Item Quantity"
            />
            <input
              type="text"
              name="category"
              value={editedItem.category}
              onChange={handleInputChange}
              className="w-2/3 p-1 border border-slate-300 rounded-md text-sm"
              placeholder="Category"
              aria-label="Item Category"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-2">
          <button onClick={handleCancel} className="p-1 text-slate-500 hover:text-slate-700" aria-label="Cancel edit">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <button onClick={handleSave} className="p-1 text-green-600 hover:text-green-800" aria-label="Save changes">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex justify-between items-center group">
      <div>
        <p className="font-semibold text-slate-700">{item.name}</p>
        <p className="text-xs text-slate-500 bg-slate-200 inline-block px-2 py-0.5 rounded-full mt-1">{item.category}</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="font-bold text-lg text-blue-600">{item.quantity}</p>
          <p className="text-xs text-slate-400">items</p>
        </div>
        <button onClick={() => setIsEditing(true)} className="p-2 text-slate-400 rounded-full hover:bg-slate-200 hover:text-slate-600 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity" aria-label={`Edit ${item.name}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L16.732 3.732z" /></svg>
        </button>
      </div>
    </div>
  );
};

export default ItemCard;
