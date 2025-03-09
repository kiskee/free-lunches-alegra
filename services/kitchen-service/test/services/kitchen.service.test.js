const KitchenService = require("../../src/services/kitchen.service");
const axios = require("axios");
const { connectProducer, sendMessage } = require("../../src/kafka");

jest.mock("axios");
jest.mock("../../src/kafka");

describe("KitchenService", () => {
  let kitchenService;

  beforeEach(async () => {
    connectProducer.mockResolvedValue({}); // Simular conexión exitosa a Kafka
    sendMessage.mockResolvedValue(); // Evitar errores en el envío de mensajes

    kitchenService = new KitchenService();
    await kitchenService.producerReady; // Asegurar que la conexión se inicializa en los tests
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("prepareRecipe", () => {
    it("debe preparar una receta correctamente", async () => {
      const mockRecipe = { recipe: { name: "Pasta", ingredients: ["tomato", "pasta"] } };
      axios.post.mockResolvedValue({ data: { success: true } });

      const result = await kitchenService.prepareRecipe(mockRecipe);

      expect(axios.post).toHaveBeenCalledWith("http://warehouse-service:3003/supply", { ingredients: ["tomato", "pasta"] });
      expect(result).toEqual({ status: "PREPARED", recipe: "Pasta" });
    });

    it("debe lanzar un error si falla la solicitud de ingredientes", async () => {
      const mockRecipe = { recipe: { name: "Pasta", ingredients: ["tomato", "pasta"] } };
      axios.post.mockRejectedValue(new Error("Warehouse error"));

      await expect(kitchenService.prepareRecipe(mockRecipe)).rejects.toThrow("Warehouse error");
    });
  });

  describe("incomeOrderFromRest", () => {
    it("debe procesar y enviar un pedido al almacén correctamente", async () => {
      const message = { value: Buffer.from(JSON.stringify({ order: "Pizza" })) };

      await kitchenService.incomeOrderFromRest(message);

      expect(sendMessage).toHaveBeenCalledWith("warehouse", JSON.stringify({ order: "Pizza" }));
    });

    it("debe lanzar un error si falla el envío a Kafka", async () => {
      sendMessage.mockImplementation(() => {
        throw new Error("Kafka error");
      });

      const message = { value: Buffer.from(JSON.stringify({ order: "Pizza" })) };

      await expect(kitchenService.incomeOrderFromRest(message)).rejects.toThrow("Error processing restaurant order: Kafka error");
    });
  });

  describe("sendCompleteOder", () => {
    it("debe enviar un pedido completado correctamente", async () => {
      const message = { value: Buffer.from(JSON.stringify({ order: "Burger" })) };

      await kitchenService.sendCompleteOder(message);

      expect(sendMessage).toHaveBeenCalledWith("final-order", { order: "Burger", status: "PREPARED" });
    });

    it("debe manejar un mensaje JSON anidado correctamente", async () => {
      const nestedMessage = { value: Buffer.from(JSON.stringify(JSON.stringify({ order: "Pizza" }))) };

      await kitchenService.sendCompleteOder(nestedMessage);

      expect(sendMessage).toHaveBeenCalledWith("final-order", { order: "Pizza", status: "PREPARED" });
    });

    it("debe lanzar un error si falla el envío del pedido", async () => {
      sendMessage.mockImplementation(() => {
        throw new Error("Kafka error");
      });

      const message = { value: Buffer.from(JSON.stringify({ order: "Burger" })) };

      await expect(kitchenService.sendCompleteOder(message)).rejects.toThrow("Error sending completed order: Kafka error");
    });
  });
});
