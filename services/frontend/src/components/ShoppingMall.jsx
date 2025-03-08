import { useState, useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ShoppingMall() {
  const [goToMall, setGoToMall] = useState([]);
  const [count, setCount] = useState(0)
  const historyRef = useRef(null);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8084");

    socket.onmessage = (event) => {
      try {
        const mensaje = JSON.parse(event.data);

        setGoToMall((prev) => [mensaje, ...prev]); // Agrega nuevos mensajes sin sobrescribir
        setCount((prevCount) => prevCount + 1);
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
  }, [goToMall]);

  return (
    <>
      <div className="h-full">
        <div className="bg-white border border-gray-200 p-4">
          <h2 className="text-lg font-bold mb-2 text-center">Shopping mall</h2>
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
                    <td className="p-2">{mall.data.ingredient}</td>
                    <td className="p-2">{mall.data.response}</td>
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
