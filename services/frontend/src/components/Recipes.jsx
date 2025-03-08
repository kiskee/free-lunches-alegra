import RecipeCard from "./RecipeCard";

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
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 p-2 h-1/4 bg-gray-100">
        {RECIPES.map((recipe, index) => (
          <div key={index} className="h-full">
            <RecipeCard recipe={recipe} />
          </div>
        ))}
      </div>
    </>
  );
}
