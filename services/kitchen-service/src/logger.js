const pino = require("pino");

const logger = pino({
  level: "debug", // Captura logs desde 'debug' hacia arriba
  transport: {
    target: "pino-pretty",
    options: { colorize: true, translateTime: "HH:MM:ss Z" },
  },
});

logger.info("🚀 Pino logger initialized!"); // 👈 Verificamos si esto se imprime

module.exports = logger;
// const pino = require("pino");
// const fs = require("fs");
// const path = require("path");

// // 📂 Asegura que la carpeta logs exista
// const logDir = path.join(__dirname, "logs");
// if (!fs.existsSync(logDir)) {
//   fs.mkdirSync(logDir);
// }

// // 🚀 Configura los transportes
// const logger = pino({
//   level: "debug", // Captura logs desde 'debug' hacia arriba
//   transport: {
//     targets: [
//       {
//         target: "pino-pretty", // 👀 Formato bonito en consola
//         options: { colorize: true, translateTime: "HH:MM:ss Z" },
//         level: "debug",
//       },
//       {
//         target: "pino/file", // 📁 Guarda logs en un archivo
//         options: { destination: `${logDir}/app.log`, mkdir: true },
//         level: "info", // Solo logs de info o más críticos van al archivo
//       },
//       {
//         target: "pino/file", // 📁 Guarda solo errores en un archivo aparte
//         options: { destination: `${logDir}/error.log`, mkdir: true },
//         level: "error",
//       },
//     ],
//   },
// });

// module.exports = logger;
