const { Kafka } = require("kafkajs");
const { InventoryService } = require("../../src/services/inventory.service");
const { connectConsumer } = require("../../src/consumers/warehouse.consumer");

jest.mock("kafkajs", () => {
  const runMock = jest.fn();
  const subscribeMock = jest.fn();
  const connectMock = jest.fn();
  const consumerMock = {
    connect: connectMock,
    subscribe: subscribeMock,
    run: runMock,
  };
  return {
    Kafka: jest.fn().mockImplementation(() => ({
      consumer: jest.fn(() => consumerMock),
    })),
    consumerMock,
  };
});

jest.mock("../../src/services/inventory.service", () => {
  return {
    InventoryService: jest.fn().mockImplementation(() => ({
      newIngredients: jest.fn(),
    })),
  };
});

describe("Kafka Consumer", () => {
  let inventoryServiceMock;
  let consumerMock;

  beforeEach(() => {
    jest.clearAllMocks();
    inventoryServiceMock = new InventoryService();
    ({ consumerMock } = Kafka());
  });

  test("should connect and subscribe to the warehouse topic", async () => {
    await connectConsumer();

    expect(consumerMock.connect).toHaveBeenCalled();
    expect(consumerMock.subscribe).toHaveBeenCalledWith({ topic: "warehouse", fromBeginning: false });
  });

  test("should process messages and call inventoryService.newIngredients", async () => {
    const message = { value: Buffer.from("test-message") };
    consumerMock.run.mockImplementation(async ({ eachMessage }) => {
      await eachMessage({ message });
    });

    await connectConsumer();

    expect(inventoryServiceMock.newIngredients).toHaveBeenCalledWith(message);
  });

  test("should throw an error if message processing fails", async () => {
    const error = new Error("Processing error");
    inventoryServiceMock.newIngredients.mockImplementation(() => {
      throw error;
    });

    const message = { value: Buffer.from("test-message") };
    consumerMock.run.mockImplementation(async ({ eachMessage }) => {
      await expect(eachMessage({ message })).rejects.toThrow("Error processing message: Processing error");
    });

    await connectConsumer();
  });

  test("should retry connection on failure", async () => {
    jest.useFakeTimers();
    consumerMock.connect.mockRejectedValueOnce(new Error("Connection failed"));

    await expect(connectConsumer()).rejects.toThrow("Error connecting consumer: Connection failed");
    expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 5000);
    jest.useRealTimers();
  });
});
