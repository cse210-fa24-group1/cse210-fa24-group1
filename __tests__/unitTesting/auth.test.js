import fs from 'fs';
import path from 'path';

// Mock DOM setup
const loginHtml = fs.readFileSync(
  path.resolve(__dirname, '../../src/pages/login-page.html'),
  'utf8'
);
const createUserHtml = fs.readFileSync(
  path.resolve(__dirname, '../../src/pages/create-account-page.html'),
  'utf8'
);

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn((key) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock location and alert
const mockLocation = {
  href: '',
  pathname: '',
};
Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true,
});
window.alert = jest.fn();

// Import the script dynamically
const authScript = require('../../src/scripts/auth.js');

describe('Authentication Functions', () => {
  describe('Login Functionality', () => {
    beforeEach(() => {
      // Reset mocks and localStorage
      localStorageMock.clear();
      jest.clearAllMocks();

      // Setup DOM for login page using safer DOM methods
      const parser = new DOMParser();
      const doc = parser.parseFromString(loginHtml, 'text/html');
      // Clear existing content
      while (document.body.firstChild) {
        document.body.removeChild(document.body.firstChild);
      }
      // Append new content
      Array.from(doc.body.children).forEach((child) => {
        document.body.appendChild(document.importNode(child, true));
      });

      mockLocation.pathname = '/login-page.html';
    });

    test('validateCredentials with existing user', () => {
      // Setup test user
      const testUser = {
        username: 'testuser',
        password: 'password123',
      };
      localStorage.setItem('users', JSON.stringify([testUser]));

      // Test valid credentials
      const validUser = authScript.validateCredentials(
        'testuser',
        'password123'
      );
      expect(validUser).toEqual(testUser);

      // Test invalid credentials
      const invalidUser = authScript.validateCredentials(
        'testuser',
        'wrongpassword'
      );
      expect(invalidUser).toBeNull();
    });
  });

  describe('User Registration', () => {
    beforeEach(() => {
      // Reset mocks and localStorage
      localStorageMock.clear();
      jest.clearAllMocks();

      // Setup DOM for create user page using safer DOM methods
      const parser = new DOMParser();
      const doc = parser.parseFromString(createUserHtml, 'text/html');
      // Clear existing content
      while (document.body.firstChild) {
        document.body.removeChild(document.body.firstChild);
      }
      // Append new content
      Array.from(doc.body.children).forEach((child) => {
        document.body.appendChild(document.importNode(child, true));
      });

      mockLocation.pathname = '/create-user-page.html';
    });

    test('isUsernameAvailable', () => {
      // Setup existing users
      const existingUsers = [
        { username: 'existinguser', password: 'password123' },
      ];
      localStorage.setItem('users', JSON.stringify(existingUsers));

      // Test username availability
      expect(authScript.isUsernameAvailable('newuser')).toBe(true);
      expect(authScript.isUsernameAvailable('existinguser')).toBe(false);
    });

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

  describe('Session Management', () => {
    beforeEach(() => {
      // Reset mocks and localStorage
      localStorageMock.clear();
      jest.clearAllMocks();

      // Setup DOM for login page using safer DOM methods
      const parser = new DOMParser();
      const doc = parser.parseFromString(loginHtml, 'text/html');
      // Clear existing content
      while (document.body.firstChild) {
        document.body.removeChild(document.body.firstChild);
      }
      // Append new content
      Array.from(doc.body.children).forEach((child) => {
        document.body.appendChild(document.importNode(child, true));
      });

      mockLocation.pathname = '/login-page.html';
    });

    test('setUserSession creates correct session', () => {
      const testUser = { username: 'testuser' };

      authScript.setUserSession(testUser);

      const session = JSON.parse(localStorage.getItem('currentSession'));

      expect(session.username).toBe('testuser');
      expect(session.isActive).toBe(true);
      expect(session.loginTime).toBeTruthy();
    });

    test('checkExistingSession redirects for active session', () => {
      // Simulate an active session
      const activeSession = {
        username: 'testuser',
        loginTime: new Date().toISOString(),
        isActive: true,
      };
      localStorage.setItem('currentSession', JSON.stringify(activeSession));

      // Mock location href
      authScript.checkExistingSession();

      // Check redirect
      expect(window.location.href).toBe('./dashboard.html');
    });
  });
});
