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
      } catch (error) {
        console.log(error);
      }
    };
    initialValues();
  }, []);

  useEffect(() => {
    const socket = new WebSocket("ws://52.72.210.91:8084");

    socket.onmessage = (event) => {
      try {
        const mensaje = JSON.parse(event.data);
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
      <div className="grid grid-cols-1 grid-rows-10 gap-4 bg-white h-full text-center">
        {/* Header */}
        <div className="flex flex-row justify-between items-center px-4 py-6 border-b pr-14">
          <h2 className="text-2xl font-bold"> Shopping mall</h2>

          <button
            className="bg-orange-600 text-white rounded px-4 py-2 cursor-pointer z-10 "
            onClick={handleDeleteTrips}
          >
            Delete History
          </button>
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
            {goToMall.length > 0 ? (
              <ul>
                {goToMall.map((mall, index) => (
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
