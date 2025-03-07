const app = require("./app");
const { connectConsumer } = require('./consumers/kitchen.consumer');

const PORT = process.env.PORT || 3002;

const server = app.listen(PORT, "0.0.0.0", 511, () => {
  console.log(`Kitchen running on port ${PORT}`);
});


(async () => {
  await connectConsumer();
})();


server.keepAliveTimeout = 5000; // 5s
server.headersTimeout = 6000; // 6s
