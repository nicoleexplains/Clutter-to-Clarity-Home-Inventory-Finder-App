
export interface Item {
  name: string;
  quantity: number;
  category: string;
}

export interface InventoryLocation {
  location_suggestion: string;
  items: Item[];
}
