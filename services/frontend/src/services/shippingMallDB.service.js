import axios from "axios";

/**
 * Fetch all trip records from the API.
 * @returns {Promise<any[]>} A list of trip records or an empty array if an error occurs.
 */
export const fetchTripsItems = async () => {
  try {
    const response = await axios.get("mall/supply/trips-records");

    if (response.status != 200) {
      throw new Error("Error al obtener los datos");
    }
    return await response.data;
  } catch (error) {
    console.error("Error in fetchTripsItems:", error);
    return [];
  }
};

/**
 * Fetch the total count of trip records from the API.
 * @returns {Promise<number>} The number of trip records or 0 if an error occurs.
 */
export const fetchTripsItemCount = async () => {
  try {
    const response = await axios.get("mall/supply/trips");
    if (response.status != 200) {
      throw new Error("Error retrieving record count");
    }
    return response.data; // Suponiendo que el backend responde con { count: 10 }
  } catch (error) {
    console.error("Error in fetchTripsItemCount:", error);
    return 0;
  }
};

/**
 * Delete all trip records from the API.
 * @returns {Promise<string | number>} A success message or 0 if an error occurs.
 */
export const deleteAlltrips = async () => {
  try {
    const response = await axios.delete("mall/supply/delete-trips");
    if (response.status != 200) {
      throw new Error("Error deleting records");
    }
    return response.message;
  } catch (error) {
    console.error("Error in deleteAllTrips:", error);
    return 0;
  }
};
