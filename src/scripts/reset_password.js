/**
 * Password Reset module handling the actual password reset process
 * using token validation and localStorage for data persistence.
 * @module PasswordResetModule
 */
(function () {
  /**
   * Retrieves all users from localStorage
   * @returns {Array<Object>} Array of user objects
   */
  function getUsers() {
    return JSON.parse(localStorage.getItem('users')) || [];
  }

  /**
   * Validates password requirements and matching confirmation
   * @param {string} password1 - New password
   * @param {string} password2 - Password confirmation
   * @returns {boolean} True if passwords are valid and match, false otherwise
   */
  function validatePasswords(password1, password2) {
    if (password1.length < 6) {
      alert('Password must be at least 6 characters long!');
      return false;
    }

    if (password1 !== password2) {
      alert('Passwords do not match!');
      return false;
    }

    return true;
  }

  /**
   * Handles the password reset process using a valid token
   * @param {string} token - Reset token from URL
   * @param {string} newPassword - New password to set
   * @param {string} confirmPassword - Password confirmation
   * @returns {boolean} True if reset successful, false otherwise
   */
  function handlePasswordReset(token, newPassword, confirmPassword) {
    // Validate passwords
    if (!validatePasswords(newPassword, confirmPassword)) {
      return false;
    }

    // Find user with valid reset token
    const users = getUsers();
    const userIndex = users.findIndex(
      (u) =>
        u.resetToken &&
        u.resetToken.token === token &&
        new Date(u.resetToken.expiresAt) > new Date()
    );

    if (userIndex === -1) {
      alert('Invalid or expired reset token');
      return false;
    }

    // Update password and remove reset token
    users[userIndex].password = newPassword;
    delete users[userIndex].resetToken;

    // Save updated users
    localStorage.setItem('users', JSON.stringify(users));

    alert('Password successfully reset');
    return true;
  }

  /**
   * Initializes the reset password page by setting up form submission handler
   * and token validation
   * @returns {void}
   */
  function initializeResetPasswordPage() {
    const resetPasswordForm = document.querySelector('form');

    if (resetPasswordForm) {
      resetPasswordForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Get token from URL
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        if (!token) {
          alert('No reset token found');
          return;
        }

        // Get password inputs
        const passwordInputs = document.querySelectorAll(
          'input[type="password"]'
        );
        const newPassword = passwordInputs[0].value;
        const confirmPassword = passwordInputs[1].value;

        // Attempt to reset password
        const resetSuccess = handlePasswordReset(
          token,
          newPassword,
          confirmPassword
        );

        if (resetSuccess) {
          // Redirect to login page
          window.location.href = './login-page.html';
        }
      });
    }
  }

  // Initialize when DOM is loaded
  window.addEventListener('DOMContentLoaded', initializeResetPasswordPage);

  /**
   * @exports PasswordResetModule
   * @type {Object}
   * @property {Function} handlePasswordReset - Function to process password reset with token
   */
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      handlePasswordReset,
    };
  }
})();
