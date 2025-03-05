const app = require("./app"); // Import the configured Express application

// Define the port number, using environment variable or default to 3001
const PORT =  3004; //process.env.PORT ||

// Start the Express server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Restaurant Manager Service running on port ${PORT}`);
});
