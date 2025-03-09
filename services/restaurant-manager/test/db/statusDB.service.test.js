// Import the service to test
const statusDBService = require('../../src/db/statusDB.service');
// Import the model that's being used
const Status = require('../../src/db/models/Status');

// Mock the Status model
jest.mock('../../src/db/models/Status');

describe('StatusDBService', () => {
  // Clear all mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createStatusRecord', () => {
    it('should create a new status record', async () => {
      // Arrange
      const mockData = { name: 'active', description: 'User is active', date: new Date() };
      const mockCreatedRecord = { ...mockData, _id: '123abc' };
      Status.create.mockResolvedValue(mockCreatedRecord);

      // Act
      const result = await statusDBService.createStatusRecord(mockData);

      // Assert
      expect(Status.create).toHaveBeenCalledWith(mockData);
      expect(result).toEqual(mockCreatedRecord);
    });

    it('should throw an error if creation fails', async () => {
      // Arrange
      const mockData = { name: 'active', description: 'User is active' };
      const mockError = new Error('Creation failed');
      Status.create.mockRejectedValue(mockError);

      // Act & Assert
      await expect(statusDBService.createStatusRecord(mockData)).rejects.toThrow(mockError);
      expect(Status.create).toHaveBeenCalledWith(mockData);
    });
  });

  describe('countStatusRecords', () => {
    it('should return the count of status records', async () => {
      // Arrange
      const mockCount = 15;
      Status.countDocuments.mockResolvedValue(mockCount);

      // Act
      const result = await statusDBService.countStatusRecords();

      // Assert
      expect(Status.countDocuments).toHaveBeenCalled();
      expect(result).toBe(mockCount);
    });

    it('should throw an error if counting fails', async () => {
      // Arrange
      Status.countDocuments.mockRejectedValue(new Error('DB error'));

      // Act & Assert
      await expect(statusDBService.countStatusRecords()).rejects.toThrow('Error counting status records');
      expect(Status.countDocuments).toHaveBeenCalled();
    });
  });

  describe('deleteAllRecords', () => {
    it('should delete all status records and return the count', async () => {
      // Arrange
      const mockDeleteResult = { deletedCount: 5 };
      Status.deleteMany.mockResolvedValue(mockDeleteResult);

      // Act
      const result = await statusDBService.deleteAllRecords();

      // Assert
      expect(Status.deleteMany).toHaveBeenCalledWith({});
      expect(result).toBe(5);
    });

    it('should throw an error if deletion fails', async () => {
      // Arrange
      Status.deleteMany.mockRejectedValue(new Error('DB error'));

      // Act & Assert
      await expect(statusDBService.deleteAllRecords()).rejects.toThrow('Error deleting status records');
      expect(Status.deleteMany).toHaveBeenCalledWith({});
    });
  });

  describe('getAllItems', () => {
    it('should return all status records with sorting and limit', async () => {
      // Arrange
      const mockRecords = [
        { _id: '1', name: 'active', description: 'User is active', date: new Date() },
        { _id: '2', name: 'inactive', description: 'User is inactive', date: new Date() }
      ];
      
      const mockSort = jest.fn().mockReturnValue({
        limit: jest.fn().mockResolvedValue(mockRecords)
      });
      
      Status.find.mockReturnValue({
        sort: mockSort
      });

      // Act
      const result = await statusDBService.getAllItems();

      // Assert
      expect(Status.find).toHaveBeenCalled();
      expect(mockSort).toHaveBeenCalledWith({ date: -1 });
      expect(result).toEqual(mockRecords);
    });

    it('should throw an error if retrieval fails', async () => {
      // Arrange
      const mockSort = jest.fn().mockReturnValue({
        limit: jest.fn().mockRejectedValue(new Error('DB error'))
      });
      
      Status.find.mockReturnValue({
        sort: mockSort
      });

      // Act & Assert
      await expect(statusDBService.getAllItems()).rejects.toThrow('Error retrieving status records');
      expect(Status.find).toHaveBeenCalled();
    });
  });
});