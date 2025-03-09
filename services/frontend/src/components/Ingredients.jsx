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

const ingredientColors = {
  chicken: {
    bg: "bg-orange-100",
    text: "text-orange-800",
    border: "border-orange-200",
  },
  rice: {
    bg: "bg-yellow-50",
    text: "text-yellow-700",
    border: "border-yellow-200",
  },
  tomato: { bg: "bg-red-100", text: "text-red-800", border: "border-red-200" },
  lettuce: {
    bg: "bg-green-100",
    text: "text-green-800",
    border: "border-green-200",
  },
  cheese: {
    bg: "bg-yellow-100",
    text: "text-yellow-800",
    border: "border-yellow-200",
  },
  potato: {
    bg: "bg-amber-100",
    text: "text-amber-800",
    border: "border-amber-200",
  },
  onion: {
    bg: "bg-purple-100",
    text: "text-purple-800",
    border: "border-purple-200",
  },
  ketchup: { bg: "bg-red-100", text: "text-red-800", border: "border-red-200" },
  meat: { bg: "bg-red-100", text: "text-red-800", border: "border-red-200" },
  lemon: {
    bg: "bg-yellow-100",
    text: "text-yellow-800",
    border: "border-yellow-200",
  },
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
      <div className="flex flex-col h-full">
        <div className="bg-white border-b border-gray-200 p-2 sticky top-0 z-10">
          <h2 className="text-lg font-bold text-center">Inventory</h2>
        </div>

        <div className="overflow-auto flex-grow p-2 grid grid-cols-2 gap-2">
          {Object.entries(ingredients).map(([item, quantity]) => {
            const colors = ingredientColors[item] || {
              bg: "bg-gray-100",
              text: "text-gray-800",
              border: "border-gray-200",
            };

            return (
              <div
                key={item}
                className={`${colors.bg} ${colors.text} border ${colors.border} rounded-lg p-2 flex justify-between items-center shadow-sm`}
              >
                <div className="flex items-center">
                  <div
                    className={`w-2 h-2 rounded-full mr-2 ${colors.text.replace(
                      "text",
                      "bg"
                    )}`}
                  ></div>
                  <span className="font-medium">{capitalize(item)}</span>
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
