const mongoose = require('mongoose');
const { connectDB } = require('../../src/db/mongo.service');

// Mock de mongoose
jest.mock('mongoose');

// Mock de console.info y console.error
const mockConsoleInfo = jest.spyOn(console, 'info').mockImplementation();
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();

// Mock de process.exit
const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});

describe('Database Connection', () => {
  beforeEach(() => {
    // Limpiar todos los mocks antes de cada prueba
    jest.clearAllMocks();
  });

  afterAll(() => {
    // Restaurar los mocks después de todas las pruebas
    jest.restoreAllMocks();
  });

  it('debería conectarse correctamente a MongoDB', async () => {
    // Configurar el mock para simular una conexión exitosa
    mongoose.connect.mockResolvedValueOnce();

    // Llamar a la función
    await connectDB();

    // Verificar que mongoose.connect fue llamado con los parámetros correctos
    expect(mongoose.connect).toHaveBeenCalledWith(
      expect.any(String),
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );

    // Verificar que se muestra el mensaje de éxito
    expect(mockConsoleInfo).toHaveBeenCalledWith(
      '🟢 Successfully connected to MongoDB'
    );

    // Verificar que process.exit no fue llamado
    expect(mockExit).not.toHaveBeenCalled();
  });

  it('debería usar la URI de MongoDB desde las variables de entorno', async () => {
    // Guardar el valor original
    const originalEnv = process.env.MONGODB_URI;
    
    // Establecer una URI personalizada
    process.env.MONGODB_URI = 'mongodb://custom-host:27017/testDB';
    
    // Configurar el mock para simular una conexión exitosa
    mongoose.connect.mockResolvedValueOnce();

    // Llamar a la función
    await connectDB();

    // Verificar que mongoose.connect fue llamado con la URI personalizada
    expect(mongoose.connect).toHaveBeenCalledWith(
      'mongodb://custom-host:27017/testDB',
      expect.any(Object)
    );

    // Restaurar el valor original
    process.env.MONGODB_URI = originalEnv;
  });

  it('debería usar la URI predeterminada cuando no hay variable de entorno', async () => {
    // Guardar el valor original
    const originalEnv = process.env.MONGODB_URI;
    
    // Eliminar la variable de entorno
    delete process.env.MONGODB_URI;
    
    // Configurar el mock para simular una conexión exitosa
    mongoose.connect.mockResolvedValueOnce();

    // Llamar a la función
    await connectDB();

    // Verificar que mongoose.connect fue llamado con la URI predeterminada
    expect(mongoose.connect).toHaveBeenCalledWith(
      'mongodb://mongodb:27017/restaurantDB',
      expect.any(Object)
    );

    // Restaurar el valor original
    process.env.MONGODB_URI = originalEnv;
  });

  it('debería manejar errores de conexión y salir del proceso', async () => {
    // Configurar el mock para simular un error de conexión
    const mockError = new Error('Connection failed');
    mongoose.connect.mockRejectedValueOnce(mockError);

    // Llamar a la función
    await connectDB();

    // Verificar que se muestra el mensaje de error
    expect(mockConsoleError).toHaveBeenCalledWith(
      '🔴 Failed to connect to MongoDB:',
      mockError
    );

    // Verificar que process.exit fue llamado con código 1
    expect(mockExit).toHaveBeenCalledWith(1);
  });
});