// __tests__/unitTesting/auth.test.js
const { mockErrorPopup, getMockLocalStorage } = require('../test-utils');
const {
  getUsers,
  validateCredentials,
  validatePasswords,
  isUsernameAvailable,
  setUserSession,
} = require('../../dist/scripts/auth');

describe('Authentication Module', () => {
  beforeEach(() => {
    mockErrorPopup.reset();
    jest.clearAllMocks();

    // Setup localStorage mock
    Object.defineProperty(window, 'localStorage', {
      value: getMockLocalStorage(),
    });
  });

  describe('validateCredentials', () => {
    test('should return user object for valid credentials', async () => {
      const mockUsers = [{ username: 'testuser', password: 'password123' }];
      global.fetch = jest.fn().mockResolvedValue({
        json: () => Promise.resolve(mockUsers),
      });

      const user = await validateCredentials('testuser', 'password123');
      expect(user).toEqual(mockUsers[0]);
    });

    test('should return null for invalid credentials', async () => {
      const mockUsers = [{ username: 'testuser', password: 'password123' }];
      global.fetch = jest.fn().mockResolvedValue({
        json: () => Promise.resolve(mockUsers),
      });

      const user = await validateCredentials('testuser', 'wrongpassword');
      expect(user).toBeNull();
      expect(mockErrorPopup.getLastError().message).toBe(
        'The password is incorrect.'
      );
    });
  });

  describe('validatePasswords', () => {
    test('should return false for password shorter than 6 characters', () => {
      const result = validatePasswords('short', 'short', false);
      expect(result).toBeFalsy();
      expect(mockErrorPopup.getLastError().message).toBe(
        'Password must be at least 6 characters long!'
      );
    });

    test('should return false if passwords do not match on registration page', () => {
      const result = validatePasswords('password123', 'differentpass', false);
      expect(result).toBeFalsy();
      expect(mockErrorPopup.getLastError().message).toBe(
        'Passwords do not match!'
      );
    });
  });
});
