jest.mock(
  "/app/shared/constants/ingredients",
  () => ({
    RECIPES: [
      {
        id: "mock-recipe-1",
        name: "Mock Pizza",
        ingredients: ["tomato", "cheese", "dough"],
        time: 20,
      },
      {
        id: "mock-recipe-2",
        name: "Mock Burger",
        ingredients: ["meat", "bun", "lettuce"],
        time: 15,
      },
    ],
  }),
  { virtual: true }
);
jest.mock("../../src/services/restaurant.service", () => {
  return {
    RestaurantService: jest.fn().mockImplementation(() => ({
      selectRandomRecipe: jest.fn(), // Simula el método
    })),
  };
});

const restaurantController = require("../../src/controllers/order.controller");
const RestaurantService = require("../../src/services/restaurant.service");
const { connectProducer, sendMessage } = require("../../src/kafka");
const { enviarOrdenFinalizada } = require("../../src/services/ws.service");
const HistoryService = require("../../src/db/db.service");
const StatusDBService = require("../../src/db/statusDB.service");
const crypto = require("crypto");

// Mock de todas las dependencias
jest.mock("../../src/controllers/order.controller");
jest.mock("../../src/kafka");
jest.mock("../../src/services/ws.service");
jest.mock("../../src/db/db.service");
jest.mock("../../src/db/statusDB.service");
jest.mock("crypto");

describe("Restaurant Controller", () => {
  let req;
  let res;
  let mockSelectRandomRecipe;

  // Setup para cada test
  beforeEach(() => {
    // Reset de mocks
    jest.clearAllMocks();

    // Mock para selectRandomRecipe
    // Mock para selectRandomRecipe con spyOn
    mockSelectRandomRecipe = jest.fn().mockResolvedValue("Mocked Recipe");
    jest
      .spyOn(RestaurantService.prototype, "selectRandomRecipe")
      .mockImplementation(mockSelectRandomRecipe);

    // Mock de req y res
    req = {};
    res = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    };

    // Mock de la conexión del productor
    connectProducer.mockResolvedValue({});

    // Mock UUID
    crypto.randomUUID.mockReturnValue("mock-uuid-1234");
  });

  describe("placeOrder", () => {
    it("debe colocar una orden exitosamente", async () => {
      // Configuración de mocks
      const mockRecipe = { name: "Test Recipe" };
      mockSelectRandomRecipe.mockReturnValue(mockRecipe);
      sendMessage.mockResolvedValue();
      enviarOrdenFinalizada.mockResolvedValue();
      HistoryService.createHistoryRecord.mockResolvedValue({});

      // Ejecutar función
      await restaurantController.placeOrder(req, res);

      // Verificaciones
      expect(connectProducer).toHaveBeenCalled();
      expect(RestaurantService).toHaveBeenCalledTimes(1);
      expect(mockSelectRandomRecipe).toHaveBeenCalled();

      // Verificar que se generó un UUID
      expect(crypto.randomUUID).toHaveBeenCalled();

      // Verificar que se envió el mensaje a Kafka
      expect(sendMessage).toHaveBeenCalledWith("kitchen", {
        name: "Test Recipe",
        id: "mock-uuid-1234",
      });

      // Verificar que se envió la notificación por WebSocket
      expect(enviarOrdenFinalizada).toHaveBeenCalledWith("orderCreated", {
        name: "Test Recipe",
        id: "mock-uuid-1234",
      });

      // Verificar que se guardó en el historial
      expect(HistoryService.createHistoryRecord).toHaveBeenCalledWith({
        id: "mock-uuid-1234",
        recipeName: "Test Recipe",
      });

      // Verificar respuesta
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Order sent to kitchen",
        orderId: "mock-uuid-1234",
      });
    });

    it("debe manejar errores al colocar una orden", async () => {
      // Configuración de mock para forzar un error
      mockSelectRandomRecipe.mockImplementation(() => {
        throw new Error("Error al seleccionar receta");
      });

      // Ejecutar función
      await restaurantController.placeOrder(req, res);

      // Verificaciones
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Error al seleccionar receta",
      });
    });

    it("debe intentar reconectar el productor cuando no está disponible", async () => {
      // Configuración para simular reconexión
      connectProducer.mockRejectedValueOnce(new Error("Error de conexión"));

      const mockRecipe = { name: "Test Recipe" };
      mockSelectRandomRecipe.mockReturnValue(mockRecipe);

      // Ejecutar función
      await restaurantController.placeOrder(req, res);

      // Verificar que se manejó el error
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Error de conexión",
      });

      // Limpiar para la próxima ejecución
      jest.clearAllMocks();

      // Configurar para éxito en el segundo intento
      connectProducer.mockResolvedValue({});
      mockSelectRandomRecipe.mockReturnValue(mockRecipe);

      // Ejecutar de nuevo
      await restaurantController.placeOrder(req, res);

      // Debe ser exitoso esta vez
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
        })
      );
    });
  });

  describe("getCountHistory", () => {
    it("debe obtener el conteo de registros del historial", async () => {
      // Mock del servicio
      HistoryService.countRecords.mockResolvedValue(10);

      // Ejecutar función
      await restaurantController.getCountHistory(req, res);

      // Verificaciones
      expect(HistoryService.countRecords).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(10);
    });

    it("debe manejar errores al obtener el conteo", async () => {
      // Mock para forzar un error
      HistoryService.countRecords.mockRejectedValue(
        new Error("Error al contar")
      );

      // Ejecutar función
      await restaurantController.getCountHistory(req, res);

      // Verificaciones
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Error al contar" });
    });
  });

  describe("getAllItems", () => {
    it("debe obtener todos los elementos del historial", async () => {
      // Mock del servicio
      const mockItems = [
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ];
      HistoryService.getAllItems.mockResolvedValue(mockItems);

      // Ejecutar función
      await restaurantController.getAllItems(req, res);

      // Verificaciones
      expect(HistoryService.getAllItems).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockItems);
    });

    it("debe manejar errores al obtener los elementos", async () => {
      // Mock para forzar un error
      HistoryService.getAllItems.mockRejectedValue(
        new Error("Error al obtener")
      );

      // Ejecutar función
      await restaurantController.getAllItems(req, res);

      // Verificaciones
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Error al obtener" });
    });
  });

  describe("deleteAllHistory", () => {
    it("debe eliminar todos los registros del historial", async () => {
      // Mock del servicio
      HistoryService.deleteAllRecords.mockResolvedValue();

      // Ejecutar función
      await restaurantController.deleteAllHistory(req, res);

      // Verificaciones
      expect(HistoryService.deleteAllRecords).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "All records were deleted",
      });
    });

    it("debe manejar errores al eliminar los registros", async () => {
      // Mock para forzar un error
      HistoryService.deleteAllRecords.mockRejectedValue(
        new Error("Error al eliminar")
      );

      // Ejecutar función
      await restaurantController.deleteAllHistory(req, res);

      // Verificaciones
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Error al eliminar" });
    });
  });

  describe("getCountStatus", () => {
    it("debe obtener el conteo de registros de estado", async () => {
      // Mock del servicio
      StatusDBService.countStatusRecords.mockResolvedValue(5);

      // Ejecutar función
      await restaurantController.getCountStatus(req, res);

      // Verificaciones
      expect(StatusDBService.countStatusRecords).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(5);
    });

    it("debe manejar errores al obtener el conteo de estado", async () => {
      // Mock para forzar un error
      StatusDBService.countStatusRecords.mockRejectedValue(
        new Error("Error al contar")
      );

      // Ejecutar función
      await restaurantController.getCountStatus(req, res);

      // Verificaciones
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Error al contar" });
    });
  });

  describe("getAllStatus", () => {
    it("debe obtener todos los registros de estado", async () => {
      // Mock del servicio
      const mockItems = [
        { id: "1", status: "Pending" },
        { id: "2", status: "Completed" },
      ];
      StatusDBService.getAllItems.mockResolvedValue(mockItems);

      // Ejecutar función
      await restaurantController.getAllStatus(req, res);

      // Verificaciones
      expect(StatusDBService.getAllItems).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockItems);
    });

    it("debe manejar errores al obtener los registros de estado", async () => {
      // Mock para forzar un error
      StatusDBService.getAllItems.mockRejectedValue(
        new Error("Error al obtener")
      );

      // Ejecutar función
      await restaurantController.getAllStatus(req, res);

      // Verificaciones
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Error al obtener" });
    });
  });

  describe("deleteAllStatus", () => {
    it("debe eliminar todos los registros de estado", async () => {
      // Mock del servicio
      StatusDBService.deleteAllRecords.mockResolvedValue();

      // Ejecutar función
      await restaurantController.deleteAllStatus(req, res);

      // Verificaciones
      expect(StatusDBService.deleteAllRecords).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "All records were deleted",
      });
    });

    it("debe manejar errores al eliminar los registros de estado", async () => {
      // Mock para forzar un error
      StatusDBService.deleteAllRecords.mockRejectedValue(
        new Error("Error al eliminar")
      );

      // Ejecutar función
      await restaurantController.deleteAllStatus(req, res);

      // Verificaciones
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Error al eliminar" });
    });
  });
});
