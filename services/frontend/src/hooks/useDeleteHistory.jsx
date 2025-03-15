import { useState } from "react";

/**
 * Custom hook to handle deleting history.
 * It manages the deletion process, updates the state, and provides loading feedback.
 *
 * @param {Function} deleteAllHistory - Function to delete all history items.
 * @param {Function} setItems - Function to update the items state after deletion.
 * @param {Function} setCount - Function to reset the count after deletion.
 * @returns {Object} - An object containing the delete handler and loading state.
 */
const useDeleteHistory = (deleteAllHistory, setItems, setCount) => {
  const [isDeleting, setIsDeleting] = useState(false);

  /**
   * Handles deleting the history by calling the provided delete function,
   * then updating the state accordingly.
   */
  const handleDeleteHistory = async () => {
    setIsDeleting(true);
    try {
      await deleteAllHistory(); // Calls the function to delete history
      setItems([]); // Clears the items list
      setCount(0); // Resets the count
    } catch (error) {
      console.error("Error deleting history:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return { handleDeleteHistory, isDeleting };
};

export default useDeleteHistory;
