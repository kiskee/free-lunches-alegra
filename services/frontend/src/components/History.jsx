import { useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  fetchHistoryItemCount,
  fetchHistoryItems,
  deleteAllHistory,
} from "@/services/historyBD.service";
import { useInitialFetch } from "@/hooks/useInitialFetch";
import { AlertDelete } from "./AlertDelete";

export default function History() {
  const { count, items, setCount, setItems } = useInitialFetch(
    fetchHistoryItemCount,
    fetchHistoryItems
  );

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8082");

    socket.onmessage = (event) => {
      try {
        const mensaje = JSON.parse(event.data);

        if (mensaje.evento === "orderCreated") {
          setItems((prev) => [mensaje.data, ...prev]); // Agrega nuevos mensajes sin sobrescribir
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

  return (
    <>
      <div className="grid grid-cols-1 grid-rows-10 gap-4 bg-white h-full text-center">
        {/* Header */}
        <div className="flex flex-row justify-between items-center px-4 py-6 border-b">
          <h2 className="text-2xl font-bold">Orders Sent To Kitchen</h2>
          <h2 className="text-2xl font-bold">
            Count: <span className="text-orange-600">{count}</span>
          </h2>
          <AlertDelete
            deleteAllHistory={deleteAllHistory}
            setItems={setItems}
            setCount={setCount}
          />
        </div>

        {/* Table Header */}
        <div className="flex flex-row justify-between px-6 py-2 pb-8 border-b">
          <h3>ID:</h3>
          <h3>Name:</h3>
          <h3>Status:</h3>
        </div>

        {/* Orders List */}
        <div className="row-span-8 h-fit w-full">
          <ScrollArea className="h-[300px] w-full rounded-md p-4">
            {items.length > 0 ? (
              <ul>
                {items.map((order, index) => (
                  <li
                    key={index}
                    className="flex flex-row justify-between w-full px-6 py-2 border-b"
                  >
                    <p>{order.id}</p>
                    <p>{order.name}</p>
                    <p>{order.status}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center">No Orders to show..</p>
            )}
          </ScrollArea>
        </div>
      </div>
    </>
  );
}
