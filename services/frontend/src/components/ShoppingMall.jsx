import { ScrollArea } from "@/components/ui/scroll-area";
import {
  fetchTripsItems,
  fetchTripsItemCount,
  deleteAlltrips,
} from "@/services/shippingMallDB.service";
import { useInitialFetch } from "@/hooks/useInitialFetch";
import { AlertDelete } from "@/components/AlertDelete";
import useWebSocket from "@/hooks/useWebSocket";

export default function ShoppingMall() {
  // Fetching trip data and managing state
  const { count, items, setCount, setItems } = useInitialFetch(
    fetchTripsItemCount,
    fetchTripsItems
  );

  // WebSocket connection for real-time updates
  useWebSocket("ws://54.175.210.212:8084", setItems, setCount);

  return (
    <>
      {/* Main Container */}
      <div className="grid grid-cols-1 grid-rows-10 gap-4 bg-white h-full text-center">
        {/* Header Section */}
        <div className="flex flex-row justify-between items-center px-4 py-6 border-b pr-14">
          <h2 className="text-2xl font-bold">Shopping Mall</h2>

          {/* Delete all trips button */}
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

        {/* Scrollable Trip List */}
        <div className="row-span-8 h-fit w-full">
          <ScrollArea className="h-[300px] w-full rounded-md p-4">
            {items.length > 0 ? (
              <ul>
                {items.map((mall, index) => (
                  <li
                    key={index}
                    className="flex flex-row justify-between w-full pl-56 pr-56 border-b"
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
