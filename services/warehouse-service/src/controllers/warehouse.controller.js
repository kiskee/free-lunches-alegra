const { InventoryService } = require("../services/inventory.service");
const ShoppingMallDBService = require('../db/shoppingMall.service')

const inventoryService = new InventoryService();

async function supplyIngredients(req, res) {
  const { ingredients } = req.body;
  console.log("los ingredientes que me piden", ingredients);
  try {
    await inventoryService.ensureIngredientsAvailable(ingredients);
    console.log("aca el inventario", inventoryService.getInventory());
    res.json({
      status: "SUPPLIED",
      inventory: inventoryService.getInventory(),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const getCountTripsMall = async (req, res) => {
  try {
    const items = await ShoppingMallDBService.countTripsRecords();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllTrips = async (req, res) => {
  try {
    const items = await ShoppingMallDBService.getAllItems()
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteAllTrips = async (req, res) => {
  try {
    await ShoppingMallDBService.deleteAllRecords()
    res.status(200).json({ message: "all records was deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports = { supplyIngredients, getCountTripsMall, getAllTrips, deleteAllTrips };
