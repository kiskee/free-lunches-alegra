const app = require("./app"); // Importa la aplicación configurada

const PORT = 3003; // O usa process.env.PORT si es necesario

app.listen(PORT, () => {
  console.log(`Warehouse Service running on port ${PORT}`);
});