import { useState, useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function History() {
  const [orders, setOrders] = useState([]);
  const [count, setCount] = useState(0);
  const historyRef = useRef(null);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8082");

    socket.onmessage = (event) => {
      try {
        const mensaje = JSON.parse(event.data);

        if (mensaje.evento === "orderCreated") {
          setOrders((prev) => [mensaje, ...prev]); // Agrega nuevos mensajes sin sobrescribir
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

  return (
    <>
      <div className="h-full">
        <div className="bg-white border border-gray-200 p-4">
          <h2 className="text-lg font-bold mb-2 text-center">History</h2>
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
                    <td className="p-1.5 truncate">{order.data.id}</td>
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
