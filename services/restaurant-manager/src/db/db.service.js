const History = require("./models/History");

/**
 * Service class for handling operations related to the history records.
 */
class HistoryService {
  /**
   * Creates a new history record.
   * @param {Object} data - The history data to be stored.
   * @returns {Promise<Object>} The created history record.
   */
  async createHistoryRecord(data) {
    return await History.create(data);
  }

  /**
   * Counts the total number of history records.
   * @returns {Promise<number>} The count of records.
   */
  async countRecords() {
    try {
      return await History.countDocuments();
    } catch (error) {
      throw new Error("Error counting records");
    }
  }

  /**
   * Deletes all history records.
   * @returns {Promise<number>} The number of deleted records.
   */
  async deleteAllRecords() {
    try {
      const result = await History.deleteMany({});
      return result.deletedCount;
    } catch (error) {
      throw new Error("Error deleting records");
    }
  }

  /**
   * Retrieves all history records, sorted by date in descending order, limited to 100 entries.
   * @returns {Promise<Array>} The list of history records.
   */
  async getAllItems() {
    try {
      return await History.find().sort({ date: -1 }).limit(200);
    } catch (error) {
      throw new Error("Error retrieving records");
    }
  }
}

module.exports = new HistoryService();