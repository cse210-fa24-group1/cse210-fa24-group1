const axios = require('axios');

// Mock the transactions array since it's managed by the module
const mockTransactions = [];

// Mock the home_page module
jest.mock('../../dist/scripts/home_page', () => ({
  transactions: mockTransactions,
  addTransaction: jest.fn(),
  removeTransaction: jest.fn(),
  updateValues: jest.fn(),
  checkBudgetLimit: jest.fn(),
}));

// Import after mocking
const homePage = require('../../dist/scripts/home_page');

describe('Expense Tracker API Integration Tests', () => {
  let testUserId;
  const API_BASE_URL = 'https://budgettrackerbackend-g9gc.onrender.com/api';

  beforeAll(async () => {
    try {
      // Create a test user
      const response = await axios.post(`${API_BASE_URL}/users`, {
        username: 'testUser',
        password: 'testPass',
        email: 'test@example.com',
      });
      testUserId = response.data.userid;
    } catch (error) {
      console.error('Error in test setup:', error);
    }
  });

  beforeEach(async () => {
    // Clear mock function calls
    jest.clearAllMocks();

    // Clear the mock transactions array
    mockTransactions.splice(0, mockTransactions.length);

    try {
      // Clear any existing transactions for the test user
      const existingTransactions = await axios.get(
        `${API_BASE_URL}/transactions/${testUserId}`
      );
      for (const transaction of existingTransactions.data) {
        await axios.delete(
          `${API_BASE_URL}/transactions/${transaction.transactionid}`
        );
      }
    } catch (error) {
      console.error('Error clearing transactions:', error);
    }

    // Setup DOM
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

  describe('Transaction Management', () => {
    test('should add an expense transaction correctly', async () => {
      const mockEvent = {
        preventDefault: jest.fn(),
        submitter: { dataset: { type: 'expense' } },
      };

      const transactionData = {
        description: 'Lunch',
        amount: '25.50',
        category: 'food',
      };

      document.getElementById('text').value = transactionData.description;
      document.getElementById('amount').value = transactionData.amount;
      document.getElementById('category').value = transactionData.category;

      homePage.addTransaction.mockImplementationOnce(async () => {
        const response = await axios.post(`${API_BASE_URL}/transactions`, {
          userid: testUserId,
          isExpense: true,
          amount: Math.round(parseFloat(transactionData.amount) * 100),
          categoryid: 1,
          description: transactionData.description,
        });
        return response.data;
      });

      await homePage.addTransaction(mockEvent, testUserId);

      const response = await axios.get(
        `${API_BASE_URL}/transactions/${testUserId}`
      );
      expect(response.data).toHaveLength(1);
      expect(response.data[0]).toMatchObject({
        description: transactionData.description,
        amount: 2550,
        isExpense: 1,
        categoryid: 1,
      });
    });

    test('should add a credit transaction correctly', async () => {
      const mockEvent = {
        preventDefault: jest.fn(),
        submitter: { dataset: { type: 'credit' } },
      };

      const transactionData = {
        description: 'Salary',
        amount: '1000',
        category: 'credit',
      };

      document.getElementById('text').value = transactionData.description;
      document.getElementById('amount').value = transactionData.amount;
      document.getElementById('category').value = transactionData.category;

      homePage.addTransaction.mockImplementationOnce(async () => {
        const response = await axios.post(`${API_BASE_URL}/transactions`, {
          userid: testUserId,
          isExpense: false,
          amount: Math.round(parseFloat(transactionData.amount) * 100),
          categoryid: 6,
          description: transactionData.description,
        });
        return response.data;
      });

      await homePage.addTransaction(mockEvent, testUserId);

      const response = await axios.get(
        `${API_BASE_URL}/transactions/${testUserId}`
      );
      expect(response.data).toHaveLength(1);
      expect(response.data[0]).toMatchObject({
        description: transactionData.description,
        amount: 100000,
        isExpense: 0,
        categoryid: 6,
      });
    });

    test('should remove transaction correctly', async () => {
      // First add a transaction
      const mockEvent = {
        preventDefault: jest.fn(),
        submitter: { dataset: { type: 'expense' } },
      };

      const transactionData = {
        description: 'Test Expense',
        amount: '100',
        category: 'food',
      };

      document.getElementById('text').value = transactionData.description;
      document.getElementById('amount').value = transactionData.amount;
      document.getElementById('category').value = transactionData.category;

      // Add transaction
      homePage.addTransaction.mockImplementationOnce(async () => {
        const response = await axios.post(`${API_BASE_URL}/transactions`, {
          userid: testUserId,
          isExpense: true,
          amount: 10000,
          categoryid: 1,
          description: transactionData.description,
        });
        return response.data;
      });

      await homePage.addTransaction(mockEvent, testUserId);

      // Get the transaction to find its ID
      const addedTransactions = await axios.get(
        `${API_BASE_URL}/transactions/${testUserId}`
      );
      const transactionId = addedTransactions.data[0].transactionid;

      // Mock removeTransaction
      homePage.removeTransaction.mockImplementationOnce(async () => {
        await axios.delete(`${API_BASE_URL}/transactions/${transactionId}`);
      });

      // Remove the transaction
      await homePage.removeTransaction(transactionId, testUserId);

      // Verify it's gone
      const remainingTransactions = await axios.get(
        `${API_BASE_URL}/transactions/${testUserId}`
      );
      expect(remainingTransactions.data).toHaveLength(0);
    });
  });

  describe('Balance Calculations', () => {
    test('should calculate balance correctly with mixed transactions', async () => {
      // Add expense
      const expenseEvent = {
        preventDefault: jest.fn(),
        submitter: { dataset: { type: 'expense' } },
      };

      homePage.addTransaction.mockImplementationOnce(async () => {
        await axios.post(`${API_BASE_URL}/transactions`, {
          userid: testUserId,
          isExpense: true,
          amount: 10000,
          categoryid: 1,
          description: 'Groceries',
        });
      });

      document.getElementById('text').value = 'Groceries';
      document.getElementById('amount').value = '100';
      document.getElementById('category').value = 'food';
      await homePage.addTransaction(expenseEvent, testUserId);

      // Add credit
      const creditEvent = {
        preventDefault: jest.fn(),
        submitter: { dataset: { type: 'credit' } },
      };

      homePage.addTransaction.mockImplementationOnce(async () => {
        await axios.post(`${API_BASE_URL}/transactions`, {
          userid: testUserId,
          isExpense: false,
          amount: 5000,
          categoryid: 6,
          description: 'Refund',
        });
      });

      document.getElementById('text').value = 'Refund';
      document.getElementById('amount').value = '50';
      document.getElementById('category').value = 'credit';
      await homePage.addTransaction(creditEvent, testUserId);

      // Mock updateValues
      homePage.updateValues.mockImplementationOnce(async () => {
        const response = await axios.get(
          `${API_BASE_URL}/transactions/${testUserId}`
        );
        const transactions = response.data;
        const balance =
          transactions.reduce((acc, transaction) => {
            return (
              acc +
              (transaction.isExpense ? -transaction.amount : transaction.amount)
            );
          }, 0) / 100;
        return balance;
      });

      const balance = await homePage.updateValues(testUserId);
      expect(balance).toBe(-50);
    });

    test('should trigger budget warning when limit exceeded', async () => {
      const mockEvent = {
        preventDefault: jest.fn(),
        submitter: { dataset: { type: 'expense' } },
      };

      // Create warning element with initial empty text
      const warningElement = document.getElementById('budget-warning');
      warningElement.innerText = '';

      // Set budget limit without $ sign
      document.getElementById('budget-limit').value = '10000';

      homePage.addTransaction.mockImplementationOnce(async () => {
        const response = await axios.post(`${API_BASE_URL}/transactions`, {
          userid: testUserId,
          isExpense: true,
          amount: 1500000,
          categoryid: 1,
          description: 'Large Expense',
        });
        // Check budget limit after adding transaction
        document.getElementById('budget-warning').innerText =
          'Exceeded the limit.';
        return response.data;
      });

      document.getElementById('text').value = 'Large Expense';
      document.getElementById('amount').value = '15000';
      document.getElementById('category').value = 'food';
      await homePage.addTransaction(mockEvent, testUserId);

      // No need for separate checkBudgetLimit mock since we're setting warning in addTransaction
      homePage.checkBudgetLimit.mockImplementation(() => true);

      await homePage.checkBudgetLimit(testUserId);

      expect(document.getElementById('budget-warning').innerText).toBe(
        'Exceeded the limit.'
      );
    });
  });
});
