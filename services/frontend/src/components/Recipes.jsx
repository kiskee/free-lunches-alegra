import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

const RECIPES = [
  {
    name: "Chicken Rice Bowl",
    ingredients: {
      chicken: 2,
      rice: 1,
      tomato: 1,
      lettuce: 1,
    },
  },
  {
    name: "Cheesy Potato Bake",
    ingredients: {
      potato: 3,
      cheese: 2,
      onion: 1,
      ketchup: 1,
    },
  },
  {
    name: "Lemon Grilled Meat",
    ingredients: {
      meat: 2,
      lemon: 1,
      onion: 1,
      lettuce: 1,
    },
  },
  {
    name: "Tomato Rice Delight",
    ingredients: {
      rice: 2,
      tomato: 2,
      cheese: 1,
      ketchup: 1,
    },
  },
  {
    name: "Chicken Potato Wrap",
    ingredients: {
      chicken: 2,
      potato: 2,
      lettuce: 1,
      onion: 1,
    },
  },
  {
    name: "Cheesy Meat Burger",
    ingredients: {
      meat: 2,
      cheese: 2,
      ketchup: 1,
      lettuce: 1,
    },
  },
];

export default function Recipes() {
  return (
    <>
      <div className="grid grid-cols-6 grid-rows-1 gap-1 h-full p-2">
        {RECIPES.map((recipe, index) => (
          <HoverCard key={index}>
            <HoverCardTrigger asChild>
              <div className="h-full flex items-center justify-center text-center text-white border rounded-md text-2xl font-bold border-slate-600 shadow-md shadow-cyan-500/50 cursor-pointer">
                {recipe.name}
              </div>
            </HoverCardTrigger>
            <HoverCardContent>
              <ul className="w-full space-y-1 flex-grow">
                {Object.entries(recipe.ingredients).map(
                  ([ingredient, quantity]) => (
                    <li
                      key={ingredient}
                      className="flex items-center bg-gray-50 rounded-md p-1.5 text-sm"
                    >
                      <span className="w-2 h-2 bg-gray-500 rounded-full mr-2"></span>
                      <span className="font-medium capitalize">
                        {ingredient}:
                      </span>
                      <span className="ml-auto bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full text-xs font-semibold">
                        {quantity}
                      </span>
                    </li>
                  )
                )}
              </ul>
            </HoverCardContent>
          </HoverCard>
        ))}
      </div>
    </>
  );
}
