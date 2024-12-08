(function () {
  /**
   * Retrieves all users from localStorage
   * @returns {Array<Object>} Array of user objects
   */
  async function getUsers() {
    try {
      const response = await fetch('http://localhost:3000/api/users');
      const users = await response.json(); // Wait for the JSON data to be parsed
      return users; // Return the data after awaiting
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  }
  /**
   * Generates a random token for password reset
   * @returns {string} Random string token
   */
  function generateResetToken() {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }

  /**
   * Simulates sending a password reset email by generating and storing a reset token
   * @param {string} username - Username of the account to reset
   * @returns {string|null} Reset token if successful, null if user not found
   */
  async function sendPasswordResetEmail(username) {
    const users = await getUsers();
    const user =
      users &&
      users.find(
        (user) => user.username === username || user.email === username
      );
    if (!user) {
      alert('User not found');
      return null;
    }

    // Generate a reset token and store it with the user
    const resetToken = generateResetToken();
    const expiresAt = new Date(Date.now() + 3600000);
    const responseToken = await fetch('http://localhost:3000/api/resettoken', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: resetToken, expiresAt }),
    });
    if (!responseToken.ok) {
      throw new Error('Failed to create reset token');
    }
    const tokenData = await responseToken.json();
    const tokenId = tokenData.id;
    const updateUserResponse = await fetch('http://localhost:3000/api/users', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: user.id, tokenid: tokenId }),
    });

    if (!updateUserResponse.ok) {
      const errorText = await updateUserResponse.text();
      throw new Error(`Failed to update user: ${errorText}`);
    }
    updatedUsers = await getUsers();
    updatedUser =
      updatedUsers &&
      updatedUsers.find(
        (user) => user.username === username || user.email === username
      );
    console.log(updatedUser);

    // Construct reset link
    const resetLink = `${window.location.origin}/pages/reset-password-page.html?token=${resetToken}&username=${username}`;

    // EmailJS configuration (You'll need to sign up at emailjs.com and get these details)
    // eslint-disable-next-line no-undef
    window.emailjs.init('FHzkkOp1lrgWuCbYY'); // Replace with actual User ID from EmailJS
    // Email parameters
    const templateParams = {
      to_email: user.email, // Sender's email
      from_name: 'Expense Tracker',
      reset_link: resetLink,
      reply_to: 'sedlabadkar@ucsd.edu',
    };

    // Send email using EmailJS
    emailjs
      .send('service_0n5821h', 'template_02gap7y', templateParams)
      .then(() => {
        // console.log('Email sent successfully', response);
        alert(`A password reset link has been sent to the email associated with ${username}. 
The link is valid for 1 hour.`);
      })
      .catch(() => {
        // console.error('Failed to send email', error);
        alert('Failed to send password reset email. Please try again.');
      });

    // need a way to return null/resetToken depending on if emailJS works
    return resetToken;
  }

  /**
   * Initializes the forgot password page by setting up event listeners
   * and form handling
   * @returns {void}
   */
  function initializeForgotPasswordPage() {
    const forgotPasswordForm = document.querySelector('form');

    if (forgotPasswordForm) {
      forgotPasswordForm.addEventListener('submit', async function (e) {
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

  /**
   * Checks if the current page is the forgot password page and initializes
   * functionality if it is
   * @returns {void}
   */
  function checkAndInitializeForgotPassword() {
    if (window.location.pathname.includes('forgot-password-page.html')) {
      window.addEventListener('DOMContentLoaded', initializeForgotPasswordPage);
    }
  }

  // Immediately check and potentially initialize
  checkAndInitializeForgotPassword();

  /**
   * @exports ForgotPasswordModule
   * @type {Object}
   * @property {Function} sendPasswordResetEmail - Function to handle password reset email
   * @property {Function} initializeForgotPasswordPage - Function to initialize the forgot password page
   */
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      sendPasswordResetEmail,
      initializeForgotPasswordPage,
    };
  }
})();
