// password-reset.test.js
const {
  handlePasswordReset,
  validatePasswords,
} = require('../../dist/scripts/reset_password');

<<<<<<< HEAD
/**
 * Mock implementation of localStorage for testing purposes
 * This mock allows us to simulate interactions with localStorage
 * during tests, without affecting the actual browser storage.
 * @type {Object}
 * @property {jest.Mock} getItem - Mock function to retrieve stored items
 * @property {jest.Mock} setItem - Mock function to store items
 * @property {jest.Mock} clear - Mock function to clear all items from storage
 */
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] || null), // Retrieve value by key
    setItem: jest.fn((key, value) => {
      store[key] = value.toString(); // Store key-value pair
    }),
    clear: jest.fn(() => {
      store = {}; // Clear all stored items
    }),
  };
})();

// Configure mock localStorage to override window.localStorage
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

/**
 * Mock window location object to simulate URL and query parameters
 * Used for simulating the password reset page with a test token.
 * @type {Object}
 */
Object.defineProperty(window, 'location', {
  value: {
    origin: 'http://localhost', // Simulate the base URL of the application
    pathname: '/forgot-password-page.html', // Simulate the current page
    search: '?token=testtoken123', // Simulate query parameter with test token
  },
  writable: true,
});

// Import functions for testing password recovery flows
=======
// password-reset.test.js
>>>>>>> dd577d3 (Integrated backed with auth)
const {
  sendPasswordResetEmail,
  generateResetToken,
} = require('../../dist/scripts/forgot_password');

<<<<<<< HEAD
/**
 * Integration tests for password recovery functionality
 * These tests cover both the "forgot password" and "reset password" flows.
 * @group Integration
 * @group Password-Recovery
 */
describe('Password Recovery Functionality', () => {
  /**
   * Setup before each test:
   * - Creates a mock user and stores it in localStorage
   * - Clears mock function calls (e.g., jest, window.alert)
   */
  beforeEach(() => {
    const mockUsers = [
      {
        username: 'testuser',
        password: 'oldpassword',
        email: 'test@example.com',
      },
    ];
    localStorage.setItem('users', JSON.stringify(mockUsers)); // Save mock users to localStorage

    // Reset mock calls to ensure each test starts fresh
    jest.clearAllMocks();
    window.alert = jest.fn(); // Mock window.alert function
    console.log = jest.fn(); // Mock console.log function
  });

  /**
   * Tests for the forgot password functionality
   * @group Forgot-Password
   */
  describe('Forgot Password', () => {
    /**
     * Test: Verify reset token generation for existing user
     * This test checks if the function generates a valid reset token
     * and updates the user's reset token in localStorage.
     */
    test('sendPasswordResetEmail generates a reset token for existing user', () => {
      // Arrange
      const username = 'testuser';

      // Act
      const resetToken = sendPasswordResetEmail(username); // Generate reset token

      // Assert
      const users = JSON.parse(localStorage.getItem('users'));
      const updatedUser = users.find((u) => u.username === username);

      expect(resetToken).toBeTruthy(); // Ensure reset token is generated
      expect(updatedUser.resetToken).toBeTruthy(); // Ensure user has a reset token
      expect(updatedUser.resetToken.token).toBe(resetToken); // Ensure token matches
      expect(
        new Date(updatedUser.resetToken.expiresAt) > new Date()
      ).toBeTruthy(); // Ensure the reset token is not expired
      /*
      // Uncomment this test when emailJS integration is verified
      expect(window.alert).toHaveBeenCalledWith(
        expect.stringContaining('password reset link')
      );
      */
    });

    /**
     * Test: Verify handling of non-existent users
     * This test checks if the function returns null and shows an error
     * message when a user does not exist.
     */
    test('sendPasswordResetEmail returns null for non-existing user', () => {
      // Arrange
      const username = 'nonexistentuser';

      // Act
      const result = sendPasswordResetEmail(username); // Try to generate token for a non-existent user

      // Assert
      expect(result).toBeNull(); // Ensure no token is generated
      expect(window.alert).toHaveBeenCalledWith('User not found'); // Ensure error message is shown
    });
  });

  /**
   * Tests for the password reset functionality
   * @group Reset-Password
   */
  describe('Reset Password', () => {
    /**
     * Test: Verify successful password reset with valid token
     * This test checks if the password is updated successfully when
     * a valid reset token is provided.
     */
    test('handlePasswordReset successfully resets password with valid token', () => {
      // Arrange
      const users = JSON.parse(localStorage.getItem('users'));
      const resetToken = 'testtoken123';
      users[0].resetToken = {
        token: resetToken,
        expiresAt: new Date(Date.now() + 3600000), // 1 hour from now
      };
      localStorage.setItem('users', JSON.stringify(users)); // Save updated user in localStorage

      // Act
      const result = handlePasswordReset(
        resetToken,
        'newpassword123',
        'newpassword123'
      ); // Attempt to reset password with valid token

      // Assert
      const updatedUsers = JSON.parse(localStorage.getItem('users'));
      expect(result).toBeTruthy(); // Ensure the reset operation succeeded
      expect(updatedUsers[0].password).toBe('newpassword123'); // Ensure password was updated
      expect(updatedUsers[0].resetToken).toBeUndefined(); // Ensure reset token is cleared
      expect(window.alert).toHaveBeenCalledWith('Password successfully reset'); // Ensure success message
    });

    /**
     * Test: Verify validation of password matching
     * This test checks if the reset fails when the provided passwords don't match.
     */
    test('handlePasswordReset fails with mismatched passwords', () => {
      // Act
      const result = handlePasswordReset('token', 'password1', 'password2'); // Attempt to reset with mismatched passwords

      // Assert
      expect(result).toBeFalsy(); // Ensure the reset fails
      expect(window.alert).toHaveBeenCalledWith('Passwords do not match!'); // Ensure error message
    });

    /**
     * Test: Verify password length validation
     * This test checks if the reset fails when the password is too short.
     */
    test('handlePasswordReset fails with short password', () => {
      // Act
      const result = handlePasswordReset('token', '123', '123'); // Attempt to reset with short password

      // Assert
      expect(result).toBeFalsy(); // Ensure the reset fails
      expect(window.alert).toHaveBeenCalledWith(
        'Password must be at least 6 characters long!' // Ensure error message for short password
      );
    });

    /**
     * Test: Verify token validation
     * This test checks if the reset fails when the token is invalid or expired.
     */
    test('handlePasswordReset fails with invalid or expired token', () => {
      // Arrange
      const expiredToken = 'expiredtoken'; // Simulate expired token
=======
// Mock fetch and global objects
global.fetch = jest.fn();
global.window = {
  location: {
    origin: 'http://example.com',
    pathname: '/forgot-password-page.html',
    search: '?token=validtoken',
  },
  emailjs: {
    init: jest.fn(),
    send: jest.fn().mockResolvedValue({}),
  },
  addEventListener: jest.fn(),
};
global.document = {
  querySelector: jest.fn(),
  querySelectorAll: jest.fn(),
};
global.alert = jest.fn();

describe('Password Reset Module', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  // Token Generation Tests
  describe('Token Generation', () => {
    test('generateResetToken creates a token of expected length', () => {
      const token = generateResetToken();
      expect(token).toBeTruthy();
      expect(token.length).toBeGreaterThan(10);
    });
  });

  // Password Validation Tests
  describe('Password Validation', () => {
    test('validatePasswords rejects short passwords', () => {
      const result = validatePasswords('short', 'short');
      expect(result).toBeFalsy();
      expect(alert).toHaveBeenCalledWith(
        'Password must be at least 6 characters long!'
      );
    });

    test('validatePasswords rejects non-matching passwords', () => {
      const result = validatePasswords('password123', 'differentpassword');
      expect(result).toBeFalsy();
      expect(alert).toHaveBeenCalledWith('Passwords do not match!');
    });
>>>>>>> dd577d3 (Integrated backed with auth)

    test('validatePasswords accepts valid passwords', () => {
      const result = validatePasswords('validpassword', 'validpassword');
      expect(result).toBeTruthy();
    });
  });

  // Handle Password Reset Tests
  describe('Handle Password Reset', () => {
    test('handlePasswordReset fails with invalid token', async () => {
      // Mock getUsers and getresetToken to return empty arrays
      fetch
        .mockResolvedValueOnce({
          json: () => Promise.resolve([]),
        })
        .mockResolvedValueOnce({
          json: () => Promise.resolve([]),
        });

      const result = await handlePasswordReset(
        'invalidtoken',
        'newpassword',
        'newpassword'
      );

      expect(result).toBeFalsy();
      expect(alert).toHaveBeenCalledWith('Invalid or expired reset token');
    });

    test('handlePasswordReset succeeds with valid inputs', async () => {
      // Mock successful reset scenario
      const mockUsers = [
        {
          id: '1',
          resetTokenId: '123',
        },
      ];
      const mockResetToken = [
        {
          id: '123',
          expiresAt: new Date(Date.now() + 3600000).toISOString(),
        },
      ];

      fetch
        .mockResolvedValueOnce({
          json: () => Promise.resolve(mockUsers),
        })
        .mockResolvedValueOnce({
          json: () => Promise.resolve(mockResetToken),
        })
        .mockResolvedValueOnce({
          ok: true,
        });

      const result = await handlePasswordReset(
        'validtoken',
        'newpassword123',
        'newpassword123'
      ); // Attempt to reset with expired token

<<<<<<< HEAD
      // Assert
      expect(result).toBeFalsy(); // Ensure the reset fails
      expect(window.alert).toHaveBeenCalledWith(
        'Invalid or expired reset token' // Ensure error message for invalid token
      );
=======
      expect(result).toBeTruthy();
      expect(alert).toHaveBeenCalledWith('Password successfully reset');
>>>>>>> dd577d3 (Integrated backed with auth)
    });
  });
});
