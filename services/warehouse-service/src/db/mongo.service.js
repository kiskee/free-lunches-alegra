const mongoose = require("mongoose");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://mongodb:27017/restaurantDB";

async function connectDB() {
    try {
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("🟢 Conectado a MongoDB");
    } catch (error) {
        console.error("🔴 Error al conectar con MongoDB:", error);
        process.exit(1);
    }
}

module.exports = { connectDB };
