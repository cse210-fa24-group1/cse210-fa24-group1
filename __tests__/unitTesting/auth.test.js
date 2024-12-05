/**
 * @file Integration tests for authentication functionality
 * @requires ../../src/scripts/auth.js
 * @requires fs
 * @requires path
 */

import fs from 'fs';
import path from 'path';

/**
 * Load HTML templates for testing
 * @type {string}
 */
const loginHtml = fs.readFileSync(
  path.resolve(__dirname, '../../src/pages/index.html'),
  'utf8'
);
const createUserHtml = fs.readFileSync(
  path.resolve(__dirname, '../../src/pages/create-account-page.html'),
  'utf8'
);

/**
 * Mock implementation of localStorage for testing
 * Uses Jest's mock functions for tracking calls
 * @type {Object}
 */
const localStorageMock = (() => {
  let store = {};
  return {
    /** @type {jest.Mock} Gets an item from store */
    getItem: jest.fn((key) => store[key] || null),
    /** @type {jest.Mock} Sets an item in store */
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    /** @type {jest.Mock} Removes an item from store */
    removeItem: jest.fn((key) => {
      delete store[key];
    }),
    /** @type {jest.Mock} Clears all items from store */
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

// Configure window mock objects
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

/**
 * Mock location object for testing navigation
 * @type {Object}
 */
const mockLocation = {
  href: '',
  pathname: '',
};
Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true,
});

/**
 * Mock alert function
 * @type {jest.Mock}
 */
window.alert = jest.fn();

// Import authentication module
const authScript = require('../../src/scripts/auth.js');

/**
 * Test suite for authentication functionality
 * @group Authentication
 */
describe('Authentication Functions', () => {
  /**
   * Test suite for login functionality
   * @group Login
   */
  describe('Login Functionality', () => {
    /**
     * Setup before each login test
     * Resets mocks and sets up DOM environment
     * @beforeEach
     */
    beforeEach(() => {
      localStorageMock.clear();
      jest.clearAllMocks();

      const parser = new DOMParser();
      const doc = parser.parseFromString(loginHtml, 'text/html');
      while (document.body.firstChild) {
        document.body.removeChild(document.body.firstChild);
      }
      Array.from(doc.body.children).forEach((child) => {
        document.body.appendChild(document.importNode(child, true));
      });

      mockLocation.pathname = '/index.html';
    });

    /**
     * Tests credential validation with existing user
     * @test
     */
    test('validateCredentials with existing user', () => {
      const testUser = {
        username: 'testuser',
        password: 'password123',
      };
      localStorage.setItem('users', JSON.stringify([testUser]));

      const validUser = authScript.validateCredentials(
        'testuser',
        'password123'
      );
      expect(validUser).toEqual(testUser);

      const invalidUser = authScript.validateCredentials(
        'testuser',
        'wrongpassword'
      );
      expect(invalidUser).toBeNull();
    });
  });

  /**
   * Test suite for user registration functionality
   * @group Registration
   */
  describe('User Registration', () => {
    /**
     * Setup before each registration test
     * Resets mocks and sets up DOM environment
     * @beforeEach
     */
    beforeEach(() => {
      localStorageMock.clear();
      jest.clearAllMocks();

      const parser = new DOMParser();
      const doc = parser.parseFromString(createUserHtml, 'text/html');
      while (document.body.firstChild) {
        document.body.removeChild(document.body.firstChild);
      }
      Array.from(doc.body.children).forEach((child) => {
        document.body.appendChild(document.importNode(child, true));
      });

      mockLocation.pathname = '/create-user-page.html';
    });

    /**
     * Tests username availability checking
     * @test
     */
    test('isUsernameAvailable', () => {
      const existingUsers = [
        { username: 'existinguser', password: 'password123' },
      ];
      localStorage.setItem('users', JSON.stringify(existingUsers));

      expect(authScript.isUsernameAvailable('newuser')).toBe(true);
      expect(authScript.isUsernameAvailable('existinguser')).toBe(false);
    });

    /**
     * Tests user data persistence to localStorage
     * @test
     */
    test('saveUser adds user to localStorage', () => {
      const userData = {
        username: 'newuser',
        password: 'password123',
        createdAt: new Date().toISOString(),
      };

      authScript.saveUser(userData);

      const users = JSON.parse(localStorage.getItem('users'));
      expect(users).toContainEqual(userData);
    });
  });

  /**
   * Test suite for session management functionality
   * @group Session
   */
  describe('Session Management', () => {
    /**
     * Setup before each session test
     * Resets mocks and sets up DOM environment
     * @beforeEach
     */
    beforeEach(() => {
      localStorageMock.clear();
      jest.clearAllMocks();

      const parser = new DOMParser();
      const doc = parser.parseFromString(loginHtml, 'text/html');
      while (document.body.firstChild) {
        document.body.removeChild(document.body.firstChild);
      }
      Array.from(doc.body.children).forEach((child) => {
        document.body.appendChild(document.importNode(child, true));
      });

      mockLocation.pathname = '/index.html';
    });

    /**
     * Tests user session creation
     * @test
     */
    test('setUserSession creates correct session', () => {
      const testUser = { username: 'testuser' };

      authScript.setUserSession(testUser);

      const session = JSON.parse(localStorage.getItem('currentSession'));

      expect(session.username).toBe('testuser');
      expect(session.isActive).toBe(true);
      expect(session.loginTime).toBeTruthy();
    });

    /**
     * Tests session checking and redirection
     * @test
     */
    test('checkExistingSession redirects for active session', () => {
      const activeSession = {
        username: 'testuser',
        loginTime: new Date().toISOString(),
        isActive: true,
      };
      localStorage.setItem('currentSession', JSON.stringify(activeSession));

      authScript.checkExistingSession();

      expect(window.location.href).toBe('../pages/home-page.html');
    });
  });
});
