import fs from 'fs';
import path from 'path';


const homeHtml = fs.readFileSync(
  path.resolve(__dirname, '../../src/pages/home-page.html'),
  'utf8'
);
const homeScript = require('../../src/scripts/home_page.js');

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


describe('Home Functions', () => {
  beforeEach(() => {
    localStorageMock.clear();
    jest.clearAllMocks();

    const parser = new DOMParser();
    const doc = parser.parseFromString(homeHtml, 'text/html');
    document.body.innerHTML = ''; // Clear existing DOM
    document.body.append(...Array.from(doc.body.children));

    // Import the script after setting up the DOM
    require('../../src/scripts/home_page.js');

    mockLocation.pathname = '/home-page.html';
  });

  test('generateID should return a random integer', () => {
    const id = homeScript.generateID(); // Access generateID via homePageModule
    expect(typeof id).toBe('number');
    expect(id).toBeGreaterThanOrEqual(0);
  });

  test('generateID should return a random integer', () => {
    const id = homeScript.generateID();
    expect(typeof id).toBe('number');
    expect(id).toBeGreaterThanOrEqual(0);
  });

  test('removeTransaction should remove a transaction by ID', () => {
    const transactions = [{
      id: 1,
      text: "bought apples",
      category: "Food",
      amount: 50,
      date: new Date().toLocaleString()
    }];

    homeScript.transactions = transactions;
    homeScript.updateLocalStorage();
    expect(homeScript.transactions.length).toBe(1);
    homeScript.removeTransaction(1);
    expect(localStorage.getItem('transactions')).toBe(JSON.stringify([]));
    localStorageMock.clear();
  });

  test('addTransaction should add a new transaction', () => {
    const initialTransactionCount = document.querySelectorAll('#list li').length;
    document.getElementById('text').value = 'Grocery';
    document.getElementById('amount').value = '50';
    document.getElementById('category').value = 'Food';
    const eventMock = {
      preventDefault: jest.fn(),
      submitter: { dataset: { type: 'expense' } },
    };
    homeScript.addTransaction(eventMock);
    const updatedTransactionCount = document.querySelectorAll('#list').length;
    expect(updatedTransactionCount).toBe(initialTransactionCount + 1);
  });



});