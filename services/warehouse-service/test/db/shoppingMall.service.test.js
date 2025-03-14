const mongoose = require('mongoose');
const ShoppingMallDBService = require('../../src/db/shoppingMall.service');

// Importamos el modelo directamente para los mocks
jest.mock('../../src/db/models/ShoppingMall');
const ShoppingMall = require('../../src/db/models/ShoppingMall');

// Mock de console.error
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();

describe('ShoppingMallDBService', () => {
  beforeEach(() => {
    // Limpiar todos los mocks antes de cada prueba
    jest.clearAllMocks();
  });

  afterAll(() => {
    // Restaurar los mocks después de todas las pruebas
    jest.restoreAllMocks();
    mongoose.connection.close();
  });

  describe('createShoppingMallRecord', () => {
    it('debería crear un nuevo registro de centro comercial', async () => {
      // Datos de prueba
      const mockData = {
        name: 'Centro Comercial Test',
        location: 'Ciudad Test',
        stores: 50,
        openingYear: 2020
      };

      // Mock de la respuesta esperada
      const mockCreatedRecord = { ...mockData, _id: 'mock-id-123' };
      
      // Configurar el mock para simular una creación exitosa
      ShoppingMall.create.mockResolvedValueOnce(mockCreatedRecord);

      // Llamar al método del servicio
      const result = await ShoppingMallDBService.createShoppingMallRecord(mockData);

      // Verificaciones
      expect(ShoppingMall.create).toHaveBeenCalledWith(mockData);
      expect(result).toEqual(mockCreatedRecord);
    });

    it('debería propagar el error si la creación falla', async () => {
      // Datos de prueba
      const mockData = { name: 'Centro Comercial Error' };
      
      // Error simulado
      const mockError = new Error('Database error');
      ShoppingMall.create.mockRejectedValueOnce(mockError);

      // Verificar que el error se propaga
      await expect(ShoppingMallDBService.createShoppingMallRecord(mockData))
        .rejects.toThrow(mockError);
      
      expect(ShoppingMall.create).toHaveBeenCalledWith(mockData);
    });
  });

  describe('countTripsRecords', () => {
    it('debería devolver el número de registros correctamente', async () => {
      // Mock del contador esperado
      const mockCount = 42;
      ShoppingMall.countDocuments.mockResolvedValueOnce(mockCount);

      // Llamar al método del servicio
      const result = await ShoppingMallDBService.countTripsRecords();

      // Verificaciones
      expect(ShoppingMall.countDocuments).toHaveBeenCalled();
      expect(result).toBe(mockCount);
    });

    it('debería manejar errores al contar registros', async () => {
      // Error simulado
      const mockError = new Error('Count failed');
      ShoppingMall.countDocuments.mockRejectedValueOnce(mockError);

      // Verificar que se lanza el error esperado
      await expect(ShoppingMallDBService.countTripsRecords())
        .rejects.toThrow('Failed to count records');
      
      // Verificar que se registra el error original
      expect(mockConsoleError).toHaveBeenCalledWith(
        '🔴 Error while counting records:',
        mockError
      );
    });
  });

  describe('deleteAllRecords', () => {
    it('debería eliminar todos los registros y devolver la cantidad', async () => {
      // Mock del resultado de eliminación
      const mockDeleteResult = { deletedCount: 15 };
      ShoppingMall.deleteMany.mockResolvedValueOnce(mockDeleteResult);

      // Llamar al método del servicio
      const result = await ShoppingMallDBService.deleteAllRecords();

      // Verificaciones
      expect(ShoppingMall.deleteMany).toHaveBeenCalledWith({});
      expect(result).toBe(15);
    });

    it('debería manejar errores al eliminar registros', async () => {
      // Error simulado
      const mockError = new Error('Delete failed');
      ShoppingMall.deleteMany.mockRejectedValueOnce(mockError);

      // Verificar que se lanza el error esperado
      await expect(ShoppingMallDBService.deleteAllRecords())
        .rejects.toThrow('Failed to delete records');
      
      // Verificar que se registra el error original
      expect(mockConsoleError).toHaveBeenCalledWith(
        '🔴 Error while deleting records:',
        mockError
      );
    });
  });

  describe('getAllItems', () => {
    it('debería obtener hasta 500 registros ordenados por _id descendente', async () => {
      // Mock de registros a devolver
      const mockRecords = [
        { _id: '3', name: 'Centro Comercial C' },
        { _id: '2', name: 'Centro Comercial B' },
        { _id: '1', name: 'Centro Comercial A' }
      ];

      // Configuración del mock con encadenamiento de métodos
      const mockSort = jest.fn().mockReturnValue({
        limit: jest.fn().mockResolvedValue(mockRecords)
      });
      ShoppingMall.find.mockReturnValue({
        sort: mockSort
      });

      // Llamar al método del servicio
      const result = await ShoppingMallDBService.getAllItems();

      // Verificaciones
      expect(ShoppingMall.find).toHaveBeenCalled();
      expect(mockSort).toHaveBeenCalledWith({ _id: -1 });
      expect(result).toEqual(mockRecords);
    });

    it('debería manejar errores al obtener registros', async () => {
      // Error simulado
      const mockError = new Error('Find failed');
      
      // Configuración del mock con error
      ShoppingMall.find.mockImplementationOnce(() => {
        throw mockError;
      });

      // Verificar que se lanza el error esperado
      await expect(ShoppingMallDBService.getAllItems())
        .rejects.toThrow('Failed to retrieve records');
      
      // Verificar que se registra el error original
      expect(mockConsoleError).toHaveBeenCalledWith(
        '🔴 Error while retrieving records:',
        mockError
      );
    });
  });
});