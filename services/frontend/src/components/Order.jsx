import axios from "axios";
import { useState, useEffect } from "react";

export default function Order() {
  const [orderStatus, setOrderStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmitOrder = async () => {
    try {
      setLoading(true);
      setError(null);
      setOrderStatus(null);

      // Llamada al endpoint para ordenar
      const response = await axios.post("http://restaurant-manager:3004/order");

      setOrderStatus(response.data);
      setLoading(false);
    } catch (err) {
      setError("Error to process order: " + err.message);
      setLoading(false);
    }
  };
  return (
    <>
      <div className="w-full h-full p-6 bg-black border border-black rounded-lg shadow-2xl ring-1 ring-orange-500/20 text-center text-white shadow-orange-400/30 ">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-orange-700">
          Make your Free and Random order here
        </h5>
        <button
          onClick={handleSubmitOrder}
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed"
        >
          {loading ? "Processing..." : "Order Random Dish"}
        </button>
      </div>
    </>
  );
}
