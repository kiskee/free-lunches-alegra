const RestaurantService = require("../services/restaurant.service");
const { connectProducer, sendMessage } = require("../kafka");
const crypto = require("crypto");
const { enviarOrdenFinalizada } = require("../services/ws.service");
const HistoryService = require('../db/db.service')

let producerReady = null; // Variable global para la conexión persistente

/**
 * Asegura que el producer esté conectado antes de enviar mensajes
 */
const ensureProducerConnected = async () => {
  if (!producerReady) {
    producerReady = connectProducer()
      .then((producer) => {
        console.log("Kafka Producer conectado correctamente");
        return producer;
      })
      .catch((error) => {
        console.error("Error al conectar el Kafka Producer:", error);
        producerReady = null; // Resetear para intentar reconectar en la siguiente petición
      });
  }
  return producerReady;
};

/**
 * Handles incoming order requests.
 * Selects a random recipe and sends it as a response.
 */
const placeOrder = async (req, res) => {
  try {
    await ensureProducerConnected(); // Esperar la conexión del producer
    const service = new RestaurantService();
    const selectedRecipe = service.selectRandomRecipe();
    const uuid = crypto.randomUUID();
    selectedRecipe["id"] = uuid;

    await sendMessage("kitchen", selectedRecipe);
    await enviarOrdenFinalizada("orderCreated", selectedRecipe);
    const dataToSave = {
      id: uuid,
      recipeName: selectedRecipe.name,
    }
    await HistoryService.createHistoryRecord(dataToSave)
    res.json({
      success: true,
      message: "Orden enviada a la cocina",
      orderId: uuid,
    });
  } catch (error) {
    console.error("Error en placeOrder:", error);
    res.status(500).json({ error: error.message });
  }
};

const getCountHistory = async (req, res) =>{
  try {
    const items = await HistoryService.countRecords()
    res.status(200).json(items);
} catch (error) {
    res.status(500).json({ error: error.message });
}
}

const getAllItems = async (req, res) => {
  try {
      const items = await HistoryService.getAllItems();
      res.status(200).json(items);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};


const deleteAllHistory= async (req, res) => {
  try {
    await HistoryService.deleteAllRecords()
    res.status(200).json({message: "all records was deleted"});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { placeOrder, getCountHistory , getAllItems, deleteAllHistory};
