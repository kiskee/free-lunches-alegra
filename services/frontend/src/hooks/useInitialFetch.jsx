import { useState, useEffect } from "react";

export const useInitialFetch = (fetchCount, fetchItems) => {
  const [count, setCount] = useState(0);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true); // Estado de carga
  const [error, setError] = useState(null); // Estado de error

  useEffect(() => {
    const setInitialValues = async () => {
      setLoading(true); // Iniciar la carga
      setError(null); // Limpiar errores previos

      try {
        // Obtener el conteo y los elementos
        const [total, data] = await Promise.all([
          fetchCount(),
          fetchItems(),
        ]);

        setCount(total);
        setItems(data);
      } catch (err) {
        console.error("Error fetching initial values:", err);
        setError(err); // Guardar el error
      } finally {
        setLoading(false); // Finalizar la carga (tanto en éxito como en error)
      }
    };

    setInitialValues();
  }, [fetchCount, fetchItems]);

  return { count, items, loading, error, setCount, setItems };
};