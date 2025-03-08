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
      const response = await axios.post("api/order");

      setOrderStatus(response.data);
      setLoading(false);
    } catch (err) {
      setError("Error to process order: " + err.message);
      setLoading(false);
    }
  };
  return (
    <>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
        <button
          className="bg-red-600 hover:bg-red-700 text-white font-bold w-40 h-40 rounded-full shadow-lg flex items-center justify-center text-xl"
          onClick={handleSubmitOrder}
          disabled={loading}
        >
          {loading ? "Processing..." : "Order Random Dish"}
        </button>
      </div>
    </>
  );
}
