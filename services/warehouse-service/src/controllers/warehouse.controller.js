const { InventoryService } = require("../services/inventory.service");
const ShoppingMallDBService = require("../db/shoppingMall.service");

// Initialize the inventory service instance
const inventoryService = new InventoryService();

/**
 * Handles ingredient supply requests.
 * 
 * This function checks if the requested ingredients are available in the inventory.
 * If they are, it responds with the updated inventory status.
 * If not, it returns an error response.
 * 
 * @param {Object} req - Express request object containing the list of ingredients in req.body.
 * @param {Object} res - Express response object used to send responses to the client.
 */
async function supplyIngredients(req, res) {
  const { ingredients } = req.body; // Extract the ingredients from the request body

  try {
    // Ensure the requested ingredients are available in the inventory
    await inventoryService.ensureIngredientsAvailable(ingredients);

    // Respond with the updated inventory status
    res.json({
      status: "SUPPLIED",
      inventory: inventoryService.getInventory(),
    });
  } catch (error) {
    // Handle errors if ingredients are not available or another issue occurs
    res.status(500).json({ error: error.message });
  }
}

/**
 * Retrieves the total count of trips recorded in the shopping mall database.
 * 
 * This function queries the database and returns the total number of recorded trips.
 * 
 * @param {Object} req - Express request object (not used in this function).
 * @param {Object} res - Express response object used to send back the count of trips.
 */
const getCountTripsMall = async (req, res) => {
  try {
    // Fetch the count of trip records from the database
    const items = await ShoppingMallDBService.countTripsRecords();
    res.status(200).json(items);
  } catch (error) {
    // Handle database retrieval errors
    res.status(500).json({ error: error.message });
  }
};

/**
 * Retrieves all trip records from the shopping mall database.
 * 
 * This function fetches a list of all recorded trips and returns them in the response.
 * 
 * @param {Object} req - Express request object (not used in this function).
 * @param {Object} res - Express response object used to send back the list of trips.
 */
const getAllTrips = async (req, res) => {
  try {
    // Fetch all trip records from the database
    const items = await ShoppingMallDBService.getAllItems();
    res.status(200).json(items);
  } catch (error) {
    // Handle errors that occur while fetching trip records
    res.status(500).json({ error: error.message });
  }
};

/**
 * Deletes all trip records from the shopping mall database.
 * 
 * This function removes all records of trips and confirms the deletion in the response.
 * 
 * @param {Object} req - Express request object (not used in this function).
 * @param {Object} res - Express response object used to confirm the deletion.
 */
const deleteAllTrips = async (req, res) => {
  try {
    // Delete all trip records from the database
    await ShoppingMallDBService.deleteAllRecords();
    res.status(200).json({ message: "All records have been deleted." });
  } catch (error) {
    // Handle database deletion errors
    res.status(500).json({ error: error.message });
  }
};

// Export the functions to be used in other parts of the application
module.exports = { supplyIngredients, getCountTripsMall, getAllTrips, deleteAllTrips };
