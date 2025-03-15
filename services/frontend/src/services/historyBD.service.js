import axios from "axios";

/**
 * Fetch all history items from the API.
 * @returns {Promise<any[]>} A list of history items or an empty array if an error occurs.
 */
export const fetchHistoryItems = async () => {
  try {
    const response = await axios.get("api/order/history-records");

    if (response.status != 200) {
      throw new Error("Error retrieving data");
    }
    return await response.data;
  } catch (error) {
    console.error("Error in fetchHistoryItems:", error);
    return [];
  }
};

/**
 * Fetch the total count of history records from the API.
 * @returns {Promise<number>} The number of history records or 0 if an error occurs.
 */
export const fetchHistoryItemCount = async () => {
  try {
    const response = await axios.get("api/order/history");
    if (response.status != 200) {
      throw new Error("Error retrieving record count");
    }
    return response.data; // Assuming the backend responds with { count: 10 }
  } catch (error) {
    console.error("Error in fetchHistoryItemCount:", error);
    return 0;
  }
};

/**
 * Delete all history records from the API.
 * @returns {Promise<string | number>} A success message or 0 if an error occurs.
 */
export const deleteAllHistory = async () => {
  try {
    const response = await axios.delete("api/order/delete-history");
    if (response.status != 200) {
      throw new Error("Error deleting records");
    }
    return response.message;
  } catch (error) {
    console.error("Error in deleteAllHistory:", error);
    return 0;
  }
};

/**
 * Fetch all status items from the API.
 * @returns {Promise<any[]>} A list of status items or an empty array if an error occurs.
 */
export const fetchStatusItems = async () => {
  try {
    const response = await axios.get("api/order/status-records");

    if (response.status != 200) {
      throw new Error("Error retrieving data");
    }
    return await response.data;
  } catch (error) {
    console.error("Error in fetchStatusItems:", error);
    return [];
  }
};

/**
 * Fetch the total count of status records from the API.
 * @returns {Promise<number>} The number of status records or 0 if an error occurs.
 */
export const fetchStatusItemCount = async () => {
  try {
    const response = await axios.get("api/order/status");
    if (response.status != 200) {
      throw new Error("Error retrieving record count");
    }
    return response.data; // Assuming the backend responds with { count: 10
  } catch (error) {
    console.error("Error en fetchItemCount:", error);
    return 0;
  }
};

/**
 * Delete all status records from the API.
 * @returns {Promise<string | number>} A success message or 0 if an error occurs.
 */
export const deleteAllStatus = async () => {
  try {
    const response = await axios.delete("api/order/delete-status");
    if (response.status != 200) {
      throw new Error("Error deleting records");
    }
    return response.message;
  } catch (error) {
    console.error("Error in deleteAllStatus:", error);
    return 0;
  }
};
