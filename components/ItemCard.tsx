
import React from 'react';
import type { Item } from '../types';

interface ItemCardProps {
  item: Item;
}

const ItemCard: React.FC<ItemCardProps> = ({ item }) => {
  return (
    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex justify-between items-center">
      <div>
        <p className="font-semibold text-slate-700">{item.name}</p>
        <p className="text-xs text-slate-500 bg-slate-200 inline-block px-2 py-0.5 rounded-full mt-1">{item.category}</p>
      </div>
      <div className="text-right">
        <p className="font-bold text-lg text-blue-600">{item.quantity}</p>
        <p className="text-xs text-slate-400">items</p>
      </div>
    </div>
  );
};

export default ItemCard;
