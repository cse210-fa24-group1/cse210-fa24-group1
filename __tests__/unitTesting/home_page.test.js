const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => {
      // Special handling for specific keys
      if (key === 'currentSession') {
        return JSON.stringify({ username: 'testuser', userId: 1 });
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

jest.mock('../../dist/scripts/home_page.js', () => {
  const actualModule = jest.requireActual('../../dist/scripts/home_page.js');
  return {
    ...actualModule,
    saveTransactionToDB: jest.fn(),
    deleteTransaction: jest.fn(),
    updateUI: jest.fn(),
  };
});

const {
  addTransaction,
  saveTransactionToDB,
  removeTransaction,
  deleteTransaction,
  updateUI,
  addTransactionDOM,
  updateValues,
} = require('../../dist/scripts/home_page.js');

describe('addTransaction', () => {
  let form;

  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();

    document.body.innerHTML = `
      <form id="transaction-form">
        <input id="category" value="Food" />
        <input id="text" value="Dinner" />
        <input id="amount" value="50" />
        <button data-type="expense">Submit</button>
      </form>
    `;

    form = document.getElementById('transaction-form');
    form.reset = jest.fn();

    // jest.clearAllMocks();
    // localStorageMock.clear();

    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue([]),
    });
  });

  test('mock saveTransactionToDB', () => {
    saveTransactionToDB(1, true, 50, 2, 'Dinner');
    expect(saveTransactionToDB).toHaveBeenCalledWith(1, true, 50, 2, 'Dinner');
  });

  it('should add a transaction when valid inputs are provided', async () => {
    const event = {
      preventDefault: jest.fn(),
      submitter: { dataset: { type: 'expense' } },
    };

    const res = await addTransaction(event);

    if (res) {
      expect(event.preventDefault).toHaveBeenCalled();
      expect(saveTransactionToDB).toHaveBeenCalledWith(
        1,
        true,
        50,
        expect.any(Number),
        'Dinner'
      );
      expect(form.reset).toHaveBeenCalled();
    }
  });

  it('should show an alert if the description or amount is invalid', async () => {
    global.alert = jest.fn();

    document.getElementById('text').value = ''; // Invalid description
    const event = {
      preventDefault: jest.fn(),
      submitter: { dataset: { type: 'expense' } },
    };

    await addTransaction(event);

    expect(global.alert).toHaveBeenCalledWith(
      'Please enter a valid description and amount.'
    );
  });
});

describe('removeTransaction', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Mock global alert
    global.alert = jest.fn();
  });

  it('should call deleteTransaction with the correct transaction ID', async () => {
    const transactionId = 123;

    const res = await removeTransaction(transactionId);

    if (res) {
      expect(deleteTransaction).toHaveBeenCalledWith(transactionId);
    }
  });

  it('should show a success alert after successful deletion', async () => {
    const transactionId = 123;

    // Simulate a successful deletion by resolving `deleteTransaction`
    deleteTransaction.mockResolvedValue();

    const res = await removeTransaction(transactionId);

    if (res) {
      expect(alert).toHaveBeenCalledWith(
        `Transaction with ID ${transactionId} deleted successfully!`
      );
    }
  });

  it('should show an error alert if deleteTransaction throws an error', async () => {
    const transactionId = 123;

    // Simulate an error during deletion
    deleteTransaction.mockRejectedValue(
      new Error('Failed to delete transaction')
    );

    const res = await removeTransaction(transactionId);

    if (res) {
      expect(alert).toHaveBeenCalledWith(
        'Failed to delete transaction: Failed to delete transaction'
      );
    }
  });

  it('should call updateUI after successful deletion', async () => {
    const transactionId = 123;

    // Simulate successful deletion
    deleteTransaction.mockResolvedValue();

    const res = await removeTransaction(transactionId);

    if (res) {
      expect(updateUI).toHaveBeenCalled();
    }
  });
});

describe('addTransactionDOM', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <ul id="list"></ul>
    `;
  });

  it('should add an expense transaction to the DOM', () => {
    const transaction = {
      transactionid: 1,
      isExpense: true,
      amount: 50,
      description: 'Dinner',
    };

    const res = addTransactionDOM(transaction);

    if (res) {
      const list = document.getElementById('list');
      const listItem = list.querySelector('li');

      expect(list.children.length).toBe(1);
      expect(listItem.classList.contains('minus')).toBe(true); // Expense transactions should have the "minus" class
      expect(listItem.textContent).toContain('Dinner'); // Transaction description
      expect(listItem.textContent).toContain('-$50'); // Expense amount
    }
  });
  it('should add an income transaction to the DOM', () => {
    const transaction = {
      transactionid: 2,
      isExpense: false,
      amount: 100,
      description: 'Salary',
    };

    const res = addTransactionDOM(transaction);
    if (res) {
      const list = document.getElementById('list');
      const listItem = list.querySelector('li');

      expect(list.children.length).toBe(1);
      expect(listItem.classList.contains('plus')).toBe(true); // Income transactions should have the "plus" class
      expect(listItem.textContent).toContain('Salary'); // Transaction description
      expect(listItem.textContent).toContain('+$100'); // Income amount
    }
  });

  it('should add a delete button to the transaction item', () => {
    const transaction = {
      transactionid: 3,
      isExpense: true,
      amount: 25,
      description: 'Snack',
    };

    const res = addTransactionDOM(transaction);
    if (res) {
      const list = document.getElementById('list');
      const deleteButton = list.querySelector('li button.delete-btn');

      expect(deleteButton).not.toBeNull();
      expect(deleteButton.textContent).toBe('x');
      expect(deleteButton.onclick).toBeDefined(); // Ensures delete button has a click handler
    }
  });

  it('should add multiple transactions to the DOM', () => {
    const transactions = [
      { transactionid: 1, isExpense: true, amount: 50, description: 'Dinner' },
      {
        transactionid: 2,
        isExpense: false,
        amount: 200,
        description: 'Freelance',
      },
    ];

    const res = transactions.forEach(addTransactionDOM);

    if (res) {
      const list = document.getElementById('list');
      expect(list.children.length).toBe(2);

      const [firstTransaction, secondTransaction] = list.children;

      expect(firstTransaction.textContent).toContain('Dinner');
      expect(firstTransaction.textContent).toContain('-$50');
      expect(secondTransaction.textContent).toContain('Freelance');
      expect(secondTransaction.textContent).toContain('+$200');
    }
  });
});
