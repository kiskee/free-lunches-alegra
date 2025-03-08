// Mapa de colores para los ingredientes
const ingredientColors = {
    chicken: { dot: 'bg-orange-500', badge: 'bg-orange-100 text-orange-800' },
    rice: { dot: 'bg-yellow-200', badge: 'bg-yellow-50 text-yellow-700' },
    tomato: { dot: 'bg-red-500', badge: 'bg-red-100 text-red-800' },
    lettuce: { dot: 'bg-green-500', badge: 'bg-green-100 text-green-800' },
    cheese: { dot: 'bg-yellow-400', badge: 'bg-yellow-100 text-yellow-800' },
    potato: { dot: 'bg-amber-600', badge: 'bg-amber-100 text-amber-800' },
    onion: { dot: 'bg-purple-300', badge: 'bg-purple-100 text-purple-800' },
    ketchup: { dot: 'bg-red-600', badge: 'bg-red-100 text-red-800' },
    meat: { dot: 'bg-red-700', badge: 'bg-red-100 text-red-800' },
    lemon: { dot: 'bg-yellow-300', badge: 'bg-yellow-100 text-yellow-800' },
  };

export default function RecipeCard({ recipe }) {
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
      <div className="bg-yellow-50 p-3 border-b border-yellow-100">
        <h1 className="text-lg font-bold text-gray-800 text-center truncate">
          {recipe.name}
        </h1>
      </div>

      <div className="p-3 flex-grow flex flex-col">
        <p className="font-medium text-gray-700 mb-2 text-center text-sm">
          Ingredients:
        </p>

        <ul className="w-full space-y-1 flex-grow">
          {Object.entries(recipe.ingredients).map(([ingredient, quantity]) => (
            <li
              key={ingredient}
              className="flex items-center bg-gray-50 rounded-md p-1.5 text-sm"
            >
              <span
                className={`w-2 h-2 ${
                  ingredientColors[ingredient]?.dot || "bg-gray-500"
                } rounded-full mr-2`}
              ></span>
              <span className="font-medium capitalize">{ingredient}:</span>
              <span
                className={`ml-auto ${
                  ingredientColors[ingredient]?.badge ||
                  "bg-gray-100 text-gray-800"
                } px-2 py-0.5 rounded-full text-xs font-semibold`}
              >
                {quantity}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
