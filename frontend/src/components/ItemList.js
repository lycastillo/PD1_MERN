import React, { useEffect, useState } from "react";
import { getItems } from "../services/itemService";

const ItemList = () => {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getItems();
        setItems(result);
      } catch (error) {
        console.error("Error in fetchData:", error);
        setError("Failed to load items. Please try again.");
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <h2>Items List</h2>
      {error ? (
        <p style={{ color: "red" }}>{error}</p> // Display error message if fetch fails
      ) : (
        <ul>
          {items.map((item) => (
            <li key={item._id}>{item.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ItemList;
