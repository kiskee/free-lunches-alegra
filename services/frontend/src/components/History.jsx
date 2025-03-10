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
      <div className="grid grid-cols-1 grid-rows-10 gap-4 bg-white h-full items-center text-center">
        <div className="flex flex-row justify-between pl-4">
          <h2 className="text-2xl font-bold pt-6"> Orders Sent To Kitchen</h2>
          <h2 className="text-2xl font-bold pt-6"> Count: {count}</h2>
          <div className="pt-6">
            <button
              className="bg-red-500 text-white rounded px-4 py-2 hover:bg-red-600 transition"
              onClick={handleDeleteHistory}
            >
              Delete History
            </button>
          </div>
        </div>
        <div className="flex flex-row justify-between pl-6  pr-6 pb-2 pt-12 border-b-2 ">
          <h3>id:</h3>
          <h3>Name:</h3>
          <h3>Status:</h3>
        </div>
        <div className="row-span-8 h-fit w-full">
          <ScrollArea className="h-[300px] w-full rounded-md p-4 ">
            {orders.length > 0 ? (
              <ul>
                {orders.map((order, index) => (
                  <li
                    key={index}
                    className="flex flex-row justify-between w-full pl-6 pr-6 border-b"
                  >
                    <p>{order.id}</p>
                    <p>{order.name} </p>
                    <p> {order.status}</p>
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
