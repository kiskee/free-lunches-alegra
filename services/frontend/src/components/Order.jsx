import axios from "axios";
import { useState } from "react";

/**
 * Order Component
 * Displays a button that submits an order request.
 * Handles loading state while the request is being processed.
 */
export default function Order() {
  const [loading, setLoading] = useState(false);

  /**
   * Handles order submission by making an API request.
   * Disables the button while the request is in progress.
   */
  const handleSubmitOrder = async () => {
    try {
      setLoading(true);
      // API request to place an order
      await axios.post("api/order");
    } catch (err) {
      console.error("Order submission failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Centered Order Button */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/14 z-10">
        <button
          className="bg-orange-600 text-white font-bold w-30 h-30 rounded-full flex items-center justify-center text-xl shadow-lg shadow-amber-500/50"
          onClick={handleSubmitOrder}
          disabled={loading}
        >
          {loading ? "Processing..." : "Order Random Dish"}
        </button>
      </div>
    </>
  );
}
