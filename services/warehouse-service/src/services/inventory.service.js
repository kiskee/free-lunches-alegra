const { INGREDIENTS } = require("/app/shared/constants/ingredients");
const { MarketService } = require("./market.service");
const { connectProducer, sendMessage } = require("../kafka");
const { sendInventory } = require("./wsWarehouse.service");
const logger = require("../logger");

class InventoryService {
  constructor() {
    logger.info("Initializing InventoryService...");
    this.inventory = this.initializeInventory(); // Initialize inventory with default values
    this.marketService = new MarketService(); // Create an instance of MarketService to handle ingredient purchases
    this.producerReady = this.initializeProducer(); // Store the Kafka producer connection promise
  }

  /**
   * Initializes the inventory by setting a default quantity for each ingredient.
   * The default quantity for each ingredient is set to 5.
   * 
   * @returns {Object} An object representing the initial state of the inventory.
   *                  Example: { ingredient1: 5, ingredient2: 5, ... }
   */
  initializeInventory() {
    logger.info("Initializing inventory with default values.");
    return INGREDIENTS.reduce((acc, ingredient) => {
      acc[ingredient] = 5; // Default quantity assigned to each ingredient
      return acc;
    }, {});
  }

  /**
   * Establishes a connection to the Kafka producer, if not already connected.
   * The producer will be used to send messages to Kafka topics.
   */
  async initializeProducer() {
    if (!this.producer) { // Ensures that only one Kafka connection is established
      try {
        this.producer = await connectProducer(); // Connect to Kafka producer
        logger.info("🟢 Kafka Producer connected successfully");
      } catch (error) {
        logger.error("🔴 Error connecting Kafka Producer:", error);
      }
    }
  }

  /**
   * Retrieves the current inventory state, which contains all ingredients
   * and their available quantities.
   * 
   * @returns {Object} The current inventory object with ingredient quantities.
   *                  Example: { flour: 3, sugar: 10, eggs: 7 }
   */
  getInventory() {
    logger.info("Fetching current inventory state.");
    return this.inventory;
  }

  /**
   * Ensures that the required ingredients are available in the inventory.
   * If an ingredient's quantity is insufficient, it will be purchased from the market.
   * 
   * @param {Object} ingredients An object containing the required ingredients and their quantities.
   *                            Example: { flour: 2, sugar: 5 }
   * 
   * @throws {Error} If there is an issue in fetching ingredients from the market.
   */
  async ensureIngredientsAvailable(ingredients) {
    logger.info("Ensuring ingredients availability:", ingredients);
    sendInventory(this.getInventory()); // Notify external systems about the current inventory

    for (const [ingredient, quantity] of Object.entries(ingredients)) {
      while (this.inventory[ingredient] < quantity) { // Check if inventory has sufficient quantity
        logger.warn(`Insufficient ${ingredient}. Attempting to purchase more.`);
        const marketResponse = await this.marketService.buyFromMarket(ingredient); // Attempt to purchase missing ingredient

        if (marketResponse > 0) {
          this.inventory[ingredient] += marketResponse; // Add purchased quantity to inventory
          logger.info(`Purchased ${marketResponse} of ${ingredient}. New stock: ${this.inventory[ingredient]}`);
        }
      }
      this.inventory[ingredient] -= quantity; // Deduct the used quantity after ensuring availability
      logger.info(`Deducted ${quantity} of ${ingredient}. Remaining stock: ${this.inventory[ingredient]}`);
    }

    sendInventory(this.getInventory()); // Notify external systems about the updated inventory
    logger.info("Inventory updated and sent to external systems.");
  }

  /**
   * Handles incoming ingredient supply messages from Kafka.
   * The message is expected to contain ingredient requests, which are then processed.
   * After ensuring ingredient availability, a response is sent to a Kafka topic.
   * 
   * @param {Object} message The message received from Kafka.
   *                        Expected format: { value: Buffer }
   * 
   * @throws {Error} If the message format is incorrect or JSON parsing fails.
   */
  async newIngredients(message) {
    try {
      logger.info("Received new Kafka message:", message);
      let convertedMsg = JSON.parse(message.value.toString()); // Convert message buffer to JSON

      if (typeof convertedMsg === "string") {
        convertedMsg = JSON.parse(convertedMsg); // Handle nested JSON parsing if necessary
      }

      await this.ensureIngredientsAvailable(convertedMsg.ingredients); // Ensure requested ingredients are available
      await this.producerReady; // Wait for Kafka producer to be ready before sending messages
      await sendMessage("avalibleIngredients", convertedMsg); // Send confirmation message to Kafka
      logger.info("Processed and sent ingredient availability confirmation.");
    } catch (error) {
      logger.error("🔴 Error parsing or processing Kafka message:", error);
    }
  }
}

module.exports = { InventoryService };
