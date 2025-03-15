import { ScrollArea } from "@/components/ui/scroll-area"; // Import ScrollArea component for scrolling
import {
  fetchHistoryItemCount,
  fetchHistoryItems,
  deleteAllHistory,
} from "@/services/historyBD.service"; // Import functions for fetching and deleting history data
import { useInitialFetch } from "@/hooks/useInitialFetch"; // Custom hook to fetch initial data
import { AlertDelete } from "./AlertDelete"; // Import AlertDelete component for confirmation dialog
import useWebSocket from "@/hooks/useWebSocket"; // Custom hook to handle WebSocket connection

/**
 * History Component
 * Displays a list of orders sent to the kitchen with a live count and delete functionality.
 */
export default function History() {
  // Fetch initial history data and item count
  const { count, items, setCount, setItems } = useInitialFetch(
    fetchHistoryItemCount,
    fetchHistoryItems
  );

  // Establish WebSocket connection to receive real-time updates for new orders
  useWebSocket("ws://localhost:8082", setItems, setCount, "orderCreated");

  return (
    <>
      <div className="grid grid-cols-1 grid-rows-10 gap-4 bg-white h-full text-center">
        {/* Header section */}
        <div className="flex flex-row justify-between items-center px-4 py-6 border-b">
          <h2 className="text-2xl font-bold">Orders Sent To Kitchen</h2>
          <h2 className="text-2xl font-bold">
            Count: <span className="text-orange-600">{count}</span>
          </h2>
          {/* Delete history button with confirmation dialog */}
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
              // Message when no orders are available
              <p className="text-center">No Orders to show..</p>
            )}
          </ScrollArea>
        </div>
      </div>
    </>
  );
}
