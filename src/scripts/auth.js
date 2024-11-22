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
  function getUsers() {
    return JSON.parse(localStorage.getItem('users')) || [];
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
  function saveUser(userData) {
    const users = getUsers();
    const existingUserIndex = users.findIndex(
      (user) => user.username === userData.username
    );
    const existingUserIndexEmail = users.findIndex(
      (user) => user.email === userData.email
    );

    if (existingUserIndex !== -1 || existingUserIndexEmail != -1) {
      users[existingUserIndex] = { ...users[existingUserIndex], ...userData };
    } else {
      users.push(userData);
    }

    localStorage.setItem('users', JSON.stringify(users));
  }

  /**
   * Validates user credentials against stored data
   * @param {string} username - Username to validate
   * @param {string} password - Password to validate
   * @returns {Object|null} User object if credentials are valid, null otherwise
   */
  function validateCredentials(username, password) {
    const users = getUsers();
    const user = users.find((user) => user.username === username);
    return user && user.password === password ? user : null;
  }

  /**
   * Validates password requirements and matching confirmation if on registration page
   * @returns {boolean} True if passwords are valid, false otherwise
   */
  function validatePasswords() {
    const password1 = passwordInputs[0].value;
    const password2 = passwordInputs[1]?.value;

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
  function isUsernameAvailable(username) {
    const users = getUsers();
    return !users.some((user) => user.username === username);
  }

  /**
   * Creates a new user session in localStorage
   * @param {Object} user - User object for the session
   * @param {string} user.username - Username for the session
   */
  function setUserSession(user) {
    const session = {
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
      window.location.href = './dashboard.html';
    }
  }

  // Determine if it's the login page based on URL or body class
  const isLoginPage = window.location.pathname.includes('login');

  // Select form and inputs
  const form = document.querySelector('form');
  const usernameInput = document.querySelector('#username');

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
  function handleLogin(e) {
    e.preventDefault();

    const username = usernameInput.value.trim();
    const password = passwordInputs[0].value;

    if (!username || !password) {
      alert('Please fill in all fields!');
      return;
    }

    const user = validateCredentials(username, password);

    if (user) {
      try {
        setUserSession(user);
        alert('Login successful!');
        window.location.href = './dashboard.html';
      } catch (error) {
        alert('Error during login. Please try again.');
        console.error('Login error:', error);
      }
    } else {
      alert('Invalid username or password!');
      passwordInputs[0].value = '';
    }
  }

  /**
   * Handles the registration form submission
   * @param {Event} e - Submit event object
   * @returns {void}
   */
  function handleRegistration(e) {
    e.preventDefault();

    const username = usernameInput.value.trim();
    const password = passwordInputs[0].value;

    if (!username || !password) {
      alert('Please fill in all fields!');
      return;
    }

    if (!validatePasswords()) {
      return;
    }

    if (!isUsernameAvailable(username)) {
      alert('Username already exists! Please choose another one.');
      return;
    }

    const userData = {
      username: username,
      password: password,
      createdAt: new Date().toISOString(),
    };

    try {
      saveUser(userData);
      alert('Account created successfully!');
      window.location.href = './login-page.html';
    } catch (error) {
      alert('Error creating account. Please try again.');
      console.error('Error:', error);
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
      saveUser,
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
