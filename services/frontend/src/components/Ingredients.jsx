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
      <div className="h-fit">
      <div className="bg-white border border-gray-200 p-4">
          <h2 className="text-lg font-bold mb-2 text-center">Inventory</h2>
        </div>
        {Object.entries(ingredients).map(([item, quantity]) => (
        <div key={item} className="p-2 border rounded flex justify-between">
          <span>{capitalize(item)}</span>
          <span className="font-bold">{quantity}</span>
        </div>
      ))}
      </div>
      </>
  )
}
