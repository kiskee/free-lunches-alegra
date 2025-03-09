// __tests__/kafkaConsumer.test.js

const { connectConsumer } = require("../../src/consumers/kitchen.consumer");
const KitchenService = require("../../src/services/kitchen.service");

// Mock kafkajs
jest.mock("kafkajs", () => {
  const mockConsumerRun = jest.fn();
  const mockConsumerConnect = jest.fn();
  const mockConsumerSubscribe = jest.fn();
  const mockProducerConnect = jest.fn();
  const mockProducerSend = jest.fn().mockResolvedValue({});
  const mockProducerDisconnect = jest.fn();

  return {
    Kafka: jest.fn().mockImplementation(() => {
      return {
        consumer: jest.fn().mockImplementation(() => {
          return {
            connect: mockConsumerConnect,
            subscribe: mockConsumerSubscribe,
            run: mockConsumerRun,
          };
        }),
        producer: jest.fn().mockImplementation(() => {
          return {
            connect: mockProducerConnect,
            send: mockProducerSend,
            disconnect: mockProducerDisconnect,
          };
        }),
      };
    }),
    // Exponer los mocks para poder verificarlos en los tests
    mockConsumerRun,
    mockConsumerConnect,
    mockConsumerSubscribe,
    mockProducerConnect,
    mockProducerSend,
    mockProducerDisconnect,
  };
});

// Mock del KitchenService
jest.mock("../../src/services/kitchen.service");

// Importar los mocks después de declarar los jest.mock
const {
  Kafka,
  mockConsumerRun,
  mockConsumerConnect,
  mockConsumerSubscribe,
  mockProducerConnect,
  mockProducerSend,
  mockProducerDisconnect,
} = require("kafkajs");

describe("Kafka Consumer", () => {
  let mockKitchenService;

  beforeEach(() => {
    // Limpiar todos los mocks antes de cada test
    jest.clearAllMocks();

    // Setup del mock para KitchenService
    mockKitchenService = {
      incomeOrderFromRest: jest.fn(),
      sendCompleteOder: jest.fn(),
    };

    // Configurar el constructor mock para devolver nuestra instancia mock
    KitchenService.mockImplementation(() => mockKitchenService);
  });

  test("should connect to Kafka and subscribe to topics", async () => {
    await connectConsumer();

    expect(mockConsumerConnect).toHaveBeenCalledTimes(1);
    expect(mockConsumerSubscribe).toHaveBeenCalledWith({
      topics: ["kitchen", "avalibleIngredients"],
      fromBeginning: false,
    });
    expect(mockConsumerRun).toHaveBeenCalledTimes(1);
  });

  test('should process messages from "kitchen" topic', async () => {
    await connectConsumer();

    // Obtener la función de callback eachMessage
    const eachMessageCallback = mockConsumerRun.mock.calls[0][0].eachMessage;

    // Crear un mensaje mock
    const mockMessage = {
      topic: "kitchen",
      partition: 0,
      message: {
        value: Buffer.from('{"testData": "kitchen order data"}'),
      },
    };

    // Llamar al callback con el mensaje mock
    await eachMessageCallback(mockMessage);

    // Verificar que el método correcto del servicio fue llamado
    expect(mockKitchenService.incomeOrderFromRest).toHaveBeenCalledWith(
      mockMessage.message
    );
    expect(mockKitchenService.sendCompleteOder).not.toHaveBeenCalled();
  });

  test('should process messages from "avalibleIngredients" topic', async () => {
    await connectConsumer();

    // Obtener la función de callback eachMessage
    const eachMessageCallback = mockConsumerRun.mock.calls[0][0].eachMessage;

    // Crear un mensaje mock
    const mockMessage = {
      topic: "avalibleIngredients",
      partition: 0,
      message: {
        value: Buffer.from('{"testData": "ingredients data"}'),
      },
    };

    // Llamar al callback con el mensaje mock
    await eachMessageCallback(mockMessage);

    // Verificar que el método correcto del servicio fue llamado
    expect(mockKitchenService.sendCompleteOder).toHaveBeenCalledWith(
      mockMessage.message
    );
    expect(mockKitchenService.incomeOrderFromRest).not.toHaveBeenCalled();
  });

  test("should handle unrecognized topics", async () => {
    // Mock de console.warn
    const originalConsoleWarn = console.warn;
    console.warn = jest.fn();

    await connectConsumer();

    // Obtener la función de callback eachMessage
    const eachMessageCallback = mockConsumerRun.mock.calls[0][0].eachMessage;

    // Crear un mensaje mock con un topic desconocido
    const mockMessage = {
      topic: "unknown-topic",
      partition: 0,
      message: {
        value: Buffer.from('{"testData": "unknown data"}'),
      },
    };

    // Llamar al callback con el mensaje mock
    await eachMessageCallback(mockMessage);

    // Verificar que se registra la advertencia y no se llama a ningún método del servicio
    expect(console.warn).toHaveBeenCalledWith(
      "⚠️ Unhandled topic: unknown-topic"
    );
    expect(mockKitchenService.incomeOrderFromRest).not.toHaveBeenCalled();
    expect(mockKitchenService.sendCompleteOder).not.toHaveBeenCalled();

    // Restaurar console.warn
    console.warn = originalConsoleWarn;
  });

  test("should handle errors in message processing", async () => {
    // Mock de console.error
    const originalConsoleError = console.error;
    console.error = jest.fn();

    // Configurar el servicio para que lance un error
    mockKitchenService.incomeOrderFromRest.mockRejectedValue(
      new Error("Test error")
    );

    await connectConsumer();

    // Obtener la función de callback eachMessage
    const eachMessageCallback = mockConsumerRun.mock.calls[0][0].eachMessage;

    // Crear un mensaje mock
    const mockMessage = {
      topic: "kitchen",
      partition: 0,
      message: {
        value: Buffer.from('{"testData": "kitchen order data"}'),
      },
    };

    // Llamar al callback con el mensaje mock
    await eachMessageCallback(mockMessage);

    // Verificar que se registra el error
    expect(console.error).toHaveBeenCalledWith(
      "❌ Error processing message on topic kitchen:",
      expect.any(Error)
    );

    // Restaurar console.error
    console.error = originalConsoleError;
  });

  test("should retry connection if it fails", async () => {
    // Mock de setTimeout
    jest.useFakeTimers();

    // Mock de console.error
    const originalConsoleError = console.error;
    console.error = jest.fn();

    // Hacer que la conexión falle
    mockConsumerConnect.mockRejectedValueOnce(new Error("Connection failed"));

    // Llamar a connectConsumer
    connectConsumer();

    // Resolver todas las promesas pendientes
    await Promise.resolve();

    // Verificar que se registra el error
    expect(console.error).toHaveBeenCalledWith(
      "❌ Error connecting the consumer:",
      expect.any(Error)
    );

    // Verificar que se programó un temporizador para 5000ms
    //expect(setTimeout).toHaveBeenCalled();
    expect(jest.getTimerCount()).toBe(1);
    // Alternativamente, podemos verificar el tiempo específico
    expect(jest.getTimerCount()).toBeGreaterThan(0);

    // Restaurar console.error y setTimeout
    console.error = originalConsoleError;
    jest.useRealTimers();
  });
});
