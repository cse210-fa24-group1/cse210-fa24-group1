(function () {
  // Utility function to get users
  function getUsers() {
    return JSON.parse(localStorage.getItem('users')) || [];
  }

  // Validate passwords
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

  // Handle password reset
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

  // Initialize reset password page
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

  // Export for potential testing
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      handlePasswordReset,
    };
  }
})();
