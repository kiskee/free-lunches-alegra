import { useState, useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  fetchTripsItems,
  fetchTripsItemCount,
  deleteAlltrips,
} from "@/services/shippingMallDB.service";

export default function ShoppingMall() {
  const [goToMall, setGoToMall] = useState([]);
  const [count, setCount] = useState(0);
  const historyRef = useRef(null);

  useEffect(() => {
    const initialValues = async () => {
      try {
        const total = await fetchTripsItemCount();
        setCount(total);

        const items = await fetchTripsItems();
        setGoToMall(items);
      } catch (error) {}
    };
    initialValues();
  }, []);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8084");

    socket.onmessage = (event) => {
      try {
        const mensaje = JSON.parse(event.data);
        console.log("el mensaje de mall", mensaje);
        setGoToMall((prev) => [mensaje.data, ...prev]); // Agrega nuevos mensajes sin sobrescribir
        setCount((prevCount) => prevCount + 1);
      } catch (error) {
        console.error("Error al procesar el mensaje:", error);
      }
    };

    return () => {
      socket.close();
    };
  }, []);

  const handleDeleteTrips = async () => {
    try {
      await deleteAlltrips();
      setGoToMall([]);
      setCount(0);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight;
    }
  }, [goToMall]);

  return (
    <>
      <div className="h-full">
        <div className="bg-white border border-gray-200 p-4">
          <h2 className="text-lg font-bold mb-2 text-center">
            Shopping mall - Trips count: {count}{" "}
            <button
              className="bg-red-500 text-white rounded px-4 py-2 hover:bg-red-600 transition"
              onClick={handleDeleteTrips}
            >
              Delete Trips
            </button>
          </h2>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-orange-500 text-orange-700">
              <th className="p-2">Ingredient</th>
              <th className="p-2">Response from store</th>
            </tr>
          </thead>
        </table>
        <ScrollArea
          className="h-[400px] w-full rounded-md border p-4 "
          ref={historyRef}
        >
          {goToMall.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <tbody>
                {goToMall.map((mall, index) => (
                  <tr key={index} className="border-b border-orange-500/30">
                    <td className="p-2">{mall.ingredient}</td>
                    <td className="p-2">{mall.response}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center">There are no trips to the mall yet</p>
          )}
        </ScrollArea>
      </div>
    </>
  );
}
