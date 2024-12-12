/**
 * Authentication module handling user registration and login functionality
 * using localStorage for data persistence.
 * @module AuthenticationModule
 */
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
   * Saves or updates user data in localStorage
   * @param {Object} userData - The user data to save
   * @param {string} userData.username - User's username
   * @param {string} userData.password - User's password
   * @param {string} [userData.email] - User's email address
   * @param {string} userData.createdAt - ISO timestamp of account creation
   * @returns {void}
   */

  /**
   * Validates user credentials against stored data
   * @param {string} username - Username to validate
   * @param {string} password - Password to validate
   * @returns {Object|null} User object if credentials are valid, null otherwise
   */
  async function validateCredentials(username, password) {
    const users = await getUsers();
    // console.log(users);
    const user = users && users.find((user) => user.username === username);

    if (!user) {
      alert('User not found. Please create an account.');
      return null;
    }

    if (user.password !== password) {
      alert('The password is incorrect.');
      return null;
    }

    return user;
  }

  /**
   * Validates password requirements and matching confirmation if on registration page
   * @returns {boolean} True if passwords are valid, false otherwise
   */
  function validatePasswords(password1, password2) {
    // const password1 = passwordInputs[0].value;
    // const password2 = passwordInputs[1]?.value;

    if (password1.length < 6) {
      alert('Password must be at least 6 characters long!');
      return false;
    }

    if (!isLoginPage && password1 !== password2) {
      alert('Passwords do not match!');
      return false;
    }

    return true;
  }

  /**
   * Checks if a username is available for registration
   * @param {string} username - Username to check
   * @returns {boolean} True if username is available, false if taken
   */
  async function isUsernameAvailable(username) {
    const users = await getUsers();
    return users && !users.some((user) => user.username === username);
  }

  /**
   * Creates a new user session in localStoragef
   * @param {Object} user - User object for the session
   * @param {string} user.username - Username for the session
   */
  function setUserSession(user) {
    const session = {
      userId: user.userid,
      username: user.username,
      loginTime: new Date().toISOString(),
      isActive: true,
    };
    localStorage.setItem('currentSession', JSON.stringify(session));
  }

  /**
   * Checks for an existing active session and redirects to dashboard if found
   * @returns {void}
   */
  function checkExistingSession() {
    const currentSession = JSON.parse(localStorage.getItem('currentSession'));
    if (currentSession && currentSession.isActive) {
      window.location.href = '../../dist/pages/home-page.html';
    }
  }

  // Determine if it's the login page based on URL or body class
  const isLoginPage = window.location.pathname.includes('index');

  // Select form and inputs
  const form = document.querySelector('form');
  const usernameInput = document.querySelector('#username');
  const emailInput = document.querySelector('#email');
  // Handle password inputs for both login and registration pages
  let passwordInputs;
  if (isLoginPage) {
    passwordInputs = [document.querySelector('#password')];
  } else {
    passwordInputs = document.querySelectorAll('input[type="password"]');
    if (passwordInputs[1]) {
      passwordInputs[1].id = 'password-confirm';
    }
  }

  /**
   * Handles the login form submission
   * @param {Event} e - Submit event object
   * @returns {void}
   */
  async function handleLogin(e) {
    e.preventDefault();

    const username = usernameInput.value.trim();
    const password = passwordInputs[0].value;

    if (!username || !password) {
      alert('Please fill in all fields!');
      return;
    }

    const user = await validateCredentials(username, password);

    if (user) {
      try {
        setUserSession(user);
        // alert('Login successful!');
        window.location.href = './pages/home-page.html';
      } catch (error) {
        alert('Error during login. Please try again.');
      }
    } else {
      alert('Please create an account with us before you login!');
      // window.location.href = '../../dist/pages/create-account-page.html';
    }
  }

  /**
   * Handles the registration form submission
   * @param {Event} e - Submit event object
   * @returns {void}
   */
  async function handleRegistration(e) {
    e.preventDefault();

    const username = usernameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInputs[0].value;

    if (!username || !password || !email) {
      alert('Please fill in all fields!');
      return;
    }

    if (!validatePasswords(passwordInputs[0].value, passwordInputs[1]?.value)) {
      return;
    }

    if (!isUsernameAvailable(username)) {
      alert('Username already exists! Please choose another one.');
      return;
    }

    try {
      await fetch('http://localhost:3000/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, email }),
      });
      // alert('Account created successfully!');
      window.location.href = '../index.html';
    } catch (error) {
      alert('Error creating account. Please try again.');
    }
  }

  /**
   * Initializes event listeners and checks for existing session
   * @returns {void}
   */
  function initializeEventListeners() {
    if (form) {
      form.addEventListener(
        'submit',
        isLoginPage ? handleLogin : handleRegistration
      );
    }

    checkExistingSession();
  }

  // Initialize event listeners when DOM is fully loaded
  window.addEventListener('DOMContentLoaded', initializeEventListeners);

  // Export functions for testing
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      getUsers,
      validateCredentials,
      validatePasswords,
      isUsernameAvailable,
      setUserSession,
      checkExistingSession,
      handleLogin,
      handleRegistration,
    };
  }
})();
