const axios = require("axios");
const { MarketService } = require("../../src/services/market.service");
const { goToMall } = require("../../src/services/wsWarehouse.service");
const ShoppingMallDBService = require("../../src/db/shoppingMall.service");

// Mocks para todas las dependencias
jest.mock("axios");
jest.mock("../../src/services/wsWarehouse.service");
jest.mock("../../src/db/shoppingMall.service");

describe("MarketService", () => {
  let marketService;

  beforeEach(() => {
    // Limpiar todos los mocks antes de cada prueba
    jest.clearAllMocks();

    // Crear una nueva instancia del servicio
    marketService = new MarketService();
  });

  describe("buyFromMarket", () => {
    it("debería comprar el ingrediente correctamente y devolver la cantidad adquirida", async () => {
      // Configurar el mock de axios para una respuesta exitosa
      const mockResponse = {
        data: {
          quantitySold: 5,
        },
      };
      axios.get.mockResolvedValueOnce(mockResponse);

      // Configurar los mocks para los servicios dependientes
      goToMall.mockImplementation(() => {});
      ShoppingMallDBService.createShoppingMallRecord.mockResolvedValueOnce({});

      // Ejecutar el método con un ingrediente de prueba
      const result = await marketService.buyFromMarket("flour");

      // Verificar que se llamó a axios con la URL correcta
      expect(axios.get).toHaveBeenCalledWith(
        "https://recruitment.alegra.com/api/farmers-market/buy?ingredient=flour"
      );

      // Verificar que se notificó al almacén con los datos correctos
      expect(goToMall).toHaveBeenCalledWith({
        ingredient: "flour",
        response: 5,
      });

      // Verificar que se almacenó en la base de datos
      expect(
        ShoppingMallDBService.createShoppingMallRecord
      ).toHaveBeenCalledWith({
        ingredient: "flour",
        response: 5,
      });

      // Verificar que se devolvió la cantidad correcta
      expect(result).toBe(5);
    });

    it("debería devolver 0 cuando quantitySold es indefinido", async () => {
      // Configurar el mock de axios para una respuesta sin quantitySold
      const mockResponse = {
        data: {},
      };
      axios.get.mockResolvedValueOnce(mockResponse);

      // Ejecutar el método
      const result = await marketService.buyFromMarket("eggs");

      // Verificar que se llamó a las dependencias con los datos correctos
      expect(goToMall).toHaveBeenCalledWith({
        ingredient: "eggs",
        response: undefined,
      });

      expect(
        ShoppingMallDBService.createShoppingMallRecord
      ).toHaveBeenCalledWith({
        ingredient: "eggs",
        response: undefined,
      });

      // Verificar que se devolvió 0
      expect(result).toBe(0);
    });

    it("debería manejar errores en la petición HTTP y devolver 0", async () => {
      // Configurar el mock de console.error
      const mockConsoleError = jest
        .spyOn(console, "error")
        .mockImplementation();

      // Configurar el mock de axios para simular un error
      const mockError = new Error("Network error");
      axios.get.mockRejectedValueOnce(mockError);

      // Ejecutar el método
      const result = await marketService.buyFromMarket("milk");

      // Verificar que se intentó la llamada a axios
      expect(axios.get).toHaveBeenCalledWith(
        "https://recruitment.alegra.com/api/farmers-market/buy?ingredient=milk"
      );

      // Verificar que se registró el error
      expect(mockConsoleError).toHaveBeenCalledWith(
        "🔴 Market purchase error for milk:",
        mockError
      );

      // Verificar que no se llamó a los servicios dependientes
      expect(goToMall).not.toHaveBeenCalled();
      expect(
        ShoppingMallDBService.createShoppingMallRecord
      ).not.toHaveBeenCalled();

      // Verificar que se devolvió 0
      expect(result).toBe(0);

      // Restaurar console.error
      mockConsoleError.mockRestore();
    });

    it("debería gestionar errores en los servicios dependientes y seguir devolviendo el valor correcto", async () => {
      // Configurar el mock de console.error
      const mockConsoleError = jest
        .spyOn(console, "error")
        .mockImplementation();

      // Configurar el mock de axios para una respuesta exitosa
      const mockResponse = {
        data: {
          quantitySold: 3,
        },
      };
      axios.get.mockResolvedValueOnce(mockResponse);

      // Configurar error en un servicio dependiente
      goToMall.mockImplementation(() => {}); // Este funciona normalmente
      ShoppingMallDBService.createShoppingMallRecord.mockRejectedValueOnce(
        new Error("DB error")
      ); // Este falla

      // Ejecutar el método
      const result = await marketService.buyFromMarket("sugar");

      // Verificar que se llamó a axios correctamente
      expect(axios.get).toHaveBeenCalledWith(
        "https://recruitment.alegra.com/api/farmers-market/buy?ingredient=sugar"
      );

      // Verificar que se notificó al almacén
      expect(goToMall).toHaveBeenCalledWith({
        ingredient: "sugar",
        response: 3,
      });

      // Verificar que se intentó guardar en la DB
      expect(
        ShoppingMallDBService.createShoppingMallRecord
      ).toHaveBeenCalledWith({
        ingredient: "sugar",
        response: 3,
      });

      // Verificar que se registró el error
      expect(mockConsoleError).toHaveBeenCalled();

      // Verificar que se devolvió 0 debido al error
      expect(result).toBe(0);

      // Restaurar console.error
      mockConsoleError.mockRestore();
    });

    it("debería hacer una petición diferente para cada tipo de ingrediente", async () => {
      // Configurar respuestas mock para diferentes ingredientes
      axios.get
        .mockResolvedValueOnce({ data: { quantitySold: 2 } }) // para flour
        .mockResolvedValueOnce({ data: { quantitySold: 3 } }); // para sugar

      // Ejecutar el método para diferentes ingredientes
      await marketService.buyFromMarket("flour");
      await marketService.buyFromMarket("sugar");

      // Verificar que se llamó a axios con diferentes URLs
      expect(axios.get).toHaveBeenNthCalledWith(
        1,
        "https://recruitment.alegra.com/api/farmers-market/buy?ingredient=flour"
      );
      expect(axios.get).toHaveBeenNthCalledWith(
        2,
        "https://recruitment.alegra.com/api/farmers-market/buy?ingredient=sugar"
      );
    });
  });
});
