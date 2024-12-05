/**
 * Integration tests for the authentication system
 * including registration and login functionality.
 * @module AuthenticationTests
 */

import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';

/**
 * Suppress specific JSDOM navigation warnings while preserving other console errors
 * @type {Function}
 */
const originalConsoleError = console.error;
console.error = (...args) => {
  if (
    args.length > 0 &&
    typeof args[0] === 'string' &&
    (args[0].includes('Not implemented: navigation') ||
      args[0].includes('navigation (except hash changes)'))
  ) {
    // Silently ignore these specific warnings
    return;
  }
  originalConsoleError(...args);
};

/**
 * Creates a JSDOM environment with mocked browser APIs for testing
 * @param {string} html - HTML content to initialize the DOM
 * @param {string} url - URL to simulate for the environment
 * @returns {JSDOM} Configured JSDOM instance with mocked localStorage and alert
 */
function createDOMEnvironment(html, url) {
  const dom = new JSDOM(html, {
    url: url,
    runScripts: 'dangerously',
    resources: 'usable',
    beforeParse(window) {
      // Mock localStorage
      window.localStorage = {
        _store: {},
        getItem: function (key) {
          return this._store[key] || null;
        },
        setItem: function (key, value) {
          this._store[key] = value;
        },
        removeItem: function (key) {
          delete this._store[key];
        },
        clear: function () {
          this._store = {};
        },
      };

      // Mock alert
      window.alert = jest.fn();
    },
  });

  // Read and execute the auth script
  const authScript = fs.readFileSync(
    path.resolve(__dirname, '../../dist/scripts/auth.js'),
    'utf8'
  );
  const scriptElement = dom.window.document.createElement('script');
  scriptElement.textContent = authScript;
  dom.window.document.body.appendChild(scriptElement);

  return dom;
}

/**
 * Test suite for the authentication system
 * @namespace AuthenticationSystemIntegrationTests
 */
describe('Authentication System Integration Tests', () => {
  let dom;
  let document;
  let window;

  /**
   * Registration page test suite
   * @namespace RegistrationPageTests
   */
  describe('Registration Page', () => {
    /**
     * Set up fresh DOM environment before each test
     */
    beforeEach(() => {
      dom = createDOMEnvironment(
        `
        <!DOCTYPE html>
        <html>
        <body>
          <form>
            <input type="text" id="username" name="username" />
            <input type="text" id="email" name="email" />
            <input type="password" id="password" name="password" />
            <input type="password" id="password-confirm" name="password-confirm" />
          </form>
        </body>
        </html>
      `,
        'http://localhost/create-account-page.html'
      );

      window = dom.window;
      document = window.document;
    });

    /**
     * Clean up DOM environment after each test
     */
    afterEach(() => {
      dom.window.close();
    });

    /**
     * Test successful user registration
     */
    it('should successfully create a new user', () => {
      // Ensure elements exist
      const form = document.querySelector('form');
      const usernameInput = document.getElementById('username');
      const emailInput = document.getElementById('email');
      const passwordInput = document.getElementById('password');
      const passwordConfirmInput = document.getElementById('password-confirm');

      // Verify inputs are found
      expect(form).not.toBeNull();
      expect(usernameInput).not.toBeNull();
      expect(emailInput).not.toBeNull();
      expect(passwordInput).not.toBeNull();
      expect(passwordConfirmInput).not.toBeNull();

      // Set input values
      usernameInput.value = 'testuser';
      passwordInput.value = 'password123';
      emailInput.value = 'test@example.com';
      passwordConfirmInput.value = 'password123';

      // Trigger form submission
      const submitEvent = new window.Event('submit');
      form.dispatchEvent(submitEvent);

      // Check localStorage
      const users = JSON.parse(window.localStorage.getItem('users') || '[]');
      expect(users).toBeTruthy();
      expect(users.length).toBe(1);
      expect(users[0].username).toBe('testuser');
    });

    /**
     * Test duplicate username prevention
     */
    it('should prevent registration with existing username', () => {
      // Preload an existing user
      window.localStorage.setItem(
        'users',
        JSON.stringify([
          {
            username: 'testuser',
            password: 'oldpassword',
          },
        ])
      );

      const form = document.querySelector('form');
      const usernameInput = document.getElementById('username');
      const emailInput = document.getElementById('email');
      const passwordInput = document.getElementById('password');
      const passwordConfirmInput = document.getElementById('password-confirm');

      usernameInput.value = 'testuser';
      emailInput.value = 'test@example.com';
      passwordInput.value = 'password123';
      passwordConfirmInput.value = 'password123';

      // Trigger form submission
      const submitEvent = new window.Event('submit');
      form.dispatchEvent(submitEvent);

      // Check alert and users
      expect(window.alert).toHaveBeenCalledWith(
        'Username already exists! Please choose another one.'
      );
      const users = JSON.parse(window.localStorage.getItem('users'));
      expect(users.length).toBe(1);
    });

    /**
     * Test password mismatch validation
     */
    it('should prevent registration with mismatched passwords', () => {
      const form = document.querySelector('form');
      const usernameInput = document.getElementById('username');
      const emailInput = document.getElementById('email');
      const passwordInput = document.getElementById('password');
      const passwordConfirmInput = document.getElementById('password-confirm');

      usernameInput.value = 'testuser';
      emailInput.value = 'test@example.com';
      passwordInput.value = 'password123';
      passwordConfirmInput.value = 'differentpassword';

      // Trigger form submission
      const submitEvent = new window.Event('submit');
      form.dispatchEvent(submitEvent);

      // Check alert
      expect(window.alert).toHaveBeenCalledWith('Passwords do not match!');
      const users = JSON.parse(window.localStorage.getItem('users') || '[]');
      expect(users.length).toBe(0);
    });

    /**
     * Test password length validation
     */
    it('should prevent short passwords', () => {
      const form = document.querySelector('form');
      const usernameInput = document.getElementById('username');
      const emailInput = document.getElementById('email');
      const passwordInput = document.getElementById('password');
      const passwordConfirmInput = document.getElementById('password-confirm');

      usernameInput.value = 'testuser';
      emailInput.value = 'test@example.com';
      passwordInput.value = '12345';
      passwordConfirmInput.value = '12345';

      // Trigger form submission
      const submitEvent = new window.Event('submit');
      form.dispatchEvent(submitEvent);

      // Check alert
      expect(window.alert).toHaveBeenCalledWith(
        'Password must be at least 6 characters long!'
      );
      const users = JSON.parse(window.localStorage.getItem('users') || '[]');
      expect(users.length).toBe(0);
    });
  });

  /**
   * Login page test suite
   * @namespace LoginPageTests
   */
  describe('Login Page', () => {
    /**
     * Set up fresh DOM environment and test user before each test
     */
    beforeEach(() => {
      dom = createDOMEnvironment(
        `
        <!DOCTYPE html>
        <html>
        <body>
          <form>
            <input type="text" id="username" name="username" />
            <input type="password" id="password" name="password" />
          </form>
        </body>
        </html>
      `,
        'http://localhost/index.html'
      );

      window = dom.window;
      document = window.document;

      // Preload a user for login testing
      window.localStorage.setItem(
        'users',
        JSON.stringify([
          {
            username: 'testuser',
            password: 'password123',
            createdAt: new Date().toISOString(),
          },
        ])
      );

      // Mock location
      delete window.location;
      window.location = { href: '' };
    });

    /**
     * Clean up DOM environment after each test
     */
    afterEach(() => {
      dom.window.close();
    });

    /**
     * Test successful login
     */
    it('should successfully login with correct credentials', () => {
      const form = document.querySelector('form');
      const usernameInput = document.getElementById('username');
      const passwordInput = document.getElementById('password');

      usernameInput.value = 'testuser';
      passwordInput.value = 'password123';

      // Trigger form submission
      const submitEvent = new window.Event('submit');
      form.dispatchEvent(submitEvent);

      // Check session and navigation
      const currentSession = JSON.parse(
        window.localStorage.getItem('currentSession')
      );
      expect(currentSession).toBeTruthy();
      expect(currentSession.username).toBe('testuser');
      expect(currentSession.isActive).toBe(true);
      expect(window.location.href).toBe('http://localhost/index.html');
    });

    /**
     * Test invalid credentials handling
     */
    it('should prevent login with incorrect credentials', () => {
      const form = document.querySelector('form');
      const usernameInput = document.getElementById('username');
      const passwordInput = document.getElementById('password');

      usernameInput.value = 'testuser';
      passwordInput.value = 'wrongpassword';

      // Trigger form submission
      const submitEvent = new window.Event('submit');
      form.dispatchEvent(submitEvent);

      // Check alert and session
      expect(window.alert).toHaveBeenCalledWith(
        'Invalid username or password!'
      );
      const currentSession = window.localStorage.getItem('currentSession');
      expect(currentSession).toBeNull();
    });
  });
});
