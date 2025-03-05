const app = require('./app');

const PORT = process.env.PORT || 3002;

// Start the Express server
app.listen(PORT, () => {
    console.log(`Kitchen Service running on port ${PORT}`);
});