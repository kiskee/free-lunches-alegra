const Status = require("./models/Status");

class StatusDBService {
  /**
   * Creates a new status record in the database.
   * @param {Object} data - The status data to be stored.
   * @returns {Promise<Object>} - The created status record.
   */
  async createStatusRecord(data) {
    return await Status.create(data);
  }

  /**
   * Counts the total number of status records in the database.
   * @returns {Promise<number>} - The total count of status records.
   */
  async countStatusRecords() {
    try {
      return await Status.countDocuments();
    } catch (error) {
      throw new Error("Error counting status records");
    }
  }

  /**
   * Deletes all status records from the database.
   * @returns {Promise<number>} - The number of deleted records.
   */
  async deleteAllRecords() {
    try {
      const result = await Status.deleteMany({});
      return result.deletedCount; 
    } catch (error) {
      throw new Error("Error deleting status records");
    }
  }

  /**
   * Retrieves all status records from the database, sorted by date.
   * Limits the results to 100 records.
   * @returns {Promise<Array>} - The list of status records.
   */
  async getAllItems() {
    try {
      return await Status.find().sort({ date: -1 }).limit(200); 
    } catch (error) {
      throw new Error("Error retrieving status records");
    }
  }
}

module.exports = new StatusDBService();