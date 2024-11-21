import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';
// Suppress specific JSDOM navigation warnings
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
// Utility function to create a full JSDOM environment with script
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
    path.resolve(__dirname, '../../src/scripts/auth.js'),
    'utf8'
  );
  const scriptElement = dom.window.document.createElement('script');
  scriptElement.textContent = authScript;
  dom.window.document.body.appendChild(scriptElement);

  return dom;
}

describe('Authentication System Integration Tests', () => {
  let dom;
  let document;
  let window;

  // Registration page setup
  describe('Registration Page', () => {
    beforeEach(() => {
      dom = createDOMEnvironment(
        `
        <!DOCTYPE html>
        <html>
        <body>
          <form>
            <input type="text" id="username" name="username" />
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

    afterEach(() => {
      dom.window.close();
    });

    it('should successfully create a new user', () => {
      // Ensure elements exist
      const form = document.querySelector('form');
      const usernameInput = document.getElementById('username');
      const passwordInput = document.getElementById('password');
      const passwordConfirmInput = document.getElementById('password-confirm');

      // Verify inputs are found
      expect(form).not.toBeNull();
      expect(usernameInput).not.toBeNull();
      expect(passwordInput).not.toBeNull();
      expect(passwordConfirmInput).not.toBeNull();

      // Set input values
      usernameInput.value = 'testuser';
      passwordInput.value = 'password123';
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
      const passwordInput = document.getElementById('password');
      const passwordConfirmInput = document.getElementById('password-confirm');

      usernameInput.value = 'testuser';
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

    it('should prevent registration with mismatched passwords', () => {
      const form = document.querySelector('form');
      const usernameInput = document.getElementById('username');
      const passwordInput = document.getElementById('password');
      const passwordConfirmInput = document.getElementById('password-confirm');

      usernameInput.value = 'testuser';
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

    it('should prevent short passwords', () => {
      const form = document.querySelector('form');
      const usernameInput = document.getElementById('username');
      const passwordInput = document.getElementById('password');
      const passwordConfirmInput = document.getElementById('password-confirm');

      usernameInput.value = 'testuser';
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

  // Login page setup
  describe('Login Page', () => {
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
        'http://localhost/login-page.html'
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

    afterEach(() => {
      dom.window.close();
    });

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
      expect(window.location.href).toBe('http://localhost/login-page.html');
    });

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
