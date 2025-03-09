const mongoose = require("mongoose");
const { connectDB } = require("../../src/db/mongo.service");

describe("connectDB", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should connect to MongoDB successfully", async () => {
        jest.spyOn(mongoose, "connect").mockResolvedValueOnce();
        
        await connectDB();

        expect(mongoose.connect).toHaveBeenCalledWith(
            process.env.MONGODB_URI || "mongodb://mongodb:27017/restaurantDB",
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }
        );
    });

    it("should log an error and exit process if connection fails", async () => {
        const error = new Error("Connection failed");
        jest.spyOn(mongoose, "connect").mockRejectedValueOnce(error);
        const consoleErrorMock = jest.spyOn(console, "error").mockImplementation();
        const processExitMock = jest.spyOn(process, "exit").mockImplementation(() => {});
        
        await connectDB();
        
        expect(consoleErrorMock).toHaveBeenCalledWith("🔴 Error connecting to MongoDB:", error);
        expect(processExitMock).toHaveBeenCalledWith(1);

        consoleErrorMock.mockRestore();
        processExitMock.mockRestore();
    });
})