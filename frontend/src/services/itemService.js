// src/services/itemService.js
import axios from "axios";

export const getItems = async () => {
  try {
    const response = await axios.get("/api/items");
    return response.data;
  } catch (error) {
    console.error("Error fetching items:", error); // Detailed error logging
    return []; // Return an empty array to avoid breaking the app
  }
};
