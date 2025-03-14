const { supplyIngredients, getCountTripsMall, getAllTrips, deleteAllTrips } = require("../../src/controllers/warehouse.controller");
const { InventoryService } = require("../../src/services/inventory.service");
const ShoppingMallDBService = require("../../src/db/shoppingMall.service");

jest.mock("../../src/services/inventory.service");
jest.mock("../../src/db/shoppingMall.service");

describe("Inventory Controller", () => {
  let res;

  beforeEach(() => {
    jest.clearAllMocks();
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  test("should supply ingredients when available", async () => {
    const req = { body: { ingredients: ["flour", "sugar"] } };
    InventoryService.prototype.ensureIngredientsAvailable = jest.fn().mockResolvedValue();
    InventoryService.prototype.getInventory = jest.fn().mockReturnValue({ flour: 10, sugar: 5 });

    await supplyIngredients(req, res);

    expect(InventoryService.prototype.ensureIngredientsAvailable).toHaveBeenCalledWith(["flour", "sugar"]);
    expect(res.json).toHaveBeenCalledWith({ status: "SUPPLIED", inventory: { flour: 10, sugar: 5 } });
  });

  test("should return 500 if ingredients are not available", async () => {
    const req = { body: { ingredients: ["flour"] } };
    const error = new Error("Ingredients not available");
    InventoryService.prototype.ensureIngredientsAvailable = jest.fn().mockRejectedValue(error);

    await supplyIngredients(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Ingredients not available" });
  });

  test("should return the count of trips in the mall", async () => {
    const req = {};
    ShoppingMallDBService.countTripsRecords.mockResolvedValue(10);

    await getCountTripsMall(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(10);
  });

  test("should return 500 if countTripsRecords fails", async () => {
    const req = {};
    const error = new Error("Database error");
    ShoppingMallDBService.countTripsRecords.mockRejectedValue(error);

    await getCountTripsMall(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Database error" });
  });

  test("should return all trips", async () => {
    const req = {};
    const trips = [{ id: 1, name: "Trip1" }, { id: 2, name: "Trip2" }];
    ShoppingMallDBService.getAllItems.mockResolvedValue(trips);

    await getAllTrips(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(trips);
  });

  test("should return 500 if getAllItems fails", async () => {
    const req = {};
    const error = new Error("Database error");
    ShoppingMallDBService.getAllItems.mockRejectedValue(error);

    await getAllTrips(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Database error" });
  });

  test("should delete all trips", async () => {
    const req = {};
    ShoppingMallDBService.deleteAllRecords.mockResolvedValue();

    await deleteAllTrips(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "All records have been deleted." });
  });

  test("should return 500 if deleteAllRecords fails", async () => {
    const req = {};
    const error = new Error("Database error");
    ShoppingMallDBService.deleteAllRecords.mockRejectedValue(error);

    await deleteAllTrips(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Database error" });
  });
});
