import History from "./components/History"
import Ingredients from "./components/Ingredients"
import Recipes from "./components/Recipes"
import Layaut from "./components/Layaut"
import Order from "./components/Order"
import OrderStatus from "./components/OdersStatus"
import ShoppingMall from "./components/ShoppingMall"



function App() {


  return (
    <>
      <Layaut>
      {/* Sección superior con 6 divisiones para recetas */}
   
     <Recipes/>
      {/* Contenedor principal de las 4 secciones grandes - ocupa el resto de la pantalla */}
      <div className="relative flex-grow flex flex-col">
        {/* Grid de 2x2 para las cuatro secciones */}
        <div className="grid grid-cols-1 md:grid-cols-2 h-full">
          {/* Área superior izquierda - Status */}
         <OrderStatus/>
          
          {/* Área superior derecha - Shopping mall */}
         <ShoppingMall/>
          
          {/* Área inferior izquierda - History */}
          <History/>
          
          {/* Área inferior derecha - Inventory */}
          <Ingredients/>
        </div>
        
        {/* Botón circular perfectamente centrado en la intersección */}
        <Order/>
      </div>
      </Layaut>
    </>
  )
}

export default App
