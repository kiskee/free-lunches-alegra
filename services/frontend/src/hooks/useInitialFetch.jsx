import { useState, useEffect } from "react";

/**
 * Custom hook to fetch initial data for count and items.
 * It handles loading, error states, and updates the state with fetched data.
 *
 * @param {Function} fetchCount - Function to fetch the total count.
 * @param {Function} fetchItems - Function to fetch the list of items.
 * @returns {Object} - An object containing count, items, loading state, error state, and setters.
 */
export const useInitialFetch = (fetchCount, fetchItems) => {
  const [count, setCount] = useState(0);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    /**
     * Fetches initial values for count and items.
     * Handles loading state and errors.
     */
    const setInitialValues = async () => {
      setLoading(true); // Start loading
      setError(null); // Reset previous errors

      try {
        // Fetch count and items simultaneously
        const [total, data] = await Promise.all([fetchCount(), fetchItems()]);

        setCount(total);
        setItems(data);
      } catch (err) {
        console.error("Error fetching initial values:", err);
        setError(err); // Store the error
      } finally {
        setLoading(false); // Stop loading (on success or error)
      }
    };

    setInitialValues();
  }, [fetchCount, fetchItems]);

  return { count, items, loading, error, setCount, setItems };
};
