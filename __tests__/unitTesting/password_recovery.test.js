// password-reset.test.js
const {
  handlePasswordReset,
  validatePasswords,
} = require('../../dist/scripts/reset_password');

// password-reset.test.js
const {
  sendPasswordResetEmail,
  generateResetToken,
} = require('../../dist/scripts/forgot_password');

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
      );

      expect(result).toBeTruthy();
      expect(alert).toHaveBeenCalledWith('Password successfully reset');
    });
  });
});
