const { InventoryService } = require('../../src/services/inventory.service');
const { INGREDIENTS } = require('/app/shared/constants/ingredients');
const { MarketService } = require('../../src/services/market.service');
const { connectProducer, sendMessage } = require('../../src/kafka');
const { sendInventory } = require('../../src/services/wsWarehouse.service');

// Mocks
jest.mock('/app/shared/constants/ingredients', () => ({
  INGREDIENTS: ['flour', 'sugar', 'eggs', 'milk']
}));

jest.mock('../../src/services/market.service');
jest.mock('../../src/kafka');
jest.mock('../../src/services/wsWarehouse.service');

describe('InventoryService', () => {
  let inventoryService;
  
  beforeEach(() => {
    // Limpiar todos los mocks
    jest.clearAllMocks();
    
    // Configurar mocks para comportamiento por defecto
    MarketService.mockImplementation(() => ({
      buyFromMarket: jest.fn().mockResolvedValue(5) // Por defecto, compra 5 unidades
    }));
    
    connectProducer.mockResolvedValue({});
    sendMessage.mockResolvedValue();
    sendInventory.mockImplementation();
    
    // Crear nueva instancia para cada test
    inventoryService = new InventoryService();
  });
  
  describe('initializeInventory', () => {
    it('debería inicializar el inventario con 5 unidades de cada ingrediente', () => {
      const inventory = inventoryService.initializeInventory();
      
      // Verificar que cada ingrediente tiene 5 unidades
      INGREDIENTS.forEach(ingredient => {
        expect(inventory[ingredient]).toBe(5);
      });
      
      // Verificar que solo existen los ingredientes definidos
      expect(Object.keys(inventory).length).toBe(INGREDIENTS.length);
    });
  });
  
  describe('initializeProducer', () => {
    it('debería conectar al productor Kafka si no está ya conectado', async () => {
      // Reinicializar el servicio para este test específico
      inventoryService = new InventoryService();
      
      // Forzar ejecución del método
      await inventoryService.initializeProducer();
      
      // Verificar que se llamó a connectProducer
      expect(connectProducer).toHaveBeenCalled();
    });
    
    it('no debería volver a conectar si el productor ya existe', async () => {
      // Configurar un productor existente
      inventoryService.producer = {};
      
      // Llamar al método
      await inventoryService.initializeProducer();
      
      // Verificar que no se volvió a llamar a connectProducer
      expect(connectProducer).not.toHaveBeenCalled();
    });
    
    it('debería manejar errores de conexión adecuadamente', async () => {
      // Mock de console.error
      const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();
      
      // Forzar error en connectProducer
      const mockError = new Error('Connection failed');
      connectProducer.mockRejectedValueOnce(mockError);
      
      // Reinicializar servicio para probar la ruta de error
      inventoryService = new InventoryService();
      
      // No debería lanzar excepción
      await expect(inventoryService.initializeProducer()).resolves.not.toThrow();
      
      // Verificar que se registró el error
      expect(mockConsoleError).toHaveBeenCalledWith(
        '🔴 Error connecting Kafka Producer:',
        mockError
      );
      
      // Restaurar console.error
      mockConsoleError.mockRestore();
    });
  });
  
  describe('getInventory', () => {
    it('debería devolver el inventario actual', () => {
      // Configurar un inventario de prueba específico
      inventoryService.inventory = {
        flour: 10,
        sugar: 15,
        eggs: 20
      };
      
      // Verificar que devuelve el inventario correctamente
      expect(inventoryService.getInventory()).toEqual({
        flour: 10,
        sugar: 15,
        eggs: 20
      });
    });
  });
  
  describe('ensureIngredientsAvailable', () => {
    it('debería notificar del inventario actual y actualizado', async () => {
      // Llamar al método con algunos ingredientes
      await inventoryService.ensureIngredientsAvailable({ flour: 2, sugar: 3 });
      
      // Verificar que se llamó a sendInventory dos veces
      expect(sendInventory).toHaveBeenCalledTimes(2);
    });
    
    it('debería comprar ingredientes del mercado si la cantidad es insuficiente', async () => {
      // Configurar inventario inicial
      inventoryService.inventory = {
        flour: 1, // Menos que lo requerido
        sugar: 5,
        eggs: 5,
        milk: 5
      };
      
      // Configurar mock de MarketService
      const mockBuyFromMarket = jest.fn()
        .mockResolvedValueOnce(3); // Compra 3 unidades de harina
      
      inventoryService.marketService = {
        buyFromMarket: mockBuyFromMarket
      };
      
      // Llamar al método
      await inventoryService.ensureIngredientsAvailable({ flour: 3 });
      
      // Verificar que se llamó a buyFromMarket para flour
      expect(mockBuyFromMarket).toHaveBeenCalledWith('flour');
      
      // Verificar que el inventario se actualizó correctamente
      expect(inventoryService.inventory.flour).toBe(1); // 1 inicial + 3 comprados - 3 usados
    });
    
    it('debería comprar múltiples veces si una compra no es suficiente', async () => {
      // Configurar inventario inicial
      inventoryService.inventory = {
        flour: 0, // Nada disponible
        sugar: 5,
        eggs: 5,
        milk: 5
      };
      
      // Configurar mock para comprar 2 unidades cada vez
      const mockBuyFromMarket = jest.fn()
        .mockResolvedValueOnce(2) // Primera compra: 2 unidades
        .mockResolvedValueOnce(2) // Segunda compra: 2 unidades
        .mockResolvedValueOnce(2); // Tercera compra: 2 unidades
      
      inventoryService.marketService = {
        buyFromMarket: mockBuyFromMarket
      };
      
      // Necesitamos 5 unidades
      await inventoryService.ensureIngredientsAvailable({ flour: 5 });
      
      // Verificar que buyFromMarket fue llamado 3 veces
      expect(mockBuyFromMarket).toHaveBeenCalledTimes(3);
      
      // Verificar que el inventario se actualizó correctamente
      expect(inventoryService.inventory.flour).toBe(1); // 0 + 2 + 2 + 2 - 5 = 1
    });
    
    it('no debería comprar si hay suficientes ingredientes', async () => {
      // Configurar inventario inicial
      inventoryService.inventory = {
        flour: 10,
        sugar: 10,
        eggs: 10,
        milk: 10
      };
      
      // Mock del marketService
      const mockBuyFromMarket = jest.fn();
      inventoryService.marketService = {
        buyFromMarket: mockBuyFromMarket
      };
      
      // Llamar al método
      await inventoryService.ensureIngredientsAvailable({ flour: 3, sugar: 4 });
      
      // Verificar que no se llamó a buyFromMarket
      expect(mockBuyFromMarket).not.toHaveBeenCalled();
      
      // Verificar que el inventario se actualizó correctamente
      expect(inventoryService.inventory).toEqual({
        flour: 7,  // 10 - 3
        sugar: 6,  // 10 - 4
        eggs: 10,
        milk: 10
      });
    });
  });
  
  describe('newIngredients', () => {
    it('debería procesar correctamente los mensajes de Kafka', async () => {
      // Configurar mensaje de prueba
      const mockMessage = {
        value: Buffer.from(JSON.stringify({
          ingredients: { flour: 2, sugar: 3 },
          orderId: '12345'
        }))
      };
      
      // Configurar mocks
      inventoryService.ensureIngredientsAvailable = jest.fn().mockResolvedValue();
      
      // Llamar al método
      await inventoryService.newIngredients(mockMessage);
      
      // Verificar que se procesaron los ingredientes
      expect(inventoryService.ensureIngredientsAvailable).toHaveBeenCalledWith({ flour: 2, sugar: 3 });
      
      // Verificar que se envió un mensaje a Kafka
      expect(sendMessage).toHaveBeenCalledWith('avalibleIngredients', {
        ingredients: { flour: 2, sugar: 3 },
        orderId: '12345'
      });
    });
    
    it('debería manejar mensajes con doble codificación JSON', async () => {
      // Mensaje con doble codificación JSON
      const doubleEncodedMessage = {
        value: Buffer.from(JSON.stringify(JSON.stringify({
          ingredients: { flour: 2 },
          orderId: '12345'
        })))
      };
      
      // Configurar mocks
      inventoryService.ensureIngredientsAvailable = jest.fn().mockResolvedValue();
      
      // Llamar al método
      await inventoryService.newIngredients(doubleEncodedMessage);
      
      // Verificar que se procesaron los ingredientes correctamente
      expect(inventoryService.ensureIngredientsAvailable).toHaveBeenCalledWith({ flour: 2 });
    });
    
    it('debería manejar errores durante el procesamiento del mensaje', async () => {
      // Configurar mensaje inválido
      const invalidMessage = {
        value: Buffer.from('invalid json')
      };
      
      // Mock de console.error
      const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();
      
      // No debería lanzar excepción
      await expect(inventoryService.newIngredients(invalidMessage)).resolves.not.toThrow();
      
      // Verificar que se registró el error
      expect(mockConsoleError).toHaveBeenCalledWith(
        '🔴 Error parsing or processing Kafka message:',
        expect.any(Error)
      );
      
      // Restaurar console.error
      mockConsoleError.mockRestore();
    });
  });
});