import { useState, useEffect } from "react";

export default function Ingredients() {
  // Valores iniciales del inventario
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

  const [ingredients, setIngredients] = useState(initialInventory);

  // Función para capitalizar la primera letra
  const capitalize = (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  };

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

  return (
    <div className="w-full h-full p-6 bg-black border border-black rounded-lg shadow-2xl ring-1 ring-orange-500/20 text-center text-white shadow-orange-400/30">
      <h5 className="mb-2 text-2xl font-bold tracking-tight text-orange-700">
        Inventory
      </h5>
      <div className="grid grid-cols-2 gap-2">
        {Object.entries(ingredients).map(([item, quantity]) => (
          <div key={item} className="p-2 border rounded flex justify-between">
            <span>{capitalize(item)}</span>
            <span className="font-bold">{quantity}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
