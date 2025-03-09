const KitchenService = require("../../src/services/kitchen.service");
const kitchenServiceMock = new KitchenService();
jest.mock("../../src/services/kitchen.service");


const { prepareRecipe: prepareRecipeController } = require("../../src/controllers/kitchen.controller");



describe("prepareRecipe controller", () => {
    let req, res, next;
  
    beforeEach(() => {
      kitchenServiceMock.prepareRecipe = jest.fn(); // Mock explícito de la función
  
      req = { body: { name: "Pasta", ingredients: ["Tomato", "Pasta", "Cheese"] } };
      res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
      next = jest.fn();
    });
  
    it("should return a successful response when the recipe is prepared", async () => {
      const mockResponse = { message: "Recipe prepared successfully" };
      kitchenServiceMock.prepareRecipe.mockResolvedValue(mockResponse);
  
      await prepareRecipeController(req, res, next, kitchenServiceMock); // Pasar el mock al controlador
  
      expect(kitchenServiceMock.prepareRecipe).toHaveBeenCalledWith(req.body);
      expect(res.json).toHaveBeenCalledWith(mockResponse);
    });
  
    it("should return a 500 error when an exception occurs", async () => {
      const mockError = new Error("Something went wrong");
      kitchenServiceMock.prepareRecipe.mockRejectedValue(mockError);
  
      await prepareRecipeController(req, res, next, kitchenServiceMock); // Pasar el mock al controlador
  
      expect(kitchenServiceMock.prepareRecipe).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: mockError.message });
    });
  });