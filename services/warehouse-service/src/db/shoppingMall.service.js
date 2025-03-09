const ShoppingMall = require("./models/ShoppingMall");

class ShoppingMallDBService {
  async createShoppingMallRecord(data) {
    return await ShoppingMall.create(data);
  }

  async countTripsRecords() {
    try {
      const count = await ShoppingMall.countDocuments();
      return count;
    } catch (error) {
      console.error("🔴 Error al contar registros:", error);
      throw new Error("Error al contar registros");
    }
  }

  async deleteAllRecords() {
    try {
      const result = await ShoppingMall.deleteMany({});
      return result.deletedCount; // Número de registros eliminados
    } catch (error) {
      console.error("🔴 Error al eliminar registros:", error);
      throw new Error("Error al eliminar registros");
    }
  }

  async getAllItems() {
    try {
      const result = await ShoppingMall.find().sort({ _id: -1 }).limit(500);
      return result;
    } catch (error) {
      console.error("🔴 Error :", error);
      throw new Error("Error");
    }
  }
}

module.exports = new ShoppingMallDBService();
