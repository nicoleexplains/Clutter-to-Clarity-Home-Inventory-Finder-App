
import { Type } from "@google/genai";
import type { Schema } from "@google/genai";

export const inventoryResponseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    location_suggestion: {
      type: Type.STRING,
      description: "A descriptive name for the storage location shown in the image.",
    },
    items: {
      type: Type.ARRAY,
      description: "A list of all items identified in the storage location.",
      items: {
        type: Type.OBJECT,
        properties: {
          name: {
            type: Type.STRING,
            description: "The specific name of the item.",
          },
          quantity: {
            type: Type.INTEGER,
            description: "The count of this specific item.",
          },
          category: {
            type: Type.STRING,
            description: "A general category for the item (e.g., Clothing, Food, Electronics, Tools)."
          },
        },
        required: ["name", "quantity", "category"],
      },
    },
  },
  required: ["location_suggestion", "items"],
};
