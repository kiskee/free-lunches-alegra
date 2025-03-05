const INGREDIENTS = [
    'tomato', 'lemon', 'potato', 'rice', 
    'ketchup', 'lettuce', 'water', 'cheese', 
    'meat', 'chicken'
];

const RECIPES = [
    {
        name: 'Chicken Rice Bowl',
        ingredients: {
            chicken: 2,
            rice: 1,
            tomato: 1,
            lettuce: 1
        }
    },
    {
        name: 'Potato Cheese Delight',
        ingredients: {
            potato: 2,
            cheese: 1,
            ketchup: 1,
            water: 1
        }
    },
    {
        name: 'Meat Salad',
        ingredients: {
            meat: 1,
            lettuce: 1,
            lemon: 1,
            tomato: 1
        }
    },
    {
        name: 'Vegetable Medley',
        ingredients: {
            tomato: 1,
            potato: 1,
            lettuce: 1,
            water: 1
        }
    },
    {
        name: 'Cheesy Chicken',
        ingredients: {
            chicken: 1,
            cheese: 1,
            ketchup: 1,
            lemon: 1
        }
    },
    {
        name: 'Rice Surprise',
        ingredients: {
            rice: 1,
            meat: 1,
            water: 1,
            cheese: 1
        }
    }
];

module.exports = { INGREDIENTS, RECIPES };