import { useState, useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  fetchStatusItems,
  fetchStatusItemCount,
  deleteAllStatus,
} from "@/services/historyBD.service";

export default function OrderStatus() {
  const [orderStatus, setOrderStatus] = useState([]); // Estado inicial como array vacío
  const [count, setCount] = useState(0);
  const historyRef = useRef(null);

  useEffect(() => {
    const setInitialValues = async () => {
      try {
        const total = await fetchStatusItemCount();
        setCount(total);

        const items = await fetchStatusItems();
        setOrderStatus(items);
      } catch (error) {
        console.log(error);
      }
    };
    setInitialValues();
  }, []);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8082");

    socket.onmessage = (event) => {
      try {
        const mensaje = JSON.parse(event.data);
        if (mensaje.evento === "ordenFinalizada") {
          setOrderStatus((prev) => [mensaje.data, ...prev]); // Agrega nuevos mensajes sin sobrescribir
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
  }, [orderStatus]);

  const handleDeteleStatus = async () => {
    try {
      await deleteAllStatus();
      setOrderStatus([]);
      setCount(0);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
     <div className="grid grid-cols-1 grid-rows-10 gap-4 bg-white h-full text-center">
        {/* Header */}
        <div className="flex flex-row justify-between items-center px-4 py-6 border-b">
          <h2 className="text-2xl font-bold">Orders Finished</h2>
          <h2 className="text-2xl font-bold">Count Finished: <span className="text-orange-600">{count}</span></h2>
          <button
            className="bg-orange-600 text-white rounded px-4 py-2 cursor-pointer z-10"
            onClick={handleDeteleStatus}
          >
            Delete History
          </button>
        </div>

        {/* Table Header */}
        <div className="flex flex-row justify-between px-6 py-2 pb-8 border-b">
          <h3>ID:</h3>
          <h3>Name:</h3>
          <h3>Status:</h3>
        </div>


        <div className="row-span-8 h-fit w-full">
          <ScrollArea className="h-[300px] w-full rounded-md p-4 ">
            {orderStatus.length > 0 ? (
              <ul>
                {orderStatus.map((order, index) => (
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

// import { useState, useEffect, useRef } from "react";

// export default function OrdersStatus() {
//   const [orderStatus, setOrderStatus] = useState([]); // Estado inicial como array vacío
//   const [count, setCount] = useState(0);
//   const historyRef = useRef(null);

//   useEffect(() => {
//     const socket = new WebSocket("ws://54.87.1.10:8082");

//     socket.onmessage = (event) => {
//       try {
//         const mensaje = JSON.parse(event.data);
//         if (mensaje.evento === "ordenFinalizada") {
//           setOrderStatus((prev) => [...prev, mensaje]); // Agrega nuevos mensajes sin sobrescribir
//           setCount((prevCount) => prevCount + 1);
//         }
//       } catch (error) {
//         console.error("Error al procesar el mensaje:", error);
//       }
//     };

//     return () => {
//       socket.close();
//     };
//   }, []);

//   useEffect(() => {
//     if (historyRef.current) {
//       historyRef.current.scrollTop = historyRef.current.scrollHeight;
//     }
//   }, [orderStatus]);

//   return (
//     <div className="w-full h-full p-6 bg-black border border-black rounded-lg shadow-2xl ring-1 ring-orange-500/20 text-center text-white shadow-orange-400/30">
//       <h5 className="mb-2 text-2xl font-bold tracking-tight text-orange-700">
//         Orders Status    Oders Count: {count}
//       </h5>
//       <table className="w-full text-left border-collapse">
//         <thead>
//           <tr className="border-b border-orange-500 text-orange-700">
//             <th className="p-2">ID</th>
//             <th className="p-2">Name</th>
//             <th className="p-2">Status</th>
//           </tr>
//         </thead>
//       </table>
//       {/* Contenedor con tabla y scroll */}
//       <div className="text-white h-70 overflow-y-auto p-3" ref={historyRef}>
//         {orderStatus.length > 0 ? (
//           <table className="w-full text-left border-collapse">
//             <tbody>
//               {orderStatus.map((order, index) => (
//                 <tr key={index} className="border-b border-orange-500/30">
//                   <td className="p-2">{order.data.id}</td>
//                   <td className="p-2">{order.data.name}</td>
//                   <td className="p-2">{order.data.status}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         ) : (
//           <p className="text-center">No Orders to show..</p>
//         )}
//       </div>
//     </div>
//   );
// }
