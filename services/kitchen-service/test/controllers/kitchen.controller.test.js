const KitchenService = require("../../src/services/kitchen.service");
const {
  prepareRecipeController,
} = require("../../src/controllers/kitchen.controller");


//jest.mock("../../src/services/kitchen.service");
jest.spyOn(KitchenService.prototype, "prepareRecipe");

describe("prepareRecipeController", () => {
  let req, res;

  beforeEach(() => {
    req = { body: { name: "Pasta", ingredients: ["tomato", "pasta"] } };
    res = { 
      json: jest.fn(), 
      status: jest.fn().mockReturnThis() 
    };

    jest.clearAllMocks(); // Limpia mocks antes de cada test
  });

  it("debe devolver la respuesta del servicio con código 200", async () => {
    const mockResponse = { status: "success", message: "Recipe prepared!" };
    KitchenService.prototype.prepareRecipe.mockResolvedValue(mockResponse);

    await prepareRecipeController(req, res);

    expect(KitchenService.prototype.prepareRecipe).toHaveBeenCalledWith(req.body);
    expect(res.json).toHaveBeenCalledWith(mockResponse);
  });

  it("debe devolver un error 500 si el servicio falla", async () => {
    KitchenService.prototype.prepareRecipe.mockRejectedValue(new Error("Error interno"));

    await prepareRecipeController(req, res);

    expect(KitchenService.prototype.prepareRecipe).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Error interno" });
  });
});
