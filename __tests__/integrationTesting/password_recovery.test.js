const forgotPasswordModule = require('../../src/scripts/forgot_password.js');
const resetPasswordModule = require('../../src/scripts/reset_password.js');

const assert = require('assert');

// Mock localStorage for testing
global.localStorage = {
  storage: {},
  getItem: function (key) {
    return this.storage[key];
  },
  setItem: function (key, value) {
    this.storage[key] = value;
  },
  clear: function () {
    this.storage = {};
  },
};

// Mock window location
global.window = {
  location: {
    origin: 'http://localhost',
    href: '',
    search: '',
  },
};

// Mock alert function
global.alert = jest.fn();

// Import the functions to test
// const { sendPasswordResetEmail } = forgotPasswordModule;
// const { handlePasswordReset } = resetPasswordModule;

describe('Password Reset Flow Integration Test', () => {
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
