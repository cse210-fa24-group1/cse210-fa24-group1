const fs = require('fs');
const path = require('path');

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

// Mock window and document objects
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
} = require('../../src/scripts/forgot_password.js');
const { handlePasswordReset } = require('../../src/scripts/reset_password.js');

describe('Password Recovery Functionality', () => {
  // Setup: Create a mock user before each test
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

  describe('Forgot Password', () => {
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
      expect(window.alert).toHaveBeenCalledWith(
        expect.stringContaining('password reset link')
      );
    });

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

  describe('Reset Password', () => {
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

    test('handlePasswordReset fails with mismatched passwords', () => {
      // Act
      const result = handlePasswordReset('token', 'password1', 'password2');

      // Assert
      expect(result).toBeFalsy();
      expect(window.alert).toHaveBeenCalledWith('Passwords do not match!');
    });

    test('handlePasswordReset fails with short password', () => {
      // Act
      const result = handlePasswordReset('token', '123', '123');

      // Assert
      expect(result).toBeFalsy();
      expect(window.alert).toHaveBeenCalledWith(
        'Password must be at least 6 characters long!'
      );
    });

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
