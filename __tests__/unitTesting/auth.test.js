const {
  getUsers,
  validateCredentials,
  validatePasswords,
  isUsernameAvailable,
  setUserSession,
} = require('../../dist/scripts/auth');

// Mock console.error to prevent actual error logging during tests
const originalConsoleError = console.error;
console.error = jest.fn();

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock global objects and functions
global.fetch = jest.fn();
global.alert = jest.fn();
global.window = {
  location: {
    href: '',
    pathname: '/register', // Default to registration page
  },
};

// Setup a more robust document mock
const createMockInput = (value) => ({
  value: value,
});

describe('Authentication Module', () => {
  let passwordInputs;

  beforeEach(() => {
    // Clear mocks and reset localStorage before each test
    jest.clearAllMocks();
    localStorageMock.clear();

    // Reset passwordInputs before each test
    passwordInputs = [
      createMockInput(''), // First password input
      createMockInput(''), // Confirmation password input
    ];

    // Mock global variables used in the original script
    global.passwordInputs = passwordInputs;
  });

  describe('getUsers', () => {
    it('should fetch users successfully', async () => {
      const mockUsers = [
        {
          username: 'testuser',
          password: 'password123',
          email: 'test@example.com',
        },
      ];

      global.fetch.mockResolvedValue({
        json: jest.fn().mockResolvedValue(mockUsers),
      });

      const users = await getUsers();
      expect(users).toEqual(mockUsers);
    });

    it('should return empty array on fetch error', async () => {
      global.fetch.mockRejectedValue(new Error('Fetch error'));

      const users = await getUsers();
      expect(users).toEqual([]);
    });
  });

  describe('validateCredentials', () => {
    it('should return user object for valid credentials', async () => {
      const mockUsers = [{ username: 'testuser', password: 'password123' }];

      jest.spyOn(global, 'fetch').mockResolvedValue({
        json: jest.fn().mockResolvedValue(mockUsers),
      });

      const user = await validateCredentials('testuser', 'password123');
      expect(user).toEqual(mockUsers[0]);
    });

    it('should return null for invalid credentials', async () => {
      const mockUsers = [{ username: 'testuser', password: 'password123' }];

      jest.spyOn(global, 'fetch').mockResolvedValue({
        json: jest.fn().mockResolvedValue(mockUsers),
      });

      const user = await validateCredentials('testuser', 'wrongpassword');
      expect(user).toBeNull();
    });
  });

  describe('validatePasswords', () => {
    it('should return false for password shorter than 6 characters', () => {
      // Set first password to a short value
      passwordInputs[0].value = 'short';
      passwordInputs[1].value = 'short';

      const result = validatePasswords(
        passwordInputs[0].value,
        passwordInputs[1].value
      );
      expect(result).toBeFalsy();
      expect(global.alert).toHaveBeenCalledWith(
        'Password must be at least 6 characters long!'
      );
    });

    it('should return false if passwords do not match on registration page', () => {
      // Set different passwords
      passwordInputs[0].value = 'password123';
      passwordInputs[1].value = 'differentpassword';

      const result = validatePasswords(
        passwordInputs[0].value,
        passwordInputs[1].value
      );
      expect(result).toBeFalsy();
      expect(global.alert).toHaveBeenCalledWith('Passwords do not match!');
    });

    it('should return true for valid passwords', () => {
      // Set matching passwords longer than 6 characters
      passwordInputs[0].value = 'validpassword';
      passwordInputs[1].value = 'validpassword';

      const result = validatePasswords(
        passwordInputs[0].value,
        passwordInputs[1].value
      );
      expect(result).toBeTruthy();
      expect(global.alert).not.toHaveBeenCalled();
    });
  });

  describe('isUsernameAvailable', () => {
    it('should return true for a unique username', async () => {
      const mockUsers = [{ username: 'existinguser' }];

      jest.spyOn(global, 'fetch').mockResolvedValue({
        json: jest.fn().mockResolvedValue(mockUsers),
      });

      const isAvailable = await isUsernameAvailable('newuser');
      expect(isAvailable).toBeTruthy();
    });

    it('should return false for an existing username', async () => {
      const mockUsers = [{ username: 'existinguser' }];

      jest.spyOn(global, 'fetch').mockResolvedValue({
        json: jest.fn().mockResolvedValue(mockUsers),
      });

      const isAvailable = await isUsernameAvailable('existinguser');
      expect(isAvailable).toBeFalsy();
    });
  });

  describe('setUserSession', () => {
    it('should set user session in localStorage', () => {
      const mockUser = { username: 'testuser' };
      setUserSession(mockUser);

      expect(localStorage.setItem).toHaveBeenCalledWith(
        'currentSession',
        expect.stringContaining('"username":"testuser"')
      );
    });
  });
});
