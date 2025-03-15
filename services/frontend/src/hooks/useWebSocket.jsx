import { useEffect } from "react";

/**
 * Custom hook to manage a WebSocket connection.
 * Listens for messages and updates state accordingly.
 *
 * @param {string} url - The WebSocket URL.
 * @param {Function} setItems - Function to update the list of items.
 * @param {Function|null} setCount - Optional function to update the count.
 * @param {string|null} topic - Optional topic filter for incoming messages.
 */
const useWebSocket = (url, setItems, setCount = null, topic = null) => {
  useEffect(() => {
    if (!url) return;

    const socket = new WebSocket(url);

     /**
     * Handles incoming WebSocket messages.
     * Parses the message and updates state based on the topic.
     */
    socket.onmessage = (event) => {
      try {
        const mensaje = JSON.parse(event.data);

        if (topic === "ingredients") {
          setItems(mensaje.data);
        } else if (!topic || mensaje.evento === topic) {
          setItems((prev) => [mensaje.data, ...prev]);

           // Increment count only if setCount is provided
          if (setCount) {
            setCount((prevCount) => prevCount + 1);
          }
        }
      } catch (error) {
        console.error("Error processing WebSocket message:", error);
      }
    };

     // Cleanup function to close WebSocket connection when component unmounts
    return () => {
      socket.onmessage = null;
      socket.close();
    };
  }, [url, setItems, setCount, topic]);

  return null;  // No return value since this hook only listens to events
};

export default useWebSocket;
