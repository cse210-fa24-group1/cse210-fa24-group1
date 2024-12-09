// home_page.test.js
// Integration Test
const {
  generateID,
  addTransaction,
  removeTransaction,
  transactions,
  updateValues,
  updateLocalStorage,
  checkBudgetLimit,
} = require('../../dist/scripts/home_page');

describe('Expense Tracker Integration Tests', () => {
  let mockStorage = {};

  beforeEach(() => {
    // Reset the transactions array
    transactions.splice(0, transactions.length);

    // Reset mock storage
    mockStorage = {};

    // Create a fresh localStorage mock for each test
    const localStorageMock = {
      getItem: jest.fn((key) => mockStorage[key] || null),
      setItem: jest.fn((key, value) => {
        mockStorage[key] = value;
      }),
      clear: jest.fn(() => {
        mockStorage = {};
      }),
    };

    // Replace the global localStorage with our mock
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });

    // Initialize mock storage with user data
    const initialUsers = [
      {
        username: 'testUser',
        transactions: [],
      },
    ];

    const userSession = {
      username: 'testUser',
    };

    localStorageMock.setItem('users', JSON.stringify(initialUsers));
    localStorageMock.setItem('currentSession', JSON.stringify(userSession));

    // Mock DOM elements
    document.body.innerHTML = `
      <div id="balance">$0.00</div>
      <div id="list"></div>
      <form id="transaction-form">
        <input id="text" type="text" />
        <input id="amount" type="number" />
        <select id="category">
          <option value="food">Food</option>
          <option value="travel">Travel</option>
          <option value="credit">Credit</option>
        </select>
        <button type="submit" data-type="expense">Expense</button>
        <button type="submit" data-type="credit">Credit</button>
      </form>
      <input id="budget-limit" value="$10000" />
      <div id="budget-warning"></div>
    `;
  });

  afterEach(() => {
    // Clear everything
    jest.clearAllMocks();
    transactions.splice(0, transactions.length);
    mockStorage = {};
  });

  describe('Transaction Management', () => {
    test('should add an expense transaction correctly', () => {
      const mockEvent = {
        preventDefault: jest.fn(),
        submitter: { dataset: { type: 'expense' } },
      };

      document.getElementById('text').value = 'Lunch';
      document.getElementById('amount').value = '25.50';
      document.getElementById('category').value = 'food';

      addTransaction(mockEvent);

      expect(transactions).toHaveLength(1);
      expect(transactions[0]).toMatchObject({
        description: 'Lunch',
        amount: 25.5,
        isExpense: true,
        categoryid: 1,
      });
    });

    test('should add a credit transaction correctly', () => {
      const mockEvent = {
        preventDefault: jest.fn(),
        submitter: { dataset: { type: 'credit' } },
      };

      document.getElementById('text').value = 'Salary';
      document.getElementById('amount').value = '1000';
      document.getElementById('category').value = 'credit';

      addTransaction(mockEvent);

      expect(transactions).toHaveLength(1);
      expect(transactions[0]).toMatchObject({
        description: 'Salary',
        amount: 1000,
        isExpense: false,
        categoryid: 6,
      });
    });
  });

  describe('Balance Calculations', () => {
    test('should calculate balance correctly with mixed transactions', () => {
      const expenseEvent = {
        preventDefault: jest.fn(),
        submitter: { dataset: { type: 'expense' } },
      };

      document.getElementById('text').value = 'Groceries';
      document.getElementById('amount').value = '100';
      document.getElementById('category').value = 'food';
      addTransaction(expenseEvent);

      const creditEvent = {
        preventDefault: jest.fn(),
        submitter: { dataset: { type: 'credit' } },
      };

      document.getElementById('text').value = 'Refund';
      document.getElementById('amount').value = '50';
      document.getElementById('category').value = 'credit';
      addTransaction(creditEvent);

      const balance = updateValues();
      expect(balance).toBe(-50);
    });

    test('should trigger budget warning when limit exceeded', () => {
      const mockEvent = {
        preventDefault: jest.fn(),
        submitter: { dataset: { type: 'expense' } },
      };

      document.getElementById('text').value = 'Large Expense';
      document.getElementById('amount').value = '15000';
      document.getElementById('category').value = 'food';
      addTransaction(mockEvent);

      checkBudgetLimit();

      const warningElement = document.getElementById('budget-warning');
      expect(warningElement.innerText).toBe('Exceeded the limit.');
    });
  });
});
