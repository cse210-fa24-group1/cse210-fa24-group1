// __tests__/test-utils.js

// Mock popup functionality for tests
class MockPopup {
  constructor() {
    this.message = '';
    this.title = '';
    this.isVisible = false;
  }

  show(message, title = 'Error') {
    this.message = message;
    this.title = title;
    this.isVisible = true;
  }

  hide() {
    this.isVisible = false;
  }

  getLastError() {
    return {
      message: this.message,
      title: this.title,
      isVisible: this.isVisible,
    };
  }

  reset() {
    this.message = '';
    this.title = '';
    this.isVisible = false;
  }
}

const mockErrorPopup = new MockPopup();

// Global mock for showError
global.showError = (message, title = 'Error') => {
  mockErrorPopup.show(message, title);
};

// Mock alert to use showError
global.alert = (message) => {
  showError(message);
};

module.exports = {
  mockErrorPopup,
  // Common mocks
  getMockWindow: () => ({
    location: {
      origin: 'http://example.com',
      pathname: '/forgot-password-page.html',
      search: '?token=validtoken',
      href: '',
    },
    emailjs: {
      init: jest.fn(),
      send: jest.fn().mockResolvedValue({}),
    },
    addEventListener: jest.fn(),
  }),
  getMockLocalStorage: () => {
    let store = {};
    return {
      getItem: jest.fn((key) => store[key] || null),
      setItem: jest.fn((key, value) => {
        store[key] = value.toString();
      }),
      clear: jest.fn(() => {
        store = {};
      }),
    };
  },
};
