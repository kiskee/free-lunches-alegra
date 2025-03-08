import { useState, useEffect, useRef } from "react";

export default function History() {
  const [orders, setOrders] = useState([]);
  const [count, setCount] = useState(0);
  const historyRef = useRef(null);

  useEffect(() => {
    const socket = new WebSocket("ws://restaurant-manager:8082");

    socket.onmessage = (event) => {
      try {
        const mensaje = JSON.parse(event.data);
        //console.log(mensaje)
        if (mensaje.evento === "orderCreated") {
          setOrders((prev) => [...prev, mensaje]); // Agrega nuevos mensajes sin sobrescribir
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
      <div className="w-full h-full p-6 bg-black border border-black rounded-lg shadow-2xl ring-1 ring-orange-500/20 text-center text-white shadow-orange-400/30 ">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-orange-700">
          Orders History
        </h5>
        <h4 className="mb-2 text-2xl font-bold tracking-tight text-orange-700">
          Orders Count: {count}
        </h4>
        <div className="text-white h-70 overflow-y-auto p-3" ref={historyRef}>
          {orders.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <tbody>
                {orders.map((order, index) => (
                  <tr key={index} className="border-b border-orange-500/30">
                    <td className="p-2">{order.data.id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center">No Orders to show..</p>
          )}
        </div>
      </div>
    </>
  );
}
