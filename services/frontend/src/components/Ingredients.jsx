import { useState, useEffect } from "react";
const initialInventory = {
  tomato: 5,
  lemon: 5,
  potato: 5,
  rice: 5,
  ketchup: 5,
  lettuce: 5,
  cheese: 5,
  onion: 5,
  meat: 5,
  chicken: 5,
};

export default function Ingredients() {
  const [ingredients, setIngredients] = useState(initialInventory);
  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8085");

    socket.onmessage = (event) => {
      try {
        const mensaje = JSON.parse(event.data);

        // Actualiza los ingredientes con los datos recibidos
        setIngredients(mensaje.data);
      } catch (error) {
        console.error("Error al procesar el mensaje:", error);
      }
    };

    return () => {
      socket.close();
    };
  }, []);

  const capitalize = (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  };

  return (
    <>
      <div className="flex flex-col h-full max-h-74 m-4 pl-4">
        <div className="bg-white border-b border-gray-200 p-2 sticky top-0 z-10">
          <h2 className="text-lg font-bold text-center">Inventory</h2>
        </div>

        <div className="overflow-auto flex-grow p-2 grid grid-cols-2 gap-2">
          {Object.entries(ingredients).map(([item, quantity]) => {
            return (
              <div
                key={item}
                className="bg-black rounded-lg p-2 flex justify-between items-center shadow-sm"
              >
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full mr-2 bg-red-500"></div>
                  <span className="font-medium text-white">
                    {capitalize(item)}
                  </span>
                </div>
                <span className="font-bold px-2 py-0.5 bg-white rounded-full text-sm">
                  {quantity}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
