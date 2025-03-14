const WebSocket = require('ws');
const { goToMall, sendInventory } = require('../../src/services/wsWarehouse.service');

// Mock completo de WebSocket
jest.mock('ws', () => {
  // Constantes para simular los estados de WebSocket
  const OPEN = 1;
  const CLOSED = 3;
  
  // Mock del cliente WebSocket
  const mockClient = {
    readyState: OPEN,
    send: jest.fn()
  };
  
  // Mock del servidor WebSocket
  const MockServer = jest.fn().mockImplementation(() => {
    return {
      on: jest.fn((event, callback) => {
        if (event === 'connection') {
          // Simular conexión de cliente
          callback(mockClient);
        }
      }),
      clients: new Set([mockClient])
    };
  });
  
  // Exponer las propiedades y métodos necesarios
  MockServer.OPEN = OPEN;
  MockServer.CLOSED = CLOSED;
  
  return {
    Server: MockServer,
    OPEN,
    CLOSED
  };
});

describe('WebSocket Service', () => {
  let mockConsoleLog;
  
  beforeEach(() => {
    // Mock de console.log
    mockConsoleLog = jest.spyOn(console, 'log').mockImplementation();
    
    // Limpiar todos los mocks
    jest.clearAllMocks();
  });
  
  afterEach(() => {
    // Restaurar console.log
    mockConsoleLog.mockRestore();
  });

  describe('Server initialization', () => {
    it('debería inicializar dos servidores WebSocket en los puertos correctos', () => {
      // Como el módulo crea servidores en la parte superior, necesitamos re-importarlo
      jest.isolateModules(() => {
        // Re-importar el módulo para verificar la inicialización
        require('./path/to/wsWarehouse.service');
        
        // Verificar que se crearon dos servidores
        expect(WebSocket.Server).toHaveBeenCalledTimes(2);
        
        // Verificar los puertos
        expect(WebSocket.Server).toHaveBeenNthCalledWith(1, { port: 8084 });
        expect(WebSocket.Server).toHaveBeenNthCalledWith(2, { port: 8085 });
      });
    });
    
    it('debería registrar una conexión cuando un cliente se conecta', () => {
      // Re-importar el módulo para verificar el evento de conexión
      jest.isolateModules(() => {
        require('./path/to/wsWarehouse.service');
        
        // Verificar que se registró el mensaje de conexión
        expect(mockConsoleLog).toHaveBeenCalledWith(
          '🟢 Client connected to the warehouse WebSocket server'
        );
      });
    });
  });

  describe('goToMall', () => {
    it('debería enviar datos de evento a todos los clientes conectados', () => {
      // Datos de prueba
      const testData = {
        ingredient: 'flour',
        response: 5
      };
      
      // Llamar a la función
      goToMall(testData);
      
      // Acceder al cliente mock a través del servidor mock
      const mockClient = WebSocket.Server().clients.values().next().value;
      
      // Verificar que se envió el mensaje al cliente
      expect(mockClient.send).toHaveBeenCalledWith(
        JSON.stringify({
          evento: 'goToMall',
          data: testData
        })
      );
    });
    
    it('no debería enviar datos a clientes que no están abiertos', () => {
      // Configurar un cliente cerrado
      const mockServer = WebSocket.Server();
      const mockClient = mockServer.clients.values().next().value;
      mockClient.readyState = WebSocket.CLOSED;
      
      // Datos de prueba
      const testData = {
        ingredient: 'sugar',
        response: 3
      };
      
      // Llamar a la función
      goToMall(testData);
      
      // Verificar que no se envió el mensaje
      expect(mockClient.send).not.toHaveBeenCalled();
    });
  });

  describe('sendInventory', () => {
    it('debería enviar datos de inventario a todos los clientes conectados', () => {
      // Datos de prueba
      const inventoryData = {
        flour: 10,
        sugar: 5,
        eggs: 12
      };
      
      // Llamar a la función
      sendInventory(inventoryData);
      
      // Acceder al cliente mock
      const mockClient = WebSocket.Server().clients.values().next().value;
      
      // Verificar que se envió el mensaje al cliente
      expect(mockClient.send).toHaveBeenCalledWith(
        JSON.stringify({
          evento: 'invChange',
          data: inventoryData
        })
      );
    });
    
    it('debería enviar datos formateados correctamente', () => {
      // Varios tipos de datos para probar
      const testCases = [
        { flour: 5 },
        { sugar: 0, eggs: null },
        { milk: undefined },
        {}
      ];
      
      // Probar cada caso
      testCases.forEach(data => {
        // Limpiar llamadas anteriores
        jest.clearAllMocks();
        
        // Llamar a la función
        sendInventory(data);
        
        // Acceder al cliente mock
        const mockClient = WebSocket.Server().clients.values().next().value;
        
        // Verificar el formato del mensaje
        expect(mockClient.send).toHaveBeenCalledWith(
          JSON.stringify({
            evento: 'invChange',
            data: data
          })
        );
      });
    });
    
    it('no debería enviar datos a clientes que no están abiertos', () => {
      // Configurar un cliente cerrado
      const mockServer = WebSocket.Server();
      const mockClient = mockServer.clients.values().next().value;
      mockClient.readyState = WebSocket.CLOSED;
      
      // Datos de prueba
      const inventoryData = {
        flour: 7,
        sugar: 9
      };
      
      // Llamar a la función
      sendInventory(inventoryData);
      
      // Verificar que no se envió el mensaje
      expect(mockClient.send).not.toHaveBeenCalled();
    });
  });
  
  describe('Comportamiento con múltiples clientes', () => {
    it('debería enviar mensajes a todos los clientes conectados', () => {
      // Crear un mock personalizado para este test
      jest.isolateModules(() => {
        // Crear mock más específico para WebSocket para este test
        jest.doMock('ws', () => {
          const OPEN = 1;
          
          // Crear varios clientes mock
          const mockClient1 = { readyState: OPEN, send: jest.fn() };
          const mockClient2 = { readyState: OPEN, send: jest.fn() };
          const mockClient3 = { readyState: OPEN, send: jest.fn() };
          
          const MockServer = jest.fn().mockImplementation(() => {
            return {
              on: jest.fn(),
              clients: new Set([mockClient1, mockClient2, mockClient3])
            };
          });
          
          MockServer.OPEN = OPEN;
          
          return {
            Server: MockServer,
            OPEN
          };
        });
        
        // Re-importar el módulo con nuestros mocks personalizados
        const { goToMall } = require('./path/to/wsWarehouse.service');
        
        // Datos de prueba
        const testData = { ingredient: 'eggs', response: 6 };
        
        // Llamar a la función
        goToMall(testData);
        
        // Obtener los clientes mock
        const mockWs = require('ws');
        const mockServer = mockWs.Server();
        const clientsArray = Array.from(mockServer.clients);
        
        // Verificar que cada cliente recibió el mensaje
        clientsArray.forEach(client => {
          expect(client.send).toHaveBeenCalledWith(
            JSON.stringify({
              evento: 'goToMall',
              data: testData
            })
          );
        });
      });
    });
  });
});