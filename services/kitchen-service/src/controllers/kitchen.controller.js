const KitchenService = require("../services/kitchen.service");

const kitchenService = new KitchenService();

/**
 * Controller to handle recipe preparation requests.
 */
const prepareRecipeController = async (req, res) => {
  try {
    const recipe = req.body;
    const response = await kitchenService.prepareRecipe(recipe);
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const healthCheck = async (req, res) => {
  res.status(200).send("OK");
};

module.exports = { prepareRecipeController , healthCheck};
