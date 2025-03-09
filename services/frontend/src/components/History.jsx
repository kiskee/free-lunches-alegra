import { useState, useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  fetchHistoryItemCount,
  fetchHistoryItems,
  deleteAllHistory,
} from "@/services/historyBD.service";

export default function History() {
  const [orders, setOrders] = useState([]);
  const [count, setCount] = useState(0);
  const historyRef = useRef(null);

  useEffect(() => {
    const getCount = async () => {
      const total = await fetchHistoryItemCount();
      setCount(total);

      const items = await fetchHistoryItems();
      console.log(items);
      setOrders(items);
    };
    getCount();
  }, []);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8082");

    socket.onmessage = (event) => {
      try {
        const mensaje = JSON.parse(event.data);

        if (mensaje.evento === "orderCreated") {
          setOrders((prev) => [mensaje.data, ...prev]); // Agrega nuevos mensajes sin sobrescribir
          setCount((prevCount) => prevCount + 1);
        }
      } catch (error) {
        console.error("Error al procesar el mensaje:", error);
      }
    };

    return () => {
      socket.close();
    };
  }, []);

  useEffect(() => {
    if (historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight;
    }
  }, [orders]);

  const handleDeleteHistory = async () => {
    try {
      await deleteAllHistory();
      setOrders([])
      setCount(0)
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="h-full">
        <div className="bg-white border border-gray-200 p-4">
          <h2 className="text-lg font-bold mb-2 text-center">
            History count for history: {count}{" "}
            <button
              className="bg-red-500 text-white rounded px-4 py-2 hover:bg-red-600 transition"
              onClick={handleDeleteHistory}
            >
              Delete History
            </button>
          </h2>
        </div>
        <ScrollArea
          className="h-[400px] w-full rounded-md border p-4 "
          ref={historyRef}
        >
          {orders.length > 0 ? (
            <table className="w-full text-sm border-collapse">
              <tbody>
                {orders.map((order, index) => (
                  <tr
                    key={index}
                    className="border-b border-orange-500/20 hover:bg-orange-50/50"
                  >
                    <td className="p-1.5 truncate">{order.id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center">No Orders to show..</p>
          )}
        </ScrollArea>
      </div>
    </>
  );
}
