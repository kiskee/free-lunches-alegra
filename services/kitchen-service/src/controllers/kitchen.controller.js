const KitchenService = require("../services/kitchen.service");
const logger = require("../logger");

const kitchenService = new KitchenService();

/**
 * Controller to handle recipe preparation requests.
 */
const prepareRecipeController = async (req, res) => {
  try {
    const recipe = req.body;
    logger.info("Received request to prepare recipe", { meta: body });
    const response = await kitchenService.prepareRecipe(recipe);
    logger.info("Recipe successfully prepared", { meta: response });
    res.json(response);
  } catch (error) {
    logger.error("Error processing the recipe", {
      meta: { error: error.message },
    });
    res.status(500).json({ error: error.message });
  }
};

const healthCheck = async (req, res) => {
  logger.info("Health check requested");
  res.status(200).send("OK");
};

module.exports = { prepareRecipeController, healthCheck };
