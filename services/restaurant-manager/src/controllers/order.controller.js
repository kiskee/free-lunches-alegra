const RestaurantService = require("../services/restaurant.service");
const { connectProducer, sendMessage } = require("../kafka");
const crypto = require("crypto");
const { enviarOrdenFinalizada } = require("../services/ws.service");

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

module.exports = { placeOrder };
