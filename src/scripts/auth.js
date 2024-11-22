// Wrap the entire script in a function to make it more modular and testable
(function () {
  // Utility functions
  function getUsers() {
    return JSON.parse(localStorage.getItem('users')) || [];
  }

  function saveUser(userData) {
    const users = getUsers();
    const existingUserIndex = users.findIndex(
      (user) => user.username === userData.username
    );
    const existingUserIndexEmail = users.findIndex(
      (user) => user.email === userData.email
    );

    if (existingUserIndex !== -1 || existingUserIndexEmail != -1) {
      // Update existing user
      users[existingUserIndex] = { ...users[existingUserIndex], ...userData };
    } else {
      // Add new user
      users.push(userData);
    }

    localStorage.setItem('users', JSON.stringify(users));
  }

  function validateCredentials(username, password) {
    const users = getUsers();
    const user = users.find((user) => user.username === username);
    return user && user.password === password ? user : null;
  }

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

  function isUsernameAvailable(username) {
    const users = getUsers();
    return !users.some((user) => user.username === username);
  }

  function setUserSession(user) {
    const session = {
      username: user.username,
      loginTime: new Date().toISOString(),
      isActive: true,
    };
    localStorage.setItem('currentSession', JSON.stringify(session));
  }

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

  // Handle login
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

  // Handle registration
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

  // Only add event listeners if DOM elements exist
  function initializeEventListeners() {
    // Check if form exists before adding event listener
    if (form) {
      form.addEventListener(
        'submit',
        isLoginPage ? handleLogin : handleRegistration
      );
    }

    // Check existing session
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
