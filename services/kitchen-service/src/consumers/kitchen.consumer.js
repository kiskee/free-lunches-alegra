const { Kafka } = require("kafkajs");
const KitchenService = require("../services/kitchen.service");

const kafka = new Kafka({
  clientId: "kitchen-service",
  brokers: ["kafka:9092"],
  retry: {
    initialRetryTime: 300, // Tiempo inicial antes del primer reintento
    retries: 10, // Número máximo de intentos de reconexión
  },
});

// consumer
const consumer = kafka.consumer({ groupId: "kitchen-group" });

// const connectConsumer = async () => {
//   await consumer.connect();
//   await consumer.subscribe({
//     topics: ["kitchen", "avalibleIngredients"], // Lista de topics a los que suscribirse
//     fromBeginning: false, // Opcional: comienza a consumir desde el principio de los topics
//   }); //fromBeginning: true
//   const service = new KitchenService();
//   await consumer.run({
//     eachMessage: async ({ topic, partition, message }) => {
//       //console.log(`📥 Mensaje recibido en ${topic}:`, message.value.toString());

//       switch (topic) {
//         case "kitchen":
//           await service.incomeOrderFromRest(message);
//           break;
//         case "avalibleIngredients":
//           await service.sendCompleteOder(message);
//           break;
//         default:
//           console.warn(
//             `Unhandled topic: ${topic} with message: ${message.value.toString()}`
//           );
//       }
//     },
//   });
// };
const connectConsumer = async () => {
  try {
    await consumer.connect();
    //console.log("✅ Consumer conectado a Kafka");

    await consumer.subscribe({
      topics: ["kitchen", "avalibleIngredients"],
      fromBeginning: false,
    });

    const service = new KitchenService();

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          //console.log(`📥 Mensaje recibido en ${topic}: ${message.value.toString()}`);

          switch (topic) {
            case "kitchen":
              await service.incomeOrderFromRest(message);
              break;
            case "avalibleIngredients":
              await service.sendCompleteOder(message);
              break;
            default:
              console.warn(`⚠️ Unhandled topic: ${topic}`);
          }
        } catch (error) {
          console.error(
            `❌ Error procesando mensaje en topic ${topic}:`,
            error
          );
        }
      },
    });
  } catch (error) {
    console.error("❌ Error conectando el consumer:", error);
    setTimeout(connectConsumer, 5000); // Reintento tras 5 segundos si falla la conexión
  }
};

module.exports = { connectConsumer };
