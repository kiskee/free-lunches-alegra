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
        <div className="p-4">
          <h1 className="text-2xl font-bold text-center mb-4 text-white">
            Recipes
          </h1>
          <div className="grid gap-2">
            {RECIPES.map((recipe, index) => (
              <div
                key={index}
                className="bg-black shadow-md rounded-lg p-4 border border-black ring-1 ring-blue-500/20 shadow-blue-400/30 "
              >
                <h2 className="text-lg font-semibold text-blue-500 text-center">
                  {recipe.name}
                </h2>
                <ul className="mt-2 text-sm text-white grid grid-cols-2 gap-x-4 gap-y-1">
                  {Object.entries(recipe.ingredients).map(
                    ([ingredient, amount]) => (
                      <li key={ingredient} className="flex justify-between">
                        <span>{ingredient}</span>
                        <span className="font-bold text-orange-500">
                          {amount}
                        </span>
                      </li>
                    )
                  )}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }
  