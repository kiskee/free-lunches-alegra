import History from "./components/History";
import Ingredients from "./components/Ingredients";
import Recipes from "./components/Recipes";
import Order from "./components/Order";
import OrderStatus from "./components/OdersStatus";
import ShoppingMall from "./components/ShoppingMall";

function App() {
  return (
    <>
      <div className="grid grid-cols-6 grid-rows-7 gap-1 h-screen">
        <div className="col-span-6 bg-black">
          <Recipes />
        </div>
        <div className="col-span-3 row-span-3 row-start-2 bg-black">
          <OrderStatus />
        </div>
        <div className="col-span-3 row-span-3 col-start-4 row-start-2 bg-black">
          <History />
        </div>
        <div className="col-span-3 row-span-3 row-start-5 bg-black">
          <ShoppingMall />
        </div>
        <div className="col-span-3 row-span-3 col-start-4 row-start-5 bg-black">
          <Ingredients />
        </div>
        <Order />
      </div>
    </>
  );
}

export default App;
