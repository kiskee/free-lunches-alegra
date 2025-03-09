const ShoppingMall = require("./models/ShoppingMall");

/**
 * Service class for interacting with the ShoppingMall database collection.
 * This service provides methods for CRUD operations on shopping mall records.
 */
class ShoppingMallDBService {
  /**
   * Creates a new shopping mall record in the database.
   * @param {Object} data - The data to insert into the ShoppingMall collection.
   * @returns {Promise<Object>} - The created document.
   */
  async createShoppingMallRecord(data) {
    return await ShoppingMall.create(data);
  }

  /**
   * Counts the total number of shopping mall records in the database.
   * @returns {Promise<number>} - The total count of records.
   * @throws {Error} - If there is an issue counting the records.
   */
  async countTripsRecords() {
    try {
      const count = await ShoppingMall.countDocuments();
      return count;
    } catch (error) {
      console.error("🔴 Error while counting records:", error);
      throw new Error("Failed to count records");
    }
  }

  /**
   * Deletes all records from the ShoppingMall collection.
   * @returns {Promise<number>} - The number of deleted records.
   * @throws {Error} - If there is an issue deleting the records.
   */
  async deleteAllRecords() {
    try {
      const result = await ShoppingMall.deleteMany({});
      return result.deletedCount; // Number of deleted records
    } catch (error) {
      console.error("🔴 Error while deleting records:", error);
      throw new Error("Failed to delete records");
    }
  }

  /**
   * Retrieves up to 500 records from the ShoppingMall collection, sorted by newest first.
   * @returns {Promise<Array>} - An array of shopping mall records.
   * @throws {Error} - If there is an issue retrieving the records.
   */
  async getAllItems() {
    try {
      const result = await ShoppingMall.find().sort({ _id: -1 }).limit(500);
      return result;
    } catch (error) {
      console.error("🔴 Error while retrieving records:", error);
      throw new Error("Failed to retrieve records");
    }
  }
}

// Export a singleton instance of the service for use in the application.
module.exports = new ShoppingMallDBService();
