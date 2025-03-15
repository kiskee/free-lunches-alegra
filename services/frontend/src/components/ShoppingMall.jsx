import { useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  fetchTripsItems,
  fetchTripsItemCount,
  deleteAlltrips,
} from "@/services/shippingMallDB.service";
import { useInitialFetch } from "@/hooks/useInitialFetch";
import { AlertDelete } from "@/components/AlertDelete";

export default function ShoppingMall() {
  const { count, items, setCount, setItems } = useInitialFetch(
    fetchTripsItemCount,
    fetchTripsItems
  );

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8084");

    socket.onmessage = (event) => {
      try {
        const mensaje = JSON.parse(event.data);
        setItems((prev) => [mensaje.data, ...prev]); // Agrega nuevos mensajes sin sobrescribir
        setCount((prevCount) => prevCount + 1);
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
        <div className="flex flex-row justify-between items-center px-4 py-6 border-b pr-14">
          <h2 className="text-2xl font-bold"> Shopping mall</h2>
          <AlertDelete
            deleteAllHistory={deleteAlltrips}
            setItems={setItems}
            setCount={setCount}
          />
          <h2 className="text-2xl font-bold">
            Trips count: <span className="text-orange-600">{count}</span>
          </h2>
        </div>

        {/* Table Header */}
        <div className="flex flex-row justify-between px-56 py-2 pb-8 border-b">
          <h3>Ingredient:</h3>
          <h3>Response from store:</h3>
        </div>

        <div className="row-span-8 h-fit w-full">
          <ScrollArea className="h-[300px] w-full rounded-md p-4 ">
            {items.length > 0 ? (
              <ul>
                {items.map((mall, index) => (
                  <li
                    key={index}
                    className="flex flex-row justify-between w-full pl-56  pr-56 border-b"
                  >
                    <p>{mall.ingredient}</p>
                    <p>{mall.response}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center">There are no trips to the mall yet</p>
            )}
          </ScrollArea>
        </div>
      </div>
    </>
  );
}
