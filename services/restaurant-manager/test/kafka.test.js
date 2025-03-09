// kafkaService.test.js
const { Kafka } = require('kafkajs');
const RestaurantService = require('../src/services/restaurant.service');
const { connectProducer, sendMessage, connectConsumer } = require('../src/kafka'); // Ajusta la ruta a tu archivo

// Mocks para Kafka y RestaurantService
jest.mock('kafkajs', () => {
    const originalModule = jest.requireActual('kafkajs');
    return {
      ...originalModule,
      Kafka: jest.fn().mockImplementation(() => ({
        producer: jest.fn().mockReturnValue({
          connect: jest.fn().mockResolvedValue(), // mock que resuelve la promesa correctamente
          send: jest.fn(),
        }),
        consumer: jest.fn().mockReturnValue({
          connect: jest.fn(),
          subscribe: jest.fn(),
          run: jest.fn(),
        }),
      })),
    };
  });
  

jest.mock('../src/services/restaurant.service', () => {
  return jest.fn().mockImplementation(() => ({
    finalizedOder: jest.fn(),
  }));
});

jest.mock('kafkajs', () => {
    const originalModule = jest.requireActual('kafkajs');
    return {
      ...originalModule,
      Kafka: jest.fn().mockImplementation(() => ({
        producer: jest.fn().mockReturnValue({
          connect: jest.fn().mockResolvedValue(), // Resuelve la promesa
          send: jest.fn(),
        }),
        consumer: jest.fn().mockReturnValue({
          connect: jest.fn(),
          subscribe: jest.fn(),
          run: jest.fn(),
        }),
      })),
    };
  });
  
  describe('KafkaService', () => {
    let mockProducer;
  
    beforeEach(() => {
      mockProducer = new Kafka().producer(); // Asegúrate de que el mock esté disponible
    });
  
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    test('connectProducer should connect to Kafka producer', async () => {
      await connectProducer();
      expect(mockProducer.connect).toHaveBeenCalledTimes(1);
    });
  });

//   test('sendMessage should send a message to Kafka topic', async () => {
//     const topic = 'test-topic';
//     const message = { key: 'value' };

//     await sendMessage(topic, message);

//     expect(mockProducer.send).toHaveBeenCalledWith({
//       topic,
//       messages: [{ value: JSON.stringify(message) }],
//     });
//   });

//   test('connectConsumer should connect to Kafka consumer and subscribe to topics', async () => {
//     await connectConsumer();
    
//     expect(mockConsumer.connect).toHaveBeenCalledTimes(1);
//     expect(mockConsumer.subscribe).toHaveBeenCalledWith({ topic: 'final-order', fromBeginning: false });
//     expect(mockConsumer.run).toHaveBeenCalledTimes(1);
//   });

//   test('consumer should call finalizedOder on receiving a message', async () => {
//     const topic = 'final-order';
//     const message = { value: 'test' };
//     const partition = 0;

//     // Simular que el consumer está ejecutando la función cada vez que recibe un mensaje
//     await mockConsumer.run.mock.calls[0][0].eachMessage({ topic, partition, message });

//     // Verifica que finaliza la orden
//     expect(restaurantService.finalizedOder).toHaveBeenCalledWith(topic, message);
//   });
//});
