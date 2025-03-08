import { useState, useEffect, useRef } from "react";

export default function ShoppingMall() {
  const [goToMall, setGoToMall] = useState([]);
  const [count, setCount] = useState(0)
  const historyRef = useRef(null);

  useEffect(() => {
    const socket = new WebSocket("ws://54.87.1.10:8084");

    socket.onmessage = (event) => {
      try {
        const mensaje = JSON.parse(event.data);

        setGoToMall((prev) => [...prev, mensaje]); // Agrega nuevos mensajes sin sobrescribir
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
      <div className="w-full h-full p-6 bg-black border border-black rounded-lg shadow-2xl ring-1 ring-orange-500/20 text-center text-white shadow-orange-400/30 ">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-orange-700">
          SHopping Mall -- trips: {count}
        </h5>
        {/* Contenedor con tabla y scroll */}
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-orange-500 text-orange-700">
              <th className="p-2">Ingredient</th>
              <th className="p-2">Response from store</th>
            </tr>
          </thead>
        </table>
        <div className="text-white h-100 overflow-y-auto p-3" ref={historyRef}>
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
        </div>
      </div>
    </>
  );
}
