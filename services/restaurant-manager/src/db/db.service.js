const History = require("./models/History");

class HistoryService {
  async createHistoryRecord(data) {
    return await History.create(data);
  }

  async countRecords() {
    try {
      const count = await History.countDocuments();
      return count;
    } catch (error) {
      console.error("🔴 Error al contar registros:", error);
      throw new Error("Error al contar registros");
    }
  }

  async deleteAllRecords() {
    try {
      const result = await History.deleteMany({});
      return result.deletedCount; // Número de registros eliminados
    } catch (error) {
      console.error("🔴 Error al eliminar registros:", error);
      throw new Error("Error al eliminar registros");
    }
  }

  async getAllItems() {
    try {
      const result = await History.find().sort({ date: -1 }).limit(100); 
      return result;
    } catch (error) {
      console.error("🔴 Error :", error);
      throw new Error("Error");
    }
  }
}

module.exports = new HistoryService();
