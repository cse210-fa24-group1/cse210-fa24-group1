/**
 * @file Integration tests for password reset functionality
 * @requires ../../src/scripts/forgot_password.js
 * @requires ../../src/scripts/reset_password.js
 */

const forgotPasswordModule = require('../../src/scripts/forgot_password.js');
const resetPasswordModule = require('../../src/scripts/reset_password.js');

const assert = require('assert');

/**
 * Mock implementation of localStorage for testing purposes
 * @type {Object}
 */
global.localStorage = {
  storage: {},
  /**
   * Gets an item from storage
   * @param {string} key - The key to retrieve
   * @returns {string|null} The stored value or null if not found
   */
  getItem: function (key) {
    return this.storage[key];
  },
  /**
   * Sets an item in storage
   * @param {string} key - The key to set
   * @param {string} value - The value to store
   */
  setItem: function (key, value) {
    this.storage[key] = value;
  },
  /**
   * Clears all items from storage
   */
  clear: function () {
    this.storage = {};
  },
};

/**
 * Mock window object for testing
 * @type {Object}
 */
global.window = {
  location: {
    origin: 'http://localhost',
    href: '',
    search: '',
  },
};

/**
 * Mock alert function using Jest
 * @type {jest.Mock}
 */
global.alert = jest.fn();

/**
 * Test suite for password reset flow integration
 * @group Integration
 * @group PasswordReset
 */
describe('Password Reset Flow Integration Test', () => {
  /**
   * Set up test data before each test
   * @beforeEach
   */
  beforeEach(() => {
    // Set up test data
    const testUsers = [
      {
        username: 'testuser',
        password: 'oldpassword',
        email: 'test@example.com',
      },
    ];
    localStorage.setItem('users', JSON.stringify(testUsers));
  });

  /**
   * Tests the complete password reset flow from request to completion
   * @test
   */
  it('should successfully complete the password reset flow', () => {
    // Step 1: Request password reset
    const resetToken = forgotPasswordModule.sendPasswordResetEmail('testuser');
    assert(resetToken, 'Reset token should be generated');

    // Step 2: Verify user has reset token
    const users = JSON.parse(localStorage.getItem('users'));
    const user = users.find((u) => u.username === 'testuser');
    assert(user.resetToken, 'User should have a reset token');
    assert(
      user.resetToken.token === resetToken,
      'Stored token should match generated token'
    );

    // Step 3: Reset password
    const newPassword = 'newpassword123';
    const resetSuccess = resetPasswordModule.handlePasswordReset(
      resetToken,
      newPassword,
      newPassword
    );
    assert(resetSuccess, 'Password reset should be successful');

    // Step 4: Verify password was changed
    const updatedUsers = JSON.parse(localStorage.getItem('users'));
    const updatedUser = updatedUsers.find((u) => u.username === 'testuser');
    assert(updatedUser.password === newPassword, 'Password should be updated');
    assert(!updatedUser.resetToken, 'Reset token should be removed');
  });
});
