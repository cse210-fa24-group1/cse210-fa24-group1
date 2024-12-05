const {
  generateID,
  addTransaction,
  removeTransaction,
  transactions,
} = require('../../dist/scripts/home_page.js'); // Replace with actual path
const originalError = console.error;
console.error = (...args) => {
  if (
    args[0].includes('Not implemented: navigation') ||
    args[0].includes('Not implemented: method')
  ) {
    return;
  }
  originalError(...args);
};
// Comprehensive localStorage Mock
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => {
      // Special handling for specific keys
      if (key === 'currentSession') {
        return JSON.stringify({ username: 'testuser' });
      }
      if (key === 'users') {
        return JSON.stringify([
          {
            username: 'testuser',
            transactions: [],
          },
        ]);
      }
      return store[key] || null;
    }),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('Transaction Management', () => {
  beforeEach(() => {
    // Clear transactions before each test
    transactions.length = 0;

    // Reset mocks
    localStorageMock.clear();
  });

  test('should add an expense transaction', () => {
    // Mock event for expense transaction
    const mockEvent = {
      preventDefault: jest.fn(),
      submitter: { dataset: { type: 'expense' } },
    };

    // Setup mock DOM
    document.body.innerHTML = `
      <input id="text" value="Groceries" />
      <input type="number" id="amount" value=50 />
      <select id="category">
        <option selected>Food</option>
      </select>
      <form id="transaction-form"></form>
    `;

    // Add transaction
    addTransaction(mockEvent);

    // Assertions
    expect(transactions.length).toBe(1);
    expect(transactions[0].isExpense).toBe(true);
    expect(transactions[0].amount).toBe(50);
    expect(transactions[0].description).toBe('Groceries');
  });

  test('should add an income transaction', () => {
    // Mock event for income transaction
    const mockEvent = {
      preventDefault: jest.fn(),
      submitter: { dataset: { type: 'credit' } },
    };

    // Setup mock DOM
    document.body.innerHTML = `
      <input id="text" value="Salary" />
      <input type="number" id="amount" value=2000 />
      <select id="category">
        <option selected>Credit</option>
      </select>
      <form id="transaction-form"></form>
    `;

    // Add transaction
    addTransaction(mockEvent);

    // Assertions
    expect(transactions.length).toBe(1);
    expect(transactions[0].isExpense).toBe(false);
    expect(transactions[0].amount).toBe(2000);
    expect(transactions[0].description).toBe('Salary');
  });

  test('should remove a transaction', () => {
    // First add a transaction
    const mockEvent = {
      preventDefault: jest.fn(),
      submitter: { dataset: { type: 'expense' } },
    };

    document.body.innerHTML = `
      <input id="text" value="Groceries" />
      <input type="number" id="amount" value=50 />
      <select id="category">
        <option selected>Food</option>
      </select>
      <form id="transaction-form"></form>
    `;

    addTransaction(mockEvent);

    // Get the ID of the added transaction
    const transactionId = transactions[0].transactionId;

    // Remove the transaction
    removeTransaction(transactionId);
    const currentSession = JSON.parse(localStorage.getItem('currentSession'));
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Find the current user
    const currentUserIndex = users.findIndex(
      (user) => user.username === currentSession.username
    );
    // Assertions
    expect(users[currentUserIndex].transactions.length).toBe(0);
  });
});
