// __tests__/unitTesting/password_recovery.test.js
const { mockErrorPopup } = require('../test-utils');
const {
  handlePasswordReset,
  validatePasswords,
} = require('../../dist/scripts/reset_password');

describe('Password Reset Module', () => {
  beforeEach(() => {
    mockErrorPopup.reset();
    jest.clearAllMocks();
  });

  describe('Password Validation', () => {
    test('validatePasswords rejects short passwords', () => {
      const result = validatePasswords('short', 'short');
      expect(result).toBeFalsy();
      expect(mockErrorPopup.getLastError().message).toBe(
        'Password must be at least 6 characters long!'
      );
    });

    test('validatePasswords rejects non-matching passwords', () => {
      const result = validatePasswords('password123', 'differentpassword');
      expect(result).toBeFalsy();
      expect(mockErrorPopup.getLastError().message).toBe(
        'Passwords do not match!'
      );
    });

    test('validatePasswords accepts valid passwords', () => {
      const result = validatePasswords('validpassword', 'validpassword');
      expect(result).toBeTruthy();
      expect(mockErrorPopup.getLastError().message).toBe('');
    });
  });

  describe('Handle Password Reset', () => {
    test('handlePasswordReset fails with invalid token', async () => {
      global.fetch = jest
        .fn()
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
      expect(mockErrorPopup.getLastError().message).toBe(
        'Invalid or expired reset token'
      );
    });

    test('handlePasswordReset succeeds with valid inputs', async () => {
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

      global.fetch = jest
        .fn()
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
      expect(mockErrorPopup.getLastError().message).toBe(
        'Password successfully reset'
      );
    });
  });
});
