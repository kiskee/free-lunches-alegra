const historyService = require("../../src/db/db.service");
const History = require("../../src/db/models/History");

// Mock de Mongoose y el modelo History
jest.mock("../../src/db/models/History");

describe('HistoryService', () => {
    // Clear all mocks before each test
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    describe('createHistoryRecord', () => {
      it('should create a new history record', async () => {
        // Arrange
        const mockData = { user: 'test', action: 'login', date: new Date() };
        const mockCreatedRecord = { ...mockData, _id: '123' };
        History.create.mockResolvedValue(mockCreatedRecord);
  
        // Act
        const result = await historyService.createHistoryRecord(mockData);
  
        // Assert
        expect(History.create).toHaveBeenCalledWith(mockData);
        expect(result).toEqual(mockCreatedRecord);
      });
  
      it('should throw an error if creation fails', async () => {
        // Arrange
        const mockData = { user: 'test', action: 'login' };
        const mockError = new Error('Creation failed');
        History.create.mockRejectedValue(mockError);
  
        // Act & Assert
        await expect(historyService.createHistoryRecord(mockData)).rejects.toThrow(mockError);
        expect(History.create).toHaveBeenCalledWith(mockData);
      });
    });
  
    describe('countRecords', () => {
      it('should return the count of records', async () => {
        // Arrange
        const mockCount = 42;
        History.countDocuments.mockResolvedValue(mockCount);
  
        // Act
        const result = await historyService.countRecords();
  
        // Assert
        expect(History.countDocuments).toHaveBeenCalled();
        expect(result).toBe(mockCount);
      });
  
      it('should throw an error if counting fails', async () => {
        // Arrange
        History.countDocuments.mockRejectedValue(new Error('DB error'));
  
        // Act & Assert
        await expect(historyService.countRecords()).rejects.toThrow('Error counting records');
        expect(History.countDocuments).toHaveBeenCalled();
      });
    });
  
    describe('deleteAllRecords', () => {
      it('should delete all records and return the count', async () => {
        // Arrange
        const mockDeleteResult = { deletedCount: 10 };
        History.deleteMany.mockResolvedValue(mockDeleteResult);
  
        // Act
        const result = await historyService.deleteAllRecords();
  
        // Assert
        expect(History.deleteMany).toHaveBeenCalledWith({});
        expect(result).toBe(10);
      });
  
      it('should throw an error if deletion fails', async () => {
        // Arrange
        History.deleteMany.mockRejectedValue(new Error('DB error'));
  
        // Act & Assert
        await expect(historyService.deleteAllRecords()).rejects.toThrow('Error deleting records');
        expect(History.deleteMany).toHaveBeenCalledWith({});
      });
    });
  
    describe('getAllItems', () => {
      it('should return all history records with sorting and limit', async () => {
        // Arrange
        const mockRecords = [
          { _id: '1', user: 'user1', action: 'login', date: new Date() },
          { _id: '2', user: 'user2', action: 'logout', date: new Date() }
        ];
        
        const mockSort = jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue(mockRecords)
        });
        
        History.find.mockReturnValue({
          sort: mockSort
        });
  
        // Act
        const result = await historyService.getAllItems();
  
        // Assert
        expect(History.find).toHaveBeenCalled();
        expect(mockSort).toHaveBeenCalledWith({ date: -1 });
        expect(result).toEqual(mockRecords);
      });
  
      it('should throw an error if retrieval fails', async () => {
        // Arrange
        const mockSort = jest.fn().mockReturnValue({
          limit: jest.fn().mockRejectedValue(new Error('DB error'))
        });
        
        History.find.mockReturnValue({
          sort: mockSort
        });
  
        // Act & Assert
        await expect(historyService.getAllItems()).rejects.toThrow('Error retrieving records');
        expect(History.find).toHaveBeenCalled();
      });
    });
  });