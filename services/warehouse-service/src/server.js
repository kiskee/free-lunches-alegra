const app = require("./app"); // Importa la aplicación configurada
const { connectConsumer } = require('./consumers/warehouse.consumer')
const { connectDB } = require('./db/mongo.service')

const PORT = 3003; // O usa process.env.PORT si es necesario

const server = app.listen(PORT, "0.0.0.0", 511, () => {
  console.log(`Warehouse running on port ${PORT}`);
});

(async () => {
  await connectConsumer();
})();

connectDB(); // ✅ Ejecutamos la conexión a MongoDB al iniciar el servidor

server.keepAliveTimeout = 5000; // 5s
server.headersTimeout = 6000; // 6s