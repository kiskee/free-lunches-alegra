const { INGREDIENTS } = require("/app/shared/constants/ingredients");
const { MarketService } = require("./market.service");
const { connectProducer, sendMessage } = require("../kafka");
const { sendInventory } = require("./wsWarehouse.service");

class InventoryService {
  constructor() {
    this.inventory = this.initializeInventory();
    this.marketService = new MarketService();
    this.producerReady = this.initializeProducer(); // Guardamos la promesa
  }

  initializeInventory() {
    return INGREDIENTS.reduce((acc, ingredient) => {
      acc[ingredient] = 5;
      return acc;
    }, {});
  }

  async initializeProducer() {
    if (!this.producer) { // Evita múltiples conexiones
      try {
        this.producer = await connectProducer();
        console.log("Kafka Producer conectado correctamente");
      } catch (error) {
        console.error("Error al conectar el Kafka Producer:", error);
      }
    }
  }

  getInventory() {
    return this.inventory;
  }

  async ensureIngredientsAvailable(ingredients) {
    sendInventory(this.getInventory());
    for (const [ingredient, quantity] of Object.entries(ingredients)) {
      while (this.inventory[ingredient] < quantity) {
        const marketResponse = await this.marketService.buyFromMarket(ingredient);
        if (marketResponse > 0) {
          this.inventory[ingredient] += marketResponse;
        }
      }
      this.inventory[ingredient] -= quantity;
    }
    sendInventory(this.getInventory());
  }

  async newIngredients(message) {
    try {
      let convertedMsg = JSON.parse(message.value.toString());

      if (typeof convertedMsg === "string") {
        convertedMsg = JSON.parse(convertedMsg);
      }

      await this.ensureIngredientsAvailable(convertedMsg.ingredients);
      await this.producerReady; // Esperamos a que la conexión esté lista solo la primera vez
      await sendMessage("avalibleIngredients", convertedMsg);
    } catch (error) {
      console.error("Error al analizar JSON:", error);
    }
  }
}

module.exports = { InventoryService };
