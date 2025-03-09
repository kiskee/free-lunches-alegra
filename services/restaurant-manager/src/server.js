const app = require("./app"); // Import the configured Express application
const { connectConsumer } = require('./kafka');
const { connectDB } = require("./db/mongo.service"); 

// Define the port number, using environment variable or default to 3001
const PORT = 3004; //process.env.PORT ||

const server = app.listen(PORT, "0.0.0.0", 511, () => {
  console.log(`Restaurant running on port ${PORT}`);
});

(async () => {
  await connectConsumer();
})();

connectDB(); // ✅ Ejecutamos la conexión a MongoDB al iniciar el servidor

server.keepAliveTimeout = 5000; // 5s
server.headersTimeout = 6000; // 6s
