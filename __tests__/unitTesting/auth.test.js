// __tests__/unitTesting/auth.test.js
const { mockErrorPopup } = require('../test-utils');
const {
  validateCredentials,
  validatePasswords,
  isUsernameAvailable,
  getUsers,
} = require('../../dist/scripts/auth');

// API base URL
const API_BASE_URL = 'https://budgettrackerbackend-g9gc.onrender.com/api';

describe('Authentication Module', () => {
  beforeEach(() => {
    mockErrorPopup.reset();
    jest.clearAllMocks();
  });

  describe('validateCredentials', () => {
    test('should return user object for valid credentials', async () => {
      const mockUsers = [
        {
          username: 'testuser',
          password: 'password123',
          userid: '123',
          email: 'test@example.com',
        },
      ];

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockUsers),
      });

      const user = await validateCredentials('testuser', 'password123');

      expect(global.fetch).toHaveBeenCalledWith(`${API_BASE_URL}/users`);
      expect(user).toEqual(mockUsers[0]);
    });

    test('should return null for invalid credentials', async () => {
      const mockUsers = [
        {
          username: 'testuser',
          password: 'password123',
          userid: '123',
          email: 'test@example.com',
        },
      ];

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockUsers),
      });

      const user = await validateCredentials('testuser', 'wrongpassword');

      expect(user).toBeNull();
      expect(mockErrorPopup.getLastError().message).toBe(
        'The password is incorrect.'
      );
    });
  });

  describe('isUsernameAvailable', () => {
    test('should return true for available username', async () => {
      const mockUsers = [
        {
          username: 'existinguser',
          userid: '123',
          email: 'existing@example.com',
        },
      ];

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockUsers),
      });

      const result = await isUsernameAvailable('newuser');

      expect(result).toBeTruthy();
      expect(global.fetch).toHaveBeenCalledWith(`${API_BASE_URL}/users`);
    });

    test('should return false for taken username', async () => {
      const mockUsers = [
        {
          username: 'existinguser',
          userid: '123',
          email: 'existing@example.com',
        },
      ];

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockUsers),
      });

      const result = await isUsernameAvailable('existinguser');

      expect(result).toBeFalsy();
      expect(global.fetch).toHaveBeenCalledWith(`${API_BASE_URL}/users`);
    });
  });

  describe('getUsers', () => {
    test('should fetch and return users array', async () => {
      const mockUsers = [
        { username: 'user1', userid: '1', email: 'user1@example.com' },
        { username: 'user2', userid: '2', email: 'user2@example.com' },
      ];

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockUsers),
      });

      const users = await getUsers();

      expect(users).toEqual(mockUsers);
      expect(global.fetch).toHaveBeenCalledWith(`${API_BASE_URL}/users`);
    });

    test('should return empty array on error', async () => {
      global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

      const users = await getUsers();

      expect(users).toEqual([]);
      expect(global.fetch).toHaveBeenCalledWith(`${API_BASE_URL}/users`);
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

    test('should return true for valid matching passwords', () => {
      const result = validatePasswords(
        'validpassword123',
        'validpassword123',
        false
      );
      expect(result).toBeTruthy();
    });
  });
});
