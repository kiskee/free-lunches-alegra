import { useState, useEffect } from "react";
import axios from "axios";
import Layaut from "./components/Layaut";

function App() {
  const [orderStatus, setOrderStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8082');

    socket.onmessage = (event) => {
      //const mensaje = JSON.parse(event.data);
     // setEventos((prev) => [...prev, mensaje]); // Agregar al estado
     console.log("por aca me llego el eventicocococococococococ", event)
    };

    return () => socket.close();
  }, []);

  // Enviar la orden al servicio restaurant-manager
  const handleSubmitOrder = async () => {
    try {
      setLoading(true);
      setError(null);
      setOrderStatus(null);

      // Llamada al endpoint para ordenar
      const response = await axios.post("/api/order");

      setOrderStatus(response.data);
      setLoading(false);
    } catch (err) {
      setError("Error to process order: " + err.message);
      setLoading(false);
    }
  };
  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl m-4 p-6">
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
        Free Lunches by Alegra
      </h2>

      {loading && (
        <div className="flex justify-center items-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
          <p>{error}</p>
        </div>
      )}

      <div className="flex justify-center mb-6">
        <p className="text-gray-600 text-center">
          Press the button to order a random dish from the menu
        </p>
      </div>

      <button
        onClick={handleSubmitOrder}
        disabled={loading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed"
      >
        {loading ? "Processing..." : "Order Random Dish"}
      </button>

      {orderStatus && (
        <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Order Status
          </h3>

          <div className="space-y-3">
            <div className="flex">
              <span className="font-medium text-gray-500 w-32">Status:</span>
              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                {orderStatus.status}
              </span>
            </div>

            <div className="flex">
              <span className="font-medium text-gray-500 w-32">Message:</span>
              <span className="text-gray-900">{orderStatus.message}</span>
            </div>

            {orderStatus.recipe && (
              <>
                <div className="flex">
                  <span className="font-medium text-gray-500 w-32">
                    Recipe:
                  </span>
                  <span className="text-gray-900 font-semibold">
                    {orderStatus.recipe.name}
                  </span>
                </div>

                <div>
                  <span className="font-medium text-gray-500 block mb-2">
                    Ingredients:
                  </span>
                  <ul className="bg-white rounded-md p-3 border border-gray-200">
                    {Object.entries(orderStatus.recipe.ingredients).map(
                      ([ingredient, quantity]) => (
                        <li
                          key={ingredient}
                          className="flex justify-between py-1"
                        >
                          <span className="capitalize">{ingredient}</span>
                          <span className="text-gray-600">
                            {quantity} {quantity === 1 ? "unidad" : "unidades"}
                          </span>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
