(function () {
  // Utility functions specific to forgot password
  function getUsers() {
    return JSON.parse(localStorage.getItem('users')) || [];
  }

  // Generate a password reset token
  function generateResetToken() {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }

  // Simulate sending a password reset email
  function sendPasswordResetEmail(username) {
    const users = getUsers();
    const user = users.find((u) => u.username === username);

    if (!user) {
      alert('User not found');
      return null;
    }

    // Generate a reset token and store it with the user
    const resetToken = generateResetToken();
    user.resetToken = {
      token: resetToken,
      expiresAt: new Date(Date.now() + 3600000), // Token expires in 1 hour
    };

    // Update user in localStorage
    const updatedUsers = users.map((u) => (u.username === username ? user : u));
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    // In a real-world scenario, you'd send an actual email
    // Here we'll simulate it by logging and showing an alert
    const resetLink = `${window.location.origin}/pages/reset-password.html?token=${resetToken}`;
    console.log(`Password Reset Link: ${resetLink}`);

    // Show a more informative alert
    alert(`A password reset link has been sent to the email associated with ${username}. 
The link is valid for 1 hour.`);

    return resetToken;
  }

  // Specifically for forgot password page initialization
  function initializeForgotPasswordPage() {
    const forgotPasswordForm = document.querySelector('form');

    if (forgotPasswordForm) {
      forgotPasswordForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const usernameInput = document.querySelector('#username');
        const username = usernameInput.value.trim();

        if (!username) {
          alert('Please enter your username');
          return;
        }

        // Attempt to send password reset email
        sendPasswordResetEmail(username);

        // Clear the input after submission
        usernameInput.value = '';
      });
    }
  }

  // Only initialize forgot password functionality if on forgot password page
  function checkAndInitializeForgotPassword() {
    if (window.location.pathname.includes('forgot-password-page.html')) {
      window.addEventListener('DOMContentLoaded', initializeForgotPasswordPage);
    }
  }

  // Immediately check and potentially initialize
  checkAndInitializeForgotPassword();

  // Export for potential testing
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      sendPasswordResetEmail,
      initializeForgotPasswordPage,
    };
  }
})();
