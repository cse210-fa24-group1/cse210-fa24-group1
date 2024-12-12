// visualization.test.js
// At the very top of your test file
console.error = jest.fn();
const localStorageMock = {
  getItem: jest.fn((key) => {
    if (key === 'currentSession') {
      return JSON.stringify({ userId: '123' });
    }
    if (key === 'category') {
      return JSON.stringify([
        { id: 1, name: 'Food' },
        { id: 2, name: 'Travel' },
      ]);
    }
    return null;
  }),
  setItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(global, 'localStorage', { value: localStorageMock });

// Mock DOM elements and methods
document.getElementById = jest.fn((id) => {
  if (
    id === 'monthly-calender' ||
    id === 'weekly-calender' ||
    id === 'export-btn'
  ) {
    return {
      addEventListener: jest.fn(),
    };
  }
  if (id === 'no-data-message') {
    return {
      textContent: '',
      style: { display: 'none' },
    };
  }
  if (id === 'line-chart' || id === 'pie-chart') {
    return {
      style: { display: 'none' },
      getContext: jest.fn(() => ({
        createLinearGradient: jest.fn(() => ({
          addColorStop: jest.fn(),
        })),
      })),
    };
  }
  if (id === 'start-date' || id === 'end-date') {
    return {
      value: '',
      addEventListener: jest.fn(),
    };
  }
  return {
    getContext: jest.fn(() => ({
      createLinearGradient: jest.fn(() => ({
        addColorStop: jest.fn(),
      })),
    })),
  };
});
document.createElement = jest.fn().mockImplementation((tagName) => {
  return {
    tagName: tagName.toUpperCase(),
    classList: {
      add: jest.fn(),
      remove: jest.fn(),
    },
    appendChild: jest.fn(),
    setAttribute: jest.fn(),
    style: {},
  };
});

// Mock the fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve([
        { categoryid: 1, amount: 100, timestamp: '2023-01-01T00:00:00.000Z' },
        { categoryid: 2, amount: 200, timestamp: '2023-01-02T00:00:00.000Z' },
      ]),
  })
);

// Mock Chart.js
global.Chart = jest.fn(() => ({
  update: jest.fn(),
}));

global.ChartDataLabels = {};

// Import functions
const {
  getUserTransactions,
  getRandomColor,
} = require('../../dist/scripts/visualization.js');

describe('Visualization Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    document.getElementById.mockClear();
    global.lineChart = { update: jest.fn() };
    global.pieChart = { update: jest.fn() };
    localStorage.getItem.mockClear();
  });

  test('getUserTransactions fetches and returns transactions', async () => {
    const transactions = await getUserTransactions();
    expect(transactions).toHaveLength(2);
    expect(fetch).toHaveBeenCalledWith(
      'https://budgettrackerbackend-g9gc.onrender.com/api/transactions/123'
    );
  });

  test('getRandomColor returns a valid hex color', () => {
    const color = getRandomColor();
    expect(color).toMatch(/^#[0-9A-F]{6}$/i);
  });

  test('getUserTransactions handles errors', async () => {
    global.fetch.mockImplementationOnce(() => Promise.reject('API error'));
    const transactions = await getUserTransactions();
    expect(transactions).toEqual([]);
  });
});
