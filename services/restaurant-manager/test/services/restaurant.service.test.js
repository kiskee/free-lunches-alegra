// Import modules to test
jest.mock('../../services/RestaurantService', () => {
    return jest.fn().mockImplementation(() => {
      return {
        selectRandomRecipe: jest.fn().mockReturnValue("Mocked Recipe")
      };
    });
  });
const RestaurantService = require('../../src/services/restaurant.service');
const { enviarOrdenFinalizada } = require('../../src/services/ws.service');
const StatusDBService = require('../../src/db/statusDB.service');


// Mock dependencies
jest.mock('../../src/services/ws.service', () => ({
  enviarOrdenFinalizada: jest.fn()
}));

jest.mock('../../src/db/statusDB.service', () => ({
  createStatusRecord: jest.fn()
}));


jest.mock(
    "/app/shared/constants/ingredients",
    () => ({
      RECIPES: [
        {
          id: "mock-recipe-1",
          name: "Mock Pizza",
          ingredients: ["tomato", "cheese", "dough"],
          time: 20,
        },
        {
          id: "mock-recipe-2",
          name: "Mock Burger",
          ingredients: ["meat", "bun", "lettuce"],
          time: 15,
        },
      ],
    }),
    { virtual: true }
  );
  
  
  // Import after mocking to get the mocked version
  const { RECIPES } = require('/app/shared/constants/ingredients');
  
  describe('RestaurantService', () => {
    let restaurantService;
  
    beforeEach(() => {
      restaurantService = new RestaurantService();
      jest.clearAllMocks();
    });
  
    describe('selectRandomRecipe', () => {
      it('should select a random recipe from RECIPES array', () => {
        // Mock Math.random to return predictable values
        const mockMath = Object.create(global.Math);
        mockMath.random = jest.fn().mockReturnValue(0.5);
        global.Math = mockMath;
  
        // Act
        const result = restaurantService.selectRandomRecipe();
  
        // Assert
        expect(RECIPES).toContain(result);
        // Since we mocked Math.random to return 0.5, we expect the second element
        // (0.5 * 2 = 1, which gets floor'd to 1, which is the index of the second element)
        expect(result).toEqual(RECIPES[1]);
        expect(result.id).toBe("mock-recipe-2");
        expect(result.name).toBe("Mock Burger");
      });
  
      it('should be able to select the first recipe', () => {
        // Mock Math.random to return 0, which will select the first recipe
        const mockMath = Object.create(global.Math);
        mockMath.random = jest.fn().mockReturnValue(0);
        global.Math = mockMath;
  
        // Act
        const result = restaurantService.selectRandomRecipe();
  
        // Assert
        expect(result).toEqual(RECIPES[0]);
        expect(result.id).toBe("mock-recipe-1");
        expect(result.name).toBe("Mock Pizza");
      });
    });
  
    describe('finalizedOder', () => {
      it('should process a finalized order with properly formatted message', async () => {
        // Arrange
        const topic = 'test-topic';
        const orderData = {
          id: '123',
          name: 'Test Order',
          status: 'completed'
        };
        const message = {
          value: Buffer.from(JSON.stringify(orderData))
        };
  
        // Act
        await restaurantService.finalizedOder(topic, message);
  
        // Assert
        expect(enviarOrdenFinalizada).toHaveBeenCalledWith('ordenFinalizada', orderData);
        expect(StatusDBService.createStatusRecord).toHaveBeenCalledWith({
          id: orderData.id,
          name: orderData.name,
          status: orderData.status
        });
      });
  
      it('should handle double-stringified JSON messages', async () => {
        // Arrange
        const topic = 'test-topic';
        const orderData = {
          id: '456',
          name: 'Double Stringified Order',
          status: 'completed'
        };
        const doubleStringified = JSON.stringify(JSON.stringify(orderData));
        const message = {
          value: Buffer.from(doubleStringified)
        };
  
        // Act
        await restaurantService.finalizedOder(topic, message);
  
        // Assert
        expect(enviarOrdenFinalizada).toHaveBeenCalledWith('ordenFinalizada', orderData);
        expect(StatusDBService.createStatusRecord).toHaveBeenCalledWith({
          id: orderData.id,
          name: orderData.name,
          status: orderData.status
        });
      });
  
      it('should handle errors without crashing', async () => {
        // Arrange
        const topic = 'test-topic';
        const message = {
          value: Buffer.from('invalid-json-format')
        };
        
        // Spy on console.error
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
  
        // Act
        await restaurantService.finalizedOder(topic, message);
  
        // Assert
        expect(consoleErrorSpy).toHaveBeenCalled();
        expect(enviarOrdenFinalizada).not.toHaveBeenCalled();
        expect(StatusDBService.createStatusRecord).not.toHaveBeenCalled();
        
        // Restore console.error
        consoleErrorSpy.mockRestore();
      });
    });
  });