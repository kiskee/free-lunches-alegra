const KitchenService = require("../services/kitchen.service");

const kitchenService = new KitchenService();

/**
 * Controller to handle recipe preparation requests.
 */
const prepareRecipe = async (req, res) => {
  //console.log("aca me llego a la cocina algo", req)
  try {
    const recipe = req.body;
    const response = await kitchenService.prepareRecipe(recipe);
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { prepareRecipe };
