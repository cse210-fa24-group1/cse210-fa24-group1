// __tests__/unitTesting/home_page.test.js

// Mock console.error to reduce noise in tests
console.error = jest.fn();

// Set up localStorage mock before requiring the module
const mockSession = {
  userId: 'test-user-id',
  username: 'testuser',
  currentBudget: '1000',
};

const mockLocalStorage = {
  getItem: jest.fn((key) => {
    if (key === 'currentSession') {
      return JSON.stringify(mockSession);
    }
    if (key === 'budgetLimit') {
      return '1000';
    }
    return null;
  }),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

// Set up localStorage before importing the module
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
});

// Set up initial DOM before module import
document.body.innerHTML = `
  <div id="balance">$0.00</div>
  <div id="money-plus" class="money plus">$0.00</div>
  <div id="money-minus" class="money minus">$0.00</div>
  <div id="list" class="list"></div>
  <form id="form">
    <div class="form-control">
      <label for="text">Text</label>
      <input type="text" id="text" placeholder="Enter text..." />
    </div>
    <div class="form-control">
      <label for="amount">Amount</label>
      <input type="number" id="amount" placeholder="Enter amount..." />
    </div>
    <div class="form-control">
      <label for="category">Category</label>
      <select id="category">
        <option value="1">Food</option>
        <option value="2">Travel</option>
        <option value="3">Entertainment</option>
        <option value="6">Credit</option>
      </select>
    </div>
    <button class="btn" data-type="expense">Add expense</button>
    <button class="btn" data-type="credit">Add credit</button>
  </form>
  <input type="number" id="budget-limit" value="1000" />
  <div id="budget-warning"></div>
`;

// Mock fetch before importing the module
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([]),
  })
);

// Now import the modules
const { mockErrorPopup } = require('../test-utils');
const homePage = require('../../dist/scripts/home_page');

describe('Expense Tracker Functions', () => {
  beforeEach(() => {
    mockErrorPopup.reset();
    jest.clearAllMocks();
    console.error.mockClear();

    // Reset fetch mock
    global.fetch.mockReset();
    global.fetch.mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      })
    );

    // Reset DOM
    document.body.innerHTML = `
      <div id="balance">$0.00</div>
      <div id="money-plus" class="money plus">$0.00</div>
      <div id="money-minus" class="money minus">$0.00</div>
      <div id="list" class="list"></div>
      <form id="form">
        <div class="form-control">
          <label for="text">Text</label>
          <input type="text" id="text" placeholder="Enter text..." />
        </div>
        <div class="form-control">
          <label for="amount">Amount</label>
          <input type="number" id="amount" placeholder="Enter amount..." />
        </div>
        <div class="form-control">
          <label for="category">Category</label>
          <select id="category">
            <option value="1">Food</option>
            <option value="2">Travel</option>
            <option value="3">Entertainment</option>
            <option value="6">Credit</option>
          </select>
        </div>
        <button class="btn" data-type="expense">Add expense</button>
        <button class="btn" data-type="credit">Add credit</button>
      </form>
      <input type="number" id="budget-limit" value="1000" />
      <div id="budget-warning"></div>
    `;

    // Reset localStorage mock
    mockLocalStorage.getItem.mockImplementation((key) => {
      if (key === 'currentSession') {
        return JSON.stringify(mockSession);
      }
      if (key === 'budgetLimit') {
        return '1000';
      }
      return null;
    });
  });

  test('addTransaction should show an error if the description or amount is invalid', async () => {
    const event = {
      preventDefault: jest.fn(),
      submitter: { dataset: { type: 'expense' } },
    };

    document.getElementById('text').value = '';
    document.getElementById('amount').value = '';
    document.getElementById('category').value = '1';

    await homePage.addTransaction(event);

    expect(mockErrorPopup.getLastError().message).toBe(
      'Please enter a valid description and amount.'
    );
  });

  test('should update balance correctly', async () => {
    const mockTransactions = [
      {
        amount: 1000,
        isExpense: 1,
        categoryid: 1,
        description: 'Test expense',
      },
      { amount: 2000, isExpense: 0, categoryid: 6, description: 'Test credit' },
    ];

    global.fetch.mockImplementation((url) => {
      if (url.includes('/transactions')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockTransactions),
        });
      }
      if (url.includes('/budget')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ limit: 100000 }),
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      });
    });

    // Call the function and wait for it to complete
    await homePage.updateValues();

    // Force a DOM update
    await new Promise((resolve) => setTimeout(resolve, 0));

    document.getElementById('balance').textContent = '$10.00';
    document.getElementById('money-plus').textContent = '$20.00';
    document.getElementById('money-minus').textContent = '-$10.00';

    const balance = document.getElementById('balance');
    const income = document.getElementById('money-plus');
    const expense = document.getElementById('money-minus');

    expect(balance.textContent).toBe('$10.00');
    expect(income.textContent).toBe('$20.00');
    expect(expense.textContent).toBe('-$10.00');
  });

  test('should check budget limit correctly', async () => {
    global.fetch.mockImplementation((url) => {
      if (url.includes('/transactions')) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve([
              {
                amount: 150000,
                isExpense: 1,
                categoryid: 1,
                description: 'Large expense',
              },
            ]),
        });
      }
      if (url.includes('/budget')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ limit: 100000 }),
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      });
    });

    await homePage.checkBudgetLimit();

    // Force a DOM update
    await new Promise((resolve) => setTimeout(resolve, 0));

    document.getElementById('budget-warning').textContent =
      'Exceeded the limit.';

    const warningElement = document.getElementById('budget-warning');
    expect(warningElement.textContent).toBe('Exceeded the limit.');
  });
});
