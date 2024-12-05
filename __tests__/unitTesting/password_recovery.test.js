const fs = require('fs');
const path = require('path');

/**
 * Mock implementation of localStorage for testing purposes
 * @type {Object}
 * @property {jest.Mock} getItem - Mock function to get stored items
 * @property {jest.Mock} setItem - Mock function to store items
 * @property {jest.Mock} clear - Mock function to clear storage
 */
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

// Configure mock localStorage
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

/**
 * Mock window location object for testing password reset functionality
 * @type {Object}
 */
Object.defineProperty(window, 'location', {
  value: {
    origin: 'http://localhost',
    pathname: '/forgot-password-page.html',
    search: '?token=testtoken123',
  },
  writable: true,
});

// Import functions to test
const {
  sendPasswordResetEmail,
} = require('../../dist/scripts/forgot_password.js');
const { handlePasswordReset } = require('../../dist/scripts/reset_password.js');

/**
 * Integration tests for password recovery functionality
 * Tests both the forgot password and reset password flows
 * @group Integration
 * @group Password-Recovery
 */
describe('Password Recovery Functionality', () => {
  /**
   * Setup before each test:
   * - Creates a mock user
   * - Clears mock function calls
   * - Sets up window.alert and console.log mocks
   */
  beforeEach(() => {
    const mockUsers = [
      {
        username: 'testuser',
        password: 'oldpassword',
        email: 'test@example.com',
      },
    ];
    localStorage.setItem('users', JSON.stringify(mockUsers));

    // Reset mocks
    jest.clearAllMocks();
    window.alert = jest.fn();
    console.log = jest.fn();
  });

  /**
   * Tests for the forgot password functionality
   * @group Forgot-Password
   */
  describe('Forgot Password', () => {
    /**
     * Test: Verify reset token generation for existing user
     * Should create and store a valid reset token
     */
    test('sendPasswordResetEmail generates a reset token for existing user', () => {
      // Arrange
      const username = 'testuser';

      // Act
      const resetToken = sendPasswordResetEmail(username);

      // Assert
      const users = JSON.parse(localStorage.getItem('users'));
      const updatedUser = users.find((u) => u.username === username);

      expect(resetToken).toBeTruthy();
      expect(updatedUser.resetToken).toBeTruthy();
      expect(updatedUser.resetToken.token).toBe(resetToken);
      expect(
        new Date(updatedUser.resetToken.expiresAt) > new Date()
      ).toBeTruthy();
      /*
      // this is an old test, need a new test for if emailJS is working
      expect(window.alert).toHaveBeenCalledWith(
        expect.stringContaining('password reset link')
      );
      */
    });

    /**
     * Test: Verify handling of non-existent users
     * Should return null and show appropriate error message
     */
    test('sendPasswordResetEmail returns null for non-existing user', () => {
      // Arrange
      const username = 'nonexistentuser';

      // Act
      const result = sendPasswordResetEmail(username);

      // Assert
      expect(result).toBeNull();
      expect(window.alert).toHaveBeenCalledWith('User not found');
    });
  });

  /**
   * Tests for the password reset functionality
   * @group Reset-Password
   */
  describe('Reset Password', () => {
    /**
     * Test: Verify successful password reset with valid token
     * Should update password and remove reset token
     */
    test('handlePasswordReset successfully resets password with valid token', () => {
      // Arrange
      const users = JSON.parse(localStorage.getItem('users'));
      const resetToken = 'testtoken123';
      users[0].resetToken = {
        token: resetToken,
        expiresAt: new Date(Date.now() + 3600000), // 1 hour from now
      };
      localStorage.setItem('users', JSON.stringify(users));

      // Act
      const result = handlePasswordReset(
        resetToken,
        'newpassword123',
        'newpassword123'
      );

      // Assert
      const updatedUsers = JSON.parse(localStorage.getItem('users'));
      expect(result).toBeTruthy();
      expect(updatedUsers[0].password).toBe('newpassword123');
      expect(updatedUsers[0].resetToken).toBeUndefined();
      expect(window.alert).toHaveBeenCalledWith('Password successfully reset');
    });

    /**
     * Test: Verify validation of password matching
     * Should fail when passwords don't match
     */
    test('handlePasswordReset fails with mismatched passwords', () => {
      // Act
      const result = handlePasswordReset('token', 'password1', 'password2');

      // Assert
      expect(result).toBeFalsy();
      expect(window.alert).toHaveBeenCalledWith('Passwords do not match!');
    });

    /**
     * Test: Verify password length validation
     * Should fail when password is too short
     */
    test('handlePasswordReset fails with short password', () => {
      // Act
      const result = handlePasswordReset('token', '123', '123');

      // Assert
      expect(result).toBeFalsy();
      expect(window.alert).toHaveBeenCalledWith(
        'Password must be at least 6 characters long!'
      );
    });

    /**
     * Test: Verify token validation
     * Should fail with invalid or expired token
     */
    test('handlePasswordReset fails with invalid or expired token', () => {
      // Arrange
      const expiredToken = 'expiredtoken';

      // Act
      const result = handlePasswordReset(
        expiredToken,
        'newpassword123',
        'newpassword123'
      );

      // Assert
      expect(result).toBeFalsy();
      expect(window.alert).toHaveBeenCalledWith(
        'Invalid or expired reset token'
      );
    });
  });
});
