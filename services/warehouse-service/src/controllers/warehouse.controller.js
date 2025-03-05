const { InventoryService } = require("../services/inventory.service");

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

module.exports = { supplyIngredients };
