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

// Define showError function before exporting
const showError = (message, title = 'Error') => {
  mockErrorPopup.show(message, title);
};

// Make showError available globally
global.showError = showError;

module.exports = {
  mockErrorPopup,
  showError,
};
