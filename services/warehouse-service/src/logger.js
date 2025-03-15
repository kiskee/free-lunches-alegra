const pino = require("pino");

// 📂 Ensure the logs directory exists
// 📂 Absolute path inside the container
const logDir = "/app/logs";

// 🚀 Configure logging transports
const logger = pino({
  level: "debug", // Capture logs from 'debug' level and above
  transport: {
    targets: [
      {
        target: "pino-pretty", // 👀 Pretty format for console output
        options: { colorize: true, translateTime: "HH:MM:ss Z" },
        level: "debug",
      },
      {
        target: "pino/file", // 📁 Save logs to a file
        options: { destination: `${logDir}/warehouseApp.log`, mkdir: true },
        level: "info", // Only 'info' and more critical logs go to the file
      },
      {
        target: "pino/file", // 📁 Save only error logs in a separate file
        options: { destination: `${logDir}/warehouseErrors.log`, mkdir: true },
        level: "error",
      },
    ],
  },
});

module.exports = logger;