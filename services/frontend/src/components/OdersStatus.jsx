import { ScrollArea } from "@/components/ui/scroll-area";
import {
  fetchStatusItems,
  fetchStatusItemCount,
  deleteAllStatus,
} from "@/services/historyBD.service";
import { useInitialFetch } from "@/hooks/useInitialFetch";
import { AlertDelete } from "./AlertDelete";
import useWebSocket from "@/hooks/useWebSocket";

/**
 * OrderStatus Component
 * Displays a list of completed orders.
 * Fetches initial data from the API and updates dynamically via WebSocket.
 */
export default function OrderStatus() {
  // Fetch initial order status count and items
  const { count, items, setCount, setItems } = useInitialFetch(
    fetchStatusItemCount,
    fetchStatusItems
  );

  // Establish WebSocket connection to receive real-time updates for completed orders
  useWebSocket("ws://localhost:8082", setItems, setCount, "ordenFinalizada");

  return (
    <>
      <div className="grid grid-cols-1 grid-rows-10 gap-4 bg-white h-full text-center">
        {/* Header Section */}
        <div className="flex flex-row justify-between items-center px-4 py-6 border-b">
          <h2 className="text-2xl font-bold">Orders Finished</h2>
          <h2 className="text-2xl font-bold">
            Count Finished: <span className="text-orange-600">{count}</span>
          </h2>
          {/* Delete all finished orders */}
          <AlertDelete
            deleteAllHistory={deleteAllStatus}
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
                    className="flex flex-row justify-between w-full pl-6 pr-6 border-b"
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
